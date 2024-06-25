import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics'; // Importa isSupported para comprobar el entorno
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de tu aplicación web en Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { firebaseConfig, auth, db, storage, analytics };

