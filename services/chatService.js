import { db } from "../firebase/firebase.config"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"

const sendMessage = async (channelId, message) => {
  try {
    const messagesRef = collection(db, "channels", channelId, "messages");
    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const getMessages = (channelId, callback) => {
  const messagesQuery = query(
    collection(db, "channels", channelId, "messages"),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(messagesQuery, snapshot => {
    const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id, 
            ...data,
            // Convert Firestore Timestamp to JS Date object, then to ISO string
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
        }
    });
    callback(messages);
  });

  return unsubscribe;
};

export { sendMessage, getMessages };
