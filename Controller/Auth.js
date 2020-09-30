const { failResponse, successResponse } = require('../utils/Helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../Model/index');

class Auth {
  static async signup(request, response) {
    const { firstName, lastName, username, password, email } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new db.User({
      firstname: firstName,
      lastname: lastName,
      username,
      password: hashedPassword,
      email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const token = await jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SECRET
    );

    try {
      const data = await newUser.save().then((user) => user.toJSON());
      data.password = undefined;
      return successResponse(response, 201, { ...data, token });
    } catch (error) {
      return failResponse(response, 500, error);
    }
  }
  static async signin(request, response) {
    const { email, password } = request.body;

    const userAccount = await db.User.findOne({ email }).then((user) => {
      if (!user) {
        return;
      }
      return user.toJSON();
    });

    if (!userAccount) {
      return failResponse(response, 401, {
        message: 'Invalid login credentials',
      });
    }

    const isPassword = await bcrypt.compare(password, userAccount.password);

    if (!isPassword) {
      return failResponse(response, 401, {
        message: 'Invalid login credentials',
      });
    }

    const token = await jwt.sign(
      { id: userAccount.id, email: userAccount.email },
      process.env.SECRET
    );

    return successResponse(response, 201, {
      ...userAccount,
      token,
    });
  }
}

module.exports = Auth;
