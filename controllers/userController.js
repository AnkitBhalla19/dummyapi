// controllers/userController.js
const User = require('../models/user');
const Role = require('../models/role');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, username, email, phone, isActive, roles } = req.body;

    const user = new User({ name, username, email, phone, isActive, roles });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users with roles
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('roles');
    res.json({message: 'Users retrieved', users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const idAsInt = parseInt(req.params.id, 10);
    if (isNaN(idAsInt)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id).populate('roles');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({message: 'User retrieved', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('roles');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated', updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign roles to user
exports.assignRoles = async (req, res) => {
  try {
    const { roleIds } = req.body; // Array of role ObjectIds
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { roles: { $each: roleIds } } },
      { new: true }
    ).populate('roles');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Roles assigned', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a role from user
exports.removeRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { roles: roleId } },
      { new: true }
    ).populate('roles');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Role removed', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserIdByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ userId: user._id, message: 'User ID retrieved' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserFromUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User retrieved', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};