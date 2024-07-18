// src/services/employeeService.ts
import { db } from '@/firebaseConfig';
import { collection, getDocs, updateDoc, doc, DocumentData } from 'firebase/firestore';

export const getAllEmployees = async (): Promise<DocumentData[]> => {
  const employeesSnapshot = await getDocs(collection(db, 'empleados'));
  return employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEmployeeStatus = async (id: string, status: string) => {
  const employeeRef = doc(db, 'empleados', id);
  await updateDoc(employeeRef, { status });
};