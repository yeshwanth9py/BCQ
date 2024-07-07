const express = require("express");
const profileRouter = express.Router();
const Profile = require("../db/Schemas/Profile");
const auth = require("../authenticate");
const { z } = require('zod');


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
        const updatedProfile = await Profile.findByIdAndUpdate({profile:req.params.id}, parsedBody, { new: true });
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

module.exports = profileRouter