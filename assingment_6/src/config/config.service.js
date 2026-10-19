import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(`.env.${process.env.NODE_ENV}`) });

export const PORT = Number(process.env.PORT);
export const db = {
  DB_NAME: process.env.DB_NAME,
  DB_URL: process.env.DB_URI,
};
