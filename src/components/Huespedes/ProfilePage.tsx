import React, { useState, useEffect } from "react";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("")
  const [bio, setBio] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleSave = () => {
    // Guardar los datos actualizados en el localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setIsEditing(false);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="text-gray-900">{name}</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className="text-gray-900">{email}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de usuario
          </label>
          <p className="text-gray-900 capitalize">{role}</p>
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

export default ProfilePage;
