const Description = require('./Description');

const descriptionRepository = {};

descriptionRepository.create = async (data) => {
  const description = new Description(data);
  return await description.save();
};

descriptionRepository.findById = async (id) => {
  return await Description.findById(id);
};

descriptionRepository.findAll = async () => {
  return await Description.find({});
};

module.exports = descriptionRepository;