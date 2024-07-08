const express = require("express");
const http = require("http");
const app = express();

const server = http.createServer(app);


const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
}); 


io.on("connection", (socket) => {

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
});




server.listen(7000, () => {
    console.log("Server running on port 7000");
});