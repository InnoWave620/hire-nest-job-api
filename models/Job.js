const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  pay: Number,
  type: String,
  category: { type: String, enum: ['Maid', 'Landscaper'], required: true },
  workArrangement: { type: String, enum: ['accommodation', 'part-time', 'full-time'], required: true },
  postedBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);