const Helper = require('../utils/Helper');
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
    });

    const token = await jwt.sign({ id: newUser.id }, process.env.SECRET);

    try {
      const data = await newUser.save().then((user) => user.toJSON());
      data.password = undefined;
      return Helper.successResponse(response, 201, { ...data, token });
    } catch (error) {
      return Helper.failResponse(response, 500, error);
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
      return Helper.failResponse(response, 401, {
        message: 'Invalid login credentials',
      });
    }

    const isPassword = await bcrypt.compare(password, userAccount.password);

    if (!isPassword) {
      return Helper.failResponse(response, 401, {
        message: 'Invalid login credentials',
      });
    }

    const token = await jwt.sign({ id: userAccount.id }, process.env.SECRET);

    return Helper.successResponse(response, 201, {
      ...userAccount,
      token,
    });
  }
}

module.exports = Auth;
