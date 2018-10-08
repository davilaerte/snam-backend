const mongoose = require('../database/index');

const typesNotification = ['Create', 'Update', 'Like'];
const typesEntity = ['Page', 'Description'];

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: typesNotification,
    required: true
  },
  entity: {
    type: String,
    enum: typesEntity,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification; 