const User = require('./User');

const userRepository = {};

userRepository.create = async (data) => {
  const user = new User(data);
  return await user.save();
};

userRepository.findById = async (id) => {
  return await User.findById(id);
};

userRepository.findByEmail = async (email) => {
  return await User.findOne({ email });
};

userRepository.findAll = async () => {
  return await User.find({});
};

module.exports = userRepository;