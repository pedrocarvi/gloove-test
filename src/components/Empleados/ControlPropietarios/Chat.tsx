import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPropietariosValidados, getPropietariosEnProceso, Propietario } from "@/services/propietarioService";
import { getHuespedes, Huesped } from "@/services/huespedService";
import { getConversations, getMessages, sendMessage, createConversation, Conversation, Message } from '@/services/chatService';
import { storage } from '@/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from "firebase/functions";

const EmployeeChat: React.FC = () => {
  const [userType, setUserType] = useState<'propietario' | 'huesped'>('propietario');
  const [propietarioStatus, setPropietarioStatus] = useState<'validado' | 'en_proceso'>('validado');
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [huespedes, setHuespedes] = useState<Huesped[]>([]);
  const [selectedUser, setSelectedUser] = useState<Propietario | Huesped | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [documents, setDocuments] = useState<{[key: string]: string}>({});
  const { user } = useAuth();

  const functions = getFunctions();
  const notifyMessageRecipient = httpsCallable(functions, 'notifyMessageRecipient');

  useEffect(() => {
    const fetchUsers = async () => {
      if (userType === 'propietario') {
        const data = propietarioStatus === 'validado' 
          ? await getPropietariosValidados()
          : await getPropietariosEnProceso();
        setPropietarios(data);
      } else {
        const data = await getHuespedes();
        setHuespedes(data);
      }
    };
    fetchUsers();
  }, [userType, propietarioStatus]);

  useEffect(() => {
    if (user) {
      return getConversations(user.uid, setConversations);
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      return getMessages(selectedConversation, setMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedUser && userType === 'propietario') {
      fetchPropietarioDocuments(selectedUser.id);
    }
  }, [selectedUser, userType]);

  const fetchPropietarioDocuments = async (propietarioId: string) => {
    const documentsConfig = [
      { name: "Ficha técnica", path: `DocumentacionPropietarios/FichaTecnica/ficha_tecnica_${propietarioId}.pdf` },
      { name: "Textil + Presupuesto", path: `Presupuesto Textil/textile_summary_${propietarioId}.pdf` },
      { name: "Contrato", path: `DocumentacionPropietarios/Contratos/contract_${propietarioId}.pdf` },
      { name: "Inventario", path: `DocumentacionPropietarios/Inventario/inventario_${propietarioId}.pdf` },
    ];

    const fetchedDocuments: {[key: string]: string} = {};
    for (const doc of documentsConfig) {
      try {
        const url = await getDownloadURL(ref(storage, doc.path));
        fetchedDocuments[doc.name] = url;
      } catch (error) {
        console.error(`Error fetching document ${doc.name}:`, error);
        fetchedDocuments[doc.name] = "No disponible";
      }
    }
    setDocuments(fetchedDocuments);
  };

  const handleSendMessage = async () => {
    if (user && selectedConversation && newMessage.trim()) {
      try {
        await sendMessage(selectedConversation, user.uid, 'empleado', newMessage);
        await notifyMessageRecipient({ conversationId: selectedConversation, senderId: user.uid, text: newMessage });
        setNewMessage('');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: newMessage,
          senderId: user.uid,
          senderRole: 'empleado',
          timestamp: new Date(),
        }]);
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        let errorMessage = "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.";
        if (error instanceof Error) {
          if (error.message.includes("index")) {
            errorMessage = "El sistema está configurando algunos ajustes. Por favor, inténtalo de nuevo en unos minutos.";
          } else if (error.message.includes("CORS")) {
            errorMessage = "Hay un problema de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.";
          }
        }
        // Aquí puedes mostrar el errorMessage al usuario, por ejemplo, con un toast o un alert
        alert(errorMessage);
      }
    }
  };

  const handleCreateConversation = async () => {
    if (user && selectedUser && newConversationTitle.trim()) {
      try {
        const newConversationId = await createConversation(user.uid, selectedUser.id, newConversationTitle);
        setSelectedConversation(newConversationId);
        setNewConversationTitle('');
        // Actualizamos las conversaciones localmente
        setConversations(prev => [...prev, {
          id: newConversationId,
          participants: [user.uid, selectedUser.id],
          lastMessage: '',
          timestamp: new Date(),
          title: newConversationTitle,
        }]);
      } catch (error) {
        console.error("Error al crear conversación:", error);
        // Aquí puedes añadir una notificación de error para el usuario
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value as 'propietario' | 'huesped')}
          className="w-full p-2 mb-4"
        >
          <option value="propietario">Propietarios</option>
          <option value="huesped">Huéspedes</option>
        </select>
        
        {userType === 'propietario' && (
          <select
            value={propietarioStatus}
            onChange={(e) => setPropietarioStatus(e.target.value as 'validado' | 'en_proceso')}
            className="w-full p-2 mb-4"
          >
            <option value="validado">Validados</option>
            <option value="en_proceso">En Proceso</option>
          </select>
        )}
        
        <h2 className="text-xl font-bold mb-4">{userType === 'propietario' ? 'Propietarios' : 'Huéspedes'}</h2>
        {(userType === 'propietario' ? propietarios : huespedes).map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`cursor-pointer p-2 mb-2 rounded ${selectedUser?.id === user.id ? 'bg-blue-200' : 'bg-white'}`}
          >
            {user.name}
          </div>
        ))}
      </div>
      
      <div className="w-1/2 p-4 flex flex-col">
        {selectedUser && (
          <h2 className="text-xl font-bold mb-4">Chat con {selectedUser.name}</h2>
        )}
        <div className="flex-1 overflow-y-auto mb-4 border rounded p-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-2 ${msg.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
              <span className="inline-block bg-gray-200 rounded px-2 py-1">
                <strong>{msg.senderId === user?.uid ? 'Tú' : userType === 'propietario' ? 'Propietario' : 'Huésped'}:</strong> {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Escribe un mensaje..."
          />
          <button 
            onClick={handleSendMessage} 
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Enviar
          </button>
        </div>
        {selectedUser && !selectedConversation && (
          <div>
            <input
              type="text"
              value={newConversationTitle}
              onChange={(e) => setNewConversationTitle(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="Título de la nueva conversación"
            />
            <button 
              onClick={handleCreateConversation} 
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Iniciar Nueva Conversación
            </button>
          </div>
        )}
      </div>
      
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        {selectedUser && userType === 'propietario' && (
          <>
            <h2 className="text-xl font-bold mb-4">Datos del Propietario</h2>
            <p><strong>Nombre:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <h3 className="text-lg font-bold mt-4 mb-2">Documentos</h3>
            {Object.entries(documents).map(([name, url]) => (
              <div key={name} className="mb-2">
                <strong>{name}:</strong>{' '}
                {url !== "No disponible" ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Ver documento
                  </a>
                ) : (
                  "No disponible"
                )}
              </div>
            ))}
          </>
        )}
        {selectedUser && userType === 'huesped' && (
          <>
            <h2 className="text-xl font-bold mb-4">Datos del Huésped</h2>
            <p><strong>Nombre:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            {/* Agregar más información del huésped si es necesario */}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeChat;


