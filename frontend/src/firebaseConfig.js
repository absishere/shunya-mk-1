// frontend/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDMbfvEDzZR3DnSVMS-vlHiCHrSmr0yprA",
  authDomain: "studentlifeassistance.firebaseapp.com",
  projectId: "studentlifeassistance",
  storageBucket: "studentlifeassistance.firebasestorage.app",
  messagingSenderId: "510646014866",
  appId: "1:510646014866:web:fd56563d137353073ae74b",
  measurementId: "G-SFBEGGY6NH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);