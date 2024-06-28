import React, { useState } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import './InventoryForm.css';

interface InventoryFormProps {
  onComplete: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    // ... (include all inventory form fields here)
  });

  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('Error: user is undefined');
      return;
    }

    try {
      const docRef = doc(db, 'inventory_forms', `inventory_form_${user.uid}`);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        processStatus: 'completed',
      });

      onComplete();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Formulario de Inventario</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields here */}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default InventoryForm;