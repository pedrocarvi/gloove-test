import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
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
  const empleadosCollection = db.collection('empleados');
  const usersCollection = db.collection('users');
  const huespedesCollection = db.collection('huespedes');

  // Crear documentos de ejemplo para cada colección (ajusta según sea necesario)
  await usersCollection.doc('userId1').set({
    name: "Juan Pérez",
    email: "juan@example.com",
    role: {
      type: "propietario",
      additionalInfo: "Some additional info"
    },
    completedRegistration: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    currentStep: 0,
    processStatus: "ficha_tecnica"
  });

  await propietariosCollection.doc('userId1').set({
    name: "Juan Pérez",
    email: "juan@example.com",
    activated: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  // Crear subcolecciones y documentos en proceso_de_alta
  const procesosDeAltaCollection = propietariosCollection.doc('userId1').collection('proceso_de_alta');

  await procesosDeAltaCollection.doc('technical_form').set({
    completed: false,
    data: {
      campo1: 'valor1',
      campo2: 'valor2'
    },
    timestamp: FieldValue.serverTimestamp()
  });

  await procesosDeAltaCollection.doc('textil_presupuesto').set({
    completed: false,
    data: {
      toallaDucha: '',
      toallaLavabo: '',
      alfombrin: '',
      sabanaEncimera90: '',
      sabanaEncimera105: '',
      sabanaEncimera150: '',
      sabanaEncimera180: '',
      fundaAlmohada75: '',
      fundaAlmohada90: '',
      rellenoAlmohada75: '',
      rellenoAlmohada90: '',
      fundaNordica90: '',
      fundaNordica105: '',
      fundaNordica135: '',
      fundaNordica150: '',
      fundaNordica180: '',
      fundaNordica200: '',
      rellenoNordico90: '',
      rellenoNordico105: '',
      rellenoNordico135: '',
      rellenoNordico150: '',
      rellenoNordico180: '',
      rellenoNordico200: '',
      protectorColchon180: '',
      protectorColchon150: '',
      protectorColchon135: '',
      protectorColchon105: '',
      protectorColchon90: '',
    },
    timestamp: FieldValue.serverTimestamp()
  });

  await procesosDeAltaCollection.doc('textile_summaries').set({
    pdfUrl: '',
    total_sabanas: 0,
    total_fundas_edredon: 0,
    total_alfombrines: 0,
    total_toallas_grandes: 0,
    total_toallas_pequenas: 0,
    total_fundas_almohada: 0,
    timestamp: FieldValue.serverTimestamp()
  });

  await procesosDeAltaCollection.doc('distinct_documents').set({
    dni: '',
    referenciaCatastral: '',
    vut: '',
    timestamp: FieldValue.serverTimestamp()
  });

  await procesosDeAltaCollection.doc('contract').set({
    pdfUrl: '',
    timestamp: FieldValue.serverTimestamp()
  });

  await procesosDeAltaCollection.doc('inventario').set({
    propiedad: {
      numero_habitaciones: '',
      numero_banos: '',
      aire_acondicionado: false,
      calefaccion: false,
      piscina: false,
    },
    caracteristicasAdicionales: {
      terraza: false,
      alarma: false,
      gimnasio: false,
      squash: false,
      balcon: false,
      padel: false,
      tenis: false,
      zonaInfantil: false,
      spa: false,
      animales: false,
      pesoLimiteAnimalesKg: '',
      seAceptanAnimalesRazaPeligrosa: false,
    },
    piscina: {
      tipoPiscina: '',
      fechaApertura: '',
      fechaCierre: '',
      dimensiones: '',
      profundidadMaxima: '',
      profundidadMinima: '',
      piscinaClimatizada: false,
      fechaAperturaClimatizada: '',
      fechaCierreClimatizada: '',
      dimensionesClimatizada: '',
      profundidadMaximaClimatizada: '',
      profundidadMinimaClimatizada: '',
    },
    restricciones: {
      noGruposJovenesMenosDe: '',
      fumarPermitido: false,
    },
    vistas: {
      mar: false,
      piscina: false,
      jardin: false,
      lago: false,
      golf: false,
      rio: false,
      montana: false,
      pistaSki: false,
      puertoDeportivo: false,
    },
    extras: {
      cuna: false,
      camaSupletoria: false,
      mascota: false,
      sillaBebe: false,
    },
    timestamp: FieldValue.serverTimestamp()
  });

  // Crear subcolección para propietarios validados
  const propietariosValidadosCollection = propietariosCollection.doc('userId1').collection('propietarios_validados');
  await propietariosValidadosCollection.doc('validated_propietarioId1').set({
    name: "Juan Pérez",
    email: "juan@example.com",
    validatedAt: FieldValue.serverTimestamp()
  });

  // Crear documento de ejemplo para empleados y activaciones
  await empleadosCollection.doc('empleadoId1').set({
    name: "Carlos López",
    email: "carlos@example.com",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  const activacionesCollection = empleadosCollection.doc('empleadoId1').collection('activaciones');
  const activacionRef = activacionesCollection.doc('userId1');
  await activacionRef.set({
    fase_actual: "ficha_tecnica",
    status: "pendiente",
    ficha_tecnica: {
      completed: false,
      comments: "",
      timestamp: FieldValue.serverTimestamp()
    },
    textil: {
      completed: false,
      comments: "",
      timestamp: FieldValue.serverTimestamp()
    },
    presupuesto: {
      completed: false,
      comments: "",
      timestamp: FieldValue.serverTimestamp()
    },
    documentacion: {
      completed: false,
      comments: "",
      timestamp: FieldValue.serverTimestamp()
    },
    contrato: {
      completed: false,
      comments: "",
      timestamp: FieldValue.serverTimestamp()
    },
    inventario: {
      completed: false,
      comments: "",
      timestamp: FieldValue.serverTimestamp()
    }
  });

  // Crear documento de ejemplo para huespedes
  await huespedesCollection.doc('huespedId1').set({
    name: "Laura García",
    email: "laura@example.com",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  console.log('Colecciones y documentos creados');
}

createCollections().catch(console.error);
