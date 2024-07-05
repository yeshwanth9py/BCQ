const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const socketIo = require('socket.io');

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const allrooms = {};
const allwaitingrooms = {};

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const DATA_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

function setExpiry(roomno, collection) {
    setTimeout(() => {
        if (collection === "allrooms" && roomno in Object.keys(allrooms)) {
            delete allrooms[roomno];
        } else if (collection === "allwaitingrooms" && roomno in Object.keys(allwaitingrooms)) {
            delete allwaitingrooms[roomno];
        }
        console.log(`Data for room ${roomno} in ${collection} has expired.`);
    }, DATA_EXPIRY_TIME);
}

io.on("connection", (socket) => {
    console.log("new client connected", socket.id);

    socket.on("disconnect", () => {
        console.log("client disconnected");
    });

    socket.on("joinroom", (data) => {
        console.log(allwaitingrooms[data.roomno]);

        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                username: data.username,
                avatar: data.avatar,
                isReady: false
            }
        };

        socket.join(data.roomno);
        io.to(data.roomno).emit("someonejoined", allwaitingrooms[data.roomno]);

        // Set expiry for the waiting room data
        setExpiry(data.roomno, "allwaitingrooms");
    });

    socket.on("ready", (data) => {
        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                ...allwaitingrooms[data.roomno][data.ccuid],
                isReady: true
            }
        };

        console.log(allwaitingrooms);
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

    socket.on("join", (data) => {
        console.log("before joining room", data);

        allrooms[data.roomno] = {
            ...allrooms[data.roomno],
            [data.ccuid]: {
                username: data.username,
                avatar: data.avatar,
                score: 0
            }
        };
    
        console.log(data.ccuid, "has joined", data.roomno);
        console.log("allrooms", allrooms);

        socket.join(data.roomno);
        
        // Set expiry for the room data
        setExpiry(data.roomno, "allrooms");
    });

    socket.on("updatescore", (data) => {
        allrooms[data.roomno] = {
            ...allrooms[data.roomno],
            [data.ccuid]: {
                ...allrooms[data.roomno][data.ccuid],
                score: data.score
            }
        };

        io.to(data.roomno).emit("readscore", allrooms[data.roomno]);
        console.log(allrooms);
    });

    socket.on("user-disconnect", (data) => {
        console.log(data);

        if (data.roomno in allwaitingrooms && data.ccuid in allwaitingrooms[data.roomno]) {
            delete allwaitingrooms[data.roomno][data.ccuid];
            io.to(data.roomno).emit("someonejoined", allwaitingrooms[data.roomno]);
        }

        console.log("allrooms", allrooms);

    });
});

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("server is running");
});


app.get("/app/gameover/:id", (req, res) => {
    setExpiry()
    res.json(allrooms[req.params.id]);
});


server.listen(PORT, () => {
    console.log(`socket server running on port ${PORT}`);
});
