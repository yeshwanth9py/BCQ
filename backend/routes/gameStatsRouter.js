const mongoose = require("mongoose");
const express = require("express");
const GameStats = require("../db/Schemas/Gamestats");
const User = require("../db/Schemas/User");
const Profilemodel = require("../db/Schemas/Profile");
const gameStatsRouter = express.Router();


gameStatsRouter.get("/:id", async (req, res) => {
    try{
        console.log("came")
        const uname = req.params.id;
        const userDetails = await User.findOne({ username: uname });
        const pid = userDetails.profile;
        const profiled = await Profilemodel.findOne({_id:pid}).populate("previousGames");
        console.log(profiled);
        res.json(profiled.previousGames);
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});


gameStatsRouter.post("/", async (req, res) => {
    try{
        // const uname = req.params.uname;
        const gameStats = new GameStats({
            toi: req.body.toi,
            roomno: req.body.roomno,
            data: req.body.data
        });
        await gameStats.save();

        for(let uid in req.body.data){
            console.log(uid);
            const userd = await User.findById(uid);
            console.log(userd);
            const pid = userd.profile;
            const profiled = await Profilemodel.findOne({_id:pid});
            profiled.previousGames.push(gameStats._id);
            const saveddetails = await profiled.save();
            console.log("profiled",saveddetails);
        }
        res.json(gameStats);
    } catch(err){
        console.error(err.message);
        return res.status(400).json(err);
    }
});

module.exports = gameStatsRouter;