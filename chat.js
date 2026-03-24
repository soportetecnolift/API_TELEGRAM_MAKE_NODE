const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  link: { type: String },
  chat: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Chat', chatSchema)