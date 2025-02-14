const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { Pool } = require("pg");

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_API_URL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music";

const pool = new Pool({
  user: "hshin", // process.env.USER
  host: "localhost",
  port: 5432,
  password: "Sheendong18!!",
  database: "concert_tracker_db"
})

pool.on("connect", () => {
  console.log("Connection pool established with database");
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// mark event as saved or attended
app.post('/user/concerts', async (req, res) => {
  const { user_id, concert_id, concert_name, concert_date, concert_url, status } = req.body;
  
  // Validate request data
  if (!user_id || !concert_id || !concert_name || !concert_date || !concert_url || !["saved", "attended"].includes(status)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const client = await pool.connect();

  // use transactions since there's more than 1 update/insert query in this single operation?

  try {
    await client.query("BEGIN");

    // insert concert into concerts table if it doesn't already exist in there
    await client.query(
      `INSERT INTO concerts (id, name, date, url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
       [concert_id, concert_name, concert_date, concert_url]
    );

    // insert or update a user's interaction with a concert
    await client.query(
      `INSERT INTO user_concerts (user_id, concert_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, concert_id)
       DO UPDATE SET status = EXCLUDED.status`,
       [user_id, concert_id, status]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Concert saved successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving concert: ", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
})

// get user's saved events
app.get('/user/:user_id/saved-concerts', async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const query = `
      SELECT concerts.id, concerts.name, concerts.date, concerts.url, user_concerts.status
      FROM user_concerts
      JOIN concerts ON user_concerts.concert_id = concerts.id
      WHERE user_concerts.user_id = $1 AND user_concerts.status = 'saved'
      ORDER BY concerts.date ASC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    res.status(200).json({ concerts: rows });
  } catch (error) {
    console.error("Error fetching saved concerts: ", error);
    res.status(500).json({ messag: "Internal server error" });
  }
})

// get user's attended events 
app.get("/user/:user_id/attended-concerts", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      const query = `
          SELECT concerts.id, concerts.name, concerts.date, concerts.url, user_concerts.status
          FROM user_concerts
          JOIN concerts ON user_concerts.concert_id = concerts.id
          WHERE user_concerts.user_id = $1 AND user_concerts.status = 'attended'
          ORDER BY concerts.date DESC;
      `;

      const { rows } = await pool.query(query, [user_id]);

      res.status(200).json({ concerts: rows });
  } catch (error) {
      console.error("Error fetching attended concerts: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// get user's profile feed (both saved and attended events)
app.get("/user/:user_id/marked-concerts", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      const query = `
          SELECT concerts.id, concerts.name, concerts.date, concerts.url, user_concerts.status, user_concerts.created_at
          FROM user_concerts
          JOIN concerts ON user_concerts.concert_id = concerts.id
          WHERE user_concerts.user_id = $1
          ORDER BY user_concerts.created_at DESC;
      `;

      const { rows } = await pool.query(query, [user_id]);

      res.status(200).json({ concerts: rows });
  } catch (error) {
      console.error("Error fetching marked concerts:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// get a user's friends list
app.get("/friends/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      const friends = await pool.query(
          `SELECT users.id, users.username, users.profile_photo
           FROM friends
           JOIN users ON (users.id = friends.friend_id OR users.id = friends.user_id)
           WHERE (friends.user_id = $1 OR friends.friend_id = $1) 
           AND friends.status = 'accepted'
           AND users.id != $1`,
          [user_id]
      );

      res.status(200).json({ friends: friends.rows });
  } catch (error) {
      console.error("Error fetching friends list:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// get a user's friend requests
app.get("/friends/requests/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      const friendRequests = await pool.query(
        `SELECT users.id, users.username, users.profile_photo
        FROM friends
        JOIN users ON users.id = friends.user_id
        WHERE friends.friend_id = $1
        AND friends.status = 'pending'`,
        [user_id]
      );

      res.status(200).json({ friend_requests: friendRequests.rows });
  } catch (error) {
      console.error("Error fetching friend requests: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// send a friend request
app.post("/friends/send-request", async (req, res) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
      return res.status(400).json({ message: "Both user_id and friend_id are required" });
  }

  try {
      // Insert new friend request
      await pool.query(
          "INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'pending')",
          [user_id, friend_id]
      );

      res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
      console.error("Error sending friend request: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// cancel a pending friend request
app.delete("/friends/cancel-request", async (req, res) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
      return res.status(400).json({ message: "Both user_id and friend_id are required" });
  }

  try {
      // Delete the friend request where the user_id is the sender and friend_id is the recipient
      const result = await pool.query(
          `DELETE FROM friends 
           WHERE user_id = $1 
           AND friend_id = $2 
           AND status = 'pending'`,
          [user_id, friend_id]
      );

      if (result.rowCount === 0) {
          return res.status(400).json({ message: "No pending friend request found" });
      }

      res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
      console.error("Error canceling friend request:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// accept a friend request
app.post("/friends/accept-request", async (req, res) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
      return res.status(400).json({ message: "Both user_id and friend_id are required" });
  }

  try {
      // Update friend request status to 'accepted'
      const result = await pool.query(
          "UPDATE friends SET status = 'accepted' WHERE user_id = $2 AND friend_id = $1 AND status = 'pending'",
          [user_id, friend_id]
      );

      if (result.rowCount === 0) {
          return res.status(400).json({ message: "No pending friend request found" });
      }

      res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// decline a friend request
app.post("/friends/decline-request", async (req, res) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
      return res.status(400).json({ message: "Both user_id and friend_id are required" });
  }

  try {
      // Delete the friend request
      const result = await pool.query(
          "DELETE FROM friends WHERE user_id = $2 AND friend_id = $1 AND status = 'pending'",
          [user_id, friend_id]
      );

      if (result.rowCount === 0) {
          return res.status(400).json({ message: "No pending friend request found" });
      }

      res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
      console.error("Error declining friend request:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// unfriend another user
app.delete("/friends/remove", async (req, res) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
      return res.status(400).json({ message: "Both user_id and friend_id are required" });
  }

  try {
      // Delete the friendship where either user_id or friend_id matches
      const result = await pool.query(
          `DELETE FROM friends 
           WHERE (user_id = $1 AND friend_id = $2) 
           OR (user_id = $2 AND friend_id = $1) 
           AND status = 'accepted'`,
          [user_id, friend_id]
      );

      if (result.rowCount === 0) {
          return res.status(400).json({ message: "This friendship was not found" });
      }

      res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
      console.error("Error removing friend:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// get newsfeed (a list of friends' activity, sorted by most recent)
app.get("/newsfeed/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      // Get all friends of the user
      const friendsQuery = await pool.query(
          `SELECT friend_id 
           FROM friends 
           WHERE user_id = $1 AND status = 'accepted'
           UNION
           SELECT user_id
           FROM friends
           WHERE friend_id = $1 AND status = 'accepted'`,
          [user_id]
      );

      const friendIds = friendsQuery.rows.map(row => row.friend_id);
      friendIds.push(user_id); // Add the user to their own newsfeed

      if (friendIds.length === 0) {
          return res.status(404).json({ message: "No friends found" });
      }

      // Get concerts from user and their friends, sorted by created_at
      const concertsQuery = await pool.query(
          `SELECT uc.user_id, uc.concert_id, uc.status, uc.created_at, c.name AS concert_name, c.date AS concert_date
           FROM user_concerts uc
           JOIN concerts c ON c.id = uc.concert_id
           WHERE uc.user_id = ANY($1::serial[])  -- user_id of friends + the user themselves
           ORDER BY uc.created_at DESC`,
          [friendIds]
      );

      res.status(200).json({ newsfeed: concertsQuery.rows });
  } catch (error) {
      console.error("Error fetching newsfeed:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// like a user's concert interaction
app.post("/user-concerts/:user_concert_id/like", async (req, res) => {
  const { user_id } = req.body;
  const { user_concert_id } = req.params;

  if (!user_id || !user_concert_id) {
      return res.status(400).json({ message: "User ID and user_concert ID are required" });
  }

  try {
      await pool.query(
          `INSERT INTO likes (user_id, user_concert_id) 
           VALUES ($1, $2) 
           ON CONFLICT (user_id, user_concert_id) DO NOTHING`,
          [user_id, user_concert_id]
      );

      res.status(200).json({ message: "Liked" });
  } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// unlike a user's concert interaction
app.delete("/user-concerts/:user_concert_id/like", async (req, res) => {
  const { user_id } = req.body;
  const { user_concert_id } = req.params;

  try {
      const result = await pool.query(
          `DELETE FROM likes WHERE user_id = $1 AND user_concert_id = $2`,
          [user_id, user_concert_id]
      );

      if (result.rowCount === 0) {
          return res.status(400).json({ message: "Like not found" });
      }

      res.status(200).json({ message: "Unliked" });
  } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// comment on a user's concert interaction
app.post("/user-concerts/:user_concert_id/comment", async (req, res) => {
  const { user_id, content } = req.body;
  const { user_concert_id } = req.params;

  if (!user_id || !user_concert_id || !content) {
      return res.status(400).json({ message: "User ID, user_concert ID, and content are required" });
  }

  try {
      await pool.query(
          `INSERT INTO comments (user_id, user_concert_id, content) 
           VALUES ($1, $2, $3)`,
          [user_id, user_concert_id, content]
      );

      res.status(200).json({ message: "Comment added" });
  } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// delete a comment on a user's concert interaction
app.delete("/user-concerts/:user_concert_id/comment/:comment_id", async (req, res) => {
  const { user_id } = req.body;
  const { user_concert_id, comment_id } = req.params;

  try {
      const result = await pool.query(
          `DELETE FROM comments WHERE id = $1 AND user_id = $2`,
          [comment_id, user_id]
      );

      if (result.rowCount === 0) {
          return res.status(400).json({ message: "Comment not found" });
      }

      res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// get likes and comments on a user's concert interaction
app.get("/user-concerts/:user_concert_id/reactions", async (req, res) => {
  const { user_concert_id } = req.params;

  try {
      const likesQuery = await pool.query(
          `SELECT users.id, users.username 
           FROM likes 
           JOIN users ON users.id = likes.user_id 
           WHERE likes.user_concert_id = $1`,
          [user_concert_id]
      );

      const commentsQuery = await pool.query(
          `SELECT comments.id, users.id AS user_id, users.username, comments.content, comments.created_at 
           FROM comments 
           JOIN users ON users.id = comments.user_id 
           WHERE comments.user_concert_id = $1 
           ORDER BY comments.created_at ASC`,
          [user_concert_id]
      );

      res.status(200).json({
          likes: likesQuery.rows,
          comments: commentsQuery.rows
      });
  } catch (error) {
      console.error("Error fetching likes/comments", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// get concerts from Ticketmaster based on artist, concert name, city, and date
app.get("/concerts", async (req, res) => {
    try {
        const { artist, concert_name, city, date } = req.query;
        
        let params = {
            apikey: TICKETMASTER_API_KEY,
            size: 20,  // Number of results per request
        };

        // Add filters if provided
        if (artist) params.keyword = artist;
        if (concert_name) params.keyword = concert_name;
        if (city) params.city = city;
        if (date) params.startDateTime = new Date(date).toISOString();

        // Fetch from Ticketmaster API
        const response = await axios.get(TICKETMASTER_API_URL, { params });

        // Extract concert data
        const concerts = response.data._embedded?.events || [];

        // Format the response
        const formattedConcerts = concerts.map(concert => ({
            id: concert.id,
            name: concert.name,
            url: concert.url,
            date: concert.dates.start.localDate,
            time: concert.dates.start.localTime || "TBA",
            venue: concert._embedded?.venues?.[0]?.name || "Unknown Venue",
            city: concert._embedded?.venues?.[0]?.city?.name || "Unknown City",
            image: concert.images?.[0]?.url || null
        }));

        res.status(200).json(formattedConcerts);
    } catch (error) {
        console.error("Error fetching concerts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
