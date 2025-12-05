/*import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; 
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("✅ Login success:", res.data);

      // Update global auth state
      login(res.data);

      // Persist in localStorage (consistent key!)
      localStorage.setItem("chatUser", JSON.stringify(res.data));

      // Navigate to chat page
      navigate("/chat");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-sm space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Login to continue to Chatters
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
*/import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handelInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const login = await axios.post("/api/auth/login", userInput);
      const data = login.data;

      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">

      {/* BG Circles */}
      <div className="absolute w-72 h-72 bg-purple-500/30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* Card */}
      <div className="w-full max-w-md p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl relative z-10 animate-[fadeIn_0.6s_ease]">

        <h1 className="text-center text-4xl font-extrabold text-white mb-3 tracking-wide drop-shadow-lg">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Login to
          <span className="font-bold text-indigo-400"> Chatters</span>
        </p>

        <form onSubmit={handelSubmit} className="space-y-7">
          <div>
            <label className="text-gray-200 font-semibold mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              onChange={handelInput}
              placeholder="Enter Email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
            />
          </div>

          <div>
            <label className="text-gray-200 font-semibold mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              onChange={handelInput}
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30 focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 font-bold text-white text-lg shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02]"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-8">
          Don’t have an account?{" "}
          <Link
            className="text-indigo-400 hover:text-indigo-300 font-bold underline"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
