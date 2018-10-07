const jwt = require('jsonwebtoken');

const secret = 'shhhhh';
const tokenName = 'access_token';

function generateToken(params = {}) {
  return jwt.sign(params, secret)
}

function verifyToken(token) {
  const decoded = jwt.verify(token, secret);

  return decoded.id;
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
module.exports.tokenName = tokenName;
