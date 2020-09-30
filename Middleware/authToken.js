const jwt = require('jsonwebtoken');

const authToken = async (request, response, next) => {
  try {
    if (!request.headers.authorization) {
      throw new Error('You need auth token to access this route');
    }

    const token = request.headers.authorization.split(' ')[1];
    const decode = await jwt.verify(token, process.env.SECRET);

    if (!decode.email) {
      return response.status(400).json({
        status: 400,
        error: 'You have provide an invalid token',
      });
    }

    request.user = decode;
    request.token = token;
    next();
  } catch (error) {
    return response.status(400).json({
      status: 400,
      error: error.message,
    });
  }
};

module.exports = authToken;
