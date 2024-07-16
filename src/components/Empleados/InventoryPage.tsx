// src/components/Empleados/InventoryPage.tsx

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const inventoryItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
      setItems(inventoryItems);
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (newItemName && newItemQuantity > 0) {
      const docRef = await addDoc(collection(db, "inventory"), {
        name: newItemName,
        quantity: newItemQuantity,
      });
      setItems([
        ...items,
        { id: docRef.id, name: newItemName, quantity: newItemQuantity },
      ]);
      setNewItemName("");
      setNewItemQuantity(0);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteDoc(doc(db, "inventory", id));
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nombre del artículo"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(Number(e.target.value))}
          placeholder="Cantidad"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Añadir artículo
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {item.name} - {item.quantity}
            </span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryPage;
