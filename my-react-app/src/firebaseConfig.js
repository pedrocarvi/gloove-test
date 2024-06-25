// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de tu aplicación web en Firebase
const firebaseConfig = {
    apiKey: "AIzaSyANAjJ8qVI0gEvE90TxcV4fahf1BdrLN2Y",
    authDomain: "software-gloove.firebaseapp.com",
    projectId: "software-gloove",
    storageBucket: "software-gloove.appspot.com",
    messagingSenderId: "322049603815",
    appId: "1:322049603815:web:60ebde0679e0d847224a42",
    measurementId: "G-KFYP5CEEWG"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, analytics };
