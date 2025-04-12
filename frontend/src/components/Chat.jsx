// ChatPage.jsx (no changes needed here)
// Keep the ChatPage component as is

// Chat.jsx - Remove toast dependencies and error notifications
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function Chat({ conversationId, userId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const socketRef = useRef();
  const [loading, setLoading] = useState(true);
  const messagesContainerRef = useRef();

  // Socket initialization remains the same
  useEffect(() => {
    const initSocket = () => {
      socketRef.current = io(
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
        { withCredentials: true }
      );

      socketRef.current.on("connect", () => {
        socketRef.current.emit("joinConversation", conversationId);
      });

      socketRef.current.on("newMessage", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    };

    initSocket();
  }, [conversationId]);

  // Modified fetchMessages without toast
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `/api/chat/conversation/${conversationId}`,
        { withCredentials: true }
      );
      setMessages(data);
    } catch (err) {
      // Error handling without toast
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [conversationId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!msgInput.trim()) return;
    socketRef.current.emit("chatMessage", {
      conversationId,
      sender: userId,
      receiver: otherUserId,
      message: msgInput.trim(),
    });
    setMsgInput("");
  };

  // The rest of the JSX remains unchanged
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      {loading ? (
        <div className="text-center">Loading messages...</div>
      ) : (
        <>
          <div
            ref={messagesContainerRef}
            className="h-80 overflow-y-auto flex flex-col gap-2 mb-4"
          >
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.sender._id === userId
                    ? "self-end bg-blue-600 text-white"
                    : "self-start bg-gray-300"
                }`}
              >
                <p>{msg.message}</p>
                <div className="text-xs text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input input-bordered w-full"
              placeholder="Type a message..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}