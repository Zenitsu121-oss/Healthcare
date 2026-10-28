import User from '../models/User.js';

// @desc    Get all users list (should not show password)
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Support search by name, email, or mobile number
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: regex },
          { email: regex },
          { mobilenumber: regex },
        ],
      };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('[Get All Users error]:', error);
    return res.status(500).json({
      message: error.message || 'Failed to fetch user list',
    });
  }
};

// @desc    Get a particular user by ID (should not show password)
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found with the provided ID',
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('[Get User By ID error]:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    return res.status(500).json({
      message: error.message || 'Failed to retrieve user details',
    });
  }
};

// @desc    Update user details (Ask password & match)
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, name, age, mobilenumber, newPassword } = req.body;

    // Whiteboard requirement: "Ask password & match"
    if (!password) {
      return res.status(400).json({
        message: 'Password confirmation is required to update user details.',
      });
    }

    // Check acting user's password for security authorization
    const actingUser = await User.findById(req.user._id);
    if (!actingUser) {
      return res.status(401).json({ message: 'Acting user account not found.' });
    }

    const isMatch = await actingUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Password confirmation failed. Incorrect password provided.',
      });
    }

    // Find the target user to update
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User to update was not found.' });
    }

    // Apply updates
    if (name !== undefined && name.trim() !== '') {
      targetUser.name = name.trim();
    }
    if (age !== undefined) {
      targetUser.age = age === '' || age === null ? null : Number(age);
    }
    if (mobilenumber !== undefined) {
      const cleanMobile = String(mobilenumber).trim();
      if (!/^\d{10}$/.test(cleanMobile)) {
        return res.status(400).json({
          message: 'Mobile number must be exactly 10 digits (e.g. 9876543210).',
        });
      }
      targetUser.mobilenumber = cleanMobile;
    }
    if (newPassword && newPassword.trim().length >= 6) {
      targetUser.password = newPassword.trim();
    }

    const updatedUser = await targetUser.save();

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        mobilenumber: updatedUser.mobilenumber,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('[Update User error]:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    return res.status(500).json({
      message: error.message || 'Failed to update user details',
    });
  }
};

// @desc    Delete a user (Ask password & match, Prevent from deleting own data)
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Whiteboard requirement: "Prevent from deleting own data"
    if (req.user._id.toString() === id.toString()) {
      return res.status(403).json({
        message: 'Prohibited: You cannot delete your own account. Self-deletion is prevented by policy.',
      });
    }

    // Whiteboard requirement: "Ask password & match"
    if (!password) {
      return res.status(400).json({
        message: 'Password confirmation is required to delete a user.',
      });
    }

    // Verify acting user's password
    const actingUser = await User.findById(req.user._id);
    if (!actingUser) {
      return res.status(401).json({ message: 'Acting user account not found.' });
    }

    const isMatch = await actingUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Password confirmation failed. Incorrect password provided.',
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User to delete was not found.' });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: `User '${targetUser.name}' (${targetUser.email}) was deleted successfully.`,
      deletedUserId: id,
    });
  } catch (error) {
    console.error('[Delete User error]:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    return res.status(500).json({
      message: error.message || 'Failed to delete user',
    });
  }
};
