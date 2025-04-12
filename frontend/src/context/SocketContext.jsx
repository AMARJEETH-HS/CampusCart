import { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef();

  useEffect(() => {
    if (user) {
      socketRef.current = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000
      });
  
      // Essential: Identify user to join their notification room
      socketRef.current.emit("identity", user._id);
  
      // Notification Handler (Fixed with proper data parsing)
      socketRef.current.on("newMessageNotification", (conversation) => {
        toast.info(`New message from ${conversation.lastMessage.sender.name}`, {
          onClick: () => navigate(`/chat?receiver=${conversation.lastMessage.sender._id}`),
          closeOnClick: true
        });
        
        // Update conversations state
        setConversations(prev => updateConversations(prev, conversation));
      });
  
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]); // Proper dependency array

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};