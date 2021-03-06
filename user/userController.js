/**
 * @swagger
 * resourcePath: /user
 * description: Provide resources about users
 */

const express = require('express');
const userRepository = require('./userRepository');
const util = require('../util/util');
const authMiddleware = require('../middlewares/authMiddleware');
const cache = require('../cache');
const authRouter = express.Router();
const openRouter = express.Router();

authRouter.use(authMiddleware);

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new user
 *      notes: Returns a new user
 *      responseClass: User
 *      nickname: createUser
 *      consumes: 
 *        - apllication/json
 */
openRouter.post('/', async (req, res) => {
  const { email } = req.body;

  if (await userRepository.findByEmail(email)) {
    return res.status(400).json({ error: 'Usuario ja cadastrado' });
  }

  try {
    const user = await userRepository.create(req.body);

    user.password = undefined;

    return res.status(201).json(user);
  } catch (e) {
    return res.status(400).json({ error: 'Registration failed ' + e });
  }
});

/**
 * @swagger
 * path: /all
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all users
 *      notes: Returns all users
 *      responseClass: User
 *      nickname: getUsers
 */
authRouter.get('/all', async (req, res) => {
  try {
    let users = cache.getFromCache('Users');

    if (!users) {
      users = await userRepository.findAll();
      cache.putInCache('Users', users, 10000);
    }

    return res.status(200).json(users);
  } catch (e) {
    return res.status(400).json({ error: 'Falha com erro: ' + e });
  }
});

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Get a single user with id
 *      notes: Returns a user
 *      responseClass: User
 *      nickname: getSingleUser
 *      parameters:
 *        - name: id
 *          description: user id
 *          paramType: query
 *          required: true
 *          dataType: string
 */
authRouter.get('/:id', async (req, res) => {
  try {
    let user = cache.getFromCache('UserId ' + req.params.id);

    if (!user) {
      user = await userRepository.findById(req.params.id);

      if (!user) return res.status(400).json({ error: 'Usuario nao cadastrado' });
      else cache.putInCache('UserId ' + req.params.id, user)
    }

    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: 'Falha com erro: ' + e });
  }
});

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get a auth user
 *      notes: Returns a user
 *      responseClass: User
 *      nickname: getAuthUser
 *      parameters:
 *        - name: id
 *          description: user id
 *          paramType: query
 *          required: true
 *          dataType: string
 */
authRouter.get('/', async (req, res) => {
  const userId = req.userId;

  try {
    let user = cache.getFromCache('UserId ' + userId);

    if (!user) {
      user = await userRepository.findById(userId);

      if (!user) return res.status(400).json({ error: 'Usuario nao cadastrado' });
      else cache.putInCache('UserId ' + userId, user)
    }

    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: 'Falha com erro: ' + e });
  }
});

module.exports.authRouter = authRouter;
module.exports.openRouter = openRouter;