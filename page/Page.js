const mongoose = require('../database/index');
const Post = require('./Post');

const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  },
  idUserAdm: {
    type: String,
    required: true
  },
  posts: {
    type: [Post],
    default: []
  },
  like: {
    type: Number,
    default: 0
  },
  createAt: {
    type: Date,
    default: Date.now,
  }
});

const Page = mongoose.model('Page', PageSchema);

module.exports = Page;