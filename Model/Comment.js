const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  body: String,
  created_at: Date,
  updated_at: Date,
});

commentSchema.set('toJSON', {
  transform(document, returnedObj) {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model('Comment', commentSchema);
