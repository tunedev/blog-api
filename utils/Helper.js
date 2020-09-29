module.exports = {
  failResponse(response, statusCode, error) {
    return response.status(statusCode).json({
      status: 'Fail',
      error,
    });
  },
  successResponse(response, statusCode, data) {
    return response.status(statusCode).json({
      status: 'Success',
      data,
    });
  },
};
