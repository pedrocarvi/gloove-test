// fetchData.js
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const fetchProducts = async () => {
  try {
    const uid = "Ps62fnUAudIGXenHwexi"; // Reemplaza esto con el UID real del usuario
    const productsRef = collection(db, 'empleados', uid, 'productosInventario');
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log("Fetched products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

fetchProducts();
