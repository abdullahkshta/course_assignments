import crypto from "node:crypto";
import { configService } from "../../config/comfig.service.js";
const { CRYPTO_KEY, CRYPTO_IV, CRYPTO_ALGO } = configService;
const key = Buffer.from(CRYPTO_KEY, "hex");

export const encrypted = (text) => {
  const iv = crypto.randomBytes(CRYPTO_IV);
  const cipherIv = crypto.createCipheriv(CRYPTO_ALGO, key, iv);
  let result = cipherIv.update(text, "utf-8", "hex");
  result += cipherIv.final("hex");
  return `${iv.toString("hex")}::${result}`;
};

export const decryption = (cypherText) => {
  const [hexIv, encryptedText] = cypherText.split("::");
  const iv = Buffer.from(hexIv, "hex");
  const decypherIv = crypto.createDecipheriv(CRYPTO_ALGO, key, iv);
  let result = decypherIv.update(encryptedText, "hex", "utf-8");
  result += decypherIv.final("utf-8");
  return result;
};
