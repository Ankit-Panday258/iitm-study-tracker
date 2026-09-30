import mongoose from 'mongoose';

const DailyNoteSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true, index: true },
  noteText: { type: String, default: '' }
}, {
  timestamps: true
});

const DailyNote = mongoose.models.DailyNote || mongoose.model('DailyNote', DailyNoteSchema);
export default DailyNote;
