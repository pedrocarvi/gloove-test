import { db } from "@/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export const getAllEmployees = async () => {
  const employeesCollection = collection(db, "employees");
  const employeesSnapshot = await getDocs(employeesCollection);
  const employeesList = employeesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return employeesList;
};

export const updateEmployeeStatus = async (id: string, status: string) => {
  const employeeDoc = doc(db, "employees", id);
  await updateDoc(employeeDoc, { status });
};
