import crypto from 'crypto';

/**
 * Hash a password using scrypt with a unique random salt
 */
export function hashPassword(password) {
  if (!password) return null;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plain password against a stored salted scrypt hash
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  try {
    if (!storedHash.includes(':')) {
      const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
      return legacyHash === storedHash;
    }
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    return false;
  }
}
