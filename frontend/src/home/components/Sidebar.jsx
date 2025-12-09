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

  const { selectedConversation, setSelectedConversation, messages } =
    userConversation();
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
  }, [messages?.length]);

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
    setNewMessageUsers("");
  };

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;

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
    <div
      className="
        h-full w-[320px] 
        bg-gradient-to-b from-white via-[#f7f7f9] to-[#efeff3] 
        border-r border-border 
        flex flex-col 
        transition-colors duration-200
      "
    >
      {/* HEADER */}
      <div className="p-6 pb-4 bg-white/70 backdrop-blur-md shadow-sm rounded-b-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Chats
          </h1>
          <img
            onClick={() => toast.info("Profile coming soon!")}
            src={authUser?.profilepic}
            className="h-10 w-10 rounded-full border border-border cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
            alt="Profile"
          />
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="relative group">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            size={14}
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search..."
            className="
              w-full bg-white/70 border border-border 
              py-2 pl-9 pr-3 
              rounded-lg shadow-sm 
              focus:shadow-md 
              text-text-primary 
              outline-none 
              transition-all
            "
          />
        </form>
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto px-3 scrollbar-hide mt-2">
        {loading && (
          <div className="text-center p-4 text-text-secondary text-sm">
            Loading...
          </div>
        )}

        {!loading &&
          (searchUser.length > 0 ? searchUser : chatUser).map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`
                group flex items-center gap-4 p-3 mb-2 cursor-pointer 
                transition-all duration-200 border border-transparent 
                rounded-xl shadow-sm
                ${
                  selectedUserId === user._id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-[1.02]"
                    : "hover:bg-[#f1f1f5] text-text-primary hover:shadow-md"
                }
              `}
            >
              <div className="relative">
                <img
                  src={user.profilepic}
                  className="w-11 h-11 rounded-full object-cover shadow-sm"
                  alt="User"
                />
                {(onlineUser.some((id) => id.toString() === user._id.toString()) ||
                  onlineUser.map(normalize).includes(normalize(user._id))) && (
                  <span
                    className={`
                      absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 
                      ${
                        selectedUserId === user._id
                          ? "border-black dark:border-white bg-green-400"
                          : "border-white bg-green-500"
                      }
                    `}
                  ></span>
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p
                    className={`font-medium truncate ${
                      selectedUserId === user._id ? "font-semibold" : ""
                    }`}
                  >
                    {user.username}
                  </p>

                  {newMessageUsers?.senderId === user._id && (
                    <span
                      className={`
                        text-[10px] w-5 h-5 flex items-center justify-center 
                        rounded-full shadow-sm
                        ${
                          selectedUserId === user._id
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }
                      `}
                    >
                      1
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

        {!loading && chatUser.length === 0 && searchUser.length === 0 && (
          <div className="text-center mt-10 text-text-secondary text-sm">
            <p>No conversations yet.</p>
            <p className="text-xs opacity-60 mt-1">
              Search for a user to start.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-border bg-white/60 backdrop-blur-md shadow-inner mt-auto">
        <button
          onClick={searchUser.length > 0 ? handleSearchBack : handleLogout}
          className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium w-full p-2 rounded-lg"
        >
          {searchUser.length > 0 ? (
            <>
              <IoArrowBackSharp size={18} />
              <span>Back to chats</span>
            </>
          ) : (
            <>
              <BiLogOut size={18} />
              <span>Sign out</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


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
