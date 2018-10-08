const mongoose = require('../database/index');

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = PostSchema;