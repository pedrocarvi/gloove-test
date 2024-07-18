import { auth, db } from '../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

async function testInventoryPermissions() {
  try {
    // Primero, autenticamos al usuario
    const userEmail = 'empleado11@example.com'; // Reemplaza con un email de empleado real
    const userPassword = 'password123'; // Reemplaza con la contraseña correcta

    const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
    const user = userCredential.user;

    console.log('Usuario autenticado:', user.uid);

    // Probamos el acceso a la colección de inventario
    const inventoryRef = collection(db, 'empleados', user.uid, 'inventory');
    const inventorySnapshot = await getDocs(inventoryRef);
    console.log('Documentos en inventario:', inventorySnapshot.size);

    // Intentamos agregar un documento al inventario
    const newItem = await addDoc(inventoryRef, {
      name: 'Item de prueba',
      quantity: 10,
      minQuantity: 5
    });
    console.log('Nuevo item agregado con ID:', newItem.id);

    // Intentamos eliminar el documento que acabamos de crear
    await deleteDoc(newItem);
    console.log('Item de prueba eliminado');

    // Probamos el acceso a la colección de registros
    const recordsRef = collection(db, 'empleados', user.uid, 'records');
    const recordsSnapshot = await getDocs(recordsRef);
    console.log('Documentos en registros:', recordsSnapshot.size);

    console.log('Todas las pruebas completadas con éxito');
  } catch (error) {
    console.error('Error durante las pruebas:', error);
  }
}

testInventoryPermissions();




