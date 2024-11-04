import { expressMiddleware } from "./middlewares";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Rooms } from "./interfaces";
import { socketConection } from "./server/socketConection";
const cors = require("cors");

const PORT = process.env.PORT || 3001;

// inicia Express y server HTTP
const app = express();
const server = http.createServer(app);

// configura CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// configura socketIO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  socketConection(socket, io);
});

app.use("/trpc", expressMiddleware);

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
