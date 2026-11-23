import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(`.env.${process.env.NODE_ENV}`) });
export const configService = {
  PATH: Number(process.env.PORT),
  URI: process.env.URI,
  SALT: Number(process.env.SALT),
  CRYPTO_KEY: process.env.CRYPTO_KEY,
  CRYPTO_ALGO: process.env.CRYPTO_ALGO,
  CRYPTO_IV: Number(process.env.CRYPTO_IV),
  JWT_ACC_ADMIN_SECRET: process.env.JWT_ACC_ADMIN_SECRET,
  JWT_REF_ADMIN_SECRET: process.env.JWT_REF_ADMIN_SECRET,
  JWT_ACC_USER_SECRET: process.env.JWT_ACC_USER_SECRET,
  JWT_REF_USER_SECRET: process.env.JWT_REF_USER_SECRET,
  JWT_ACC_EXP: Number(process.env.JWT_ACC_EXP),
  JWT_REF_EXP: process.env.JWT_REF_EXP,
};
