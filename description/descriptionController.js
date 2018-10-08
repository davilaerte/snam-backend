const express = require('express');
const Description = require('./Description');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const description = await Description.create(req.body);

    return res.status(201).json(description);
  } catch (e) {
    return res.status(400).json({ error: 'Failed ' + e });
  }
});

module.exports = router;