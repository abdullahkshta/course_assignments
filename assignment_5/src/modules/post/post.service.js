import { postModle } from "../../db/model/post.model.js";
import { Sequelize } from "sequelize";
import { commentModle } from "../../db/model/comment.model.js";
import { userModle } from "../../db/model/user.model.js";
export const createPost = async (data) => {
  return await postModle.create({ ...data });
};
export const getPostPK = async (PK) => {
  const result = await postModle.findByPk(PK);
  //   console.log(result);
  return result;
};
export const deletePost = async (id, userId) => {
  const post = await getPostPK(id);
  let data;
  if (post) {
    if (post.userId == userId) {
      const result = await postModle.destroy({ where: { id, userId } });
      if (result) {
        data = { success: true, message: "post is deleted" };
      }
    } else {
      data = {
        success: false,
        message: "user is not the author for this post ",
      };
    }
  }
  console.log(data);
  return data;
};
export const getAllDetails = async () => {
  return await postModle.findAll({
    attributes: ["id", "title"],

    include: [
      { model: userModle, as: "user", attributes: ["name"] },
      { model: commentModle, as: "comments", attributes: ["id", "content"] },
    ],
  });
};
export const getComment_countForPosts = async () => {
  return await postModle.findAll({
    attributes: [
      "id",
      "title",
      [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "CommentCount"],
    ],
    include: [{ model: commentModle, as: "comments", attributes: [] }],
    group: ["postId"],
  });
};
