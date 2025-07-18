// controllers/roleController.js
const Role = require('../models/role');

// Create a role
exports.createRole = async (req, res) => {
  try {
    const { name, description, parentRole, permissions } = req.body;
    const role = new Role({ name, description, parentRole, permissions });
    await role.save();

    // Add this role to parent's childRoles if parentRole is provided
    if (parentRole) {
      await Role.findByIdAndUpdate(parentRole, { $addToSet: { childRoles: role._id } });
    }

    res.status(201).json({ message: 'Role created', role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('parentRole');
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const idAsInt = parseInt(req.params.id, 10);
    if (isNaN(idAsInt)) { 
      return res.status(400).json({ message: 'Invalid role ID' });
    }
    const role = await Role.findById(req.params.id).populate('parentRole');
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role updated', updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    // Remove this role from parent’s childRoles if any
    if (role.parentRole) {
      await Role.findByIdAndUpdate(role.parentRole, {
        $pull: { childRoles: role._id }
      });
    }

    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a child role
exports.addChildRole = async (req, res) => {
  try {
    const { childRoleId } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { childRoles: childRoleId } },
      { new: true }
    );

    // Set parentRole of child
    await Role.findByIdAndUpdate(childRoleId, { parentRole: req.params.id });

    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Child role added', role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a child role
exports.removeChildRole = async (req, res) => {
  try {
    const { childRoleId } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { $pull: { childRoles: childRoleId } },
      { new: true }
    );

    // Remove parentRole from child
    await Role.findByIdAndUpdate(childRoleId, { parentRole: null });

    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Child role removed', role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRoleIdByName = async (req, res) => {
  try {
    const { name } = req.params;
    const role = await Role.findOne({ name });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ roleId: role._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};