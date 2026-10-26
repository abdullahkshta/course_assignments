import { fn } from "./base.repos.js";
import { userModel } from "../../db/index.js";
const model = userModel;
export const createUser = async ({ data }) => {
  return await fn.create({ model, data });
};
export const findUser = async ({ filter }) => {
  return await fn.findOne({ model, filter });
};
export const updateUser = async ({ filter, data }) => {
  return await fn.updateOne({ model, filter, data });
};
export const deleteUser = async ({ filter }) => {
  return await fn.deleteOne({ model, filter });
};
export const getUserBK = async ({ BK }) => {
  return await fn.findBK({ model, BK });
};
