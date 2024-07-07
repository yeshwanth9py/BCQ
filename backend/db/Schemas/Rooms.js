const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  gameType:{
    type: String
  },
  numPlayers: {
    type: Number
  },
  timeLimit: {
    type: Number
  },
  difficultyLevel: {
    type: String
  },
  categories: {
    type: String
  },
  image: {
      type: String
  },
  description: {
      type: String
  },
  Participants: {
    type: Number
  },
  CreatedBy: {
    type: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;