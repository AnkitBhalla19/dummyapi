const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
}, { timestamps: true });
 
module.exports = mongoose.model('User', userSchema);