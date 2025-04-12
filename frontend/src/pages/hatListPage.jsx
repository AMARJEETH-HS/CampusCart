import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function ChatListPage() {
  const { user } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch conversations from backend.
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get(
        `/api/chat/conversations/${user._id}`,
        { withCredentials: true } // Cookies will be sent automatically.
      );
      setConversations(data);
    } catch (err) {
      if (err.response?.status === 401) {
        // Handle unauthorized (token expired or invalid).
        navigate("/login");
      } else {
        setError("Failed to load conversations");
        console.error("API Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of conversations.
  useEffect(() => {
    if (user?._id) {
      fetchConversations();
    }
  }, [user?._id, navigate]);

  // Set an interval to refresh the conversation list every 1 second.
  useEffect(() => {
    let intervalId;
    if (user?._id) {
      intervalId = setInterval(() => {
        fetchConversations();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user?._id, navigate]);

  // Socket connection for real-time updates.
  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
      withCredentials: true,
    });

    const handleNotification = (conversation) => {
      setConversations((prev) => {
        // Check if the conversation already exists:
        const index = prev.findIndex((c) => c._id === conversation._id);
        if (index === -1) {
          // Add new conversation.
          return [conversation, ...prev];
        } else {
          // Update the existing conversation if needed.
          return prev.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c
          );
        }
      });
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
      socket.disconnect();
    };
  }, [user]);

  // Group the conversations by conversationId and get the most recent message of each group.
  const groupedConversations = useMemo(() => {
    // Use an object to group messages by conversationId.
    const groups = conversations.reduce((acc, convo) => {
      const key = convo.conversationId;
      if (!acc[key]) {
        acc[key] = convo;
      } else {
        // Keep the one with the later updatedAt.
        if (new Date(convo.updatedAt) > new Date(acc[key].updatedAt)) {
          acc[key] = convo;
        }
      }
      return acc;
    }, {});
    // Return an array of groups sorted by their updatedAt in descending order.
    return Object.values(groups).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [conversations]);

  // Loading and error states.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Your Conversations</h1>
        {groupedConversations.map((c) => {
          // Determine the other participant based on the current user's ID.
          const otherUser = c.sender._id === user._id ? c.receiver : c.sender;
          return (
            <Link
              to={`/chat?receiver=${otherUser._id}`}
              key={c._id}
              className="card bg-base-100 shadow-md p-4 hover:bg-base-300 transition mb-4"
            >
              <h2 className="text-xl font-semibold">
                {otherUser.name || "Unknown User"}
              </h2>
              <p className="text-sm text-gray-500">
                {otherUser.email || "No email provided"}
              </p>
              {!c.read && (
                <span className="badge badge-error mt-2">New message</span>
              )}
              {/* Optionally, display a snippet of the latest message */}
              <p className="text-gray-700 mt-2">{c.message}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
