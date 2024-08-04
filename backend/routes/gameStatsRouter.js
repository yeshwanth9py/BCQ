const mongoose = require("mongoose");
const express = require("express");
const GameStats = require("../db/Schemas/Gamestats");
const User = require("../db/Schemas/User");
const Profilemodel = require("../db/Schemas/Profile");
const gameStatsRouter = express.Router();


gameStatsRouter.get("/:id", async (req, res) => {
    try {
      const uname = req.params.id;
      const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1 if not provided
      console.log("oage", page)
      const limit = 10; // Number of items per page
      const skipCount = (page) * limit; // Calculate the number of items to skip
  
      const userDetails = await User.findOne({ username: uname });
      const pid = userDetails.profile;
  
      const profiled = await Profilemodel.aggregate([
        { $match: { _id: pid } },
        {
          $project: {
            previousGames: { $slice: ["$previousGames", skipCount, limit] }
          }
        }
      ]).exec();
  
      // Populate the previousGames array with additional data
      const populatedGames = await Profilemodel.populate(profiled, {
        path: 'previousGames',
        options: { sort: { toi: -1 } } // Sort options, adjust as needed
      });
  
      console.log(populatedGames);
      res.json({ gamed: populatedGames[0].previousGames, uid: userDetails._id });
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  });
  
const ranks =  ['Noob', 'Rookie', 'Guardian', 'Pro', 'Master', 'Grandmaster', 'Specialist', 'Champion', 'Legend', 'Hacker', 'Godlike'];

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
            //write here
            console.log("profiled",profiled);
            
            profiled.totalpoints += req.body.data[uid].score;

            profiled.totalGamesPlayed += 1;

            if(tempwinner == req.body.data[uid].username){
                profiled.totalGamesWon += 1;
            }

            profiled.winlossratio = profiled.totalGamesWon / profiled.totalGamesPlayed;

            //updating the users rank
            if(profiled.totalpoints >0 && profiled.totalpoints < 25){
                profiled.rank = ranks[0];
            }else if(profiled.totalpoints >= 25 && profiled.totalpoints < 50){
                profiled.rank = ranks[1];
            }else if(profiled.totalpoints >= 50 && profiled.totalpoints < 75){
                profiled.rank = ranks[2];
            }else if(profiled.totalpoints >= 75 && profiled.totalpoints < 100){
                profiled.rank = ranks[3];
            }else if(profiled.totalpoints >= 100 && profiled.totalpoints < 125){
                profiled.rank = ranks[4];
            }else if(profiled.totalpoints >= 125 && profiled.totalpoints < 150){
                profiled.rank = ranks[5];
            }else if(profiled.totalpoints >= 150 && profiled.totalpoints < 175){
                profiled.rank = ranks[6];
            }else if(profiled.totalpoints >= 175 && profiled.totalpoints < 200){
                profiled.rank = ranks[7];
            }else if(profiled.totalpoints >= 200 && profiled.totalpoints < 225){
                profiled.rank = ranks[8];
            }else if(profiled.totalpoints >= 225 && profiled.totalpoints < 250){
                profiled.rank = ranks[9];
            }else if(profiled.totalpoints >= 250){
                profiled.rank = ranks[10];
            }

            await profiled.save();

        }


        res.json(gameStats);
    } catch(err) {
        console.error(err);
        return res.status(400).json(err);
    }
});

module.exports = gameStatsRouter;