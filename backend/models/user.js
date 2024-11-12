// backend/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Faculty', 'HOD', 'Registrar', 'CPO', 'Admin'], required: true },
  department: { type: String, required: function() { return this.role === 'Faculty' || this.role === 'HOD'; } },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;