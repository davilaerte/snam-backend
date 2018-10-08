const express = require('express');
const Page = require('./Page');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const page = await Page.create(req.body);

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

    return res.status(201).json(updatedPage);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

module.exports = router;