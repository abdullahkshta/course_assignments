import { fn } from "../repos/base.repos.js";
import { userModel } from "../../db/model/user.model.js";
const model = userModel;
export const createUser = async ({ data }) => {
  return await fn.create({ model, data });
};
export const findUser = async ({ filter }) => {
  return await fn.findOne({ model, filter });
};
