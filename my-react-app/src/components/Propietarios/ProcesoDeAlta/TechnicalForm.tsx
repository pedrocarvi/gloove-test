import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import './TechnicalForm.css';

interface TechnicalFormProps {
  onComplete: () => void;
}

const TechnicalForm: React.FC<TechnicalFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    // ... (include all form fields here)
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('Error: user is undefined');
      return;
    }
    try {
      await setDoc(doc(db, 'technical_forms', `technical_form_${user.uid}`), {
        userId: user.uid,
        ...formData,
      });
      await updateDoc(doc(db, 'users', user.uid), {
        processStatus: 'textile_form',
      });
      onComplete();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Ficha Técnica</h1>
        <form onSubmit={handleSubmit} className="form-content">
          {/* Add form fields here */}
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TechnicalForm;