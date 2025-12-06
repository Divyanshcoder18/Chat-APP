import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustans/useConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const {messages , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
    const { onlineUser , socket} = useSocketContext();

    const nowOnline = chatUser.map((user)=>(user._id));
    //chats function
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            setNewMessageUsers(newMessage)
        })
        return ()=> socket?.off("newMessage");
    },[socket,messages])

    //show user with u chatted
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])
    
    //show user from the search result
    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    //show which user is selected
    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    //back from search result
    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    //logout
    const handelLogOut = async () => {

        const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("LogOut Cancelled")
        }

    }

    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handelSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full '>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-transparent outline-none rounded-full'
                        placeholder='search user'
                    />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-12 w-12 hover:scale-110 cursor-pointer' />
            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {searchUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handelUserClick(user)}
                                        className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                            } `}>
                                        {/*Socket is Online*/}
                                        <div className={`avatar ${isOnline[index] ? 'online':''}`}>
                                            <div className="w-12 rounded-full">
                                                <img src={user.profilepic} alt='user.img' />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='divider divide-solid px-3 h-[1px]'></div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handSearchback} className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowBackSharp size={25} />
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                        <h1>Why are you Alone!!🤔</h1>
                                        <h1>Search username to chat</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handelUserClick(user)}
                                                className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                                    } `}>

                                                {/*Socket is Online*/}
                                                <div className={`avatar ${isOnline[index] ? 'online':''}`}>
                                                    <div className="w-12 rounded-full">
                                                        <img src={user.profilepic} alt='user.img' />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-gray-950'>{user.username}</p>
                                                </div>
                                                    <div>
                                                     { newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user._id ?
    <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1</div>
    : null
}

                                                    </div>
                                            </div>
                                            <div className='divider divide-solid px-3 h-[1px]'></div>
                                        </div>
                                    )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handelLogOut} className='hover:bg-red-600  w-10 cursor-pointer hover:text-white rounded-lg'>
                            <BiLogOut size={25} />
                        </button>
                        <p className='text-sm py-1'>Logout</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar
/*
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../Zustans/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");

  const { setSelectedConversation } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const normalize = (id) => String(id);

  // 🚀 NEW MESSAGE LISTENER
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      setNewMessageUsers(data);
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket]);

  // 🚀 LOAD CHAT USERS
  useEffect(() => {
    const loadChatters = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/user/currentchatters`);
        setChatUser(res.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    loadChatters();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/user/search?search=${searchInput}`);
      setSearchUser(res.data);
      if (res.data.length === 0) toast.info("User Not Found");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers(""); // reset new-message bubble
  };

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogout = async () => {
    const confirm = window.prompt("Type your username to LOGOUT");

    if (confirm !== authUser.username) return toast.info("Logout cancelled");

    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("chatapp");
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-[320px] bg-[#1a1a1d]/70 backdrop-blur-xl 
      border-r border-white/10 shadow-xl flex flex-col p-4">

      
      <div className="flex items-center gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-grow items-center bg-white/10 
            backdrop-blur-lg rounded-2xl px-4 py-2 shadow-inner"
        >
          <FaSearch className="text-gray-300 mr-2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search user..."
            className="bg-transparent text-white w-full outline-none placeholder:text-gray-400"
          />
        </form>

        <img
          onClick={() => navigate(`/profile/${authUser._id}`)}
          src={authUser?.profilepic}
          className="h-12 w-12 rounded-full object-cover shadow-lg hover:scale-110 cursor-pointer transition-all"
        />
      </div>

      <div className="mt-4 border-b border-white/10"></div>

      {searchUser.length > 0 ? (
        <>
          <div className="mt-3 flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
            {searchUser.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-4 p-3 rounded-xl 
                  bg-white/5 hover:bg-white/10 cursor-pointer transition-all
                  ${selectedUserId === user._id ? "bg-purple-600/40" : ""}`}
              >
                <div className="relative w-12 h-12">
                  <img src={user.profilepic} className="w-full h-full rounded-full object-cover" />

                 
                  {onlineUser.map(normalize).includes(normalize(user._id)) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></span>
                  )}
                </div>

                <p className="text-white font-medium">{user.username}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleSearchBack}
            className="mt-3 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2"
          >
            <IoArrowBackSharp size={20} />
            Back
          </button>
        </>
      ) : (
        <>
         
          <div className="mt-4 flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
            {chatUser.length === 0 ? (
              <div className="text-center text-gray-300 mt-10">
                <h1 className="text-xl font-semibold">You have no chats yet 😕</h1>
                <p>Search a username to start chatting.</p>
              </div>
            ) : (
              chatUser.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className={`flex items-center gap-4 p-3 rounded-xl 
                    transition-all bg-white/5 hover:bg-white/10 cursor-pointer
                    ${selectedUserId === user._id ? "bg-purple-600/40" : ""}`}
                >
                  <div className="relative w-12 h-12">
                    <img src={user.profilepic} className="w-full h-full rounded-full object-cover" />

                   {onlineUser.some(id => id.toString() === user._id.toString()) && (
  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></span>
)}

                  </div>

                  <div className="flex flex-col flex-1">
                    <p className="text-white font-medium">{user.username}</p>
                  </div>

               
                  {newMessageUsers?.receiverId === authUser._id &&
                    newMessageUsers?.senderId === user._id && (
                      <span className="bg-green-600 text-white text-sm px-2 rounded-full">
                        +1
                      </span>
                    )}
                </div>
              ))
            )}
          </div>

       
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mt-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-4 py-2 rounded-xl"
          >
            <BiLogOut size={22} />
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
*/
