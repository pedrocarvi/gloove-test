import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: process.env.VITE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.VITE_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.VITE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.VITE_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.VITE_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.VITE_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.VITE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.VITE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
};

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'software-gloove.appspot.com'
});

const bucket = getStorage().bucket();
const auth = getAuth();

const userId = 'SNijcNGRsZQIfAcRaPJOKXwMOfo1'; // El UID del usuario que estás probando

const documentsConfig = [
  {
    title: "Ficha técnica",
    storagePath: (uid) => `DocumentacionPropietarios/FichaTecnica/ficha_tecnica_${uid}.pdf`,
  },
  {
    title: "Textil + Presupuesto",
    storagePath: (uid) => `Presupuesto Textil/textile_summary_${uid}.pdf`,
  },
  {
    title: "Documentación",
    storagePath: () => `Documentacion obligatoria/Documentación necesaria para cumplimentación de contrato.pdf`,
  },
  {
    title: "Contrato",
    storagePath: (uid) => `DocumentacionPropietarios/Contratos/contract_${uid}.pdf`,
  },
  {
    title: "Inventario",
    storagePath: (uid) => `DocumentacionPropietarios/Inventario/inventario_${uid}.pdf`,
  },
];

async function fetchDocumentUrls(uid) {
  const urls = {};
  for (const docInfo of documentsConfig) {
    const storagePath = typeof docInfo.storagePath === 'function'
      ? docInfo.storagePath(uid)
      : docInfo.storagePath();

    console.log(`Fetching document ${docInfo.title} from path ${storagePath}`);

    const file = bucket.file(storagePath);
    try {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025'
      });
      console.log(`Generated URL for ${docInfo.title}: ${url}`);
      urls[docInfo.title] = url;
    } catch (error) {
      console.error(`Error getting URL for ${docInfo.title}:`, error);
    }
  }
  return urls;
}

async function testStorage() {
  try {
    // Verifica si el usuario está autenticado
    const user = await auth.getUser(userId);
    console.log(`User is authenticated: ${user.uid}`);

    // Fetch document URLs
    const urls = await fetchDocumentUrls(userId);

    // Print the URLs
    console.log('Document URLs:', urls);
  } catch (error) {
    console.error('Error:', error);
  }
}

testStorage();
