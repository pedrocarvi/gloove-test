// src/utils/emailService.ts

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Asegúrate de que tu configuración de Firebase esté importada correctamente
import { firebaseConfig } from "../firebaseConfig";

// Inicializa Firebase si aún no lo has hecho
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface EmailData {
  to: string[];
  subject: string;
  body: string;
  attachments: string[]; // URLs de los documentos a adjuntar
}

export const sendEmail = async (emailData: EmailData): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  // En lugar de enviar directamente el email (lo cual requeriría configuración del lado del servidor),
  // vamos a guardar la solicitud de email en Firestore para que un proceso del lado del servidor lo envíe.
  const emailRequestRef = doc(db, "emailRequests", Date.now().toString());
  await setDoc(emailRequestRef, {
    ...emailData,
    status: "pending",
    createdAt: new Date(),
    userId: user.uid,
  });

  console.log("Solicitud de email guardada en Firestore");
};