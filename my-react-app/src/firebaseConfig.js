import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // Importa isSupported para comprobar el entorno
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de tu aplicación web en Firebase usando variables de entorno
const firebaseConfig = {};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { firebaseConfig, auth, db, storage, analytics };
