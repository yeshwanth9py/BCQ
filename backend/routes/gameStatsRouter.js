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
        const profiled = await Profilemodel.findOne({ _id: pid })
        .populate({
          path: 'previousGames',
          options: { sort: { toi: -1 } }
        });
        console.log(profiled);
        res.json({gamed:profiled.previousGames, uid:userDetails._id});
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});


gameStatsRouter.post("/", async (req, res) => {
    try{
        // const uname = req.params.uname;
        console.log("came here 3")
        tempmaxsc = 0
        tempwinner = "None"
        console.log("data",req.body.data);
        for(let uid in req.body.data){
            if(req.body.data[uid].score > tempmaxsc){
                tempmaxsc = req.body.data[uid].score;
                tempwinner = req.body.data[uid].username;
            }
        }

        const gameStats = new GameStats({
            toi: req.body.toi,
            roomno: req.body.roomno,
            data: req.body.data,
            winner: tempwinner,
            maxsc: tempmaxsc,
            gametype: req.body.gametype
        });
        
        await gameStats.save();
        console.log("game stats", gameStats);

        // [data.ccuid]: {
        //     username: data.username,
        //     avatar: data.avatar,
        //     score: 0,
        //     attempted: 0,
        //     correct: 0
        // }

        for(let uid in req.body.data){
            console.log(uid);
            const userd = await User.findById(uid);
            console.log(userd);
            const pid = userd.profile;
            const profiled = await Profilemodel.findOne({_id:pid});
            profiled.previousGames.push(gameStats._id);
            const saveddetails = await profiled.save();
        }


        res.json(gameStats);
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});

module.exports = gameStatsRouter;