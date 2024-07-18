import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyANAjJ8qVI0gEvE90TxcV4fahf1BdrLN2Y",
  authDomain: "software-gloove.firebaseapp.com",
  projectId: "software-gloove",
  storageBucket: "software-gloove.appspot.com",
  messagingSenderId: "322049603815",
  appId: "1:322049603815:web:60ebde0679e0d847224a42",
  measurementId: "G-KFYP5CEEWG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testFirestore() {
  try {
    await signInWithEmailAndPassword(auth, 'empleado7@example.com', 'password123');

    const user = auth.currentUser;
    if (!user) {
      console.error('No se pudo autenticar');
      return;
    }

    console.log('Usuario autenticado:', user.uid);

    const uid = 'Ps62fnUAudIGXenHwexi'; // El UID del empleado
    const productsRef = collection(db, 'empleados', uid, 'productosInventario');
  
    const snapshot = await getDocs(productsRef);
    console.log(`Número de documentos en productosInventario: ${snapshot.size}`);
    
    for (const docSnap of snapshot.docs) {
      console.log(`ID del documento: ${docSnap.id}`);
      const productDoc = await getDoc(doc(db, 'empleados', uid, 'productosInventario', docSnap.id));
      if (productDoc.exists()) {
        console.log('Datos del producto:', productDoc.data());
      } else {
        console.log('No se encontraron datos para este documento');
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Cerrar la conexión y terminar el script
    await auth.signOut();
    process.exit(0);
  }
}

testFirestore();