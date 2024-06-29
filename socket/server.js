const express = require("express");

const http = require("http");
const app = express();

const cors = require("cors");
const jwt = require("jsonwebtoken");

const socketIo = require('socket.io');

const server = http.createServer(app);


app.use(cors());
app.use(express.json());

const allrooms = []
const alluserscores = {}


const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});



io.on("connection", (socket)=>{

    console.log("new client connected", socket.id);

    socket.on("disconnect",()=>{
        console.log("client disconnected"); 
    });

    // socket.on("join", (data)=>{
    //     allrooms.push(data);
    //     console.log(allrooms);
    // });

    socket.on("updatescore", (data)=>{
        alluserscores[data.ccuid] = data.score;
        socket.broadcast.emit("readscore", data);
        console.log(alluserscores);
    });



});

const PORT = 5000;

app.get("/", (req, res)=>{ 

    res.send("server is running");

});



server.listen(PORT,()=>{
    console.log(`socket server running on port ${PORT}`);
});