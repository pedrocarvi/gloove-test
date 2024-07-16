// src/services/employeeService.ts
import { db } from "../firebaseConfig";
import { collection, getDocs, DocumentData } from "firebase/firestore";

// Obtener las tareas del empleado
export const getTasks = async (): Promise<DocumentData[]> => {
  const tasksSnapshot = await getDocs(
    collection(db, "empleados", "empleadoId1", "tasks")
  );
  return tasksSnapshot.docs.map((doc) => doc.data());
};

// Obtener los datos de rendimiento del empleado
export const getPerformanceData = async (): Promise<DocumentData[]> => {
  const performanceSnapshot = await getDocs(collection(db, "performanceData"));
  return performanceSnapshot.docs.map((doc) => doc.data());
};

// Obtener los datos de asistencia del empleado
export const getAttendanceData = async (): Promise<DocumentData[]> => {
  const attendanceSnapshot = await getDocs(collection(db, "attendanceData"));
  return attendanceSnapshot.docs.map((doc) => doc.data());
};
