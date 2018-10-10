/**
 * @swagger
 * resourcePath: /page
 * description: Provide resources about pages
 */

const express = require('express');
const pageRepository = require('./pageRepository');
const notificationRepository = require('../notification/notificationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new page
 *      notes: Returns a new page
 *      responseClass: Page
 *      nickname: createPage
 *      consumes: 
 *        - apllication/json
 */
router.post('/', async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const page = await pageRepository.create(req.body);

    await createPageNotification('Create', 'Created new page!', page.id, userId);

    return res.status(201).json(page);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

/**
 * @swagger
 * path: /:id/post
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new post page
 *      notes: Returns a new page with a new post
 *      responseClass: Page
 *      nickname: createPostPage
 *      parameters:
 *        - name: id
 *          description: page id
 *          paramType: query
 *          required: true
 *          dataType: string
 *      consumes: 
 *        - apllication/json
 */
router.post('/:id/post', async (req, res) => {
  try {
    const updatedPage = await pageRepository.createPost(req.params.id, req.userId, req.body);
    await createPageNotification('Create', 'Created new page post!', updatedPage.id, req.userId);

    return res.status(201).json(updatedPage);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all pages
 *      notes: Returns all pages
 *      responseClass: Page
 *      nickname: getPages
 */
router.get('/', async (req, res) => {
  try {
    const pages = await pageRepository.findAll();

    return res.status(200).json(pages);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Get a single page with id
 *      notes: Returns a page
 *      responseClass: Page
 *      nickname: getSinglePage
 *      parameters:
 *        - name: id
 *          description: page id
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/:id', async (req, res) => {
  try {
    const page = await pageRepository.findById(req.params.id);

    return res.status(200).json(page);
  } catch (e) {
    return res.status(400).json({ error: 'Failed: ' + e });
  }
});

function createPageNotification(type, text, resource, userId) {
  return notificationRepository.create(type, 'Page', text, '/page/' + resource, userId);
}

module.exports = router;