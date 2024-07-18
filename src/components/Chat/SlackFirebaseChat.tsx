import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

const SlackFirebaseChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      // Añadir mensaje a Firestore
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        sender: user?.role,
        timestamp: new Date(),
      });

      // Enviar mensaje a Slack
      await axios.post('/api/sendSlackMessage', {
        text: `${user?.role}: ${newMessage}`,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          className="mt-2 bg-primary text-white p-2 rounded w-full"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default SlackFirebaseChat;