const express = require("express");
const Room = require("../db/Schemas/Rooms");
const auth = require("../authenticate");

const roomRouter = express.Router();

roomRouter.get("/all", async (req, res) => {
    const allrooms = await Room.find({});
    return res.json({ rooms: allrooms });
});

roomRouter.post("/create",auth, async (req, res) => {
    const {name, image, description} = req.body;
    const room = new Room({
        name,
        image,
        description,
    });
    room.members.push(req.userd._id)

    console.log(room);
    try {  
        await room.save();
        return res.json({ message: "Room created successfully", room });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error creating room" });
    }
});

module.exports = roomRouter