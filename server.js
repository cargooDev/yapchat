const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let messageHistory=[];
let onlineUsers=0;
let usernames={};

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log("User Connected:", socket.id);

  onlineUsers++;
  io.emit("user_count",onlineUsers);

  socket.emit("chat_history",messageHistory); 

  socket.on("user_joined", (username) => {
    usernames[socket.id] = username;
    io.emit("user_joined", username);
  });

  socket.on("send_message", (data) => {
    messageHistory.push(data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
    
    const username = usernames[socket.id];
    if(username) {
      io.emit("user_disconnected", username);
      delete usernames[socket.id];
    }

    onlineUsers--;
    io.emit("user_count",onlineUsers);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});