import React, { useState, useRef } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import Webcam from 'react-webcam';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

interface ImageState {
  dni: string;
  referenciaCatastral: string;
  vut: string;
}

interface WebcamState {
  dni: boolean;
  referenciaCatastral: boolean;
  vut: boolean;
}

interface DistinctDocumentProps {
  onNext: () => void;
}

const DistinctDocument: React.FC<DistinctDocumentProps> = ({ onNext }) => {
  const [images, setImages] = useState<ImageState>({ dni: '', referenciaCatastral: '', vut: '' });
  const [showWebcam, setShowWebcam] = useState<WebcamState>({ dni: false, referenciaCatastral: false, vut: false });
  const webcamRefs = {
    dni: useRef<Webcam>(null),
    referenciaCatastral: useRef<Webcam>(null),
    vut: useRef<Webcam>(null)
  };
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCapture = (type: keyof ImageState) => {
    const imageSrc = webcamRefs[type].current?.getScreenshot();
    if (imageSrc) {
      setImages({ ...images, [type]: imageSrc });
      setShowWebcam({ ...showWebcam, [type]: false });
    }
  };

  const handleUpload = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const storage = getStorage();

    const uploadFile = async (file: string, path: string) => {
      const storageRef = ref(storage, path);
      await uploadString(storageRef, file, 'data_url');
    };

    if (images.dni) {
      await uploadFile(images.dni, `DocumentacionPropietarios/DNI/dni_${user.uid}.jpg`);
    }
    if (images.vut) {
      await uploadFile(images.vut, `DocumentacionPropietarios/VUT/vut_${user.uid}.jpg`);
    }
    if (images.referenciaCatastral) {
      await uploadFile(images.referenciaCatastral, `DocumentacionPropietarios/RefCatastral/refCatastral_${user.uid}.jpg`);
    }

    await setDoc(doc(db, `propietarios/${user.uid}/proceso_de_alta/distinct_documents`), images);
    await updateDoc(doc(db, 'users', user.uid), {
      processStatus: 'contract',
      currentStep: 4,
    });

    onNext();
    navigate("/contract"); // Move to the next step
  };

  return (
    <div className="distinct-document-container">
      <h2>Sube tus documentos</h2>
      {Object.keys(images).map((type) => (
        <div key={type} className="document-section">
          <h3>{type}</h3>
          {images[type as keyof ImageState] ? (
            <img src={images[type as keyof ImageState]} alt={`${type} document`} />
          ) : (
            showWebcam[type as keyof ImageState] ? (
              <Webcam
                audio={false}
                ref={webcamRefs[type as keyof ImageState]}
                screenshotFormat="image/jpeg"
                className="webcam"
              />
            ) : (
              <input type="file" accept="image/*" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImages({ ...images, [type]: reader.result as string });
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }} />
            )
          )}
          {showWebcam[type as keyof ImageState] && <button onClick={() => handleCapture(type as keyof ImageState)}>Capturar</button>}
          {!showWebcam[type as keyof ImageState] && <button onClick={() => setShowWebcam({ ...showWebcam, [type]: true })}>Tomar Foto</button>}
        </div>
      ))}
      <button onClick={handleUpload}>Subir Documentos</button>
    </div>
  );
};

export default DistinctDocument;
