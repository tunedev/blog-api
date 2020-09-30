const Helper = require('../utils/Helper');
const db = require('../Model');
const { successResponse } = require('../utils/Helper');

class Blog {
  static async createPost(request, response) {
    const { user } = request;
    const { title, body } = request.body;

    const newPost = new db.Post({
      title,
      body,
      author: user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const data = await newPost.save().then((post) => post.toJSON());

    return Helper.successResponse(response, 201, {
      message: 'The stuff dey work well',
      data,
    });
  }

  static async getAll(request, response) {
    const data = await db.Post.find({});

    return Helper.successResponse(response, 200, data);
  }

  static async getById(request, response) {
    const data = await db.Post.findById(request.params.postId).populate(
      'comments'
    );

    return Helper.successResponse(response, 200, data);
  }

  static async updateById(request, response) {
    const { title, body } = request.body;
    const data = await db.Post.findByIdAndUpdate(
      request.params.postId,
      { title, body, updated_at: new Date() },
      { new: true }
    );
    return Helper.successResponse(response, 200, data);
  }

  static async addCommentToPost(request, response) {
    const { body } = request.body;
    const { postId } = request.params;
    const { user } = request;

    const newComment = {
      body,
      post_id: postId,
      user_id: user.id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const data = await db.Comment.create(newComment).then(async (comment) => {
      await db.Post.findByIdAndUpdate(
        postId,
        {
          $push: { comments: comment._id },
        },
        { new: true, useFindAndModify: false }
      );
      return comment.toJSON();
    });

    return Helper.successResponse(response, 201, data);
  }

  static async getAllComment(request, response) {
    const data = await db.Comment.find({ post_id: request.params.postId });

    return successResponse(response, 200, data);
  }

  static async getCommentById(request, response) {
    const data = await db.Comment.findById(request.params.commentId);

    return successResponse(response, 200, data);
  }

  static async updateComment(request, response) {
    const { body } = request.body;
    const data = await db.Comment.findByIdAndUpdate(
      request.params.commentId,
      {
        body,
      },
      { new: true }
    );

    return successResponse(response, 200, data);
  }

  static async deleteComment(request, response) {
    const id = request.params.commentId;
    const data = await db.Comment.findByIdAndDelete(id);

    return successResponse(response, 200, {
      message: `comment with id: ${id} has been deleted`,
      data,
    });
  }
}

module.exports = Blog;
