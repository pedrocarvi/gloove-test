import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  type: process.env.SERVICE_ACCOUNT_TYPE,
  project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
};

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase initialized successfully");

async function createUser(email, password, role) {
  try {
    // Crear usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    console.log('Successfully created new user:', userRecord.uid);

    // Guardar información del usuario en Firestore
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set({
      email: email,
      role: role,
      completedRegistration: role === 'propietario' ? false : true,
    });

    if (role === 'propietario') {
      // Crear la estructura del propietario en Firestore
      const propietarioRef = db.collection('propietarios').doc(userRecord.uid);
      await propietarioRef.set({
        name: 'Nombre del Propietario',
      });

      const registrationProcessRef = propietarioRef.collection('proceso_de_alta').doc('registration-process-id');
      await registrationProcessRef.set({
        step: 'Documentación enviada',
        completed: false,
      });
    }

    console.log('User data successfully written to Firestore');
  } catch (error) {
    console.log('Error creating new user:', error);
  }
}

// Crear usuarios de prueba
createUser('empleado@example.com', 'empleado123', 'empleado');
createUser('huesped@example.com', 'huesped123', 'huesped');
createUser('propietario@example.com', 'propietario123', 'propietario');
