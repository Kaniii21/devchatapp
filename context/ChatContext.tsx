"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { useAuth } from "./AuthContext"
import { db } from "../firebase/firebase.config" // Corrected import
import { getMessages, sendMessage } from "../services/chatService" // Corrected import
import { collection, doc, setDoc, onSnapshot, query, getDocs } from "firebase/firestore"

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
  sendMessage: (messageData: Partial<Omit<Message, 'id' | 'sender' | 'timestamp'>>) => Promise<void>
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

  // Seed default channels in Firestore if they don't exist
  const seedChannels = useCallback(async () => {
    const defaultChannels: Omit<Channel, 'id'>[] = [
      { name: "general", description: "General discussion for all developers" },
      { name: "javascript", description: "JavaScript discussions and help" },
      { name: "react", description: "React framework discussions" },
      { name: "python", description: "Python programming language discussions" },
      { name: "beginners", description: "A friendly place for programming beginners" },
    ]

    const channelsRef = collection(db, "channels")
    const snapshot = await getDocs(channelsRef)

    if (snapshot.empty) {
      for (const channelData of defaultChannels) {
        const channelId = channelData.name.toLowerCase().replace(/\s+/g, "-")
        const channelRef = doc(db, "channels", channelId)
        await setDoc(channelRef, channelData)
      }
    }
  }, [])

  // Fetch channels from Firestore
  useEffect(() => {
    seedChannels()

    const q = query(collection(db, "channels"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const channelList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Channel))
      setChannels(channelList)
      if (!currentChannel && channelList.length > 0) {
        setCurrentChannel(channelList[0])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [seedChannels, currentChannel])

  // Load messages for current channel
  useEffect(() => {
    if (!currentChannel) return

    setLoading(true)
    const unsubscribe = getMessages(currentChannel.id, (msgs) => {
      setMessages(msgs)
      setLoading(false)
    })

    // Mock online users for now
    if (user) {
        setOnlineUsers([
            { uid: "user1", displayName: "Alice Johnson", photoURL: "/placeholder-user.jpg", status: "online" },
            { uid: "user2", displayName: "Bob Smith", photoURL: "/placeholder-user.jpg", status: "online" },
            { uid: user.uid, displayName: user.displayName || "You", photoURL: user.photoURL || "/placeholder-user.jpg", status: "online" },
        ])
    }

    return () => unsubscribe()
  }, [currentChannel, user])

  // Send a message
  const sendMessageHandler = async (messageData: Partial<Omit<Message, 'id' | 'sender' | 'timestamp'>>) => {
    if (!currentChannel || !user) return

    const newMessage = {
      sender: {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "/placeholder-user.jpg",
      },
      content: messageData.content || "",
      type: messageData.type || "text",
      language: messageData.language,
    }

    try {
      await sendMessage(currentChannel.id, newMessage)
    } catch (error) {
      console.error("Error sending message:", error)
      // Here you could add a user-facing error message
    }
  }

  // Create a new channel
  const createChannel = async (channelData: Omit<Channel, 'id'>) => {
    const channelId = channelData.name.toLowerCase().replace(/\s+/g, "-")
    const channelRef = doc(db, "channels", channelId)
    try {
      await setDoc(channelRef, channelData)
      setCurrentChannel({ id: channelId, ...channelData })
    } catch (error) {
      console.error("Error creating channel:", error)
    }
  }

  const value: ChatContextType = {
    channels,
    currentChannel,
    setCurrentChannel,
    messages,
    loading,
    onlineUsers,
    sendMessage: sendMessageHandler,
    createChannel,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContext
