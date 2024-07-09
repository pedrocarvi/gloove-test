import React, { useState, useRef, useEffect } from 'react';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import Webcam from 'react-webcam';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
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

interface DocumentUrls extends ImageState {
  documentoObligatorio: string;
}

interface DistinctDocumentProps {
  onNext: () => void;
}

const DistinctDocument: React.FC<DistinctDocumentProps> = ({ onNext }) => {
  const [images, setImages] = useState<ImageState>({ dni: '', referenciaCatastral: '', vut: '' });
  const [showWebcam, setShowWebcam] = useState<WebcamState>({ dni: false, referenciaCatastral: false, vut: false });
  const [downloadUrls, setDownloadUrls] = useState<DocumentUrls | null>(null);
  const webcamRefs = {
    dni: useRef<Webcam>(null),
    referenciaCatastral: useRef<Webcam>(null),
    vut: useRef<Webcam>(null)
  };
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchDocuments = async () => {
        const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/distinct_documents`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentUrls;
          setDownloadUrls(data);
        } else {
          const obligatoryDocUrl = 'https://firebasestorage.googleapis.com/v0/b/software-gloove.appspot.com/o/Documentacion%20obligatoria%2FDocumentacio%CC%81n%20necesaria%20para%20cumplimentacio%CC%81n%20de%20contrato.pdf?alt=media&token=1b8a312e-f7cc-4c02-ba0c-f536a871745c';
          setDownloadUrls({ dni: '', referenciaCatastral: '', vut: '', documentoObligatorio: obligatoryDocUrl });
        }
      };
      fetchDocuments();
    }
  }, [user]);

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
      const url = await getDownloadURL(storageRef);
      return url;
    };

    const urls: DocumentUrls = { dni: '', referenciaCatastral: '', vut: '', documentoObligatorio: downloadUrls?.documentoObligatorio || '' };

    if (images.dni) {
      urls.dni = await uploadFile(images.dni, `DocumentacionPropietarios/DNI/dni_${user.uid}.jpg`);
    }
    if (images.vut) {
      urls.vut = await uploadFile(images.vut, `DocumentacionPropietarios/VUT/vut_${user.uid}.jpg`);
    }
    if (images.referenciaCatastral) {
      urls.referenciaCatastral = await uploadFile(images.referenciaCatastral, `DocumentacionPropietarios/RefCatastral/refCatastral_${user.uid}.jpg`);
    }

    await setDoc(doc(db, `propietarios/${user.uid}/proceso_de_alta/distinct_documents`), urls);
    await updateDoc(doc(db, 'users', user.uid), {
      processStatus: 'contract',
      currentStep: 4,
    });

    setDownloadUrls(urls);
    onNext();
    navigate("/contract");
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
          {downloadUrls && downloadUrls[type as keyof ImageState] && (
            <div>
              <a href={downloadUrls[type as keyof ImageState]} target="_blank" rel="noopener noreferrer">Ver {type}</a>
              <a href={downloadUrls[type as keyof ImageState]} download>Descargar {type}</a>
            </div>
          )}
        </div>
      ))}
      {/* Visualización y descarga del documento obligatorio */}
      {downloadUrls && (
        <div className="document-section">
          <h3>Documentación Obligatoria</h3>
          <a href={downloadUrls.documentoObligatorio} target="_blank" rel="noopener noreferrer">Ver Documento</a>
          <a href={downloadUrls.documentoObligatorio} download>Descargar Documento</a>
        </div>
      )}
      <button onClick={handleUpload}>Subir Documentos</button>
    </div>
  );
};

export default DistinctDocument;

