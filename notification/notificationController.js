/**
 * @swagger
 * resourcePath: /notification
 * description: Provide resources about notifications
 */

const express = require('express');
const notificationRepository = require('./notificationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all notifications from the authenticated user
 *      notes: Returns all notifications from the authenticated user
 *      responseClass: Notification
 *      nickname: getNotifications
 */
router.get('/', async (req, res) => {
  try {
    const notifications = await notificationRepository.findByUserId(req.userId);

    return res.status(200).json(notifications);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

module.exports = router;