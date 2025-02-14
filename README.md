Fri:
- login
- account creation
- integrate APIs

Sunday:
- add documentation
- clean up code to push to github
- add friends button on profile to display friends
- endpoint that updates the status of a concert (example: change "saved" to "attended", "attended" to "saved", unsave, unattended --> PUT request



- block another user
- notifications
- suggestions for searches

- implement data storage using react-native-sqlite-storage



User table
- ID
- Name
- Photo

Concerts table
- name
- venue
- date
- url

user_concerts table
- id (primary key)
- user_id (Foreign Key -> users.id)
- concert_id (Foreign Key -> concerts.id)
- status (Enum: "interested", "attended")
- created_at