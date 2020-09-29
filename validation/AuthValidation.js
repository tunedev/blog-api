const { check, validationResult } = require('express-validator');
const Helper = require('../utils/Helper');

const AuthValidation = {
  validator(route) {
    switch (route) {
      case 'signup':
        return [
          check('firstName')
            .isAlpha()
            .withMessage('First name must contain only alphabetical characters')
            .isLength({ min: 2 })
            .withMessage('Please enter your first name')
            .trim(),
          check('lastName')
            .isAlpha()
            .withMessage('Last name must contain only alphabetical characters')
            .isLength({ min: 2 })
            .withMessage('Please enter your last name')
            .trim(),
          check('username')
            .isLength({ min: 2 })
            .withMessage('Please enter your username')
            .trim(),
          check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .trim(),
          check('password')
            .not()
            .isEmpty()
            .isLength({ min: 8 })
            .withMessage('Password can not be less than 8 characters')
            .matches('[0-9]')
            .withMessage('Password must contain a number')
            .matches('[A-Z]')
            .withMessage('Password must contain an upper case letter'),
        ];
      case 'signin':
        return [
          check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .trim(),
          check('password')
            .not()
            .isEmpty()
            .withMessage('Password can not be empty')
            .isLength({ min: 8 })
            .withMessage('Password can not be less than 8 characters'),
        ];
    }
  },
  checkValidationResult(request, response, next) {
    const errorFormatter = ({ msg }) => {
      return `${msg}`;
    };
    const result = validationResult(request).formatWith(errorFormatter);

    if (!result.isEmpty()) {
      return Helper.failResponse(response, 400, {
        message: result.mapped(),
      });
    }
    return next();
  },
};

module.exports = AuthValidation;
