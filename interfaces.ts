export interface Room {
  usersPlayers: string[];
  usersSpectators: string[];
  gameTable: any[];
  firstPlayerTurn: "X" | "O";
  gameTurn: "X" | "O" 
  roomName: string
}

export interface Rooms {
  [key: string]: Room;
}