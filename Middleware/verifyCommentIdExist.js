const db = require('../Model');
const Helper = require('../utils/Helper');

const verifyCommentIdExist = async (request, response, next) => {
  const { commentId: commentIdFromParams } = request.params;
  const { commentId: commentIdFromBody } = request.body;

  const commentId = commentIdFromBody || commentIdFromParams;

  const commentExist = await db.Comment.findById(commentId);
  if (!commentExist) {
    return Helper.failResponse(response, 404, {
      message: `Comment with id: ${commentId} does not exist`,
    });
  }

  request.comment = commentExist;
  return next();
};

module.exports = verifyCommentIdExist;
