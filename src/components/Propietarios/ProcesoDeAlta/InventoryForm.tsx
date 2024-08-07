import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { generateInventoryPDF } from "@/utils/inventoryPdfGenerator";

interface Distribucion {
  superficieVivienda: number;
  superficieParcela: number;
  ascensor: boolean;
  ocupacionMaxAdultosNinos: number;
  ocupacionMaxSoloAdultos: number;
}

interface Dormitorios {
  numDormitorios: number;
  zonasComunes: string;
}

interface Banos {
  banosBanera: number;
  banosDucha: number;
  aseos: number;
  sauna: boolean;
  jacuzzi: boolean;
  secador: boolean;
  toallas: string;
  cambioToallas: string;
}

interface Cocina {
  numCocinas: number;
  clase: string;
  tipo: string;
  utensiliosCocina: boolean;
  cafetera: boolean;
  freidora: boolean;
  tostadora: boolean;
}

interface AccesoriosHogar {
  ropaCama: string;
  cambioRopa: string;
  lavadora: boolean;
  secadora: boolean;
  television: boolean;
  televisores: string;
  tvSatelite: boolean;
  radio: boolean;
  idiomasTvSatelite: string[];
  mosquiteras: string;
  ventiladores: number;
  dvd: string;
  aparatosAntiMosquitos: number;
}

interface CaracteristicasAdicionales {
  internetAccess: string;
  safeBox: boolean;
  miniBar: boolean;
  electronicLock: string;
  doorCode: string;
  parking: string;
  parkingLocation: string;
  parkingSpaces: string;
  parkingType: string;
  airConditioning: string;
  heating: string;
  disabledAccess: string;
  jardin: boolean;
  mobiliarioJardin: boolean;
  barbacoa: boolean;
  chimenea: boolean;
  parcelaVallada: boolean;
  terraza: boolean;
  alarma: boolean;
  gimnasio: boolean;
  squash: boolean;
  balcon: boolean;
  padel: boolean;
  tenis: boolean;
  zonaInfantil: boolean;
  spa: boolean;
  animals: string;
  weightLimit: number;
  noDangerousAnimals: boolean;
  pool: string;
  heatedPool: string;
  noYoungGroups: boolean;
  noSmoking: boolean;
  additionalFeatures: string;
}

interface FormData {
  distribucion: Distribucion;
  dormitorios: Dormitorios;
  banos: Banos;
  cocina: Cocina;
  accesoriosHogar: AccesoriosHogar;
  caracteristicasAdicionales: CaracteristicasAdicionales;
}

interface InventoryFormProps {
  onAccept: () => void;
  initialValues?: FormData;
  setFormValues: (step: number, values: any) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  onAccept,
  initialValues = {} as FormData,
  setFormValues,
}) => {
  const defaultFormData: FormData = {
    distribucion: {
      superficieVivienda: 0,
      superficieParcela: 0,
      ascensor: false,
      ocupacionMaxAdultosNinos: 0,
      ocupacionMaxSoloAdultos: 0,
    },
    dormitorios: {
      numDormitorios: 0,
      zonasComunes: "",
    },
    banos: {
      banosBanera: 0,
      banosDucha: 0,
      aseos: 0,
      sauna: false,
      jacuzzi: false,
      secador: false,
      toallas: "",
      cambioToallas: "",
    },
    cocina: {
      numCocinas: 0,
      clase: "",
      tipo: "",
      utensiliosCocina: false,
      cafetera: false,
      freidora: false,
      tostadora: false,
    },
    accesoriosHogar: {
      ropaCama: "",
      cambioRopa: "",
      lavadora: false,
      secadora: false,
      television: false,
      televisores: "",
      tvSatelite: false,
      radio: false,
      idiomasTvSatelite: [],
      mosquiteras: "",
      ventiladores: 0,
      dvd: "",
      aparatosAntiMosquitos: 0,
    },
    caracteristicasAdicionales: {
      internetAccess: "",
      safeBox: false,
      miniBar: false,
      electronicLock: "",
      doorCode: "",
      parking: "",
      parkingLocation: "",
      parkingSpaces: "",
      parkingType: "",
      airConditioning: "",
      heating: "",
      disabledAccess: "",
      jardin: false,
      mobiliarioJardin: false,
      barbacoa: false,
      chimenea: false,
      parcelaVallada: false,
      terraza: false,
      alarma: false,
      gimnasio: false,
      squash: false,
      balcon: false,
      padel: false,
      tenis: false,
      zonaInfantil: false,
      spa: false,
      animals: "",
      weightLimit: 0,
      noDangerousAnimals: false,
      pool: "",
      heatedPool: "",
      noYoungGroups: false,
      noSmoking: false,
      additionalFeatures: "",
    },
  };

  const [formData, setFormData] = useState<FormData>(
    initialValues ? { ...defaultFormData, ...initialValues } : defaultFormData
  );

  const { user } = useAuth();

  const handleBlur = () => {
    setFormValues(5, formData);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    const keys = name.split(".");

    setFormData((prevFormData) => {
      const updatedData: any = { ...prevFormData };
      if (keys.length === 2) {
        if (keys[0] === "accesoriosHogar" && keys[1] === "idiomasTvSatelite") {
          if ((e.target as HTMLInputElement).checked) {
            updatedData[keys[0]][keys[1]] = [
              ...updatedData[keys[0]][keys[1]],
              value,
            ];
          } else {
            updatedData[keys[0]][keys[1]] = updatedData[keys[0]][
              keys[1]
            ].filter((item: string) => item !== value);
          }
        } else {
          updatedData[keys[0]][keys[1]] = newValue;
        }
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      const pdfDoc = await generateInventoryPDF(formData);
      const pdfData = pdfDoc.output("datauristring");

      // Subir el PDF a Firebase Storage
      const storage = getStorage();
      const pdfRef = ref(
        storage,
        `DocumentacionPropietarios/Inventario/inventario_${user.uid}.pdf`
      );
      await uploadString(pdfRef, pdfData, "data_url");

      const pdfUrl = await getDownloadURL(pdfRef);

      // Guardar la referencia del PDF en Firestore
      const docRef = doc(
        db,
        `propietarios/${user.uid}/proceso_de_alta/inventario`
      );
      await setDoc(docRef, {
        userId: user.uid,
        pdfUrl,
        ...formData,
      });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 5,
        processStatus: "completed",
      });

      Swal.fire({
        icon: "success",
        title: "Inventario guardado",
        text: "Has completado el proceso de alta.",
      });
      onAccept();
    } catch (error) {
      console.error("Error al generar o guardar el inventario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar o guardar el inventario. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Formulario de Inventario
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DISTRIBUCIÓN */}
          <div className="col-span-full">
            <h2 className="font-bold text-lg bg-muted-foreground p-2">
              DISTRIBUCIÓN
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="superficieVivienda" className="block">
                  Superficie vivienda
                </label>
                <input
                  id="superficieVivienda"
                  name="distribucion.superficieVivienda"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.distribucion.superficieVivienda}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="superficieParcela" className="block">
                  Superficie parcela
                </label>
                <input
                  id="superficieParcela"
                  name="distribucion.superficieParcela"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.distribucion.superficieParcela}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="ascensor"
                  name="distribucion.ascensor"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.distribucion.ascensor}
                  onChange={handleChange}
                />
                <label htmlFor="ascensor">Ascensor</label>
              </div>
              <div>
                <label htmlFor="ocupacionMaxAdultosNinos" className="block">
                  Ocupación máxima adultos con niños
                </label>
                <input
                  id="ocupacionMaxAdultosNinos"
                  name="distribucion.ocupacionMaxAdultosNinos"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.distribucion.ocupacionMaxAdultosNinos}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="ocupacionMaxSoloAdultos" className="block">
                  Ocupación máxima sólo adultos
                </label>
                <input
                  id="ocupacionMaxSoloAdultos"
                  name="distribucion.ocupacionMaxSoloAdultos"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.distribucion.ocupacionMaxSoloAdultos}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* DORMITORIOS */}
          <div className="col-span-full">
            <h2 className="font-bold text-lg bg-muted-foreground p-2">
              DORMITORIOS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="numDormitorios" className="block">
                  Número dormitorios
                </label>
                <input
                  id="numDormitorios"
                  name="dormitorios.numDormitorios"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.dormitorios.numDormitorios}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="zonasComunes" className="block">
                  Zonas comunes
                </label>
                <select
                  id="zonasComunes"
                  name="dormitorios.zonasComunes"
                  className="border p-2 w-full"
                  value={formData.dormitorios.zonasComunes}
                  onChange={handleChange}
                >
                  <option>-- Seleccione --</option>
                </select>
              </div>
            </div>
          </div>

          {/* BAÑOS */}
          <div className="col-span-full">
            <h2 className="font-bold text-lg bg-muted-foreground p-2">BAÑOS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="banosBanera" className="block">
                  Baños con bañera
                </label>
                <input
                  id="banosBanera"
                  name="banos.banosBanera"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.banos.banosBanera}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="banosDucha" className="block">
                  Baños con ducha
                </label>
                <input
                  id="banosDucha"
                  name="banos.banosDucha"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.banos.banosDucha}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="aseos" className="block">
                  Aseos
                </label>
                <input
                  id="aseos"
                  name="banos.aseos"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.banos.aseos}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="sauna"
                  name="banos.sauna"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.banos.sauna}
                  onChange={handleChange}
                />
                <label htmlFor="sauna">Sauna</label>
              </div>
              <div className="flex items-center">
                <input
                  id="jacuzzi"
                  name="banos.jacuzzi"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.banos.jacuzzi}
                  onChange={handleChange}
                />
                <label htmlFor="jacuzzi">Jacuzzi</label>
              </div>
              <div className="flex items-center">
                <input
                  id="secador"
                  name="banos.secador"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.banos.secador}
                  onChange={handleChange}
                />
                <label htmlFor="secador">Secador</label>
              </div>
              <div>
                <label htmlFor="toallas" className="block">
                  Toallas
                </label>
                <select
                  id="toallas"
                  name="banos.toallas"
                  className="border p-2 w-full"
                  value={formData.banos.toallas}
                  onChange={handleChange}
                >
                  <option>Suministrada</option>
                </select>
              </div>
              <div>
                <label htmlFor="cambioToallas" className="block">
                  Cambio de toallas
                </label>
                <input
                  id="cambioToallas"
                  name="banos.cambioToallas"
                  type="text"
                  className="border p-2 w-full"
                  value={formData.banos.cambioToallas}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* COCINA */}
          <div className="col-span-full">
            <h2 className="font-bold text-lg bg-muted-foreground p-2">
              COCINA
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="numCocinas" className="block">
                  Número de cocinas
                </label>
                <input
                  id="numCocinas"
                  name="cocina.numCocinas"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.cocina.numCocinas}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="clase" className="block">
                  Clase
                </label>
                <select
                  id="clase"
                  name="cocina.clase"
                  className="border p-2 w-full"
                  value={formData.cocina.clase}
                  onChange={handleChange}
                >
                  <option>--Sin Especificar--</option>
                </select>
              </div>
              <div>
                <label htmlFor="tipo" className="block">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="cocina.tipo"
                  className="border p-2 w-full"
                  value={formData.cocina.tipo}
                  onChange={handleChange}
                >
                  <option>--Sin Especificar--</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  id="utensiliosCocina"
                  name="cocina.utensiliosCocina"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.cocina.utensiliosCocina}
                  onChange={handleChange}
                />
                <label htmlFor="utensiliosCocina">Utensilios cocina</label>
              </div>
              <div className="flex items-center">
                <input
                  id="cafetera"
                  name="cocina.cafetera"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.cocina.cafetera}
                  onChange={handleChange}
                />
                <label htmlFor="cafetera">Cafetera</label>
              </div>
              <div className="flex items-center">
                <input
                  id="freidora"
                  name="cocina.freidora"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.cocina.freidora}
                  onChange={handleChange}
                />
                <label htmlFor="freidora">Freidora</label>
              </div>
              <div className="flex items-center">
                <input
                  id="tostadora"
                  name="cocina.tostadora"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.cocina.tostadora}
                  onChange={handleChange}
                />
                <label htmlFor="tostadora">Tostadora</label>
              </div>
            </div>
          </div>

          {/* ACCESORIOS DEL HOGAR */}
          <div className="col-span-full">
            <h2 className="font-bold text-lg bg-muted-foreground p-2">
              ACCESORIOS DEL HOGAR
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="ropaCama" className="block">
                  Ropa de cama
                </label>
                <select
                  id="ropaCama"
                  name="accesoriosHogar.ropaCama"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.ropaCama}
                  onChange={handleChange}
                >
                  <option>Suministrada</option>
                </select>
              </div>
              <div>
                <label htmlFor="cambioRopa" className="block">
                  Cambio de ropa
                </label>
                <input
                  id="cambioRopa"
                  name="accesoriosHogar.cambioRopa"
                  type="text"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.cambioRopa}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="lavadora"
                  name="accesoriosHogar.lavadora"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.accesoriosHogar.lavadora}
                  onChange={handleChange}
                />
                <label htmlFor="lavadora">Lavadora</label>
              </div>
              <div className="flex items-center">
                <input
                  id="secadora"
                  name="accesoriosHogar.secadora"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.accesoriosHogar.secadora}
                  onChange={handleChange}
                />
                <label htmlFor="secadora">Secadora</label>
              </div>
              <div className="flex items-center">
                <input
                  id="television"
                  name="accesoriosHogar.television"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.accesoriosHogar.television}
                  onChange={handleChange}
                />
                <label htmlFor="television">Televisión</label>
              </div>
              <div>
                <label htmlFor="televisores" className="block">
                  Televisores
                </label>
                <input
                  id="televisores"
                  name="accesoriosHogar.televisores"
                  type="text"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.televisores}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="tvSatelite"
                  name="accesoriosHogar.tvSatelite"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.accesoriosHogar.tvSatelite}
                  onChange={handleChange}
                />
                <label htmlFor="tvSatelite">TV Satélite</label>
              </div>
              <div className="flex items-center">
                <input
                  id="radio"
                  name="accesoriosHogar.radio"
                  type="checkbox"
                  className="mr-2"
                  checked={formData.accesoriosHogar.radio}
                  onChange={handleChange}
                />
                <label htmlFor="radio">Radio</label>
              </div>
              <div>
                <label htmlFor="idiomasTvSatelite" className="block">
                  Idiomas TV Satélite
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      id="espanol"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="espanol"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "espanol"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="espanol">Español</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ingles"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="ingles"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "ingles"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="ingles">Inglés</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="aleman"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="aleman"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "aleman"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="aleman">Alemán</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="italiano"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="italiano"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "italiano"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="italiano">Italiano</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="holandes"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="holandes"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "holandes"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="holandes">Holandés</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="portugues"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="portugues"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "portugues"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="portugues">Portugués</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="frances"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="frances"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "frances"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="frances">Francés</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="noruego"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="noruego"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "noruego"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="noruego">Noruego</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="sueco"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="sueco"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "sueco"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="sueco">Sueco</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ruso"
                      name="accesoriosHogar.idiomasTvSatelite"
                      type="checkbox"
                      className="mr-2"
                      value="ruso"
                      checked={formData.accesoriosHogar.idiomasTvSatelite.includes(
                        "ruso"
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="ruso">Ruso</label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="mosquiteras" className="block">
                  Mosquiteras
                </label>
                <input
                  id="mosquiteras"
                  name="accesoriosHogar.mosquiteras"
                  type="text"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.mosquiteras}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="ventiladores" className="block">
                  Ventiladores
                </label>
                <input
                  id="ventiladores"
                  name="accesoriosHogar.ventiladores"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.ventiladores}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="dvd" className="block">
                  DVD
                </label>
                <input
                  id="dvd"
                  name="accesoriosHogar.dvd"
                  type="text"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.dvd}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="aparatosAntiMosquitos" className="block">
                  Aparatos eléctricos anti-mosquitos
                </label>
                <input
                  id="aparatosAntiMosquitos"
                  name="accesoriosHogar.aparatosAntiMosquitos"
                  type="number"
                  className="border p-2 w-full"
                  value={formData.accesoriosHogar.aparatosAntiMosquitos}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* CARACTERÍSTICAS ADICIONALES */}
          <div className="col-span-full">
            <h2 className="font-bold text-lg bg-muted-foreground p-2">
              CARACTERÍSTICAS ADICIONALES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="internetAccess"
                  className="text-muted-foreground"
                >
                  Acceso internet:
                </label>
                <select
                  id="internetAccess"
                  name="caracteristicasAdicionales.internetAccess"
                  className="border border-border rounded p-2 bg-input text-foreground"
                  value={formData.caracteristicasAdicionales.internetAccess}
                  onChange={handleChange}
                >
                  <option>--Ninguno--</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="safeBox" className="text-muted-foreground">
                  Caja fuerte:
                </label>
                <input
                  type="checkbox"
                  id="safeBox"
                  name="caracteristicasAdicionales.safeBox"
                  className="border border-border rounded bg-input text-foreground"
                  checked={formData.caracteristicasAdicionales.safeBox}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="miniBar" className="text-muted-foreground">
                  Mini bar:
                </label>
                <input
                  type="checkbox"
                  id="miniBar"
                  name="caracteristicasAdicionales.miniBar"
                  className="border border-border rounded bg-input text-foreground"
                  checked={formData.caracteristicasAdicionales.miniBar}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="electronicLock"
                  className="text-muted-foreground"
                >
                  Cerradura electrónica asociada:
                </label>
                <select
                  id="electronicLock"
                  name="caracteristicasAdicionales.electronicLock"
                  className="border border-border rounded p-2 bg-input text-foreground"
                  value={formData.caracteristicasAdicionales.electronicLock}
                  onChange={handleChange}
                >
                  <option>--Sin especificar--</option>
                </select>
                <img
                  src="https://openui.fly.dev/openui/24x24.svg?text=ℹ️"
                  alt="info-icon"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="doorCode" className="text-muted-foreground">
                  Código de puerta:
                </label>
                <input
                  type="text"
                  id="doorCode"
                  name="caracteristicasAdicionales.doorCode"
                  className="border border-border rounded p-2 bg-input text-foreground"
                  value={formData.caracteristicasAdicionales.doorCode}
                  onChange={handleChange}
                />
                <img
                  src="https://openui.fly.dev/openui/24x24.svg?text=ℹ️"
                  alt="info-icon"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="parking" className="block text-sm font-medium">
                  Aparcamiento
                </label>
                <select
                  id="parking"
                  name="caracteristicasAdicionales.parking"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.parking}
                  onChange={handleChange}
                >
                  <option>Ninguno</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="parkingLocation"
                  className="block text-sm font-medium"
                >
                  Ubicación del aparcamiento
                </label>
                <select
                  id="parkingLocation"
                  name="caracteristicasAdicionales.parkingLocation"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.parkingLocation}
                  onChange={handleChange}
                >
                  <option>Ninguno</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="parkingSpaces"
                  className="block text-sm font-medium"
                >
                  Plazas de aparcamiento
                </label>
                <select
                  id="parkingSpaces"
                  name="caracteristicasAdicionales.parkingSpaces"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.parkingSpaces}
                  onChange={handleChange}
                >
                  <option>0</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="parkingType"
                  className="block text-sm font-medium"
                >
                  Tipo de aparcamiento
                </label>
                <select
                  id="parkingType"
                  name="caracteristicasAdicionales.parkingType"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.parkingType}
                  onChange={handleChange}
                >
                  <option>No se especifica</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="airConditioning"
                  className="block text-sm font-medium"
                >
                  Aire acondicionado
                </label>
                <select
                  id="airConditioning"
                  name="caracteristicasAdicionales.airConditioning"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.airConditioning}
                  onChange={handleChange}
                >
                  <option>Si</option>
                </select>
              </div>
              <div>
                <label htmlFor="heating" className="block text-sm font-medium">
                  Calefacción
                </label>
                <select
                  id="heating"
                  name="caracteristicasAdicionales.heating"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.heating}
                  onChange={handleChange}
                >
                  <option>Ninguna</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="disabledAccess"
                  className="block text-sm font-medium"
                >
                  Adaptado discapacitados
                </label>
                <select
                  id="disabledAccess"
                  name="caracteristicasAdicionales.disabledAccess"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.disabledAccess}
                  onChange={handleChange}
                >
                  <option>No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium">Jardín</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.jardin"
                  checked={formData.caracteristicasAdicionales.jardin}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Mobiliario jardín
                </label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.mobiliarioJardin"
                  checked={formData.caracteristicasAdicionales.mobiliarioJardin}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Barbacoa</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.barbacoa"
                  checked={formData.caracteristicasAdicionales.barbacoa}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Chimenea</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.chimenea"
                  checked={formData.caracteristicasAdicionales.chimenea}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Parcela vallada
                </label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.parcelaVallada"
                  checked={formData.caracteristicasAdicionales.parcelaVallada}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Terraza</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.terraza"
                  checked={formData.caracteristicasAdicionales.terraza}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Alarma</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.alarma"
                  checked={formData.caracteristicasAdicionales.alarma}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Gimnasio</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.gimnasio"
                  checked={formData.caracteristicasAdicionales.gimnasio}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Squash</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.squash"
                  checked={formData.caracteristicasAdicionales.squash}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Balcón</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.balcon"
                  checked={formData.caracteristicasAdicionales.balcon}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Pádel</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.padel"
                  checked={formData.caracteristicasAdicionales.padel}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tenis</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.tenis"
                  checked={formData.caracteristicasAdicionales.tenis}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Zona infantil
                </label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.zonaInfantil"
                  checked={formData.caracteristicasAdicionales.zonaInfantil}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Spa</label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.spa"
                  checked={formData.caracteristicasAdicionales.spa}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="animals" className="block text-sm font-medium">
                  Animales
                </label>
                <select
                  id="animals"
                  name="caracteristicasAdicionales.animals"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.animals}
                  onChange={handleChange}
                >
                  <option>No</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="weightLimit"
                  className="block text-sm font-medium"
                >
                  Peso límite
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="number"
                    id="weightLimit"
                    name="caracteristicasAdicionales.weightLimit"
                    className="block w-full bg-input border border-border rounded-md"
                    value={formData.caracteristicasAdicionales.weightLimit}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Kilos</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  No se aceptan animales de raza potencialmente peligrosa:
                </label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.noDangerousAnimals"
                  checked={
                    formData.caracteristicasAdicionales.noDangerousAnimals
                  }
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label htmlFor="pool" className="block text-sm font-medium">
                  Piscina
                </label>
                <select
                  id="pool"
                  name="caracteristicasAdicionales.pool"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.pool}
                  onChange={handleChange}
                >
                  <option>Ninguna</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="heatedPool"
                  className="block text-sm font-medium"
                >
                  Piscina climatizada
                </label>
                <select
                  id="heatedPool"
                  name="caracteristicasAdicionales.heatedPool"
                  className="mt-1 block w-full bg-input border border-border rounded-md"
                  value={formData.caracteristicasAdicionales.heatedPool}
                  onChange={handleChange}
                >
                  <option>Ninguna</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium">
                  No se aceptan grupos de jóvenes:
                </label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.noYoungGroups"
                  checked={formData.caracteristicasAdicionales.noYoungGroups}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  No se admite fumar:
                </label>
                <input
                  type="checkbox"
                  name="caracteristicasAdicionales.noSmoking"
                  checked={formData.caracteristicasAdicionales.noSmoking}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="additionalFeatures"
                className="block text-sm font-medium"
              >
                Características adicionales
              </label>
              <textarea
                id="additionalFeatures"
                name="caracteristicasAdicionales.additionalFeatures"
                className="mt-1 block w-full bg-input border border-border rounded-md"
                value={formData.caracteristicasAdicionales.additionalFeatures}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Guardar y Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
