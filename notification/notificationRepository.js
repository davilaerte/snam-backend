const Notification = require('./Notification');

const notificationRepository = {};

notificationRepository.create = async (type, entity, text, link, userId) => {
  const notification = new Notification({ type, entity, text, link, userId });
  return await notification.save();
};

notificationRepository.findByUserId = async (id) => {
  return await Notification.find({ userId: id });
};

module.exports = notificationRepository;

