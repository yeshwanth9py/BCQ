const express = require("express");
const profileRouter = express.Router();
const Profile = require("../db/Schemas/Profile");
const auth = require("../authenticate");
const { z } = require('zod');
const User = require("../db/Schemas/User");


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


profileRouter.post("/like", async (req, res) => {
    console.log("liked");
    try {
        const { by, to } = req.body;
        const profiled = await Profile.findOne({ username: to });
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
        const { by, to } = req.body;
        const profiled = await Profile.findOne({ username: to });
        if (profiled.followers.includes(by)) {
            const newarr = profiled.followers.filter((el) => {
                return el !== by;
            });
            profiled.followers = newarr;
            await profiled.save();
            return res.json({ followed: false, followersCount: profiled.followers.length });
        } else {
            profiled.followers.push(by);
            await profiled.save();
            return res.status(200).json({ followed: true, followersCount: profiled.followers.length });
        }
    } catch (err) {
        return res.json(err)
    }
});



module.exports = profileRouter