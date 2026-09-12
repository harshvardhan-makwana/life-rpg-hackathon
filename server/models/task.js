const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['strength', 'intellect', 'focus'],
    default: 'focus'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  xpReward: {
    type: Number,
    default: 10
  },
  goldReward: {
    type: Number,
    default: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);