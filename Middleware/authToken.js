const jwt = require('jsonwebtoken');
const { failResponse } = require('../utils/Helper');

const authToken = async (request, response, next) => {
  try {
    if (!request.headers.authorization) {
      throw new Error('You need auth token to access this route');
    }

    const token = request.headers.authorization.split(' ')[1];
    const decode = await jwt.verify(token, process.env.SECRET);

    if (!decode.email) {
      return failResponse(response, 400, {
        message: 'You have provide an invalid token',
      });
    }

    request.user = decode;
    request.token = token;
    next();
  } catch (error) {
    return failResponse(response, 400, { message: error.message });
  }
};

module.exports = authToken;
