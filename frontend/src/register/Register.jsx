import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (gender) => {
    setInputData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (inputData.password !== inputData.confpassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }

    try {
      const register = await axios.post(`/api/auth/register`, inputData);
      const data = register.data;

      if (!data.success) {
        setLoading(false);
        return toast.error(data.message);
      }

      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">

      {/* Neon floating circles */}
      <div className="absolute w-80 h-80 bg-pink-500/20 blur-3xl rounded-full left-10 top-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* Form Card */}
      <div className="w-full max-w-lg p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl relative z-10 animate-[fadeIn_0.6s_ease]">

        <h1 className="text-4xl font-extrabold text-center text-white mb-2">
          Create Account
        </h1>
        <p className="text-center text-indigo-300 font-semibold mb-8 tracking-wide">
          Join <span className="text-white font-bold">Chatters</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="text-gray-200 font-semibold mb-1 block">Full Name</label>
            <input
              id="fullname"
              onChange={handleInput}
              required
              placeholder="Enter full name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-gray-200 font-semibold mb-1 block">Username</label>
            <input
              id="username"
              onChange={handleInput}
              required
              placeholder="Choose a username"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-200 font-semibold mb-1 block">Email</label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              required
              placeholder="Enter email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-200 font-semibold mb-1 block">Password</label>
            <input
              id="password"
              type="password"
              onChange={handleInput}
              required
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-200 font-semibold mb-1 block">
              Confirm Password
            </label>
            <input
              id="confpassword"
              type="password"
              onChange={handleInput}
              required
              placeholder="Re-enter password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Gender Selection */}
          <div className="flex items-center gap-6 pt-2">
            <div
              onClick={() => selectGender("male")}
              className={`cursor-pointer px-4 py-2 rounded-xl border transition-all duration-200 ${
                inputData.gender === "male"
                  ? "bg-indigo-600 border-indigo-400 text-white scale-105"
                  : "bg-white/10 border-white/30 text-gray-300 hover:bg-white/20"
              }`}
            >
              Male
            </div>

            <div
              onClick={() => selectGender("female")}
              className={`cursor-pointer px-4 py-2 rounded-xl border transition-all duration-200 ${
                inputData.gender === "female"
                  ? "bg-pink-500 border-pink-300 text-white scale-105"
                  : "bg-white/10 border-white/30 text-gray-300 hover:bg-white/20"
              }`}
            >
              Female
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.03]"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-bold underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;



/*import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate()
    const {setAuthUser} = useAuth();
    const [loading , setLoading] = useState(false);
    const [inputData , setInputData] = useState({})

    const handelInput=(e)=>{
        setInputData({
            ...inputData , [e.target.id]:e.target.value
        })
    }
console.log(inputData);
    const selectGender=(selectGender)=>{
        setInputData((prev)=>({
            ...prev , gender:selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        if(inputData.password !== inputData.confpassword.toLowerCase()){
            setLoading(false)
            return toast.error("Password Dosen't match")
        }
        try {
            const register = await axios.post(`/api/auth/register`,inputData);
            const data = register.data;
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)
                console.log(data.message);
            }
            toast.success(data?.message)
            localStorage.setItem('chatapp',JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

  return (
    <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-lg
          bg-gray-400 bg-clip-padding
           backderop-filter backdrop-blur-lg bg-opacity-0'>
  <h1 className='text-3xl font-bold text-center text-gray-300'>Register
                    <span className='text-gray-950'> Chatters </span>
                    </h1>
                    <form onSubmit={handelSubmit} className='flex flex-col text-black'>
                    <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>fullname :</span>
                            </label>
                            <input
                                id='fullname'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter Full Name'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>username :</span>
                            </label>
                            <input
                                id='username'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter UserName'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Email :</span>
                            </label>
                            <input
                                id='email'
                                type='email'
                                onChange={handelInput}
                                placeholder='Enter email'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Password :</span>
                            </label>
                            <input
                                id='password'
                                type='password'
                                onChange={handelInput}
                                placeholder='Enter password'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Conf.Password :</span>
                            </label>
                            <input
                                id='confpassword'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter Confirm password'
                                required
                                className='w-full input input-bordered h-10' />
                        </div>

                        <div
                         id='gender' className="flex gap-2">
                        <label className="cursor-pointer label flex gap-2">
                        <span className="label-text font-semibold text-gray-950">male</span>
                        <input 
                        onChange={()=>selectGender('male')}
                        checked={inputData.gender === 'male'}
                        type='checkbox' 
                        className="checkbox checkbox-info"/>
                        </label>
                        <label className="cursor-pointer label flex gap-2">
                        <span className="label-text font-semibold text-gray-950">female</span>
                        <input 
                        checked={inputData.gender === 'female'}
                        onChange={()=>selectGender('female')}
                        type='checkbox' 
                        className="checkbox checkbox-info"/>
                        </label>
                        </div>

                        <button type='submit'
                            className='mt-4 self-center 
                            w-auto px-2 py-1 bg-gray-950 
                            text-lg hover:bg-gray-900 
                            text-white rounded-lg hover: scale-105'>
                           {loading ? "loading..":"Register"}
                            </button>
                    </form>

                    <div className='pt-2'>
                        <p className='text-sm font-semibold
                         text-gray-800'>
                             Have an Acount ? <Link to={'/login'}>
                                <span
                                    className='text-gray-950 
                            font-bold underline cursor-pointer
                             hover:text-green-950'>
                                    Login Now!!
                                </span>
                            </Link>
                        </p>
                    </div>
           </div>
           </div>
  )
}

export default Register
*/