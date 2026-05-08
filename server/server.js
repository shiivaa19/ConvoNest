import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initilize socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (set to your frontend domain in production)
  },
}); 

// store online Users
export const userSocketMap = {} // {userId: socketId}

io.on("connection", (Socket) => {
  const userId = Socket.handshake.query.userId;
  console.log("User Connected", userId);

  if(userId) userSocketMap[userId] = Socket.id;

  // Emit online users to all connected clients (broadcast)
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  Socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })


})



//  middleware set up
app.use(express.json({limit: "4mb"}));
app.use(cors());
app.use("/api/status", (req, res) => {
    res.send("server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

await connectDB();

if(process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, ()=> {
      console.log("server is running on PORT: " + PORT);
    })
}

// Export server for Vercel
export default server;