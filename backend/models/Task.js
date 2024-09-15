const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
     type: String, 
     enum: ['pending', 'in-progress', 'completed'],
      default: 'pending' },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
    createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' },
  createdAt: {
     type: String , 
     default: Date.now },
  dueDate: { type: String },
});
module.exports = mongoose.model('Task', taskSchema);