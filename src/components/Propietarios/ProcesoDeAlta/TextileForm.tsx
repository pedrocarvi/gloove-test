// import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
// import { doc, setDoc, updateDoc } from "firebase/firestore";
// import { db } from "@/firebaseConfig";
// import { useAuth } from "@/context/AuthContext";
// import Swal from "sweetalert2";
// interface TextileFormProps {
//   onAccept: () => void;
//   data: {
//     camas90: number;
//     camas105: number;
//     camas135: number;
//     camas150: number;
//     camas180: number;
//     camas200: number;
//     banos: number;
//     aseos: number;
//     capacidadMaxima: number;
//   };
//   onDataChange: (newData: {
//     toallasGrandes: number;
//     toallasPequenas: number;
//     sabanas: number;
//     sabanas90: number;
//     sabanas105: number;
//     sabanas135: number;
//     sabanas150: number;
//     sabanas180: number;
//     sabanas200: number;
//     alfombrines: number;
//     fundasAlmohadaCamas150: number;
//     fundasAlmohadaOtrasCamas: number;
//     totalFundasAlmohada: number;
//     fundasNordico: number;
//   }) => void;
// }

// interface TextileItem {
//   medida: string;
//   cantidad: string;
// }

// interface TextileFormData {
//   toalla: TextileItem[];
//   alfombrin: TextileItem[];
//   sabanaEncimera: TextileItem[];
//   fundaAlmohada: TextileItem[];
//   rellenoAlmohada: TextileItem[];
//   fundaNordica: TextileItem[];
//   rellenoNordico: TextileItem[];
//   protectorColchon: TextileItem[];
// }

// type Category = keyof TextileFormData;

// const TextileForm: React.FC<TextileFormProps> = ({ onAccept, data, onDataChange }) => {

  
//   const initialProductState = { medida: "", cantidad: "" };

//   const [formData, setFormData] = useState<TextileFormData>({
//     toalla: [initialProductState],
//     alfombrin: [initialProductState],
//     sabanaEncimera: [initialProductState],
//     fundaAlmohada: [initialProductState],
//     rellenoAlmohada: [initialProductState],
//     fundaNordica: [initialProductState],
//     rellenoNordico: [initialProductState],
//     protectorColchon: [initialProductState],
//   });

//   const [toallasGrandes, setToallasGrandes] = useState(0);
//   const [toallasPequenas, setToallasPequenas] = useState(0);
//   const [sabanas, setSabanas] = useState(0);
//   const [sabanas90, setSabanas90] = useState(0);
//   const [sabanas105, setSabanas105] = useState(0);
//   const [sabanas135, setSabanas135] = useState(0);
//   const [sabanas150, setSabanas150] = useState(0);
//   const [sabanas180, setSabanas180] = useState(0);
//   const [sabanas200, setSabanas200] = useState(0);
//   const [alfombrines, setAlfombrines] = useState(0);
//   const [fundasAlmohadaCamas150, setFundasAlmohadaCamas150] = useState(0);
//   const [fundasAlmohadaOtrasCamas, setFundasAlmohadaOtrasCamas] = useState(0);
//   const [totalFundasAlmohada, setTotalFundasAlmohada] = useState(0);
//   const [fundasNordico, setFundasNordico] = useState(0);

//   const updateParentData = () => {

//     // TODO Agregar protector colchón para cada cama
//     // Revisar el resto en el presupuesto enviado.
//     onDataChange({
//       toallasGrandes,
//       toallasPequenas,
//       sabanas,
//       sabanas90,
//       sabanas105,
//       sabanas135,
//       sabanas150,
//       sabanas180,
//       sabanas200,
//       alfombrines,
//       fundasAlmohadaCamas150,
//       fundasAlmohadaOtrasCamas,
//       totalFundasAlmohada,
//       fundasNordico,
//     });
//   };

//   // Calcula y actualiza cada valor en el useEffect
//   // TODO: aca hacer los nuevos calculos
//   useEffect(() => {
//     // Toallas
//     setToallasGrandes(data.capacidadMaxima * 1);
//     setToallasPequenas(data.capacidadMaxima * 1);
//     // Sabanas - Total
//     setSabanas(
//       ((Number(data.camas90) || 0) +
//         (Number(data.camas105) || 0) +
//         (Number(data.camas135) || 0) +
//         (Number(data.camas150) || 0) +
//         (Number(data.camas180) || 0) +
//         (Number(data.camas200) || 0)) * 3
//     );
//     // Sabanas - Por cama
//     setSabanas90((Number(data.camas90) || 0) * 3);
//     setSabanas105((Number(data.camas105) || 0) * 3);
//     setSabanas135((Number(data.camas135) || 0) * 3);
//     setSabanas150((Number(data.camas150) || 0) * 3);
//     setSabanas180((Number(data.camas180) || 0) * 3);
//     setSabanas200((Number(data.camas200) || 0) * 3);
//     // Alfombrines
//     setAlfombrines(data.banos * 3);
//     setFundasAlmohadaCamas150(data.camas150 ? Number(data.camas150) * 2 * 3 : 0);
//     setFundasAlmohadaOtrasCamas(
//       ((Number(data.camas90) || 0) +
//         (Number(data.camas105) || 0) +
//         (Number(data.camas135) || 0) +
//         (Number(data.camas180) || 0) +
//         (Number(data.camas200) || 0)) * 1 * 3
//     );
//     setTotalFundasAlmohada(
//       (data.camas150 ? Number(data.camas150) * 2 * 3 : 0) +
//       ((Number(data.camas90) || 0) +
//         (Number(data.camas105) || 0) +
//         (Number(data.camas135) || 0) +
//         (Number(data.camas180) || 0) +
//         (Number(data.camas200) || 0)) * 1 * 3
//     );
//     setFundasNordico(
//       ((Number(data.camas90) || 0) +
//         (Number(data.camas105) || 0) +
//         (Number(data.camas135) || 0) +
//         (Number(data.camas150) || 0) +
//         (Number(data.camas180) || 0) +
//         (Number(data.camas200) || 0)) * 2
//     );
//     updateParentData();
//   }, [data]);

//   useEffect(() => {
//     console.log("Data recibida en TextileForm:", data);
//   }, [data]);

//   const { user } = useAuth();

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       console.error("Error: user is undefined");
//       return;
//     }

//     try {
//       updateParentData();
//       // Guardar los datos del formulario en Firestore
//       const docRef = doc(
//         db,
//         `propietarios/${user.uid}/proceso_de_alta/textil_presupuesto`
//       );
//       await setDoc(docRef, {
//         userId: user.uid,
//         ...formData,
//       });

//       // Actualizar el estado del proceso
//       await updateDoc(doc(db, "users", user.uid), {
//         currentStep: 2,
//         processStatus: "textile_summary",
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Datos textiles guardados",
//         text: "Puedes proceder al siguiente paso.",
//       });
//       onAccept();
//     } catch (error) {
//       console.error("Error al guardar los datos textiles:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Hubo un problema al guardar los datos textiles. Por favor, inténtalo de nuevo.",
//       });
//     }
//   };
  
//   return (
//     <div className="flex items-center justify-center py-8">
//       <div className="bg-white p-8 rounded-xl w-full max-w-3xl">
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
//           Formulario de Textiles
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h3 className="fs-5 font-bold"> Resultados </h3>
//           <p>Toallas grandes: {toallasGrandes}</p>
//           <p>Toallas pequeñas: {toallasPequenas}</p>
//           <p>Sábanas: {sabanas}</p>
//           <p>Sabanas 90: {sabanas90}</p>
//           <p>Sabanas 105: {sabanas105}</p>
//           <p>Sabanas 135: {sabanas135}</p>
//           <p>Sabanas 150: {sabanas150}</p>
//           <p>Sabanas 180: {sabanas180}</p>
//           <p>Sabanas 200: {sabanas200}</p>
//           <p>Alfombrines: {alfombrines}</p>
//           <p>Fundas de almohada (camas 150 cm): {fundasAlmohadaCamas150}</p>
//           <p>Fundas de almohada (otras camas): {fundasAlmohadaOtrasCamas}</p>
//           <p>Total fundas de almohada: {totalFundasAlmohada}</p>
//           <p>Fundas de nórdico: {fundasNordico}</p>
//           <div className="mt-6">
//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
//             >
//               Enviar Formulario
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TextileForm;

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

interface TextileFormProps {
  onAccept: () => void;
  data: {
    camas90: number;
    camas105: number;
    camas135: number;
    camas150: number;
    camas180: number;
    camas200: number;
    banos: number;
    aseos: number;
    capacidadMaxima: number;
  };
  onDataChange: (newData: {
    toallasGrandes: number;
    toallasPequenas: number;
    sabanas: number;
    sabanas90: number;
    sabanas105: number;
    sabanas135: number;
    sabanas150: number;
    sabanas180: number;
    sabanas200: number;
    alfombrines: number;
    fundasAlmohadaCamas150: number;
    fundasAlmohadaOtrasCamas: number;
    totalFundasAlmohada: number;
    fundasNordico: number;
  }) => void;
}

const TextileForm: React.FC<TextileFormProps> = ({ onAccept, data, onDataChange }) => {
  const [toallasGrandes, setToallasGrandes] = useState(0);
  const [toallasPequenas, setToallasPequenas] = useState(0);
  const [sabanas, setSabanas] = useState(0);
  const [sabanas90, setSabanas90] = useState(0);
  const [sabanas105, setSabanas105] = useState(0);
  const [sabanas135, setSabanas135] = useState(0);
  const [sabanas150, setSabanas150] = useState(0);
  const [sabanas180, setSabanas180] = useState(0);
  const [sabanas200, setSabanas200] = useState(0);
  const [alfombrines, setAlfombrines] = useState(0);
  const [fundasAlmohadaCamas150, setFundasAlmohadaCamas150] = useState(0);
  const [fundasAlmohadaOtrasCamas, setFundasAlmohadaOtrasCamas] = useState(0);
  const [totalFundasAlmohada, setTotalFundasAlmohada] = useState(0);
  const [fundasNordico, setFundasNordico] = useState(0);

  // Update parent data
  const updateParentData = () => {
    onDataChange({
      toallasGrandes,
      toallasPequenas,
      sabanas,
      sabanas90,
      sabanas105,
      sabanas135,
      sabanas150,
      sabanas180,
      sabanas200,
      alfombrines,
      fundasAlmohadaCamas150,
      fundasAlmohadaOtrasCamas,
      totalFundasAlmohada,
      fundasNordico,
    });
  };

  // Effect to calculate textile data
  useEffect(() => {
    setToallasGrandes(data.capacidadMaxima * 1);
    setToallasPequenas(data.capacidadMaxima * 1);
    setSabanas(
      ((Number(data.camas90) || 0) +
        (Number(data.camas105) || 0) +
        (Number(data.camas135) || 0) +
        (Number(data.camas150) || 0) +
        (Number(data.camas180) || 0) +
        (Number(data.camas200) || 0)) * 3
    );
    setSabanas90((Number(data.camas90) || 0) * 3);
    setSabanas105((Number(data.camas105) || 0) * 3);
    setSabanas135((Number(data.camas135) || 0) * 3);
    setSabanas150((Number(data.camas150) || 0) * 3);
    setSabanas180((Number(data.camas180) || 0) * 3);
    setSabanas200((Number(data.camas200) || 0) * 3);
    setAlfombrines(data.banos * 3);
    setFundasAlmohadaCamas150(data.camas150 ? Number(data.camas150) * 2 * 3 : 0);
    setFundasAlmohadaOtrasCamas(
      ((Number(data.camas90) || 0) +
        (Number(data.camas105) || 0) +
        (Number(data.camas135) || 0) +
        (Number(data.camas180) || 0) +
        (Number(data.camas200) || 0)) * 1 * 3
    );
    setTotalFundasAlmohada(
      (data.camas150 ? Number(data.camas150) * 2 * 3 : 0) +
      ((Number(data.camas90) || 0) +
        (Number(data.camas105) || 0) +
        (Number(data.camas135) || 0) +
        (Number(data.camas180) || 0) +
        (Number(data.camas200) || 0)) * 1 * 3
    );
    setFundasNordico(
      ((Number(data.camas90) || 0) +
        (Number(data.camas105) || 0) +
        (Number(data.camas135) || 0) +
        (Number(data.camas150) || 0) +
        (Number(data.camas180) || 0) +
        (Number(data.camas200) || 0)) * 2
    );
    updateParentData();
  }, [data]);

  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      updateParentData();
      const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/textil_presupuesto`);
      await setDoc(docRef, {
        userId: user.uid,
        toallasGrandes,
        toallasPequenas,
        sabanas,
        sabanas90,
        sabanas105,
        sabanas135,
        sabanas150,
        sabanas180,
        sabanas200,
        alfombrines,
        fundasAlmohadaCamas150,
        fundasAlmohadaOtrasCamas,
        totalFundasAlmohada,
        fundasNordico,
      });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 2,
        processStatus: "textile_summary",
      });

      Swal.fire({
        icon: "success",
        title: "Datos textiles guardados",
        text: "Puedes proceder al siguiente paso.",
      });
      onAccept();
    } catch (error) {
      console.error("Error al guardar los datos textiles:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar los datos textiles. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Formulario de Textiles
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="fs-5 font-bold">Resultados</h3>

          {/* Tabla de resultados */}
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Concepto</th>
                <th className="px-4 py-2 border-b">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Toallas grandes</td>
                <td className="px-4 py-2 border-b">{toallasGrandes}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Toallas pequeñas</td>
                <td className="px-4 py-2 border-b">{toallasPequenas}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas</td>
                <td className="px-4 py-2 border-b">{sabanas}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas 90</td>
                <td className="px-4 py-2 border-b">{sabanas90}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas 105</td>
                <td className="px-4 py-2 border-b">{sabanas105}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas 135</td>
                <td className="px-4 py-2 border-b">{sabanas135}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas 150</td>
                <td className="px-4 py-2 border-b">{sabanas150}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas 180</td>
                <td className="px-4 py-2 border-b">{sabanas180}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Sábanas 200</td>
                <td className="px-4 py-2 border-b">{sabanas200}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Alfombrines</td>
                <td className="px-4 py-2 border-b">{alfombrines}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Fundas de almohada (camas 150 cm)</td>
                <td className="px-4 py-2 border-b">{fundasAlmohadaCamas150}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Fundas de almohada (otras camas)</td>
                <td className="px-4 py-2 border-b">{fundasAlmohadaOtrasCamas}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Total fundas de almohada</td>
                <td className="px-4 py-2 border-b">{totalFundasAlmohada}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Fundas de nórdico</td>
                <td className="px-4 py-2 border-b">{fundasNordico}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Enviar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextileForm;
