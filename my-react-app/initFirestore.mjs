import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configurar las credenciales usando las variables de entorno
const serviceAccount = {
  type: process.env.VITE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.VITE_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.VITE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.VITE_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.VITE_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.VITE_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.VITE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.VITE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
};

// Inicializa la app de Firebase Admin con las credenciales de la cuenta de servicio
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function createCollections() {
  const propietariosCollection = db.collection('propietarios');
  const procesosDeAltaCollection = db.collection('procesos_de_alta');
  const empleadosCollection = db.collection('empleados');
  const huespedesCollection = db.collection('huespedes');
  const usersCollection = db.collection('users');

  // Crear documentos de ejemplo para cada colección (ajusta según sea necesario)
  await usersCollection.doc('userId1').set({
    nombre: "Juan Pérez",
    email: "juan@example.com",
    rol: "propietario",
    completedRegistration: false
  });

  await propietariosCollection.doc('propietarioId1').set({
    nombre: "Juan Pérez",
    rol: "propietario",
    estado: "proceso_de_alta"
  });

  // Crear subcolecciones y documentos en procesos_de_alta
  const fichaTecnicaRef = procesosDeAltaCollection.doc('ficha_tecnica').collection('propietarioId1').doc('data');
  await fichaTecnicaRef.set({
    // Datos del formulario de ficha técnica
    campo1: 'valor1',
    campo2: 'valor2'
  });

  const textileDetailsRef = procesosDeAltaCollection.doc('textile_details').collection('propietarioId1').doc('data');
  await textileDetailsRef.set({
    // Datos del formulario de detalles textiles
    campo1: 'valor1',
    campo2: 'valor2'
  });

  const propertyDetailsRef = procesosDeAltaCollection.doc('property_details').collection('propietarioId1').doc('data');
  await propertyDetailsRef.set({
    // Datos del formulario de detalles de la propiedad
    campo1: 'valor1',
    campo2: 'valor2'
  });

  const inventoryDetailsRef = procesosDeAltaCollection.doc('inventory_details').collection('propietarioId1').doc('data');
  await inventoryDetailsRef.set({
    // Datos del formulario de inventario
    campo1: 'valor1',
    campo2: 'valor2'
  });

  const contractDetailsRef = procesosDeAltaCollection.doc('contract_details').collection('propietarioId1').doc('data');
  await contractDetailsRef.set({
    // Datos del formulario del contrato
    campo1: 'valor1',
    campo2: 'valor2'
  });

  console.log('Colecciones y documentos creados');
}

createCollections().catch(console.error);
