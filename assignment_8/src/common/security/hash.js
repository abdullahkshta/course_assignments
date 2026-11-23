import { hash, compare, genSalt } from "bcrypt";
import { configService } from "../../config/comfig.service.js";
import { hashingEnum } from "../index.js";
import { hash as argonHash, verify } from "argon2";
export const hashData = async ({ plainText, minor = "b", lib }) => {
  switch (lib) {
    case hashingEnum.argon2:
      return await argonHash(plainText);
    default:
      return await hash(plainText, await genSalt(configService.SALT, minor));
  }
};
export const compareHashed = async ({ plainText, encrypted, lib }) => {
  switch (lib) {
    case hashingEnum.argon2:
      return await verify(encrypted, plainText);
    default:
      return await compare(plainText, encrypted);
  }
};
