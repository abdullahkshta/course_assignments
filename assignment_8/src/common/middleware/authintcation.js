import { responses as re, normalizeId } from "../utils/index.js";
import { userRole, verifyToken, decryption } from "../index.js";
import { findUser } from "../../module/user/user.service.js";

import jwt from "jsonwebtoken";
export const auth = (tokenType) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const { audience } = jwt.decode(token);

      if (!token) re.badReq(res, undefined, "there is no token");
      const payload = verifyToken({
        token: token,
        role: audience[0],
        tokType: tokenType,
      });
      const userId = normalizeId(payload.sub);
      const user = await findUser({
        filter: { _id: userId, role: audience[0] },
      });
      if (!user) {
        return re.badReq(res, undefined, "user not found");
      }
      user.phone = decryption(user.phone);
      req.user = user;
      req.payload = payload;
      next();
    } catch (err) {
      return re.serverError(res, err);
    }
  };
};
