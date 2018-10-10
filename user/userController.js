/**
 * @swagger
 * resourcePath: /user
 * description: Provide resources about users
 */

const express = require('express');
const userRepository = require('./userRepository');
const util = require('../util/util');
const authMiddleware = require('../middlewares/authMiddleware');
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

    res.cookie(util.tokenName, util.generateToken({ id: user.id }));

    return res.status(201).json(user);
  } catch (e) {
    return res.status(400).json({ error: 'Registration failed ' + e });
  }
});

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all users
 *      notes: Returns all users
 *      responseClass: User
 *      nickname: getUsers
 */
authRouter.get('/', async (req, res) => {
  try {
    const users = await userRepository.findAll();

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
    const user = await userRepository.findById(req.params.id);

    if (!user) return res.status(400).json({ error: 'Usuario nao cadastrado' });

    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: 'Falha com erro: ' + e });
  }
});

module.exports.authRouter = authRouter;
module.exports.openRouter = openRouter;