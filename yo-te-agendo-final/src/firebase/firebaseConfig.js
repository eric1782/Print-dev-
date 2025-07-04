import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ← esto es necesario para subir imágenes

const firebaseConfig = {
  apiKey: "AIzaSyCWlGmL4r5TrRLm0ZRWJ7AyAMOuVwkmNM4",
  authDomain: "printdev-52b49.firebaseapp.com",
  projectId: "printdev-52b49",
  storageBucket: "printdev-52b49.appspot.com", // ✅ corregido aquí
  messagingSenderId: "490782548340",
  appId: "1:490782548340:web:e2e75486e9a36f80394c21",
  measurementId: "G-MSB29SVVL1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ exportar storage correctamente
