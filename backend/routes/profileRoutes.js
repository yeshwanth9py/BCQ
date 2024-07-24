const express = require("express");
const profileRouter = express.Router();
const Profile = require("../db/Schemas/Profile");
const auth = require("../authenticate");
const { z } = require('zod');
const User = require("../db/Schemas/User");
const Profilemodel = require("../db/Schemas/Profile");
const axios = require("axios");


const updateProfileSchema = z.object({
    username: z.string().nonempty().optional(),
    profilePic: z.string().optional(),
    bio: z.string().optional(),
    followers: z.array(z.string()).optional(),
    following: z.array(z.string()).optional(),
    likes: z.array(z.string()).optional(),
    rank: z.enum(['Noob', 'Rookie', 'Guardian', 'Pro', 'Master', 'Grandmaster', 'Specialist', 'Champion', 'Legend', 'Hacker', 'Godlike']).optional(),
    email: z.string().email().optional(),
    previousGames: z.array(z.string()).optional(),
    stats: z.object({
        winLossRatio: z.string().optional(),
        highestScore: z.number().optional(),
        totalGamesPlayed: z.number().optional()
    }).optional(),
    createdAt: z.date().optional()
});

profileRouter.patch("/update/:id", auth, async (req, res) => {
    try {
        const parsedBody = updateProfileSchema.parse(req.body);
        const updatedProfile = await Profile.findByIdAndUpdate({ profile: req.params.id }, parsedBody, { new: true });
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});





profileRouter.get("/:pnm", async (req, res) => {
    try {
        const profile = await Profile.find({ username: req.params.pnm });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

profileRouter.get("/search/:pnm", async (req, res) => {
    try{
        const query = req.params.pnm;
        console.log(query);
        const users = await Profile.find({ username: { $regex: query, $options: 'i' } }).select("username bio profilePic").limit(10);
        console.log("users",users);
        return res.json(users);
    } catch(err){
        console.log(err);
    }
})


profileRouter.post("/like", async (req, res) => {
    console.log("liked");
    try {
        const { by, toname } = req.body;
        const profiled = await Profile.findOne({ username: toname });
        const to = profiled._id;
        if (profiled.likes.includes(by)) {
            const newarr = profiled.likes.filter((el) => {
                return el !== by;
            });
            profiled.likes = newarr;
            await profiled.save();
            return res.json({ liked: false, likesCount: profiled.likes.length });
        } else {
            profiled.likes.push(by);
            await profiled.save();
            return res.status(200).json({ liked: true, likesCount: profiled.likes.length });
        }
    } catch (err) {
        return res.json(err)
    }
});


profileRouter.post("/follow", async (req, res) => {
    try {
        const { by, toname } = req.body;
        const profiled = await Profile.findOne({ username: toname });
        const to = profiled._id;   //to-uid

        if (profiled.followers.includes(by)) {
            const newarr = profiled.followers.filter((el) => {
                return el !== by;
            });
            profiled.followers = newarr;
            await profiled.save();
            
            res.json({ followed: false, followersCount: profiled.followers.length });
            
            const byprofile = await Profile.findOneAndUpdate({_id: to},{$pull : {following: by }}, {new: true});
            console.log("curfollo",byprofile);
        } else {
            profiled.followers.push(by);
            await profiled.save();
            res.json({ followed: true, followersCount: profiled.followers.length });
            const cursusd = await Profile.findOneAndUpdate({ _id: to }, { $push: { following: by } }, { new: true });
            console.log("curfollo",cursusd);
        }
    } catch (err) {
        return res.json(err)
    }
});


profileRouter.post("/challenge", async (req, res) => {

    try{
        console.log("came2")
        const {byname, bypid, topid, savedroom} = req.body;
        
        // const savedroom = await axios.post("http://localhost:3000/app/rooms/create", {...req.body.challengeData}, {withCredentials: true});
        const profiled = await Profile.findById(topid);
        const challenge_time = Date.now();
        // i  want to store last 10 notifications only
        console.log("came3 after saving room");
        profiled.notifications.push({msg:`${byname} has challenged you!`, byname: byname, bypid: bypid, time: challenge_time, hasSeen: false, type: "challenge", profilepic: profiled.profilePic, roomid:savedroom._id});
        if(profiled.notifications.length > 10){
            profiled.notifications.shift();  //i am removig the oldest notification
        }

        profiled.countunread += 1;
        await profiled.save();
        res.json({profiled});
    } catch(err){
        console.error(err);
        return res.status(400).json(err);
    }
});


profileRouter.patch("/notifications", async (req, res) => {
    console.log("notifications will be removed")
    console.log(req.body)
    const {username} = req.body;
    const profiled = await Profilemodel.findOne({username: username}); 
    console.log("profiledgot",profiled);
    profiled.countunread = 0;
    await profiled.save();
    console.log("profiled",profiled);
    res.json({profiled})
});



module.exports = profileRouter
