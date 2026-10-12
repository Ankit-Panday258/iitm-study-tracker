import mongoose from 'mongoose';

const DailyNoteSchema = new mongoose.Schema({
  date: { type: String, required: true, index: true },
  noteText: { type: String, default: '' },
  userEmail: { type: String, default: 'default', required: true, lowercase: true, trim: true, index: true }
}, {
  timestamps: true
});

DailyNoteSchema.index({ date: 1, userEmail: 1 }, { unique: true });

const DailyNote = mongoose.models.DailyNote || mongoose.model('DailyNote', DailyNoteSchema);
export default DailyNote;
