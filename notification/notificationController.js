const express = require('express');
const notificationRepository = require('./notificationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const notifications = await notificationRepository.findByUserId(req.userId);

    return res.status(200).json(notifications);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

module.exports = router;