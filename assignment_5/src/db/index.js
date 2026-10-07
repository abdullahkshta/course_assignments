import { sequelize } from "./connection.js";
import { userModle } from "./model/user.model.js";
import { postModle } from "./model/post.model.js";
import { commentModle } from "./model/comment.model.js";
userModle.hasMany(postModle, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
userModle.hasMany(commentModle, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
postModle.belongsTo(userModle, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
commentModle.belongsTo(userModle, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
postModle.hasMany(commentModle, {
  foreignKey: "postId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
commentModle.belongsTo(postModle, {
  foreignKey: "postId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
export const data = {
  userModle,
  postModle,
  commentModle,
  sequelize,
};
