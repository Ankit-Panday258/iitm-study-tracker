import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  picture: { type: String, default: '' },
  googleId: { type: String, index: true },
  authProvider: { type: String, default: 'google' }, // 'google' | 'email'
  createdAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
