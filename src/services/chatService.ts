import { db, functions } from '../firebaseConfig';
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderRole: 'empleado' | 'propietario' | 'huesped';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  timestamp: Date;
  title: string;
}

export const createConversation = async (employeeId: string, userId: string, title: string): Promise<string> => {
  try {
    const newConversation = {
      participants: [employeeId, userId],
      lastMessage: '',
      timestamp: serverTimestamp(),
      title
    };
    const docRef = await addDoc(collection(db, 'conversations'), newConversation);
    return docRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const sendMessage = async (conversationId: string, senderId: string, senderRole: 'empleado' | 'propietario' | 'huesped', text: string): Promise<void> => {
  try {
    const messageData = {
      conversationId,
      senderId,
      senderRole,
      text,
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, 'messages'), messageData);
    
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: text,
      timestamp: serverTimestamp()
    });

    const notifyRecipient = httpsCallable(functions, 'notifyMessageRecipient');
    await notifyRecipient({ conversationId, senderId, text });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getConversations = (userId: string, callback: (conversations: Conversation[]) => void) => {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const conversations: Conversation[] = [];
    querySnapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() } as Conversation);
    });
    callback(conversations);
  }, (error) => {
    console.error("Error getting conversations:", error);
  });
};

export const getMessages = (conversationId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  }, (error) => {
    console.error("Error getting messages:", error);
  });
};
