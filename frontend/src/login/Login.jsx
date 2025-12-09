import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
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
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-text-primary mb-2">Login.</h1>
          <p className="text-text-secondary text-lg">Welcome back to the future.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Email</label>
            <input
              id="email"
              type="email"
              required
              onChange={handleInput}
              className="w-full bg-transparent border-b border-border py-2 text-text-primary text-lg focus:outline-none focus:border-text-primary transition-colors placeholder:text-text-secondary/50"
              placeholder="name@example.com"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Password</label>
            <input
              id="password"
              type="password"
              required
              onChange={handleInput}
              className="w-full bg-transparent border-b border-border py-2 text-text-primary text-lg focus:outline-none focus:border-text-primary transition-colors placeholder:text-text-secondary/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full py-4 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "ENTER"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-10 text-center">
          <p className="text-sm text-text-secondary">
            New here?{" "}
            <Link
              to="/register"
              className="text-text-primary font-bold hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
