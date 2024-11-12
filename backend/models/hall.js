// backend/models/hall.js
const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slots: [{ slot: String }],
  reservedForOfficial: { type: Boolean, default: false }
});

const Hall = mongoose.model('Hall', hallSchema);
module.exports = Hall;