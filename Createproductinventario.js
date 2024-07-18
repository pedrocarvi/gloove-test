import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: process.env.VITE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.VITE_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
    /\\n/g,
    "\n"
  ),
  client_email: process.env.VITE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.VITE_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.VITE_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.VITE_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.VITE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.VITE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function createProductosInventario() {
  const productos = [
    { name: "Cerradura electronica 100mm", quantity: 0, minQuantity: 1 },
    { name: "Cerradura electronica 70mm", quantity: 0, minQuantity: 1 },
    { name: "Air cableado", quantity: 0, minQuantity: 1 },
    { name: "Air enchufable", quantity: 0, minQuantity: 1 },
    { name: "Carteles fachada", quantity: 0, minQuantity: 1 },
    { name: "Kits baño doble rollo basic", quantity: 0, minQuantity: 1 },
    { name: "Kits limpieza luxury", quantity: 0, minQuantity: 1 },
    { name: "Garrafa 5 L gel", quantity: 0, minQuantity: 1 },
    { name: "Garrafa 5 L champú", quantity: 0, minQuantity: 1 },
    { name: "Garrafa 5 L jabon de manos", quantity: 0, minQuantity: 1 },
    { name: "Kit baño bio en caja", quantity: 0, minQuantity: 1 },
    { name: "Pilas AAA", quantity: 0, minQuantity: 1 },
  ];

  try {
    const productosCollectionRef = db.collection('empleados').doc('inventario').collection('productos');

    for (const producto of productos) {
      await productosCollectionRef.doc(producto.name).set(producto);
    }
    console.log('Productos añadidos a la colección productos.');
  } catch (error) {
    console.error("Error añadiendo productos:", error);
  }
}

createProductosInventario();

