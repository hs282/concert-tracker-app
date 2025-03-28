import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { User, useUser } from "@/context/UserContext";
import { useState } from "react";

export default function FeedItem({
  user,
  userEventID,
  eventName,
  eventDate,
  markedDate,
  status,
  eventUrl,
}: {
  user: string;
  userEventID: string;
  eventName: string;
  eventDate: string;
  markedDate: string;
  status: string;
  eventUrl: string;
}) {
  // TODO: get currentUser higher up in component tree and pass down into this component
  const { user: currentUser, loading } = useUser();

  // TODO: display a loading component
  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (!currentUser)
    return (
      <View>
        <Text>Please log in</Text>
      </View>
    );

  const [likerIDs, setLikerIDs] = useState<Set<string>>();
  const formattedEventDate = new Date(eventDate).toLocaleDateString();
  const formattedMarkedDate = new Date(markedDate).toLocaleString();

  const like = async () => {
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/user-concerts/${userEventID}/like`,
        {
          user_id: currentUser.id,
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getLikes = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/user-concerts/${userEventID}/reactions`
      );

      const users = await res.data.likes;
      const likers = new Set<string>(users.map((user: User) => user.id));
      setLikerIDs(likers);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  getLikes();
  const isLiked = likerIDs?.has(currentUser.id);

  return (
    <View style={styles.post}>
      <Text style={styles.postText}>
        {user} {status}{" "}
        <Link
          href={{
            pathname: "/event-details",
            params: {
              eventName,
              eventDate: formattedEventDate,
              eventUrl,
              // saved vs attended by current user
            },
          }}
          style={styles.link}
        >
          {eventName}
        </Link>
        {status === "saved" && " happening"} on {formattedEventDate}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.dateMarkedText}>{formattedMarkedDate}</Text>
        <View style={styles.postActions}>
          <Pressable onPress={like}>
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={24}
              color={isLiked ? "red" : "white"}
            />
          </Pressable>

          <Pressable>
            <FontAwesome name="comment-o" size={26} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    borderColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    justifyContent: "center",
    borderRadius: 10,
    gap: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postText: {
    color: "white",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  dateMarkedText: {
    color: "lightgray",
  },
  link: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
