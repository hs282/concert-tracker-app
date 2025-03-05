Fri:
- display user's profile feed
- display friend activity feed
- allow likes on posts
1 hr

- list concerts attended
- list concerts saved
- get concerts attended/saved number to update automatically
1 hr


- 2 hrs add unit tests
- 2 hrs clean up code to push to github
    - add types
    - add input validation (sign up, etc)
- 1 hr add documentation
    - explain what the "competitor" apps lack (dice, gigit, concert archives)
    - describe purpose (niche apps are becoming more popular as people crave community over mutual interests, such as Beli, Strava, GoodReads)
    - features, target audience, wireframes?
    - list tech stack and reasons for choosing it
    - used separate id for user in postgresql and stored firebase UID in a separate column in the users table because if I switch from Firebase in the future, the user table would still work. 
    - chose to use separate UUID for concert_id rather than use ticketmaster's event ID so that it can be compatible with fetching concert data from other sites like EDM train
    - list future plans: pulling event data from EDM train to display raves
- 30 min Put project on resume

- set up amazon s3 for storing user's profile photos
- change IDs from serial to UUID
- add password as column to users table?
- authprovider? global auth thingy?
- show on phone
- incorporate tailwind
- add friends button on profile to display friends
- endpoint that updates the status of a concert (example: change "saved" to "attended", "attended" to "saved", unsave, unattended --> PUT request

- test API requests using Postman
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

tech stack:
axios
user authentication: firebase
expo, react native
backend: node, express
database: postgresql
testing: Jest

watchman watch-del-all fixed errors