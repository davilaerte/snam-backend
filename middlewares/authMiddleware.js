const util = require('../util/util');

function autenticate(req, res, next) {
  const token = req.cookies[util.tokenName];

  if (!token) {
    return res.status(401).json({ error: 'No token provider' });
  }

  try {
    req.userId = util.verifyToken(token);

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

module.exports = autenticate;