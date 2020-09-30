const Route = require('express').Router();
const Auth = require('../Controller/Auth');
const Validation = require('../validation/Validation');
const Blog = require('../Controller/Blog');
const {
  authToken,
  confirmUniqueUsernameAndEmail,
  verifyPostIdExist,
  verifyCommentIdExist,
} = require('../Middleware');

const { validator, checkValidationResult } = Validation;

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
  confirmUniqueUsernameAndEmail,
  Auth.signup
).post('/auth/signin', validator('signin'), checkValidationResult, Auth.signin);

// Post Route
Route.post(
  '/posts',
  authToken,
  validator('post'),
  checkValidationResult,
  Blog.createPost
)
  .get('/posts', Blog.getAll)
  .get(
    '/posts/:postId',
    validator('postId'),
    checkValidationResult,
    verifyPostIdExist,
    Blog.getById
  )
  .patch(
    '/posts/:postId',
    validator('postId'),
    checkValidationResult,
    verifyPostIdExist,
    Blog.updateById
  )
  .post(
    '/posts/:postId/comments',
    authToken,
    validator('comment'),
    validator('postId'),
    checkValidationResult,
    verifyPostIdExist,
    Blog.addCommentToPost
  )
  .get(
    '/posts/:postId/comments',
    validator('postId'),
    checkValidationResult,
    verifyPostIdExist,
    Blog.getAllComment
  )
  .get(
    '/comments/:commentId',
    validator('commentId'),
    checkValidationResult,
    verifyCommentIdExist,
    Blog.getCommentById
  )
  .patch(
    '/comments/:commentId',
    validator('commentId'),
    checkValidationResult,
    verifyCommentIdExist,
    Blog.updateComment
  )
  .delete(
    '/comments/:commentId',
    validator('commentId'),
    checkValidationResult,
    verifyCommentIdExist,
    Blog.deleteComment
  );

module.exports = Route;
