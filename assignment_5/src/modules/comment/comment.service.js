import { postModle } from "../../db/model/post.model.js";
import { Op } from "sequelize";
import { commentModle } from "../../db/model/comment.model.js";
import { userModle } from "../../db/model/user.model.js";

export const createComment = async (data) => {
  return await commentModle.create({ ...data });
};
export const findOrCreate = async (data) => {
  const { userId, postId } = data;
  return await commentModle.findOrCreate({
    where: { userId, postId },
    defaults: { ...data },
  });
};
export const findRecentcomments = async (postId) => {
  return await commentModle.findAll({
    order: [["createdAt", "DESC"]],
    limit: 3,
    include: [
      {
        model: postModle,
      },
    ],
  });
};
export const getCommentByItsDetails = async (id) => {
  return await commentModle.findByPk(id, {
    include: [
      {
        model: userModle,
        as: "user",
        attributes: ["id", "name", "email"],
      },
      {
        model: postModle,
        as: "post",
        attributes: ["id", "title", "content"],
      },
    ],
  });
};
export const searchfor = async (word) => {
  return await commentModle.findAndCountAll({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });
};
export const editComment = async (id, data) => {
  let reuslt;
  const comment = await commentModle.findByPk(id);
  console.log(comment.userId, data.userId);
  if (comment && comment.userId == data.userId) {
    await commentModle.update(data, {
      where: { id },
    });
    reuslt = { success: true, message: "user updated" };
  } else if (comment) {
    reuslt = {
      success: false,
      message: "you are not the author for this comment",
    };
  }
  return reuslt;
};
