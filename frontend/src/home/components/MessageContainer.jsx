/*import React, { useEffect, useState,useRef  } from 'react'
import userConversation from '../../Zustans/useConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/sound/notification.mp3';

const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
    const {socket} = useSocketContext();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending , setSending] = useState(false);
    const [sendData , setSnedData] = useState("")
    const lastMessageRef = useRef();

    useEffect(()=>{
      socket?.on("newMessage",(newMessage)=>{
        const sound = new Audio(notify);
        sound.play();
        setMessage([...messages,newMessage])
      })

      return ()=> socket?.off("newMessage");
    },[socket,setMessage,messages])

    useEffect(()=>{
        setTimeout(()=>{
            lastMessageRef?.current?.scrollIntoView({behavior:"smooth"})
        },100)
    },[messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`/api/message/${selectedConversation?._id}`);
                const data = await get.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setMessage(data);
            } catch (error) {
                setLoading(false);
                console.log(error);

            }
        }

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessage])
    console.log(messages);

    const handelMessages=(e)=>{
        setSnedData(e.target.value)
      }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setSending(true);
        try {
            const res =await axios.post(`/api/message/send/${selectedConversation?._id}`,{messages:sendData});
            const data = await res.data;
            if (data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSnedData('')
            setMessage([...messages,data])
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    }

    return (
        <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
        {selectedConversation === null ? (
          <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center text-2xl text-gray-950 font-semibold 
            flex flex-col items-center gap-2'>
              <p className='text-2xl'>Welcome!!👋 {authUser.username}😉</p>
              <p className="text-lg">Select a chat to start messaging</p>
              <TiMessages className='text-6xl text-center' />
            </div>
          </div>
        ) : (
          <>
            <div className='flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12'>
              <div className='flex gap-2 md:justify-between items-center w-full'>
                <div className='md:hidden ml-1 self-center'>
                  <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1
                   self-center'>
                    <IoArrowBackSharp size={25} />
                  </button>
                </div>
                <div className='flex justify-between mr-2 gap-2'>
                  <div className='self-center'>
                    <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic} />
                  </div>
                  <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                    {selectedConversation?.username}
                  </span>
                </div>
              </div>
            </div>
      
            <div className='flex-1 overflow-auto'>
              {loading && (
                <div className="flex w-full h-full flex-col items-center justify-center 
                gap-4 bg-transparent">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
              {!loading && messages?.length === 0 && (
                <p className='text-center text-white items-center'>Send a message to 
                start Conversation</p>
              )}
              {!loading && messages?.length > 0 && messages?.map((message) => (
                <div className='text-white' key={message?._id} ref={lastMessageRef}>
                  <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                    <div className='chat-image avatar'></div>
                    <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-sky-600' : ''

                    }`}>
                      {message?.message}
                    </div>
                    <div className="chat-footer text-[10px] opacity-80">
                      {new Date(message?.createdAt).toLocaleDateString('en-IN')}
                      {new Date(message?.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute:
                         'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handelSubmit} className='rounded-full text-black'>
            <div className='w-full rounded-full flex items-center bg-white'>
              <input value={sendData} onChange={handelMessages} required id='message' type='text' 
              className='w-full bg-transparent outline-none px-4 rounded-full'/>
              <button type='submit'>
                {sending ? <div className='loading loading-spinner'></div>:
                <IoSend size={25}
                className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1'/>
                }
              </button>
            </div>
            </form>
          </>
        )}
      </div>
    )
}

export default MessageContainer
*/

import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/sound/notification.mp3";

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
    // ✅ CRITICAL FIX: Removed setMessage from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;

    setSending(true);
    const receiverId = selectedConversation?.userId || selectedConversation?._id;

    try {
      // 1. Save to DB
      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        { messages: sendData }
      );
      const sentMessage = res.data;

      // 2. Emit Socket Event
      socket?.emit("sendMessage", {
        senderId: authUser._id,
        receiverId: receiverId,
        message: sendData,
        _id: sentMessage._id,
        createdAt: sentMessage.createdAt,
      });

      // 3. Update UI
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
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-bg-primary sticky top-0 z-10">
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
                    ? "bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-tr-md"
                    : "bg-bg-secondary text-text-primary rounded-2xl rounded-tl-md border border-border"}
                  `}
              >
                <p>{msg.message}</p>
                <p className={`text-[10px] mt-1 text-right opacity-60 ${isMe ? "text-gray-300 dark:text-gray-600" : "text-text-secondary"}`}>
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
            className="flex-1 bg-transparent border border-border px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-text-primary transition-colors text-sm font-medium rounded-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="p-3 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {sending ? <span className="loading loading-spinner loading-xs"></span> : <IoSend size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageContainer;




/*
Zustand is a state management library for React. It gives you a global store that any component can access without prop drilling. In your app:

Sidebar sets the selectedConversation when you click on a user.

MessageContainer reads selectedConversation to know which chat to show.

Both components share the same state via Zustand, without needing to pass props through parent components.
*/

