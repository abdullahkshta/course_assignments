import { Router } from "express";
import * as booksService from "./books.service.js";
import * as commenService from "../common.service.js";
import * as re from "../../commen/utils/responses.js";
export const booksRouter = Router();

booksRouter.post("/batch", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) return re.badReq(res);
    const result = await commenService.insertDocs("books", data);
    if (result.insertedIds) return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== "object") return re.badReq(res);
    const result = await commenService.insertDocs("books", data);
    if (result.insertedIds) return re.created(res);
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.patch("/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const data = req.body;
    if (!data || typeof data !== "object") {
      return re.badReq(res, "there is no data to send it ");
    }
    const result = commenService.Update("books", { title: title }, data);
    if (result.modifiedCount < 0) {
      return re.actionDone(res, "data Updated");
    } else {
      re.badReq(res, "data is already exists");
    }
  } catch (err) {
    return res.serverError(res, err);
  }
});
booksRouter.get("/title", async (req, res) => {
  try {
    const data = req.query;
    if (!data || typeof data !== "object") {
      return re.badReq(res, "you have to send the data to look for it ");
    }
    const result = await commenService.findBK("books", data);
    if (result) {
      return re.fetched(res, result);
    } else {
      return res.badReq(res, "there is no book by this title");
    }
  } catch (err) {
    return res.serverError(res, err);
  }
});
booksRouter.get("/year", async (req, res) => {
  try {
    const data = req.query;
    if (!data || typeof data !== "object") {
      return re.badReq(res, "you have to send the data to look for it ");
    }
    const condition = {
      year: { $gte: Number(data["from"]), $lte: Number(data["to"]) },
    };
    const result = await commenService.findAll("books", condition);
    if (result.length) {
      console.log(result);
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there is no books in this period");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/genre", async (req, res) => {
  try {
    const data = req.query;
    if (!data || typeof data !== "object") {
      return re.badReq(res, "you have to send the data to look for it ");
    }
    const condition = { genres: data["genre"] };
    const result = await commenService.findAll("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there is no books by this genre");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/skip-limit", async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== "object") {
      return re.badReq(res, "you have to send the data to look for it ");
    }
    const condition = [
      { $sort: { year: -1 } },
      { $skip: data["skip"] },
      { $limit: data["limit"] },
    ];
    const result = await commenService.getByAggregate("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there is no books by this genre");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/year-integer", async (req, res) => {
  try {
    const condition = { year: { $type: "int" } };
    const result = await commenService.findAll("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there is no books by this genre");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/exclude-genres", async (req, res) => {
  try {
    const { genres } = req.body;
    const arr = [];
    if (genres.length > 0) {
      for (let i = 0; i < genres.length; i++) {
        arr.push({ genres: { $ne: genres[i] } });
      }
    }
    const condition = { $or: arr };

    const result = await commenService.findAll("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there is no books by this genre");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/aggregate1", async (req, res) => {
  try {
    const { after } = req.body;
    const condition = [
      { $match: { year: { $gt: after } } },
      { $sort: { year: -1 } },
    ];

    const result = await commenService.getByAggregate("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there are no books ");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/aggregate2", async (req, res) => {
  try {
    const { year } = req.body;
    const condition = [
      { $match: { year: { $gt: year } } },
      { $project: { title: 1, auther: 1, year: 1, _id: 0 } },
    ];

    const result = await commenService.getByAggregate("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there are no books ");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/aggregate3", async (req, res) => {
  try {
    const condition = [
      { $unwind: "$genres" },
      { $project: { title: 1, genres: 1, _id: 0 } },
    ];

    const result = await commenService.getByAggregate("books", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there are no books ");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.get("/aggregate4", async (req, res) => {
  try {
    const condition = [
      {
        $lookup: {
          from: "books",
          let: { localId: { $toObjectId: "$book_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$localId"] } } },
            { $project: { _id: 0, genres: 0 } },
          ],
          as: "book_detalis",
        },
      },
      { $project: { _id: 0, book_id: 0 } },
    ];

    const result = await commenService.getByAggregate("logs", condition);
    if (result.length) {
      return re.fetched(res, result);
    } else {
      return re.badReq(res, "there are no books ");
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.delete("/before-year", async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return re.badReq(res, "there is you year to compare with it ");
    const condition = { year: { $lt: Number(year) } };
    const result = await commenService.deleteDocs("books", condition);
    if (result.deletedCount > 0) {
      return re.actionDone(res, "books are deleted");
    } else {
      return re.badReq(res, `there are on books before this year -> (${year})`);
    }
  } catch (err) {
    return re.serverError(res, err);
  }
});
booksRouter.use((err, req, res, next) => {
  return re.notFound(res);
});
