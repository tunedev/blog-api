const db = require('../Model');
const Helper = require('../utils/Helper');

const verifyPostIdExist = async (request, response, next) => {
  const { postId: postIdFromParams } = request.params;
  const { postId: postIdFromBody } = request.body;

  const postId = postIdFromBody || postIdFromParams;

  const postExist = await db.Post.findById(postId);

  if (!postExist) {
    return Helper.failResponse(response, 404, {
      message: `Blog Post with id: ${postId} does not exist`,
    });
  }

  request.post = postExist;
  return next();
};

module.exports = verifyPostIdExist;
