const jwt = require('jsonwebtoken');
const config = require('../config');

const createToken = (payload) => {
  return jwt.sign(
    payload,
    config.security.secretKey,
    { expiresIn: config.security.jwtExpiration }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.security.secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
