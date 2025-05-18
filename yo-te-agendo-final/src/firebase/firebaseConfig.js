// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWlGmL4r5TrRLm0ZRWJ7AyAMOuVwkmNM4",
  authDomain: "printdev-52b49.firebaseapp.com",
  projectId: "printdev-52b49",
  storageBucket: "printdev-52b49.firebasestorage.com",
  messagingSenderId: "490782548340",
  appId: "1:490782548340:web:e2e75486e9a36f80394c21",
  measurementId: "G-MSB29SVVL1"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta instancias de Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
