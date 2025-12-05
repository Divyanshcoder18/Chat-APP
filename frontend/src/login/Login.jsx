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
*/
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      const login = await axios.post(`/api/auth/login`, userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.success(data.message);
      localStorage.setItem('chatapp', JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Login to <span className="text-indigo-400 font-semibold">Chatters</span>
        </p>

        <form onSubmit={handelSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              onChange={handelInput}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={handelInput}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="pt-6 text-center">
          <p className="text-gray-400">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 font-bold underline hover:text-indigo-300 transition-colors"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
