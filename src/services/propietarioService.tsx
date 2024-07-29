import { db, storage } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

export interface Propietario {
  id: string;
  name: string;
  email: string;
  fichaTecnica: string;
  presupuestoTextil: string;
  dni: string;
  referenciaCatastral: string;
  vut: string;
  contrato: string;
  inventario: string;
  chat: number;
  documentos?: boolean;
  completedRegistration: boolean;
  currentStep: number;
  processStatus: string;
  updatedAt: any;
}

const failedDocumentsCache: { [key: string]: boolean } = {};

const fetchDocumentURL = async (
  propietarioId: string,
  docPath: string,
  formats: string[] = ["jpg", "png", "pdf"]
): Promise<string> => {
  for (const format of formats) {
    const fullPath = `${docPath}.${format}`;
    const cacheKey = `${propietarioId}/${fullPath}`;
    if (failedDocumentsCache[cacheKey]) {
      continue;
    }
    try {
      const fileRef = ref(storage, fullPath);
      const url = await getDownloadURL(fileRef);
      console.log(`Fetched URL for ${fullPath}: ${url}`);
      return url;
    } catch (error) {
      if ((error as any).code === "storage/object-not-found") {
        console.warn(`Document ${fullPath} not found.`);
        failedDocumentsCache[cacheKey] = true;
      } else {
        console.error(`Error getting URL for document ${fullPath}:`, error);
        return "pendiente";
      }
    }
  }
  return "pendiente";
};

export const updatePropietarioDocuments = async (propietario: Propietario) => {
  propietario.fichaTecnica = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/FichaTecnica/ficha_tecnica_${propietario.id}`
  );
  propietario.presupuestoTextil = await fetchDocumentURL(
    propietario.id,
    `Presupuesto Textil/textile_summary_${propietario.id}`
  );
  propietario.dni = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/dNI/dNI_${propietario.id}`
  );
  propietario.referenciaCatastral = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/refCatastral/refCatastral_${propietario.id}`
  );
  propietario.vut = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/vUT/vUT_${propietario.id}`
  );
  propietario.contrato = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/Contratos/contract_${propietario.id}`
  );
  propietario.inventario = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/Inventario/inventario_${propietario.id}`
  );
  return propietario;
};

export const getPropietariosEnProceso = async (): Promise<Propietario[]> => {
  const propietariosRef = collection(db, "users");
  const q = query(
    propietariosRef,
    where("role", "==", "propietario"),
    where("completedRegistration", "==", false)
  );
  const snapshot = await getDocs(q);
  const propietarios = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Propietario)
  );

  for (const propietario of propietarios) {
    await updatePropietarioDocuments(propietario);
  }

  return propietarios;
};

export const getPropietariosValidados = async (): Promise<Propietario[]> => {
  const propietariosRef = collection(db, "users");
  const q = query(
    propietariosRef,
    where("role", "==", "propietario"),
    where("completedRegistration", "==", true)
  );
  const snapshot = await getDocs(q);
  const propietarios = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Propietario)
  );

  for (const propietario of propietarios) {
    await updatePropietarioDocuments(propietario);
  }

  return propietarios;
};

export const enviarInvitacion = async (email: string): Promise<void> => {
  const invitacionRef = doc(collection(db, "invitaciones"));
  await setDoc(invitacionRef, { email });
};

export const actualizarEstadoPropietario = async (
  id: string,
  action: string
): Promise<void> => {
  const propietarioRef = doc(db, "users", id);
  await updateDoc(propietarioRef, { [action]: true });
};