import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend, IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/sound/notification.mp3";
import { toast } from "react-toastify";

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");

  const lastMessageRef = useRef();

  // 🔌 Socket Listener
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId !== authUser._id) {
        const sound = new Audio(notify);
        sound.play();
      }
      setMessage((prev) => [...prev, newMessage]);
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, authUser?._id, setMessage]);

  // 📜 Auto Scroll to Bottom
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  // 📥 Fetch Messages on Conversation Change
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) return;
      setLoading(true);
      try {
        const res = await axios.get(`/api/message/${selectedConversation._id}`);
        setMessage(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;

    setSending(true);
    const receiverId = selectedConversation?.userId || selectedConversation?._id;

    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        { messages: sendData }
      );
      const sentMessage = res.data;

      socket?.emit("sendMessage", {
        senderId: authUser._id,
        receiverId: receiverId,
        message: sendData,
        _id: sentMessage._id,
        createdAt: sentMessage.createdAt,
      });

      setMessage((prev) => [...prev, sentMessage]);
      setSendData("");
    } catch (err) {
      console.log(err);
    }
    setSending(false);
  };

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-bg-primary text-text-primary">
        <div className="px-4 text-center flex flex-col items-center gap-4">
          <p className="text-3xl font-bold tracking-tighter">Welcome, {authUser.username}</p>
          <p className="text-lg text-text-secondary">Select a conversation to start chatting.</p>
          <div className="mt-4 p-4 rounded-full border border-border">
            <TiMessages className="text-4xl text-text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-primary">

      {/* 🟢 TOP HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-primary sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onBackUser(true)}
            className="md:hidden bg-bg-secondary p-2 rounded-full text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <IoArrowBackSharp size={20} />
          </button>

          <img
            className="w-10 h-10 rounded-full object-cover border border-border"
            src={selectedConversation?.profilepic}
            alt="Profile"
          />
          <div className="flex flex-col">
            <span className="text-text-primary font-bold text-lg leading-tight">
              {selectedConversation?.username}
            </span>
            <span className="text-text-secondary text-xs font-medium">Online</span>
          </div>
        </div>

        {/* 👁️ EYE BUTTON */}
        <button
          onClick={() => toast.info("Viewing Profile...")}
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <IoEyeSharp size={24} />
        </button>
      </div>

      {/* 💬 MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-primary">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="loading loading-spinner text-text-primary"></div>
          </div>
        )}

        {!loading && messages?.length === 0 && (
          <div className="flex h-full items-center justify-center text-text-secondary opacity-50">
            <p>No messages yet.</p>
          </div>
        )}

        {!loading && Array.isArray(messages) && messages.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;
          return (
            <div
              key={msg?._id || index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                    max-w-[75%] px-4 py-2 text-sm font-medium shadow-sm transition-all
                    ${isMe
                    ? "bg-blue-600 text-white rounded-2xl rounded-tr-md"
                    : "bg-bg-secondary text-text-primary rounded-2xl rounded-tl-md border border-border"}
                  `}
              >
                <p>{msg.message}</p>
                <p className={`text-[10px] mt-1 text-right opacity-60 ${isMe ? "text-gray-200" : "text-text-secondary"}`}>
                  {new Date(msg?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✍️ INPUT AREA */}
      <form onSubmit={handleSubmit} className="p-4 bg-bg-primary border-t border-border">
        <div className="flex items-center gap-2 group">
          <input
            value={sendData}
            onChange={(e) => setSendData(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border border-border px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-blue-600 transition-colors text-sm font-medium rounded-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {sending ? <span className="loading loading-spinner loading-xs"></span> : <IoSend size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageContainer;
