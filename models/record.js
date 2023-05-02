const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  prodObject: { type: String, required: true },
  worker: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Record', recordSchema);
