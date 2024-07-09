import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

interface TextileFormProps {
  onNext: () => void;
}

const TextileForm: React.FC<TextileFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    toallaDucha: '',
    toallaLavabo: '',
    alfombrin: '',
    sabanaEncimera90: '',
    sabanaEncimera105: '',
    sabanaEncimera150: '',
    sabanaEncimera180: '',
    fundaAlmohada75: '',
    fundaAlmohada90: '',
    rellenoAlmohada75: '',
    rellenoAlmohada90: '',
    fundaNordica90: '',
    fundaNordica105: '',
    fundaNordica135: '',
    fundaNordica150: '',
    fundaNordica180: '',
    fundaNordica200: '',
    rellenoNordico90: '',
    rellenoNordico105: '',
    rellenoNordico135: '',
    rellenoNordico150: '',
    rellenoNordico180: '',
    rellenoNordico200: '',
    protectorColchon180: '',
    protectorColchon150: '',
    protectorColchon135: '',
    protectorColchon105: '',
    protectorColchon90: '',
  });

  const { user } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('Error: user is undefined');
      return;
    }

    try {
      const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/textil_presupuesto`);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        currentStep: 2,
        processStatus: 'textile_summary', // Actualiza a textile_summary
      });

      onNext(); // Mover al siguiente paso usando el prop onNext
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="text-4xl font-bold mb-8 text-primary-dark text-center">Formulario de Textiles</h1>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-row">
            <label>Toalla Ducha 100x150</label>
            <input type="text" name="toallaDucha" value={formData.toallaDucha} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Toalla Lavabo 50x100</label>
            <input type="text" name="toallaLavabo" value={formData.toallaLavabo} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Alfombrín 50x65</label>
            <input type="text" name="alfombrin" value={formData.alfombrin} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Sábana Encimera/Bajera cama 90x200</label>
            <input type="text" name="sabanaEncimera90" value={formData.sabanaEncimera90} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Sábana Encimera/Bajera cama 1,05 - 180x290</label>
            <input type="text" name="sabanaEncimera105" value={formData.sabanaEncimera105} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Sábana Encimera/Bajera cama 1,50 - 200x290</label>
            <input type="text" name="sabanaEncimera150" value={formData.sabanaEncimera150} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Sábana Encimera/Bajera cama 1,80 - 200x290</label>
            <input type="text" name="sabanaEncimera180" value={formData.sabanaEncimera180} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Almohada 75</label>
            <input type="text" name="fundaAlmohada75" value={formData.fundaAlmohada75} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Almohada 90</label>
            <input type="text" name="fundaAlmohada90" value={formData.fundaAlmohada90} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Almohada 75</label>
            <input type="text" name="rellenoAlmohada75" value={formData.rellenoAlmohada75} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Almohada 90</label>
            <input type="text" name="rellenoAlmohada90" value={formData.rellenoAlmohada90} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Nórdica 90</label>
            <input type="text" name="fundaNordica90" value={formData.fundaNordica90} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Nórdica 105</label>
            <input type="text" name="fundaNordica105" value={formData.fundaNordica105} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Nórdica 135</label>
            <input type="text" name="fundaNordica135" value={formData.fundaNordica135} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Nórdica 150</label>
            <input type="text" name="fundaNordica150" value={formData.fundaNordica150} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Nórdica 180</label>
            <input type="text" name="fundaNordica180" value={formData.fundaNordica180} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Funda Nórdica 200</label>
            <input type="text" name="fundaNordica200" value={formData.fundaNordica200} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Nórdico 90</label>
            <input type="text" name="rellenoNordico90" value={formData.rellenoNordico90} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Nórdico 105</label>
            <input type="text" name="rellenoNordico105" value={formData.rellenoNordico105} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Nórdico 135</label>
            <input type="text" name="rellenoNordico135" value={formData.rellenoNordico135} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Nórdico 150</label>
            <input type="text" name="rellenoNordico150" value={formData.rellenoNordico150} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Nórdico 180</label>
            <input type="text" name="rellenoNordico180" value={formData.rellenoNordico180} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Relleno Nórdico 200</label>
            <input type="text" name="rellenoNordico200" value={formData.rellenoNordico200} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Protector Colchón 180</label>
            <input type="text" name="protectorColchon180" value={formData.protectorColchon180} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Protector Colchón 150</label>
            <input type="text" name="protectorColchon150" value={formData.protectorColchon150} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Protector Colchón 135</label>
            <input type="text" name="protectorColchon135" value={formData.protectorColchon135} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Protector Colchón 105</label>
            <input type="text" name="protectorColchon105" value={formData.protectorColchon105} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Protector Colchón 90</label>
            <input type="text" name="protectorColchon90" value={formData.protectorColchon90} onChange={handleChange} />
          </div>
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TextileForm;
