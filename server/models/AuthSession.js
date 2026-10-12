import mongoose from 'mongoose';

const AuthSessionSchema = new mongoose.Schema({
  token_hash: { type: String, required: true, unique: true, index: true },
  user_id: { type: String, required: true, index: true },
  expires_at: { type: Number, required: true, index: true }
}, { timestamps: false });

const AuthSession = mongoose.models.AuthSession || mongoose.model('AuthSession', AuthSessionSchema);
export default AuthSession;
