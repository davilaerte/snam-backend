/**
 * @swagger
 * resourcePath: /description
 * description: Provide resources about descriptions
 */

const express = require("express");
const descriptionRepository = require("./descriptionRepository");
const notificationRepository = require("../notification/notificationRepository");
const authMiddleware = require("../middlewares/authMiddleware");
const authRouter = express.Router();

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
    req.body.like = 0;

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
 * path: /:id/like
 * operations:
 *   -  httpMethod: PUT
 *      summary: Like a description
 *      notes: Returns a updated description
 *      responseClass: Description
 *      nickname: likeDescription
 *      consumes:
 *        - apllication/json
 */
authRouter.put("/:id/like", async (req, res) => {
  const userId = req.userId;
  const descriptionId = req.params.id;

  try {
    const updateDescription = await descriptionRepository.findById(descriptionId);

    if (updateDescription.idsUsersLikes.includes(userId)) {
      return res.status(400).json({ error: "User already like" });
    }

    updateDescription.idsUsersLikes.push(userId);
    updateDescription.like += 1;

    await updateDescription.save();

    updateDescription.idsUsersLikes = undefined;
    updateDescription.hasUserLike = true;

    await createDescriptionNotification(
      "Like",
      "A user like you description!",
      updateDescription.id,
      userId
    );

    return res.status(200).json(updateDescription);
  } catch (e) {
    return res.status(400).json({ error: "Failed " + e });
  }
});

/**
 * @swagger
 * path: /:id/deslike
 * operations:
 *   -  httpMethod: PUT
 *      summary: Deslike a description
 *      notes: Returns a updated description
 *      responseClass: Description
 *      nickname: deslikeDescription
 *      consumes:
 *        - apllication/json
 */
authRouter.put("/:id/deslike", async (req, res) => {
  const userId = req.userId;
  const descriptionId = req.params.id;

  try {
    const updateDescription = await descriptionRepository.findById(descriptionId);

    if (!updateDescription.idsUsersLikes.includes(userId)) {
      return res.status(400).json({ error: "User not like for need deslike" });
    }

    updateDescription.idsUsersLikes.splice(updateDescription.idsUsersLikes.indexOf(userId), 1);
    updateDescription.like -= 1;

    await updateDescription.save();

    updateDescription.idsUsersLikes = undefined;
    updateDescription.hasUserLike = false;

    return res.status(200).json(updateDescription);
  } catch (e) {
    return res.status(400).json({ error: "Failed " + e });
  }
});

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all descriptions for auth user
 *      notes: Returns all descriptions for auth user
 *      responseClass: Description
 *      nickname: getUserDescriptions
 */
authRouter.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    let descriptions = await descriptionRepository.findByidUserAdm(userId);

    descriptions.map(elem => {
      elem.hasUserLike = elem.idsUsersLikes.includes(userId);
      elem.idsUsersLikes = undefined;
      return elem;
    });

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
authRouter.get("/all", async (req, res) => {
  const userId = req.userId;
  const nameDescription = req.query.nameDescription || "";

  try {
    let descriptions = await descriptionRepository.findByNameDescription(nameDescription);

    descriptions.map(elem => {
      elem.hasUserLike = elem.idsUsersLikes.includes(userId);
      elem.idsUsersLikes = undefined;
      return elem;
    });

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
authRouter.get("/:id", async (req, res) => {
  const userId = req.userId;

  try {
    let description = await descriptionRepository.findById(req.params.id);

    if (!description)
      return res.status(400).json({ error: "description nao existe" });

    description.idsUsersLikes = undefined;
    description.hasUserLike = description.idsUsersLikes.includes(userId);

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
