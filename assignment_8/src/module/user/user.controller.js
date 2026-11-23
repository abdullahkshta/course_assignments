import { Router } from "express";
import * as us from "./user.service.js";
import {
  responses as re,
  auth,
  tokenType,
  normalizeId,
  decryption,
  authoriz,
  userRole,
} from "../../common/index.js";
export const userRouter = Router();
userRouter.get("/profile", auth(tokenType.ACC), async (req, res, next) => {
  try {
    return re.fetched(res, req.user);
  } catch (err) {
    return re.serverError(res, err);
  }
});
userRouter.get(
  "/admin-profile",
  auth(tokenType.ACC),
  authoriz([userRole.admin]),
  async (req, res, next) => {
    try {
      return re.fetched(res, req.user, "welcome admin");
    } catch (err) {
      return re.serverError(res, err);
    }
  },
);
// userRouter.use(async (req, res, next) => {
//   return await re.notFound(res);
// });
// userRouter.use((err, req, res, next) => {
//   return res.status(err.cause || 500).json({
//     stack: err.stack,
//     err,
//   });
// });
