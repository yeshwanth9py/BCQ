const express = require("express");
const Room = require("../db/Schemas/Rooms");
const auth = require("../authenticate");

const roomRouter = express.Router();

roomRouter.get("/all", async (req, res) => {
    const allrooms = await Room.find({});
    return res.json({ rooms: allrooms });
});

roomRouter.get("/filter/:filter",auth, async (req, res) => {
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

roomRouter.post("/create",auth, async (req, res) => {
    console.log(req.userd.username)
    const {roomName, gameType, numPlayers,roomPassword, timeLimit, difficultyLevel, categories, rulesInstructions, isPrivate } = req.body;
    
    const room = new Room({
        name: roomName,
        description: rulesInstructions,
        gameType: gameType,
        numPlayers: numPlayers,
        timeLimit: timeLimit,
        difficultyLevel: difficultyLevel,
        categories: categories,
        CreatedBy: req.userd.username,
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


roomRouter.post("/join", auth, async (req, res) => {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);
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

module.exports = roomRouter