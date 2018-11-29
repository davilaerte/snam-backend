const mongoose = require("../database/index");

const DescriptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default:
      "http://www.eltis.org/sites/default/files/default_images/photo_default_2.png"
  },
  text: {
    type: String,
    required: true
  },
  idUserAdm: {
    type: String,
    required: true
  },
  like: {
    type: Number,
    default: 0
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const Description = mongoose.model("Description", DescriptionSchema);

module.exports = Description;
