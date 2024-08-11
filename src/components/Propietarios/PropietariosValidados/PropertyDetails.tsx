import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { PropertyData } from "./types";

const PropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && propertyId) {
      fetchData();
    }
  }, [user, propertyId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, "properties", propertyId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PropertyData;
        setPropertyData(data);
      } else {
        setError("No se encontró la propiedad.");
      }
    } catch (err) {
      setError("Error al obtener los datos de la propiedad.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        {propertyData?.name}
      </h1>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Detalles de la Propiedad</h2>
        <p>
          <strong>Ubicación:</strong> {propertyData?.location}
        </p>
        <p>
          <strong>Descripción:</strong> {propertyData?.description}
        </p>
      </div>

      {propertyData?.textileInventory && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Inventario Textil</h2>
          <p>
            <strong>Ropa de cama:</strong>{" "}
            {propertyData.textileInventory.bedLinen}
          </p>
          <p>
            <strong>Toallas:</strong> {propertyData.textileInventory.towels}
          </p>
        </div>
      )}

      {propertyData?.contract && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Contrato</h2>
          <p>
            <strong>Fecha de inicio:</strong> {propertyData.contract.startDate}
          </p>
          <p>
            <strong>Fecha de fin:</strong> {propertyData.contract.endDate}
          </p>
        </div>
      )}

      {propertyData?.inventory && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Inventario Completo</h2>
          <ul>
            {propertyData.inventory.items.map((item, index) => (
              <li key={index}>
                {item.name}: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {propertyData?.budget && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Presupuesto Textil</h2>
          <p>
            <strong>Monto aprobado:</strong> {propertyData.budget.amount}
          </p>
        </div>
      )}

      {propertyData?.documents && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Documentación</h2>
          <ul>
            {propertyData.documents.map((doc, index) => (
              <li key={index}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
