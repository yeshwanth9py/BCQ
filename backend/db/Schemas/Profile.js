const mongoose = require("mongoose");


const profileschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profilepic:{
        type: String
    },
    
})