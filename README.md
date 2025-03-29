# Concert Tracking App

An iOS app that functions as a concert-tracking diary/social media

## The App

Users can search for upcoming concerts, mark them as saved/attended, and view concerts that their friends have saved/attended.

## Built With

- <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
- <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
- <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
- <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
- <img src="https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white">
- <img src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black">
- <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white">
- <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
- <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white">
- <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
- <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">

## Installation steps/how to run

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure a `.env` file for both the backend and frontend directories
4. Start the application by running `npx expo start` in the frontend directory and `npm start` in the backend directory.

## Plans for future work

- Fetch event data from [EDM train](https://edmtrain.com) to display raves/festivals that aren't shown in Ticketmaster
- Add filters/sorting to list of marked concerts, profile feed, and search results
- On any given event, display text stating how many friends saved/attended it and upon clicking this text, show popup modal listing those friends
- Handle notifications and comments
- Implement autocomplete search bar for searching events
- When marking an event as attended, enable users to upload photos/videos of their experience at the event
