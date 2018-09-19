/**
 * @swagger
 * resourcePath: /user
 * description: All about API
 */

const express = require('express');
const User = require('../models/User');
const router = express.Router();

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
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {

    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já cadastrado' });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send(user);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all users in system
 *      notes: Returns all users
 *      responseClass: User
 *      nickname: getUsers
 */
router.get('/', (req, res) => {
  User.find({}, function (err, users) {
    if (err) return res.status(400).json({ error: 'Falha com erro: ' + err });
    return res.status(200).json(users);
  });
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
router.get('/:id', (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) return res.status(400).json({ error: 'Usuario não cadastrado' });

    return res.status(200).send(user);
  });
});

module.exports = router;