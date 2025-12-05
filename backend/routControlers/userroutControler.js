/*import bcryptjs from "bcryptjs";
import User from "../Models/userModels.js";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } = req.body;

    // Check if user exists by username OR email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    if (!newUser) {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }

    jwtToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email does not exist. Please register." });
    }

    const comparepass = await bcryptjs.compare(password, user.password);
    if (!comparepass) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    jwtToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
*/

import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs'
import jwtToken from '../utils/jwtwebToken.js'

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        console.log(req.body);
        const user = await User.findOne({ username, email });
        if (user) return res.status(500).send({ success: false, message: " UserName or Email Alredy Exist " });
        const hashPassword = bcryptjs.hashSync(password, 10);
       const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
   
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl
        })

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res)
        } else {
            res.status(500).send({ success: false, message: "Inavlid User Data" })
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(500).send({ success: false, message: "Email Dosen't Exist Register" })
        const comparePasss = bcryptjs.compareSync(password, user.password || "");
        if (!comparePasss) return res.status(500).send({ success: false, message: "Email Or Password dosen't Matching" })
        
        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email:user.email,
            message: "Succesfully LogIn"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}


export const userLogOut=async(req,res)=>{
    
    try {
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({success:true ,message:"User LogOut"})

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

