// src/tests/firestorePermissionTest.mjs
import 'dotenv/config'; // Cargar variables de entorno desde .env
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig, auth, db } from '../firebaseConfig.ts';

const app = initializeApp(firebaseConfig);

async function testFirestorePermissions() {
  try {
    // 1. Autenticar al usuario
    const userEmail = 'empleado@example.com'; // Reemplaza con un email de empleado real
    const userPassword = 'password123'; // Reemplaza con la contraseña correcta

    const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
    const user = userCredential.user;

    console.log('Usuario autenticado:', user.uid);

    // 2. Intentar leer el documento del usuario
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log('Documento de usuario leído correctamente:', userDocSnap.data());
    } else {
      console.log('No se encontró el documento del usuario');
    }

    // 3. Intentar leer la colección de empleados
    const empleadosRef = collection(db, 'empleados');
    const empleadosSnapshot = await getDocs(empleadosRef);
    console.log('Documentos en la colección empleados:', empleadosSnapshot.size);

    // 4. Intentar leer una subcolección específica del empleado
    const tareaRef = collection(db, `empleados/${user.uid}/tareas`);
    const tareasSnapshot = await getDocs(tareaRef);
    console.log('Documentos en la subcolección tareas:', tareasSnapshot.size);

  } catch (error) {
    console.error('Error durante las pruebas:', error);
  }
}

testFirestorePermissions();

