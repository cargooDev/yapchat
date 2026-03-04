# MongoDB Atlas Setup Guide

## Steps to Set Up MongoDB Atlas

### 1. Create a MongoDB Atlas Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for a free account

### 2. Create a Cluster
- Click "Build a Cluster"
- Choose the free tier cluster
- Select your region and cluster name
- Click "Create Cluster"
- Wait for the cluster to be deployed (5-10 minutes)

### 3. Get Your Connection String
- In the Atlas dashboard, click "Connect" on your cluster
- Select "Drivers" → "Node.js" → version 5.5 or later
- Copy the connection string

### 4. Configure Environment Variables
1. Replace the placeholder values in `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

   - `username`: Your MongoDB Atlas username
   - `password`: Your MongoDB Atlas password (URL-encode special characters: `!` → `%21`, `@` → `%40`, etc.)
   - `cluster`: Your cluster name (from the connection string)
   - `database`: Name of your database (e.g., `chatty`)

### 5. Create a Database User
- In MongoDB Atlas, go to "Database Access"
- Click "Add New Database User"
- Set username and password
- Grant access to all databases (for development)
- Click "Add User" and wait for confirmation

### 6. Whitelist Your IP (Security)
- Go to "Network Access" in MongoDB Atlas
- Click "Add IP Address"
- For development: Allow access from anywhere (0.0.0.0/0)
- For production: Add your specific IP address

### 7. Test the Connection
Run the server:
```bash
npm start
```

Or directly:
```bash
node server.js
```

You should see:
```
✓ MongoDB connected successfully
Server running at http://localhost:3000
```

## Example Connection String
```
mongodb+srv://admin:myPassword123@chatty-db.cluster.mongodb.net/chatty?retryWrites=true&w=majority
```

## Message Storage
Messages are now automatically saved to MongoDB with:
- `username`: Who sent the message
- `message`: The message content
- `timestamp`: When it was sent (ISO format)

New users will receive the last 50 messages from the database when they join! 🎉
