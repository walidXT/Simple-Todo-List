const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  code: String,
  description: String,
  tasktime: String,
  project: String,
  completeDate: String,
  isDone: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', taskSchema);