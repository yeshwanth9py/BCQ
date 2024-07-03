const express = require("express");

const http = require("http");
const app = express();

const cors = require("cors");
const jwt = require("jsonwebtoken");

const socketIo = require('socket.io');

const server = http.createServer(app);


app.use(cors());
app.use(express.json());

const allrooms = {};


// {
//     roomno1: {
//         user1: {
//             name: "username1",
//             avatar:"",
//             score: 0
//         },
//         user2:{
//             name: "username2".
//             avatar: "",
//             score: 0
//         }
//     },
//     roomno2: {
//         user1: {
//             name: "username1",
//             avatar:"",
//             score: 0
//         },
//         user2:{
//             name: "username2".
//             avatar: "",
//             score: 0
//         }
//     }
// }
        
let allwaitingrooms = {}

// roomno:{
//     user1:{
//         name: "user1",
//         isReady: false
//     },
//     user2: {
//         name: "user2",
//         isReady: false
//     }
// }


const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});



io.on("connection", (socket)=>{

    console.log("new client connected", socket.id);

    socket.on("disconnect",(data)=>{
        console.log("client disconnected");
    });

    socket.on("joinroom", (data)=>{
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
        // socket.to(data.roomno).emit("someonejoined", allwaitingrooms[data.roomno]);
        // socket.emit("someonejoined", allwaitingrooms[data.roomno]);
    });

    socket.on("ready", (data)=>{
        
        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                ...allwaitingrooms[data.roomno][data.ccuid],
                isReady: true
            }
        }

        console.log(allwaitingrooms);
        // io.to(data.roomno).emit("readyb", allwaitingrooms[data.roomno]);
        io.to(data.roomno).emit("readyb", allwaitingrooms[data.roomno]);
    });

    socket.on("cancelready", (data)=>{
        allwaitingrooms[data.roomno] = {
            ...allwaitingrooms[data.roomno],
            [data.ccuid]: {
                ...allwaitingrooms[data.roomno][data.ccuid],
                isReady: false
            }
        }

        io.to(data.roomno).emit("cancelb", allwaitingrooms[data.roomno]);

    });

    

    socket.on("join", (data)=>{

        allrooms[data.roomno] = {
            ...allrooms[data.roomno],
            [data.ccuid]: {
                username: data.username,
                avatar: data.avatar,
                score: 0
            }
        };
        console.log(data.ccuid, "has joined", data.roomno);
        console.log(allrooms);

        socket.join(data.roomno);
        
        console.log(allrooms);
    });

    socket.on("updatescore", (data)=>{

        // console.log(alluserscores[data.roomno]);

        allrooms[data.roomno] = {
            ...allrooms[data.roomno],
            [data.ccuid]: {
                ...allrooms[data.roomno][data.ccuid],
                score: data.score
            }
        };

        io.to(data.roomno).emit("readscore", allrooms[data.roomno][data.ccuid]);
        // socket.broadcast.emit("readscore", alluserscores[data.roomno]);

        // socket.broadcast.to(data.roomno).emit("readscore", allrooms[data.roomno][data.ccuid]);
        // io.to(data.roomno).emit('readscore', allrooms[data.roomno]);

        console.log(allrooms);
    });

    // user-disc

    socket.on("user-disconnect", (data)=>{
        console.log(data);

        // delete allrooms[data.roomno][data.ccuid];
        delete allwaitingrooms[data.roomno][data.ccuid];
        io.to(data.roomno).emit("someonejoined", allwaitingrooms[data.roomno]);

        // io.to(data.roomno).emit("user-disc", data);

        // io.to(data.roomno).emit('readscore', allrooms[data.roomno]);

        console.log(allrooms);

        

    });

});

const PORT = 5000;

app.get("/", (req, res)=>{ 

    res.send("server is running");

});



server.listen(PORT,()=>{
    console.log(`socket server running on port ${PORT}`);
});