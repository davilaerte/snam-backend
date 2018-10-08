const express = require('express');
const Description = require('./Description');
const notificationRepository = require('../notification/notificationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const description = await Description.create(req.body);

    await createDescriptionNotification('Create', 'Created new description!', description.id, userId);

    return res.status(201).json(description);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

router.get('/', async (req, res) => {
  try {
    const descriptions = await Description.find({});

    return res.status(200).json(descriptions);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const description = await Description.findById(req.params.id);

    return res.status(200).json(description);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

function createDescriptionNotification(type, text, resource, userId) {
  return notificationRepository.create(type, 'Description', text, '/description/' + resource, userId);
}

module.exports = router;