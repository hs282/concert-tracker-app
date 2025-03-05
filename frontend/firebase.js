// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtO4UK2ExdJlW4u4iEIiCxCr9TKYjjn-Y",
  authDomain: "concert-tracker-66012.firebaseapp.com",
  projectId: "concert-tracker-66012",
  storageBucket: "concert-tracker-66012.firebasestorage.app",
  messagingSenderId: "983448935055",
  appId: "1:983448935055:web:e341d79aa84453b5f6aefa",
  measurementId: "G-8HDYPH8J69",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };
