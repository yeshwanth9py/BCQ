const mongoose = require("mongoose");

const codingqsSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    testcase1:{
        input:{
            type: String,
            required: true
        },
        output:{
            type: String,
            required: true
        }
    },
    testcase2:{
        input:{
            type: String,
            required: true
        },
        output:{
            type: String,
            required: true
        }
    },
    testcase3:{
        input:{
            type: String,
            required: true
        },
        output:{
            type: String,
            required: true
        }
    },
    testcase4:{
        input:{
            type: String,
            required: true
        },
        output:{
            type: String,
            required: true
        }
    },
    testcase5:{
        input:{
            type: String,
            required: true
        },
        output:{
            type: String,
            required: true
        }
    },
    tags:[String],
    difficulty:{
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    }
});


const Codingqs = mongoose.model("Codingqs", codingqsSchema);
module.exports = Codingqs