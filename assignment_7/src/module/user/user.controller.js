import { Router } from "express";
import * as ur from "../repos/user.repos.js";
import { responses as re } from "../../common/index.js";
import { normalizeId } from "../../common/index.js";
export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user = await ur.createUser({ data });
    if (user) {
      return re.created(res, "user signed-up Successfully");
    } else {
      return re.badReq(res, "Email is already Exists");
    }
  } catch (err) {
    if (err.code == 11000) {
      return re.badReq(res, "Email is already Exists");
    }
    return re.serverError(res, err);
  }
});
userRouter.post("/login", async (req, res) => {
  try {
    const filter = req.body;
    const user = await ur.findUser({ filter });
    if (user) {
      return re.created(res, "user logged-in Successfully");
    } else {
      return re.badReq(res, "make sure on data that you submited");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
userRouter.patch("/:id", async (req, res) => {
  try {
    const filter = normalizeId(req.params.id);
    const data = req.body;
    const { password } = data;
    if (password) return await re.badReq(res, "can't update password ");
    const user = await ur.updateUser({ filter, data });
    if (user) {
      return await re.actionDone(res, "user Updated", user);
    }
    return await re.badReq(res, "User Not Found ");
  } catch (err) {
    if (err.code == 11000) {
      return re.badReq(res, "Email is already Exists");
    }
    return await re.serverError(res, err);
  }
});
userRouter.delete("/", async (req, res) => {
  try {
    const filter = normalizeId(req.query.id);
    const result = await ur.deleteUser({ filter });
    if (result.deletedCount > 0) {
      return await re.actionDone(res, "User deleted");
    }
    return re.badReq(res, "User undefined");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
userRouter.get("/", async (req, res) => {
  try {
    const BK = normalizeId(req.query.id);
    const result = await ur.getUserBK({ BK });
    if (result) {
      return await re.fetched(res, result);
    }
    return await re.badReq(res, "User Not Found");
  } catch (err) {
    return await re.serverError(res, err);
  }
});

userRouter.use(async (req, res, next) => {
  return await re.notFound(res);
});
userRouter.use((err, req, res, next) => {
  return res.status(err.cause || 500).json({
    stack: err.stack,
    err,
  });
});
