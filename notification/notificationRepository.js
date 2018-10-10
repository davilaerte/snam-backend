const Notification = require('./Notification');

const notificationRepository = {};

notificationRepository.create = async (type, entity, text, link, userId) => {
  const notification = new Notification({ type, entity, text, link, userId });
  return await notification.save();
};

notificationRepository.findByUserId = async (id) => {
  return await Notification.find({ userId: id });
};

notificationRepository.dropAll = async (id) => {
  return await Notification.collection.drop();
};

module.exports = notificationRepository;

