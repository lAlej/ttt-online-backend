import { Rooms } from "../interfaces";
import { detectWinner, isTableEmpty } from "../utils/detectWinner";
import { generateRoomId } from "../utils/generateRoomId";

const rooms = {} as Rooms;

export const socketConection = (socket: any, io: any) => {
  socket.on("getAllRooms", () => {
    console.log("getAllRooms");
    socket.emit("allRooms", rooms);
  });

  //Create room
  socket.on(
    "createRoom",
    (roomName: string) => {
      console.log("createRoom", roomName);
      const turn = Math.random() < 0.5 ? "X" : "O";
      const roomId = generateRoomId();

      rooms[roomId] = {
        usersPlayers: [],
        usersSpectators: [],
        gameTable: [],
        firstPlayerTurn: turn,
        gameTurn: "X",
        roomName: roomName,
      };

      socket.emit("roomCreated", { success: true, roomId });
    }
  );

  //Join room
  socket.on("joinRoom", (room: string) => {
    console.log("joinRoom", room);

    socket.join(room);

    //Add user to room
    if (rooms[room].usersPlayers.length === 2) {
      rooms[room].usersSpectators.push(socket.id);
    } else {
      console.log(rooms[room].usersPlayers);
      rooms[room].usersPlayers.push(socket.id);
    }

    socket.emit("roomData", { room: rooms[room], userId: socket.id });

    socket.broadcast
      .to(room)
      .emit("userJoined", { userId: socket.id, roomData: rooms[room] });
  });

  //Update table
  socket.on("newMoveTable", ({ updateTable, room }: any) => {
    rooms[room].gameTable = updateTable;
    const winner = detectWinner(rooms[room].gameTable);

    rooms[room].gameTurn = rooms[room].gameTurn === "O" ? "X" : "O";

    //Send winner to all users
    if (winner) {
      console.log("Someone won");
      io.to(room).emit("gameOver", { winner });
    } else {
      socket.broadcast.to(room).emit("updatedTable", rooms[room].gameTable);
      io.to(room).emit("newTurn", rooms[room].gameTurn);
    }
  });

  //Leave room
  socket.on("leaveRoom", (room: string) => {
    if (rooms[room].usersPlayers.includes(socket.id)) {
      rooms[room].usersPlayers = rooms[room].usersPlayers.filter(
        (userId) => userId !== socket.id
      );
    }

    if (rooms[room].usersSpectators.includes(socket.id)) {
      rooms[room].usersSpectators = rooms[room].usersSpectators.filter(
        (userId) => userId !== socket.id
      );
    }

    if (rooms[room].usersPlayers.length === 0) {
      delete rooms[room];
      console.log("room empty");
    }

    socket.leave(room);
  });

  //Send message
  socket.on(
    "message",
    (message: { name: string; message: string; room: string }) => {
      console.log("message received on server:", message);
      socket.broadcast.to(message.room).emit("newMessage", message);
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};
