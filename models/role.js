const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'update', 'manageUsers', 'viewReports', 'approveRequests']
  }],
  parentRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
