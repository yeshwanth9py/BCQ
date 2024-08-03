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
    type: String,
    default: ""
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
    index: { expires: '2d' } 
  },
  no_of_ready:{
    type: Number,
    default: 0
  },
  Status: {
    type: String,
    default: 'open to anyone'
  },
  ingame:{
    type: Boolean,
    default: false
  },
  private:{
    type: Boolean,
    default: false
  },
  password:{
    type: String,
    default: ""
  },
  roomImg:{
    type: String
  },
  current_room_owner:{
    type: String  //i will be storing the socket id of the user
  },
  members:[{
    type: String,
  }]

});

roomSchema.pre('save', function (next) {
  const uniqueMembers = [...new Set(this.members)];
  this.members = uniqueMembers;
  next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
