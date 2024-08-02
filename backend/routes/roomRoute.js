const express = require("express");
const Room = require("../db/Schemas/Rooms");
const auth = require("../authenticate");
const axios = require("axios");

const roomRouter = express.Router();
const roomNames = [
    "Aurora",
    "Zephyr",
    "Echo",
    "Nebula",
    "Phoenix",
    "Luna",
    "Solstice",
    "Odyssey",
    "Cascade",
    "Nimbus",
    "Starlight",
    "Quantum",
    "Eclipse",
    "Serenity",
    "Mirage",
    "Vortex",
    "Zenith",
    "Aether",
    "Mosaic",
    "Pinnacle",
    "Galactic",
    "Orbit",
    "Cosmos",
    "Meteor",
    "Asteroid",
    "Comet",
    "Galaxy",
    "Starship",
    "Satellite",
    "Supernova",
    "Pulsar",
    "Celestial",
    "Astral",
    "Nebular",
    "Quasar",
    "Stardust",
    "Event Horizon",
    "Black Hole",
    "Solaris",
    "Horizon"
];


const roomimages = ["https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2V8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1562571046-d34f606e7693?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxNzQyMzYyfHxlbnwwfHx8fHw%3D", "https://images.unsplash.com/photo-1614121181207-4b6c334d353d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwzNzE0MzQyOXx8ZW58MHx8fHx8", "https://images.unsplash.com/photo-1559513455-6b937d16d16a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0ODY3NzA2fHxlbnwwfHx8fHw%3D", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Mnw0ODY3NzA2fHxlbnwwfHx8fHw%3D", "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3w0ODY3NzA2fHxlbnwwfHx8fHw%3D"]

roomRouter.get("/all", async (req, res) => {
    const allrooms = await Room.find();
    return res.json({ rooms: allrooms });
});

roomRouter.get("/filter/:filter", auth, async (req, res) => {
    const filterVal = req.params.filter;

    const filteredRooms = await Room.find({
        $or: [
            { name: { $regex: filterVal, $options: 'i' } }, // Case-insensitive match for username
            { description: { $regex: filterVal, $options: 'i' } }, // Case-insensitive match for description
            { CreatedBy: { $regex: filterVal, $options: 'i' } } // Case-insensitive match for createdBy
        ]
    });

    return res.json({ rooms: filteredRooms });
});

roomRouter.patch("/:id", async (req, res) => {
    const  roomId  = req.params.id;
    
    console.log("changing the status");
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, { ingame: true }, { new: true });
        console.log(updatedRoom);
        return res.json({ message: "Room updated successfully", room: updatedRoom });
    } catch (err) {
        console.error(err);
    }
});

roomRouter.patch("/finish/:id", async (req, res) => {
    const  roomId  = req.params.id;
    console.log("changing the status");
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, { ingame: false }, { new: true });
        console.log(updatedRoom);   
        return res.json({ message: "Room updated successfully", room: updatedRoom });
    } catch (err) {
        console.error(err);
    }
});




roomRouter.post("/create", auth, async (req, res) => {
    console.log(req.userd.username);

    const { roomName, gameType, numPlayers, roomPassword = "", timeLimit, difficultyLevel, categories, rulesInstructions="", isPrivate = false } = req.body;

    const room = new Room({
        name: roomName || roomNames[Math.floor(Math.random() * roomNames.length)],
        description: rulesInstructions,
        roomImg: roomimages[Math.floor(Math.random() * roomimages.length)],
        gameType: gameType,
        numPlayers: numPlayers || 12,
        timeLimit: timeLimit,
        difficultyLevel: difficultyLevel,
        categories: categories,
        CreatedBy: req.userd.username,
        private: isPrivate,
        password: roomPassword,
        members: [String(req.userd._id)],
        Status: isPrivate ? "private room" : "open to anyone"
    });

    // room.members.push(req.userd._id)

    console.log("room creating:",room);
    try {
        await room.save();
        return res.json({ message: "Room created successfully", room });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error creating room" });
    }
});


roomRouter.get("/quickmatch", async (req, res) => {
    const rooms = await Room.find({ Status: "open to anyone" });
    console.log("rooms", rooms)
    if (rooms.length > 0) {
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        return res.json({ roomid: randomRoom._id });
    } else {
        console.log("creating a random room...");
        if (!req.cookies.token) {
            return res.status(401).json({ message: "unauthorized access" });
        }
        try {
            const roomd = await axios.post("http://localhost:3000/app/rooms/create", {
                roomName: `${roomNames[Math.floor(Math.random() * roomNames.length)]}`,
                gameType: "Quick match",
                timeLimit: 160,
                Status: "open to anyone",
                CreatedBy: "Quick match",
            }, {
                "headers": {
                    "auth-token": req.cookies.token
                }
            });
            console.log(roomd.data);

            return res.json({ roomid: roomd.data.room._id });
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({ message: "Error creating room" });
        }
    }
});


roomRouter.post("/join", auth, async (req, res) => {
    console.log("kjhghjk")
    const { roomno } = req.body;
    const room = await Room.findById(roomno);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    // if(room.private && room.password != req.body.passwordentered) {
    //     return res.status(404).json({ message: "Room not found" });
    // }
    room.members.push(req.userd._id)
    try {
        await room.save();
        return res.json({ message: "Room joined successfully", room });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error joining room" });
    }
});

roomRouter.post("/canjoin", async (req, res) => {
    const roomid = req.body.roomid;
    const room = await Room.findById(roomid);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    if (room.private && room.password != req.body.password) {
        return res.status(404).json({ message: "Room not found" });
    }
    return res.json({ message: "Room joined successfully", room });
})


roomRouter.post("/exitroom", auth, async (req, res) => {
    const { roomno } = req.body;
    const room = await Room.findById(roomno);
    if (!room) {
        console.log("came2")
        return res.json({ message: "Room exited successfully", room });
    }
    room.members.pop(req.userd._id)
    try {
        await room.save();
        return res.json({ message: "Room exited successfully", room });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error joining room" });
    }
});

roomRouter.delete("/:roomid", auth, async (req, res) => {
    const { roomid } = req.params;
    const room = await Room.findById(roomid);
    if (!room) {
        return res.json({ message: "Room deleted successfully" });
    }
    try {
        await Room.findByIdAndDelete(roomid);
        return res.json({ message: "Room deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error deleting room" });
    }
});

roomRouter.get("/:roomid", async (req, res) => {
    try {
        const { roomid } = req.params;
        const room = await Room.findById(roomid);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.json({ room });
    } catch (err) {
        return res.status(400).json({ message: "Error getting room" });
    }
});




module.exports = roomRouter