const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String], // Array of strings for multiple choice options
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const MCQ = mongoose.model('MCQ', mcqSchema);

module.exports = MCQ;