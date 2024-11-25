// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9pLAfoAgO1wWY0_9n_X7_uXa7YnsXXmg",
  authDomain: "chat-realtime-6f50a.firebaseapp.com",
  databaseURL: "https://chat-realtime-6f50a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-realtime-6f50a",
  storageBucket: "chat-realtime-6f50a.firebasestorage.app",
  messagingSenderId: "229129458106",
  appId: "1:229129458106:web:5c0b3f5b9b7bf5efe78d83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase();
