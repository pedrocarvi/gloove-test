// src/components/UI/Chatbot.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ text: string; timestamp: any }[]>(
    []
  );
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!user) return;

    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(
        (doc) => doc.data() as { text: string; timestamp: any }
      );
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        timestamp: Timestamp.now(),
        uid: user?.uid,
      };
      await addDoc(collection(db, "messages"), newMessage);
      setInput("");
    }
  };

  if (!user) {
    return <div>Please log in to use the chatbot.</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col p-4 space-y-2 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 rounded bg-gray-200">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center border-t p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
