/*import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
       origin:['https://slrtech-chatapp.onrender.com'],
    // origin:[ "http://localhost:3000"] , 
        methods:["GET","POST"]
    }
});

export const getReciverSocketId = (receverId)=>{
    return userSocketmap[receverId];
};

const userSocketmap={}; //{userId,socketId}
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId !== "undefine") userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

export {app , io , server}
*/

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
    
      "https://divyansh-chat-app-tkuh.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
   pingTimeout: 60000,   // prevents disconnect on Render
  pingInterval: 25000,  // keeps socket alive
});

const userSocketMap = {}; // userId -> socket.id

export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("🔥 User connected:", socket.id, "UserId:", userId); // <-- IMPORTANT LOG

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 📩 LISTEN FOR MESSAGE FROM SENDER
  socket.on("sendMessage", (data) => {
    console.log("📩 Received sendMessage:", data);

    const receiverSocketId = userSocketMap[data.receiverId];

    console.log("➡️ Receiver socket:", receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", data);
      console.log("📨 Forwarded to receiver:", receiverSocketId);
    }
  });

  // ❌ USER DISCONNECTED
  socket.on("disconnect", () => {
    console.log("⚠️ User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
