import { Router } from "express";
import * as collService from "./collection.service.js";
import * as commenService from "../common.service.js";
import * as re from "../../commen/utils/responses.js";
export const collRouter = Router();

collRouter.post("/books", async (req, res) => {
  try {
    await collService.createColletion("books");
    return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
collRouter.post("/author", async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== "object") {
      return re.badReq(res, "there are no data to create them");
    }
    await commenService.insertDocs("author", data);
    return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
collRouter.post("/logs/capped", async (req, res) => {
  try {
    const { limt } = req.body;
    if (!limt) return re.badReq(res, "there is no limt to set it");
    await collService.createCollectionCapped("logs", parseInt(limt));
    return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
collRouter.post("/books/index", async (req, res) => {
  try {
    const { field } = req.body;
    if (!field) return re.badReq(res);
    await commenService.addIndex("books", field);
    return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
collRouter.use((err, req, res, next) => {
  return re.notFound(res);
});
