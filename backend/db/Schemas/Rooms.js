const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '10m' } 
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  no_of_ready:{
    type: Number,
    default: 0
  },
  Status: {
    type: String,
    default: 'open to anyone'
  },
  private:{
    type: Boolean,
    default: false
  },
  password:{
    type: String,
    default: ""
  },
  current_room_owner:{
    type: String  //i will be storing the socket id of the user
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
