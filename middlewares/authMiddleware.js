const util = require("../util/util");

function autenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provider" });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }

  try {
    req.userId = util.verifyToken(token);

    return next();
  } catch (e) {
    return res.status(401).json({ error: "Token invalid" });
  }
}

module.exports = autenticate;
