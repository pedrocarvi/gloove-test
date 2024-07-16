// src/services/propietarioService.ts

import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

interface Propietario {
  id: string;
  // Otros campos del propietario
}

export const getPropietariosEnProceso = async (): Promise<Propietario[]> => {
  const propietariosRef = collection(db, "propietariosEnProceso");
  const snapshot = await getDocs(propietariosRef);
  const propietarios = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Propietario)
  );
  return propietarios;
};

export const getPropietariosValidados = async (): Promise<Propietario[]> => {
  const propietariosRef = collection(db, "propietariosValidados");
  const snapshot = await getDocs(propietariosRef);
  const propietarios = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Propietario)
  );
  return propietarios;
};

export const enviarInvitacion = async (email: string) => {
  const invitacionRef = doc(collection(db, "invitaciones"));
  await setDoc(invitacionRef, { email });
  // Aquí puedes agregar la lógica para enviar el correo y mensaje de WhatsApp
};

export const actualizarEstadoPropietario = async (
  id: string,
  action: string
) => {
  const propietarioRef = doc(db, "propietariosEnProceso", id);
  await updateDoc(propietarioRef, { [action]: true });
};
