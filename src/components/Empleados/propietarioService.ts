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
  formularioTextil: string;
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
  docPath: string
): Promise<string> => {
  const cacheKey = `${propietarioId}/${docPath}`;

  if (failedDocumentsCache[cacheKey]) {
    return "pendiente";
  }

  try {
    const fileRef = ref(storage, docPath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    if ((error as any).code === "storage/object-not-found") {
      console.warn(
        `Document ${docPath} for propietario ${propietarioId} not found.`
      );
      failedDocumentsCache[cacheKey] = true;
      return "pendiente";
    } else {
      console.error(
        `Error fetching URL for document ${docPath} of propietario ${propietarioId}:`,
        error
      );
      return "pendiente";
    }
  }
};

export const updatePropietarioDocuments = async (
  propietario: Propietario
): Promise<Propietario> => {
  propietario.fichaTecnica = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/FichaTecnica/technical_form.pdf`
  );
  propietario.formularioTextil = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/TextileSummaries/textile_summaries.pdf`
  );
  propietario.presupuestoTextil = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/PresupuestoTextil/textil_presupuesto.pdf`
  );
  propietario.dni = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/dNI/dNI_${propietario.id}.jpg`
  );
  propietario.referenciaCatastral = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/refCatastral/refCatastral_${propietario.id}.jpg`
  );
  propietario.vut = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/vUT/vUT_${propietario.id}.jpg`
  );
  propietario.contrato = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/Contratos/contract.pdf`
  );
  propietario.inventario = await fetchDocumentURL(
    propietario.id,
    `DocumentacionPropietarios/Inventario/inventario.pdf`
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
