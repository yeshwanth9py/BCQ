const mongoose = require("mongoose");


const profileschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true
    },
    profilePic: {
        type: String
    },
    bio: {
        type: String
    },
    followers: {
        type: [String],
    },
    following: {
        type: [String],
    },
    likes:{
        type: [String],
    },
    rank:{
        enum: ['Noob', 'Rookie', 'Guardian', 'Pro', 'Master', 'Grandmaster', 'Specialist', 'Champion', 'Legend', 'Hacker', 'Godlike'],
    },
    email: {
        type: String,
        required: true
    },
    previousGames:{
        type: [String]
    },
    stats: {
        winLossRatio: String,
        highestScore: Number,
        totalGamesPlayed: Number
    },
    previousGames:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gamestats"
        }],
    notifications: {
        type: [{}],
        // expires: '9d'
    },
    countunread: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Profilemodel = mongoose.model("Profile", profileschema);

module.exports = Profilemodel