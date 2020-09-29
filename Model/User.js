const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  created_at: Date,
  updated_at: Date,
});

userSchema.set('toJSON', {
  transform(document, returnedObj) {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model('User', userSchema);
