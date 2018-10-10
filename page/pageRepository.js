const Page = require('./Page');

const pageRepository = {};

pageRepository.create = async (data) => {
  const page = new Page(data);
  return await page.save();
};

pageRepository.findById = async (id) => {
  return await Page.findById(id);
};

pageRepository.findAll = async () => {
  return await Page.find({});
};

pageRepository.dropAll = async () => {
  return await Page.collection.drop();
};

pageRepository.createPost = async (idPage, idUser, data) => {
  const page = await pageRepository.findById(idPage);

  if (page.idUserAdm !== idUser) {
    throw new Error('User not allowed');
  }

  page.posts.push(data);
  return await page.save();
};

module.exports = pageRepository;