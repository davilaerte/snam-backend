const express = require('express');
const pageRepository = require('./pageRepository');
const notificationRepository = require('../notification/notificationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const page = pageRepository.create(req.body);

    await createPageNotification('Create', 'Created new page!', page.id, userId);

    return res.status(201).json(page);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

router.post('/:id/post', async (req, res) => {
  try {
    const updatedPage = await pageRepository.createPost(req.params.id, req.userId, req.body);
    await createPageNotification('Create', 'Created new page post!', updatedPage.id, req.userId);

    return res.status(201).json(updatedPage);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

router.get('/', async (req, res) => {
  try {
    const pages = await pageRepository.findAll();

    return res.status(200).json(pages);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const page = await pageRepository.findById(req.params.id);

    return res.status(200).json(page);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

function createPageNotification(type, text, resource, userId) {
  return notificationRepository.create(type, 'Page', text, '/page/' + resource, userId);
}

module.exports = router;