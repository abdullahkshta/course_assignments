import { Router } from "express";
import * as ur from "./auth.service.js";
import {
  hashingEnum,
  hashData,
  compareHashed,
  encrypted,
  responses as re,
  createTokens,
  auth,
  tokenType,
  userRole,
} from "../../common/index.js";
import { configService } from "../../config/comfig.service.js";
export const authRouter = Router();
// const lib = hashingEnum.argon2;
const lib = "";
authRouter.post("/signup", async (req, res, next) => {
  try {
    req.body.password = await hashData({ plainText: req.body.password, lib });
    req.body.phone = encrypted(req.body.phone);
    const user = await ur.createUser({ data: req.body });
    if (user) {
      return re.created(res, "", "user signed-up Successfully");
    } else {
      return re.badReq(res, undefined, "Email is already Exists");
    }
  } catch (err) {
    if (err.code == 11000) {
      return re.badReq(res, 409, "Email is already Exists");
    }
    return re.serverError(res, err);
  }
});
authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await ur.findUser({ filter: { email: req.body.email } });
    if (user) {
      const compare = await compareHashed({
        plainText: req.body.password,
        encrypted: user.password,
        lib,
      });
      if (compare) {
        const data = {
          tokens: createTokens({
            payload: { sub: user._id, audience: [user.role] },
            role: user.role,
          }),
        };
        return re.fetched(res, data, "user logged-in Successfully");
      }
    }
    return re.badReq(res, undefined, "make sure on data that you submited");
  } catch (err) {
    return re.serverError(res, err);
  }
});
authRouter.post(
  "/rotate-token",
  auth(tokenType.REF),
  async (req, res, next) => {
    try {
      const payload = req.payload;
      const accTokenEXP = payload.iat + configService.JWT_ACC_EXP;
      const currDate = Math.ceil(Date.now() / 1000);
      console.log(currDate);
      console.log(accTokenEXP);

      if (accTokenEXP <= currDate) {
        const token = createTokens({
          payload: {
            sub: payload.sub,
            audience: [payload.audience[0]],
            role: payload.audience[0],
          },
        });
        return re.created(res, { token }, "New Token Created");
      }
      return re.badReq(res, 409, "Token Still valid");
    } catch (err) {
      return re.serverError(res, err);
    }
  },
);
