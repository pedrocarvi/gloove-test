// src/components/Empleados/NuevoPropietarioForm.tsx

import React, { useState } from "react";
import { enviarInvitacion } from "@/services/propietarioService";

const NuevoPropietarioForm: React.FC = () => {
  const [newOwnerEmail, setNewOwnerEmail] = useState("");

  const handleAddNewOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    await enviarInvitacion(newOwnerEmail);
    setNewOwnerEmail("");
  };

  return (
    <form onSubmit={handleAddNewOwner} className="mb-4">
      <input
        type="email"
        value={newOwnerEmail}
        onChange={(e) => setNewOwnerEmail(e.target.value)}
        placeholder="Correo del nuevo propietario"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Enviar Invitación
      </button>
    </form>
  );
};

export default NuevoPropietarioForm;
