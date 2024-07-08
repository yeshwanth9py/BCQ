const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const socketIo = require('socket.io');

const axios = require("axios");
// const GameStats = require("../backend/db/Schemas/Gamestats");
// const User = require("../backend/db/Schemas/User");
// const Profilemodel = require("../backend/db/Schemas/Profile");

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const allrooms = {};
const allwaitingrooms = {};
const toi = {};

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const DATA_EXPIRY_TIME = 10*1000; // 10 SECONDS
let tid;
function setExpiry(roomno, collection) {
    console.log("will be storing in 3 mins", allrooms[roomno]);
    clearTimeout(tid);
    tid = setTimeout(async () => {
        if (collection === "allrooms" && allrooms[roomno]) {
            console.log("is getting saved...");
            await axios.post("http://localhost:3000/app/gamestats", { toi: toi[roomno], roomno: roomno, data: allrooms[roomno] });
            delete allrooms[roomno];
            setExpiry(roomno, "allwaitingrooms");
        } else if (collection === "allwaitingrooms" && roomno in Object.keys(allwaitingrooms)) {
            delete allwaitingrooms[roomno];
        }
        
    }, DATA_EXPIRY_TIME);
}

io.on("connection", (socket) => {
    // console.log("new client connected", socket.id);
    socket.on("sglobal", (data)=>{
        socket.broadcast.emit("rglobal", data);
    });

    socket.on("disconnect", () => {
        // console.log("client disconnected");
    });

    socket.on("joinroom", (data) => {
        // console.log(allwaitingrooms[data.roomno]);

        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                username: data.username,
                avatar: data.avatar,
                isReady: false,

            }
        };

        

        socket.join(data.roomno);
        // setExpiry(data.roomno, "allwaitingrooms");

        io.to(data.roomno).emit("someonejoined", allwaitingrooms[data.roomno]);

        // Set expiry for the waiting room data
    });

    socket.on("ready", (data) => {
        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                ...allwaitingrooms[data.roomno][data.ccuid],
                isReady: true
            }
        };
        // console.log(allwaitingrooms);
        io.to(data.roomno).emit("readyb", allwaitingrooms[data.roomno]);
    });

    socket.on("cancelready", (data) => {
        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                ...allwaitingrooms[data.roomno][data.ccuid],
                isReady: false
            }
        };

        io.to(data.roomno).emit("cancelb", allwaitingrooms[data.roomno]);
    });

    socket.on("chat-message", (data) => {
        io.to(data.roomno).emit("receive-msg", {message:data.message, username: data.username});
    })

    socket.on("join", (data) => {
        // console.log("before joining room", data);

        allrooms[data.roomno] = {
            ...allrooms[data.roomno],
            [data.ccuid]: {
                username: data.username,
                avatar: data.avatar,
                score: 0,
                attempted: 0,
                correct: 0
            }
        };

        toi[data.roomno] = Date.now();
    
        // console.log(data.ccuid, "has joined", data.roomno);
        // console.log("allrooms", allrooms);

        socket.join(data.roomno);
        
        // Set expiry for the room data
        // setExpiry(data.roomno, "allrooms");
    });

    socket.on("updatescore", (data) => {
        allrooms[data.roomno] = {
            ...allrooms[data.roomno],
            [data.ccuid]: {
                ...allrooms[data.roomno][data.ccuid],
                score: data.score,
                attempted: data.attempted,
                correct: data.correct
            }
        };

        io.to(data.roomno).emit("readscore", allrooms[data.roomno]);
        // console.log(allrooms);
    });

    socket.on("user-disconnect", (data) => {
        // console.log(data);

        if (data.roomno in allwaitingrooms && data.ccuid in allwaitingrooms[data.roomno]) {
            delete allwaitingrooms[data.roomno][data.ccuid];
            io.to(data.roomno).emit("someonejoined", allwaitingrooms[data.roomno]);
        }

        // console.log("allrooms", allrooms);

    });
});

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("server is running");
});


app.get("/app/gameover/:id", (req, res) => {
    clearTimeout(tid);
    setExpiry(req.params.id, "allrooms");   
    res.json(allrooms[req.params.id]);
});


server.listen(PORT, () => {
    console.log(`socket server running on port ${PORT}`);
});
