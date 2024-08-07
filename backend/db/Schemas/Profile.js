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
            // 0,           25,      50,       75,     100,         125,      150,           175,         200,       225,         250+      
        type: String  
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
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    totalpoints:{
        type: Number,
        default: 0
    },
    winlossratio:{
        type: Number,
        default: 0.0
    },
    totalGamesPlayed:{
        type: Number,
        default: 0
    },
    totalGamesWon:{
        type: Number,
        default: 0
    }
});

const Profilemodel = mongoose.model("Profile", profileschema);

module.exports = Profilemodel