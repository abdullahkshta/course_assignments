import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(`.env.${process.env.NODE_ENV}`) });

export const Path = Number(process.env.PORT);
export const URI = process.env.URI;
