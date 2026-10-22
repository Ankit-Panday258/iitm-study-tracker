import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  picture: { type: String, default: '' },
  google_id: { type: String, index: true },
  password_hash: { type: String, default: null },
  study_goal: { type: String, default: '' },
  selected_subjects: { type: [String], default: [] },
  auth_provider: { type: String, default: 'google' },
  created_at: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
