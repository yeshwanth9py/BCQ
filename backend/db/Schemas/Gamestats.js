const mongoose = require("mongoose");

const gamestats = new mongoose.Schema({
    toi: {
        type: String,
        required: true
    },
    roomno: {
        type: String,
        required: true
    },
    data:{
        type: Object
    },
    winner:{
        type: String
    },
    maxsc:{
        type: Number
    },
    gametype:{
        type: String
    }
});

const GameStats = mongoose.model("Gamestats", gamestats);

module.exports = GameStats