// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore in modular API

// Your web app's Firebase configuration (from your Firebase console)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: "hbargotchi.firebaseapp.com",
  projectId: "hbargotchi",
  storageBucket: "hbargotchi.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID!
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (use this in your app to interact with Firestore)
const db = getFirestore(app);

export { db };