import jwt from "jsonwebtoken";
import { userRole, tokenType } from "../enums/index.js";
import { configService } from "../../config/comfig.service.js";
export const createTokens = ({
  payload = {},
  options = {},
  role = userRole.user,
}) => {
  const accessToken = createToken({
    payload: payload,
    options: {
      ...options,
      expiresIn: configService.JWT_ACC_EXP,
    },
    role: role,
    tokType: tokenType.ACC,
  });
  const refreshToken = createToken({
    payload: payload,
    options: {
      ...options,
      expiresIn: configService.JWT_REF_EXP,
    },
    role: role,
    tokType: tokenType.REF,
  });
  return { accessToken, refreshToken };
};

const getSecret = (role) => {
  let user = {};
  switch (role) {
    case userRole.admin: {
      user.ACC = configService.JWT_ACC_ADMIN_SECRET;
      user.REF = configService.JWT_REF_ADMIN_SECRET;
      break;
    }
    default: {
      user.ACC = configService.JWT_ACC_USER_SECRET;
      user.REF = configService.JWT_REF_USER_SECRET;
      break;
    }
  }
  return user;
};
const createToken = ({
  payload = {},
  options = {},
  role = undefined,
  tokType = tokenType.ACC,
}) => {
  const secret =
    role != undefined ? getSecret(role) : configService.JWT_ACC_USER_SECRET;
  return jwt.sign(payload, secret[tokType], options);
};
export const verifyToken = ({
  token,
  role = userRole.user,
  tokType = tokenType.ACC,
}) => {
  const secret = getSecret(role);
  return jwt.verify(token, secret[tokType]);
};
