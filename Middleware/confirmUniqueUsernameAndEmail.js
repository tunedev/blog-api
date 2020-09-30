const db = require('../Model');
const { failResponse } = require('../utils/Helper');

const confirmUniqueUsernameAndEmail = async (request, response, next) => {
  const { email, username } = request.body;

  const emailExist = await db.User.find({ email });
  const usernameExist = await db.User.find({ username });

  console.log('middleware: ', emailExist, usernameExist);

  if (emailExist.length > 0) {
    return failResponse(response, 409, {
      message: `account with email: ${email} already exist`,
    });
  } else if (usernameExist.length > 0) {
    return failResponse(response, 409, {
      message: `account with username: ${username} already exist`,
    });
  }

  next();
};

module.exports = confirmUniqueUsernameAndEmail;
