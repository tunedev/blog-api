const Route = require('express').Router();
const Auth = require('../Controller/Auth');
const AuthValidation = require('../validation/AuthValidation');
const ensureUserDetailsIsUnique = require('../Middleware/confirmUniqueUsernameAndEmail');

const { validator, checkValidationResult } = AuthValidation;

// Welcome route
Route.get('/', (request, response) => {
  response.status(200).json({
    status: 'Success',
    message: 'Welcome to version 1 of the blog api',
  });
});

// Auth Route
Route.post(
  '/auth/signup',
  validator('signup'),
  checkValidationResult,
  ensureUserDetailsIsUnique,
  Auth.signup
).post('/auth/signin', validator('signin'), checkValidationResult, Auth.signin);

module.exports = Route;
