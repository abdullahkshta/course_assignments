import { Router } from "express";
import { ObjectId } from "mongodb";
import * as logService from "./logs.service.js";
import * as commenService from "../common.service.js";
import * as re from "../../commen/utils/responses.js";
export const logRouter = Router();

logRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    const { book_id } = req.body;
    const objId = new ObjectId(book_id);
    if (!data || typeof data !== "object") return re.badReq(res);
    const check = await commenService.findBK("books", { _id: objId });
    if (!check) return re.badReq(res, "there is no book by this book id");
    console.log(check);
    const result = await commenService.insertDocs("logs", data);
    if (result.insertedIds) return re.created(res);
    return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
logRouter.use((err, req, res, next) => {
  return re.notFound(res);
});
