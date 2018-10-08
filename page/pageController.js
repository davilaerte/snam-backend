const express = require('express');
const Page = require('./Page');
const notificationRepository = require('../notification/notificationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const page = await Page.create(req.body);

    await createPageNotification('Create', 'Created new page!', page.id, userId);

    return res.status(201).json(page);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

router.post('/:id/post', async (req, res) => {
  const userId = req.userId;
  const page = await Page.findById(req.params.id);

  if (page.idUserAdm !== userId) {
    return res.status(401).json({ error: 'User not allowed' });
  }

  try {
    page.posts.push(req.body);

    const updatedPage = await page.save();

    await createPageNotification('Create', 'Created new page post!', page.id, userId);

    return res.status(201).json(updatedPage);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({});

    return res.status(200).json(pages);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    return res.status(200).json(page);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

function createPageNotification(type, text, resource, userId) {
  return notificationRepository.create(type, 'Page', text, '/page/' + resource, userId);
}

module.exports = router;