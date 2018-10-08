const mongoose = require('../database/index');

const DescriptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  idUserAdm: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now,
  }
});

const Description = mongoose.model('Description', DescriptionSchema);

module.exports = Description; 