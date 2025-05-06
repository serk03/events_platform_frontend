import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_ya857JBdIBuYuajUBQs0zAtckGXnQP4",
  authDomain: "event-platform-78e32.firebaseapp.com",
  projectId: "event-platform-78e32",
  storageBucket: "event-platform-78e32.appspot.com",
  messagingSenderId: "709886380359",
  appId: "1:709886380359:web:b819c0d21472898a652462",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
