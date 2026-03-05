YapChat

A simple real-time public chat application built with Node.js, Socket.IO, Express, and MongoDB Atlas.
Users can join the chat with a username, send messages instantly, and view previous chat history stored in the database.

🚀 Features

Real-time messaging using Socket.IO

Username join system

Live online user count

Join / leave notifications

Persistent chat history stored in MongoDB

Automatically loads last 50 messages

Simple responsive UI

Deployed online using Render

🛠 Tech Stack

Frontend

HTML

CSS

Socket.IO client

Backend

Node.js

Express

Socket.IO

Database

MongoDB Atlas

Mongoose

Deployment

Render

📂 Project Structure
yapchat/
│
├── server.js        # Express + Socket.IO server
├── index.html       # Frontend chat interface
├── package.json
├── .env             # Environment variables
└── README.md
⚙️ Installation

Clone the repository:

git clone https://github.com/yourusername/yapchat.git
cd yapchat

Install dependencies:

npm install

Create a .env file:

MONGODB_URI=your_mongodb_connection_string

Start the server:

node server.js

Then open:

http://localhost:3000
