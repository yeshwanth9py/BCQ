const express = require("express");
const Room = require("../db/Schemas/Rooms");
const auth = require("../authenticate");
const axios = require("axios");

const roomRouter = express.Router();

roomRouter.get("/all", async (req, res) => {
    const allrooms = await Room.find({ private: { $ne: true } });
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
    const { roomId } = req.params.id;

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, { Status: "In game" }, { new: true });
        return res.json({ message: "Room updated successfully", room: updatedRoom });
    } catch (err) {
        console.error(err);
    }
});

roomRouter.post("/create", auth, async (req, res) => {
    console.log(req.userd.username);

    const { roomName, gameType, numPlayers, roomPassword = "", timeLimit, difficultyLevel, categories, rulesInstructions, isPrivate = false } = req.body;

    const room = new Room({
        name: roomName,
        description: rulesInstructions,
        gameType: gameType,
        numPlayers: numPlayers,
        timeLimit: timeLimit,
        difficultyLevel: difficultyLevel,
        categories: categories,
        CreatedBy: req.userd.username,
        private: isPrivate,
        password: roomPassword,
        members: [req.userd._id],
        Status: isPrivate ? "private room" : "open to anyone"
    });

    // room.members.push(req.userd._id)

    console.log(room);
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
        try {
            const roomd = await axios.post("http://localhost:3000/app/rooms/create", {
                roomName: "Quick match",
                gameType: "Quick match",
                timeLimit: 60,
                Status: "open to anyone",
                CreatedBy: "Quick match",
            }, {
                "headers": {
                    "auth-token": req.cookies.token
                }
            });

            return res.json({ roomid: roomd.data._id });
        } catch(err){
            return res.status(400).json({ message: "Error creating room" });
        }
    }
});


roomRouter.post("/join", auth, async (req, res) => {
    const { roomno } = req.body;
    const room = await Room.findById(roomno);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    room.members.push(req.userd._id)
    try {
        await room.save();
        return res.json({ message: "Room joined successfully", room });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error joining room" });
    }
});


roomRouter.post("/exitroom",auth, async (req, res) => {
    const { roomno } = req.body;
    const room = await Room.findById(roomno);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
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



module.exports = roomRouter