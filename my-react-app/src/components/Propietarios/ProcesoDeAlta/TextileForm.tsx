import React, { useState } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import './TextileForm.css';

interface TextileFormProps {
  onComplete: () => void;
}

const TextileForm: React.FC<TextileFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    // ... (include all form fields here)
  });

  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('Error: user is undefined');
      return;
    }

    try {
      const docRef = doc(db, 'textile_forms', `textile_form_${user.uid}`);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        processStatus: 'textile_summary',
      });

      onComplete();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Formulario de Textiles</h1>
        <form onSubmit={handleSubmit} className="form-content">
          {/* Add form fields here */}
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TextileForm;