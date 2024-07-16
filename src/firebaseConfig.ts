import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

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

let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.error("Analytics no soportado: ", error);
  });
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { firebaseConfig, auth, db, storage, analytics };
