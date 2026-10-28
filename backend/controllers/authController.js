import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secure_healthcare_jwt_secret_key_2026_xyz123',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register (or /api/users)
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, mobilenumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !mobilenumber) {
      return res.status(400).json({
        message: 'Name, Email, Password, and Mobile number are required fields.',
      });
    }

    // Validate 10 digits
    const cleanMobile = String(mobilenumber).trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({
        message: 'Mobile number must be exactly 10 digits (e.g. 9876543210).',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      age: age ? Number(age) : null,
      mobilenumber: cleanMobile,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        mobilenumber: user.mobilenumber,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Register error]:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({
      message: error.message || 'Server error during user registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide both email and password.',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        mobilenumber: user.mobilenumber,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Login error]:', error);
    return res.status(500).json({
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to fetch current user profile',
    });
  }
};
