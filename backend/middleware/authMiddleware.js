import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader) {
    // Strip one or multiple "Bearer " prefixes (e.g. if user entered 'Bearer ...' in Postman's Bearer token field)
    let cleanHeader = authHeader.trim();
    while (/^bearer\s+/i.test(cleanHeader)) {
      cleanHeader = cleanHeader.replace(/^bearer\s+/i, '').trim();
    }
    token = cleanHeader;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secure_healthcare_jwt_secret_key_2026_xyz123'
    );

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }

    next();
  } catch (error) {
    console.error('[Auth Middleware] Token error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};
