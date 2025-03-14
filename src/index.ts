import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({
  port: 8082,
  perMessageDeflate: false, 
});

let usercnt = 0;
const allsocket = new Set<WebSocket>(); 

wss.on("connection", (socket) => {
  allsocket.add(socket);
  usercnt++;
  console.log(`User connected. Active users: ${usercnt}`);

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast message to all clients except sender
    allsocket.forEach((s) => {
      if (s !== socket && s.readyState === WebSocket.OPEN) {
        s.send(`${message} from a user`);
      }
    });
  });

  socket.on("close", () => {
    allsocket.delete(socket);
    usercnt--;
    console.log(`User disconnected. Active users: ${usercnt}`);
  });

  socket.on("error", (error) => {
    console.error("WebSocket Error:", error);
  });
});
