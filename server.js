const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MongoDB Connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chatuser:chat1234@cluster0.yxrbiwr.mongodb.net/?appName=Cluster0');
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Message Schema & Model
const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const Message = mongoose.model('Message', messageSchema);

let onlineUsers = 0;
let usernames = {};

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', async (socket) => {
  console.log("User Connected:", socket.id);

  onlineUsers++;
  io.emit("user_count", onlineUsers);

  // Load last 50 messages from MongoDB
  try {
    const chatHistory = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    // Reverse to maintain chronological order
    socket.emit("chat_history", chatHistory.reverse());
  } catch (error) {
    console.error('Error loading chat history:', error.message);
    socket.emit("chat_history", []);
  }

  socket.on("user_joined", (username) => {
    usernames[socket.id] = username;
    io.emit("user_joined", username);
  });

  socket.on("send_message", async (data) => {
    try {
      // Create and save message to MongoDB
      const newMessage = new Message({
        username: data.username,
        message: data.message,
        timestamp: new Date()
      });

      await newMessage.save();

      // Broadcast to all connected clients
      io.emit("receive_message", {
        username: newMessage.username,
        message: newMessage.message,
        timestamp: newMessage.timestamp
      });
    } catch (error) {
      console.error('Error saving message:', error.message);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    const username = usernames[socket.id];
    if (username) {
      io.emit("user_disconnected", username);
      delete usernames[socket.id];
    }

    onlineUsers--;
    io.emit("user_count", onlineUsers);
  });
});

server.listen(3000, () => {
  connectDatabase();
  console.log('Server running at http://localhost:3000');
});