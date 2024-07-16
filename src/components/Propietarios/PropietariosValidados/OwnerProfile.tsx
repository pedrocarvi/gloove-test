import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
}

const OwnerProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setProfileData(data);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...profileData,
      } as Partial<ProfileData>);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Perfil del Usuario
      </h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre
          </label>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-900">{profileData.name}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Correo Electrónico
          </label>
          {isEditing ? (
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-900">{profileData.email}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Biografía
          </label>
          {isEditing ? (
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
            ></textarea>
          ) : (
            <p className="text-gray-900">{profileData.bio}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
