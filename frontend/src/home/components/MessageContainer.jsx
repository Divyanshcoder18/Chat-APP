import React, { useEffect, useState,useRef  } from 'react'
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



/*import React, { useEffect, useState, useRef } from "react";
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

  // 🚀 LISTEN FOR NEW MESSAGES
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId !== authUser._id) {
        const sound = new Audio(notify);
        sound.play();
      }

      // 💡 FIXED — ALWAYS USE FUNCTIONAL UPDATE
      setMessage((prev) => [...prev, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, authUser?._id, setMessage]);

  // 🚀 AUTO SCROLL TO LAST MESSAGE
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  // 🚀 FETCH MESSAGES WHEN CHAT OPENS
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
  }, [selectedConversation?._id, setMessage]);

  // 🚀 SEND MESSAGE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await axios.post(`/api/message/send/${selectedConversation._id}`, {
        messages: sendData,
      });

      const sentMessage = res.data;

      // 📡 SEND THROUGH SOCKET
      socket?.emit("sendMessage", {
        senderId: authUser._id,
        receiverId: selectedConversation._id,
        message: sendData,
      });

      // 💡 FIXED — ALWAYS USE FUNCTIONAL UPDATE
      setMessage((prev) => [...prev, sentMessage]);

      setSendData("");
    } catch (err) {
      console.log(err);
    }

    setSending(false);
  };

  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2 
      bg-gradient-to-br from-[#0b141a] via-[#0a1116] to-black 
      rounded-xl shadow-lg">

      
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-white font-semibold flex flex-col items-center gap-4">
            <p className="text-2xl">Welcome 👋 {authUser.username} 😉</p>
            <p className="text-lg text-gray-400">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-indigo-400" />
          </div>
        </div>
      ) : (
        <>
        
          <div className="flex justify-between items-center 
            bg-[#202c33] px-4 py-2 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onBackUser(true)}
                className="bg-white rounded-full p-2 shadow hover:scale-105 transition-transform"
              >
                <IoArrowBackSharp size={22} className="text-indigo-600" />
              </button>

              <img
                className="rounded-full w-10 h-10 border-2 border-white shadow"
                src={selectedConversation?.profilepic}
              />
              <span className="text-white font-bold text-lg">
                {selectedConversation?.username}
              </span>
            </div>
          </div>

         
          <div className="flex-1 overflow-auto px-3 py-3 space-y-3 bg-cover bg-center">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="loading loading-spinner text-indigo-400"></div>
              </div>
            )}

            {!loading && messages?.length === 0 && (
              <p className="text-center text-gray-300">Start the conversation...</p>
            )}

            {!loading &&
              messages?.map((msg, index) => {
                const isMe = msg.senderId === authUser._id;
                const isLast = index === messages.length - 1;

                return (
                  <div
                    key={msg?._id || index}
                    ref={isLast ? lastMessageRef : null}
                    className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-xl shadow text-sm
                        ${isMe
                          ? "bg-[#005c4b] text-white rounded-br-none"
                          : "bg-[#202c33] text-gray-200 rounded-bl-none"
                        }`}
                    >
                      {msg.message}

                      <div className="text-[10px] text-gray-300 mt-1 text-right">
                        {new Date(msg?.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

       
          <form onSubmit={handleSubmit} className="px-4 py-2">
            <div className="w-full flex items-center bg-[#202c33] rounded-full px-4 py-2 shadow-lg">
              <input
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                required
                type="text"
                placeholder="Message"
                className="w-full bg-transparent text-white outline-none"
              />

              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner text-indigo-400"></div>
                ) : (
                  <IoSend size={24} className="text-green-500 hover:text-green-400 cursor-pointer" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
*/


/*
Zustand is a state management library for React. It gives you a global store that any component can access without prop drilling. In your app:

Sidebar sets the selectedConversation when you click on a user.

MessageContainer reads selectedConversation to know which chat to show.

Both components share the same state via Zustand, without needing to pass props through parent components.
*/
