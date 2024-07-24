const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    lang:{
        type: String,
        enum:["cpp", "py"],
        required: true
    },
    filepath:{
        type: String,
        required: true
    },
    submittedAt:{
        type: Date,
        default: Date.now
    },
    startedAt:{
        type: Date
    },
    completedAt:{
        type: Date
    },
    output:{
        type: String
    },
    status:{
        type: String, 
        default: "pending",
        enum:["pending", "running", "completed", "failed"],
    },
    qid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Codingqs"
    }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job