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

try {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  console.log("Firebase initialized successfully");

  const db = getFirestore();
  const auth = getAuth();

  async function createStructure() {
    // Crea un usuario
    const userRef = db.collection('users').doc('user-id');
    await userRef.set({
      email: 'user@example.com',
      role: 'propietario',
      completedRegistration: false,
    });

    // Crea un propietario con subcolecciones
    const propietarioRef = db.collection('propietarios').doc('propietario-id');
    await propietarioRef.set({
      name: 'Nombre del Propietario',
    });

    // Subcolección: propiedades
    const propertyRef = propietarioRef.collection('properties').doc('property-id');
    await propertyRef.set({
      name: 'Casa Bonita',
      address: '123 Calle Falsa',
    });

    // Subcolección: chats
    const chatRef = propietarioRef.collection('chats').doc('chat-id');
    await chatRef.set({
      message: 'Hola',
    });

    // Subcolección: propietarios validados
    const validatedOwnerRef = propietarioRef.collection('propietarios_validados').doc('validated-owner-id');
    await validatedOwnerRef.set({
      name: 'Nombre del Propietario Validado',
      email: 'validated@example.com',
    });

    // Subcolección: proceso de alta
    const registrationProcessRef = propietarioRef.collection('proceso_de_alta').doc('registration-process-id');
    await registrationProcessRef.set({
      step: 'Documentación enviada',
      completed: false,
    });

    // Crea un huésped con subcolecciones
    const huespedRef = db.collection('huespedes').doc('huesped-id');
    await huespedRef.set({
      name: 'Nombre del Huésped',
    });

    const reservationRef = huespedRef.collection('reservations').doc('reservation-id');
    await reservationRef.set({
      propertyId: 'property-id',
      dates: '2024-07-01 to 2024-07-10',
    });

    const huespedChatRef = huespedRef.collection('chats').doc('chat-id');
    await huespedChatRef.set({
      message: 'Hola',
    });

    // Crea un empleado con subcolecciones
    const empleadoRef = db.collection('empleados').doc('empleado-id');
    await empleadoRef.set({
      name: 'Nombre del Empleado',
    });

    const taskRef = empleadoRef.collection('tasks').doc('task-id');
    await taskRef.set({
      description: 'Limpiar piscina',
    });

    console.log('Estructura de Firestore creada exitosamente');
  }

  createStructure().catch(console.error);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}





