// Create a new SocketContext.js
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
      });

      // Identify user to join their personal room
      socketRef.current.emit("identity", user._id);

      // Listen for notifications
      socketRef.current.on("newMessageNotification", (message) => {
        if (message.receiver === user._id) {
          toast.info(`New message from ${message.sender.name}`, {
            onClick: () => window.location.href = `/chat?receiver=${message.sender._id}`,
            closeOnClick: true
          });
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};