/**
 * @swagger
 * resourcePath: /auth
 * description: Provide resources to authenticate
 */
const express = require('express');
const bcrypt = require('bcrypt');
const util = require('../util/util');
const User = require('../user/User');
const router = express.Router();

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: POST
 *      summary: Authenticate a user
 *      notes: Returns a cookie with a token
 *      nickname: authenticateUser
 *      consumes: 
 *        - apllication/json
 */
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  res.cookie('access_token', util.generateToken({ id: user.id }));

  return res.status(201).end();
});

module.exports = router;