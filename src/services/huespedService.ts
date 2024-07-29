import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface Huesped {
  id: string;
  name: string;
  email: string;
  // Añade aquí otros campos específicos de los huéspedes
  reservationStatus?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}

export const getHuespedes = async (): Promise<Huesped[]> => {
  const huespedRef = collection(db, "users");
  const q = query(huespedRef, where("role", "==", "huesped"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Huesped));
};

export const getHuespedesActivos = async (): Promise<Huesped[]> => {
  const huespedRef = collection(db, "users");
  const q = query(
    huespedRef,
    where("role", "==", "huesped"),
    where("reservationStatus", "==", "active")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Huesped));
};

export const actualizarEstadoHuesped = async (
  id: string,
  status: string
): Promise<void> => {
  const huespedRef = doc(db, "users", id);
  await updateDoc(huespedRef, { reservationStatus: status });
};

// Puedes añadir más funciones específicas para los huéspedes aquí, como:
// - Función para registrar check-in
// - Función para registrar check-out
// - Función para actualizar detalles de la reserva
// etc.