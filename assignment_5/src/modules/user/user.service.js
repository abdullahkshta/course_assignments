import { userModle } from "../../db/model/user.model.js";

export const createUser = async (data) => {
  let { name, email, password, role } = data;
  return await userModle.create({ name, email, password, role });
};
export const upsertUser = async (id, data) => {
  const { name, email, password, role } = data;
  return await userModle.upsert({
    id,
    name,
    email,
    password,
    role,
  });
};
export const getUserByEmail = async (email) => {
  return await userModle.findOne({ where: { email } });
};
export const getUserPK = async (id) => {
  return await userModle.findByPk(id, {
    attributes: { exclude: ["role", "password", "deletedAt"] },
  });
};
