/*import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../Zustand/useConversation";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { setSelectedConversation } = userConversation();

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          console.log(data.message);
        } else {
          setChatUser(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    chatUserHandler();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        console.log(data.message);
      } else if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
  };

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogOut = async () => {
    const confirmlogout = window.prompt("Type your username to logout");
    if (confirmlogout === authUser.username) {
      try {
        const logout = await axios.post("/api/auth/logout");
        toast.info(logout.data?.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.info("Logout Cancelled");
    }
  };

  // ✅ Rendering with if...else
  let content;
  if (loading) {
    content = (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-600"></div>
      </div>
    );
  } else if (searchUser.length > 0) {
    content = (
      <>
        {searchUser.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition ${
              selectedUserId === user._id ? "bg-indigo-200" : ""
            }`}
          >
            <img
              src={user.profilepic}
              alt="user"
              className="w-8 h-8 rounded-full border"
            />
            <p className="font-medium text-gray-800 text-sm">{user.username}</p>
          </div>
        ))}
        <button
          onClick={handleSearchBack}
          className="mt-2 flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600"
        >
          <IoArrowBackSharp size={14} /> Back
        </button>
      </>
    );
  } else if (chatUser.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center text-gray-500 h-full">
        <p className="font-medium text-sm">No chats yet 🤔</p>
        <p className="text-xs">Search for a user to start chatting</p>
      </div>
    );
  } else {
    content = (
      <>
        {chatUser.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition ${
              selectedUserId === user._id ? "bg-indigo-200" : ""
            }`}
          >
            <img
              src={user.profilepic}
              alt="user"
              className="w-8 h-8 rounded-full border"
            />
            <p className="font-medium text-gray-800 text-sm">{user.username}</p>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="h-full w-56 bg-white shadow-md rounded-lg flex flex-col">
     
      <div className="flex items-center justify-between p-2 border-b">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-gray-100 rounded-full px-2 py-1 w-full mr-2"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="flex-1 bg-transparent outline-none text-xs"
            placeholder="Search user..."
          />
          <button className="text-indigo-600 hover:text-indigo-800 text-xs">
            <FaSearch size={14} />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          alt="profile"
          className="h-8 w-8 rounded-full border-2 border-indigo-600 cursor-pointer hover:scale-105 transition"
        />
      </div>

    
      <div className="flex-1 overflow-y-auto p-1">{content}</div>

      
      <div className="p-2 border-t flex items-center gap-1">
        <button
          onClick={handleLogOut}
          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition text-xs"
        >
          <BiLogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
*/
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

      {/* HEADER: SEARCH BAR */}
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

      {/* SEARCH RESULTS */}
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

                  {/* GREEN DOT */}
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
          {/* CHAT LIST */}
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

                    {/* GREEN DOT */}
                    {onlineUser.map(normalize).includes(normalize(user._id)) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <p className="text-white font-medium">{user.username}</p>
                  </div>

                  {/* 🔔 NEW MESSAGE BADGE */}
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

          {/* LOGOUT */}
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

