import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAgmwg6p43CyvbrqJry0udFpBAt_n3NwQs",
  authDomain: "nwitter-reloaded-1105a.firebaseapp.com",
  projectId: "nwitter-reloaded-1105a",
  storageBucket: "nwitter-reloaded-1105a.firebasestorage.app",
  messagingSenderId: "98979528433",
  appId: "1:98979528433:web:66ddca6433ca9dfa93b350"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);