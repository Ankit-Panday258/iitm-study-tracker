import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  durationHours: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 45 },
  durationSeconds: { type: Number, default: 0 },
  priority: { type: String, default: 'Medium' },
  completed: { type: Boolean, default: false, index: true },
  completedAt: { type: String, default: null },
  notes: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: true
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;
