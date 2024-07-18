import { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, runTransaction, addDoc, DocumentData, query, orderBy } from 'firebase/firestore';
import Swal from 'sweetalert2';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
}

export interface RecordItem {
  id: string;
  date: string;
  user?: string;
  product: string;
  quantity: number;
  reason: string;
  house: string;
}

export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
}

export const useInventoryManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsRef = collection(db, 'empleados', 'inventario', 'productos');
      const productsSnapshot = await getDocs(productsRef);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ProductItem));
      setProducts(productsData);
      setInventory(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error al cargar los productos: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      const recordsRef = collection(db, 'empleados', 'inventario', 'records');
      const q = query(recordsRef, orderBy('date', 'desc'));
      const recordsSnapshot = await getDocs(q);
      const recordsData = recordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RecordItem));
      setRecords(recordsData);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Error al cargar los registros: " + (err as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchRecords();
  }, [fetchProducts, fetchRecords]);


  const updateInventory = useCallback(async (productId: string, quantity: number, action: 'add' | 'remove') => {
    try {
      const productRef = doc(db, 'empleados', 'inventario', 'productos', productId);
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error("El producto no existe");
        }
        const currentQuantity = productDoc.data().quantity;
        const newQuantity = action === 'add' ? currentQuantity + quantity : currentQuantity - quantity;
        if (newQuantity < 0) {
          throw new Error("La cantidad no puede ser negativa");
        }
        transaction.update(productRef, { quantity: newQuantity });
      });
      fetchProducts(); // Refresh the inventory after update
    } catch (err) {
      console.error("Error updating inventory:", err);
      throw new Error("Error al actualizar el inventario");
    }
  }, [fetchProducts]);

  const addRecord = useCallback(async (record: Omit<RecordItem, 'id'>) => {
    try {
      await addDoc(collection(db, 'empleados', 'inventario', 'records'), record);
    } catch (err) {
      console.error("Error adding record:", err);
      throw new Error("Error al añadir el registro");
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<ProductItem, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'empleados', 'inventario', 'productos'), product);
      fetchProducts(); // Refresh the products after adding
      return docRef.id;
    } catch (err) {
      console.error("Error adding product:", err);
      throw new Error("Error al añadir el producto");
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (product: ProductItem) => {
    try {
      const productRef = doc(db, 'empleados', 'inventario', 'productos', product.id);
      const { id, ...updateData } = product;
      await updateDoc(productRef, updateData as DocumentData);
      fetchProducts(); // Refresh the products after updating
    } catch (err) {
      console.error("Error updating product:", err);
      throw new Error("Error al actualizar el producto");
    }
  }, [fetchProducts]);

  return {
    inventory,
    records,
    products,
    updateInventory,
    addRecord,
    addProduct,
    updateProduct,
    loading,
    error,
    fetchProducts,
    fetchRecords
  };
};