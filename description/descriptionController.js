/**
 * @swagger
 * resourcePath: /description
 * description: Provide resources about descriptions
 */

const express = require("express");
const descriptionRepository = require("./descriptionRepository");
const notificationRepository = require("../notification/notificationRepository");
const authMiddleware = require("../middlewares/authMiddleware");
const cache = require("../cache");
const authRouter = express.Router();
const openRouter = express.Router();

authRouter.use(authMiddleware);

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new description
 *      notes: Returns a new description
 *      responseClass: Description
 *      nickname: createDescription
 *      consumes:
 *        - apllication/json
 */
authRouter.post("/", async (req, res) => {
  const userId = req.userId;

  try {
    req.body.idUserAdm = userId;

    const description = await descriptionRepository.create(req.body);

    await createDescriptionNotification(
      "Create",
      "Created new description!",
      description.id,
      userId
    );

    return res.status(201).json(description);
  } catch (e) {
    return res.status(400).json({ error: "Failed " + e });
  }
});

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all descriptions for user
 *      notes: Returns all descriptions for user
 *      responseClass: Description
 *      nickname: getUserDescriptions
 */
authRouter.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    let descriptions = cache.getFromCache("DescriptionsUser-" + userId);

    if (!descriptions) {
      descriptions = await descriptionRepository.findByidUserAdm(userId);
      cache.putInCache("DescriptionsUser-" + userId, descriptions, 10000);
    }

    return res.status(200).json(descriptions);
  } catch (e) {
    return res.status(400).json({ error: "Failed " + e });
  }
});

/**
 * @swagger
 * path: /all
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all descriptions
 *      notes: Returns all descriptions
 *      responseClass: Description
 *      nickname: getDescriptions
 */
openRouter.get("/all", async (req, res) => {
  try {
    let descriptions = cache.getFromCache("Descriptions");

    if (!descriptions) {
      descriptions = await descriptionRepository.findAll();
      cache.putInCache("Descriptions", descriptions, 10000);
    }

    return res.status(200).json(descriptions);
  } catch (e) {
    return res.status(400).json({ error: "Failed " + e });
  }
});

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Get a single description with id
 *      notes: Returns a description
 *      responseClass: Description
 *      nickname: getSingleDescription
 *      parameters:
 *        - name: id
 *          description: description id
 *          paramType: query
 *          required: true
 *          dataType: string
 */
openRouter.get("/:id", async (req, res) => {
  try {
    let description = cache.getFromCache("DescriptionId-" + req.params.id);

    if (!description) {
      description = await descriptionRepository.findById(req.params.id);

      if (!description)
        return res.status(400).json({ error: "description nao existe" });
      else cache.putInCache("DescriptionId-" + req.params.id, description);
    }

    return res.status(200).json(description);
  } catch (e) {
    return res.status(400).json({ error: "Failed " + e });
  }
});

function createDescriptionNotification(type, text, resource, userId) {
  return notificationRepository.create(
    type,
    "Description",
    text,
    "/description/" + resource,
    userId
  );
}

module.exports.authRouter = authRouter;
module.exports.openRouter = openRouter;
