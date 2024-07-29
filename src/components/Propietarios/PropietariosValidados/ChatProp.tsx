import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getConversations, getMessages, sendMessage, Conversation, Message } from '@/services/chatService';
import { getFunctions, httpsCallable } from "firebase/functions";

const ChatProp: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  const functions = getFunctions();
  const notifyMessageRecipient = httpsCallable(functions, 'notifyMessageRecipient');

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

  const handleSendMessage = async () => {
    if (user && selectedConversation && newMessage.trim()) {
      await sendMessage(selectedConversation, user.uid, 'propietario', newMessage);
      await notifyMessageRecipient({ conversationId: selectedConversation, senderId: user.uid, text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Conversaciones</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedConversation(conv.id)}
            className={`cursor-pointer p-2 mb-2 rounded ${selectedConversation === conv.id ? 'bg-blue-200' : 'bg-white'}`}
          >
            <div className="font-bold">Conversación</div>
            <div className="text-sm">{conv.lastMessage}</div>
          </div>
        ))}
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 border rounded p-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-2 ${msg.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
              <span className="inline-block bg-gray-200 rounded px-2 py-1">
                <strong>{msg.senderId === user?.uid ? 'Tú' : 'Empleado'}:</strong> {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
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
      </div>
    </div>
  );
};

export default ChatProp;

