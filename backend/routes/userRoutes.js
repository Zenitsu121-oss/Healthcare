import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User creation accessible at POST /api/users and POST /api/users/register
router.post('/', registerUser);
router.post('/register', registerUser);

// User login accessible at POST /api/users/login as well
router.post('/login', loginUser);

// User Get - Get all user list (Should not show password)
router.get('/', protect, getAllUsers);

// User get by id - Get a particular user (Should not show password)
router.get('/:id', protect, getUserById);

// User Update - Ask password & match, Update user details
router.put('/:id', protect, updateUser);

// User Delete - Ask password & match, Delete that user, Prevent from deleting own data
router.delete('/:id', protect, deleteUser);

export default router;
