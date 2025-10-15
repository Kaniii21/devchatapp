"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { v4 as uuidv4 } from "uuid"

interface User {
  uid: string
  displayName: string
  photoURL: string
  status: string
}

interface Message {
  id: string
  sender: User
  content: string
  timestamp: string
  type: string
  language?: string
}

interface Channel {
  id: string
  name: string
  description: string
}

interface ChatContextType {
  channels: Channel[]
  currentChannel: Channel | null
  setCurrentChannel: (channel: Channel) => void
  messages: Message[]
  loading: boolean
  onlineUsers: User[]
  sendMessage: (messageData: Partial<Message>) => Promise<void>
  createChannel: (channelData: Omit<Channel, 'id'>) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { user } = useAuth()
  const [channels, setChannels] = useState<Channel[]>([])
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])

  // Initialize default channels
  useEffect(() => {
    const defaultChannels: Channel[] = [
      { id: "general", name: "general", description: "General discussion for all developers" },
      { id: "javascript", name: "javascript", description: "JavaScript discussions and help" },
      { id: "react", name: "react", description: "React framework discussions" },
      { id: "python", name: "python", description: "Python programming language discussions" },
      { id: "beginners", name: "beginners", description: "A friendly place for programming beginners" },
    ]

    setChannels(defaultChannels)
    setCurrentChannel(defaultChannels[0])
  }, [])

  // Load messages for current channel
  useEffect(() => {
    if (!currentChannel || !user) return

    setLoading(true)

    // In a real app, this would fetch from Firestore
    // For demo purposes, we'll simulate messages
    const simulatedMessages: Message[] = [
      {
        id: uuidv4(),
        sender: {
          uid: "user1",
          displayName: "Alice Johnson",
          photoURL: "/placeholder.svg?height=40&width=40",
          status: "online",
        },
        content: "Hey everyone! Has anyone used the new React Server Components?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: "text",
      },
      {
        id: uuidv4(),
        sender: {
          uid: "user2",
          displayName: "Bob Smith",
          photoURL: "/placeholder.svg?height=40&width=40",
          status: "online",
        },
        content: "Yes, I've been experimenting with them. They're pretty cool!",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        type: "text",
      },
      {
        id: uuidv4(),
        sender: {
          uid: "user3",
          displayName: "Charlie Davis",
          photoURL: "/placeholder.svg?height=40&width=40",
          status: "away",
        },
        content: "Here's a simple example:",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        type: "text",
      },
      {
        id: uuidv4(),
        sender: {
          uid: "user3",
          displayName: "Charlie Davis",
          photoURL: "/placeholder.svg?height=40&width=40",
          status: "away",
        },
        content: `// server-component.jsx
export default async function ServerComponent() {
  const data = await fetchSomeData();
  
  return (
    <div>
      <h1>Server Component</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`,
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        type: "code",
        language: "jsx",
      },
      {
        id: uuidv4(),
        sender: {
          uid: user?.uid || "anonymous",
          displayName: user?.displayName || "You",
          photoURL: user?.photoURL || "/placeholder.svg?height=40&width=40",
          status: "online",
        },
        content: "Thanks for sharing! I'm still learning how to use them effectively.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: "text",
      },
    ]

    // Simulate loading delay
    setTimeout(() => {
      setMessages(simulatedMessages)
      setLoading(false)
    }, 1000)

    // Simulate online users
    setOnlineUsers([
      { uid: "user1", displayName: "Alice Johnson", status: "online" },
      { uid: "user2", displayName: "Bob Smith", status: "online" },
      { uid: "user3", displayName: "Charlie Davis", status: "away" },
      { uid: user.uid, displayName: user.displayName || "You", status: "online" },
    ])

    // In a real app, you would use Firestore listeners
    // const messagesRef = collection(db, 'channels', currentChannel.id, 'messages');
    // const q = query(messagesRef, orderBy('timestamp', 'asc'));

    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const messageList = [];
    //   snapshot.forEach((doc) => {
    //     messageList.push({ id: doc.id, ...doc.data() });
    //   });
    //   setMessages(messageList);
    //   setLoading(false);
    // });

    // return () => unsubscribe();
  }, [currentChannel, user])

  // Send a message
  const sendMessage = async (messageData: Partial<Message>): Promise<void> => {
    if (!currentChannel || !user) return

    const newMessage: Message = {
      id: uuidv4(),
      sender: {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "/placeholder.svg?height=40&width=40",
        status: "online",
      },
      content: messageData.content || "",
      timestamp: new Date().toISOString(),
      type: messageData.type || "text",
      language: messageData.language,
    }

    // In a real app, this would save to Firestore
    // await addDoc(collection(db, 'channels', currentChannel.id, 'messages'), {
    //   ...newMessage,
    //   timestamp: serverTimestamp()
    // });

    // For demo purposes, we'll just add it to the local state
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  // Create a new channel
  const createChannel = (channelData: Omit<Channel, 'id'>): void => {
    const newChannel: Channel = {
      id: channelData.name.toLowerCase().replace(/\s+/g, "-"),
      ...channelData,
    }

    // In a real app, this would save to Firestore
    // For demo purposes, we'll just add it to the local state
    setChannels((prevChannels) => [...prevChannels, newChannel])
    setCurrentChannel(newChannel)
  }

  const value: ChatContextType = {
    channels,
    currentChannel,
    setCurrentChannel,
    messages,
    loading,
    onlineUsers,
    sendMessage,
    createChannel,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContext
