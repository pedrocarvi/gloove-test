import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
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
const auth = getAuth();

async function createUser(email, password, role, name) {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const userRef = db.collection("users").doc(userRecord.uid);
    await userRef.set({
      email,
      role,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedRegistration: role === "propietario" ? false : true,
      currentStep: 0,
      processStatus: "technical_form",
    });

    if (role === "propietario") {
      const propietarioRef = db.collection("propietarios").doc(userRecord.uid);
      await propietarioRef.set({
        name,
        email,
      });

      const procesoDeAltaRef = propietarioRef.collection("proceso_de_alta");

      const initialDocs = [
        { id: "technical_form", data: {} },
        { id: "textil_presupuesto", data: {} },
        { id: "textile_summaries", data: {} },
        { id: "distinct_documents", data: {} },
        { id: "contract", data: {} },
        { id: "inventario", data: {} },
      ];

      for (const doc of initialDocs) {
        await procesoDeAltaRef.doc(doc.id).set(doc.data);
      }
    }

    console.log(
      "User created and initial structure set in Firestore:",
      userRecord.uid
    );
  } catch (error) {
    console.error("Error creating new user:", error);
  }
}

// Ejemplo de uso
createUser(
  "propietarioAlexandra3@example.com",
  "password123",
  "propietario",
  "Valentino Garcia"
);
createUser(
  "alexandraferrer3@gloove.me",
  "Alexandra.2468",
  "empleado",
  "Juan Perez"
);
createUser("huespedRos4@example.com", "pass¢word123", "huesped", "Ana Lopez");
