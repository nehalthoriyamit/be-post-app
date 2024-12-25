const { Op } = require("sequelize");
const { isEmpty } = require("lodash");
const { Users, Posts, Likes } = require("../../database/models");
const { HTTP_STATUS, HTTP_CODE } = require("../../utils/constants");
const { handleResponse } = require("../../utils/handleResponse");

// Fetch Posts Route
const getPosts = async (req, res) => {
  try {
    const result = await Posts.findAll({
      deletedAt: {
        [Op.is]: null,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Users,
          as: "userDetails",
          attributes: ["id", "name", "email"],
        },
        {
          model: Likes,
          as: "likesData",
        },
      ],
    });

    return handleResponse(
      res,
      HTTP_STATUS.SUCCESS_STATUS,
      HTTP_CODE.SUCCESS_CODE,
      "Feed list",
      { posts: result }
    );
  } catch (err) {
    console.log("getPosts Error: ", err);
    return handleResponse(
      res,
      HTTP_STATUS.ERROR_STATUS,
      HTTP_CODE.SERVER_ERROR_CODE,
      "Server error"
    );
  }
};

// Create Post
const addPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { currentUser } = req;

    if (!content) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.BAD_REQUEST_CODE,
        "Content is required"
      );
    }

    const bodyData = {
      content,
      userId: currentUser.id,
    };

    const postRes = await Posts.create(bodyData);
    if (!postRes || isEmpty(postRes)) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.CONFLICT_CODE,
        "Post not created"
      );
    }

    const postData = await Posts.findOne({
      where: {
        id: postRes?.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Users,
          as: "userDetails",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return handleResponse(
      res,
      HTTP_STATUS.SUCCESS_STATUS,
      HTTP_CODE.RESOURCE_CREATED_CODE,
      "Post created successfully",
      { post: { ...postData?.dataValues, likes: 0, likesData: [] } }
    );
  } catch (err) {
    console.log("addPost Error: ", err);
    return handleResponse(
      res,
      HTTP_STATUS.ERROR_STATUS,
      HTTP_CODE.SERVER_ERROR_CODE,
      "Server error"
    );
  }
};

// Post like/remove-like
const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { currentUser } = req;

    if (!postId) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.BAD_REQUEST_CODE,
        "PostId is required"
      );
    }

    const postQry = {
      where: {
        id: postId,
        deletedAt: {
          [Op.is]: null,
        },
      },
    };

    const postExistsRes = await Posts.findOne(postQry);
    if (!postExistsRes) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.NOT_FOUND_CODE,
        "Post not found"
      );
    }

    const userId = currentUser.id;
    const likePost = await Likes.findOne({ where: { postId, userId } });

    if (likePost) {
      await likePost.destroy();
    } else {
      await Likes.create({ postId, userId });
    }

    const post = await Posts.findOne({
      where: {
        id: postId,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: [
        { model: Likes, as: "likesData" },
        {
          model: Users,
          as: "userDetails",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const likesCount = await Likes.count({ where: { postId } });

    return handleResponse(
      res,
      HTTP_STATUS.SUCCESS_STATUS,
      HTTP_CODE.SUCCESS_CODE,
      "Post's like is updated",
      { post: { ...post.dataValues, likes: likesCount } }
    );
  } catch (err) {
    console.log("toggleLikePost Error: ", err);
    return handleResponse(
      res,
      HTTP_STATUS.ERROR_STATUS,
      HTTP_CODE.SERVER_ERROR_CODE,
      "Server error"
    );
  }
};

module.exports = { getPosts, addPost, toggleLikePost };
