import { Router } from "express";
import * as nr from "../repos/note.repos.js";
import { responses as re } from "../../common/index.js";
import { normalizeId } from "../../common/index.js";
export const noteRouter = Router();

noteRouter.post("/", async (req, res) => {
  try {
    const userId = normalizeId(req.query.userId);
    const body = req.body;
    const data = { ...body, userId };
    const result = await nr.createNote({ data });
    if (result) return await re.created(res, "Note Created");
    return await re.badReq(res, "There is no user");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.patch("/all", async (req, res) => {
  try {
    const userId = normalizeId(req.query.userId);
    const title = req.body.title;
    const data = { title };
    const result = await nr.updateAllNotes({ userId, data });
    if (result) return re.actionDone(res, "All Notes Updated");
    return re.badReq(res, "No Note Found");
  } catch (err) {
    // return await re.serverError(res, err);
  }
});
noteRouter.patch("/:noteId", async (req, res) => {
  try {
    const noteId = normalizeId(req.params.noteId),
      userId = normalizeId(req.query.userId),
      body = req.body;
    const result = await nr.updateNote({ noteId, userId, data: body });
    if (result != undefined || result != null) {
      return await re.actionDone(res, "data Updated", result);
    } else if (result == undefined) {
      return await re.badReq(res, "you are not the Owner");
    }
    return await re.badReq(res, "Note Not Found");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.put("/replace/:noteId", async (req, res) => {
  try {
    const noteId = normalizeId(req.params.noteId),
      userId = normalizeId(req.body.userId),
      body = req.body;
    body.userId = userId;

    const result = await nr.updateNote({ noteId, userId, data: body });
    if (result != undefined || result != null) {
      return await re.actionDone(res, "data Updated", result);
    } else if (result == undefined) {
      return await re.badReq(res, "you are not the Owner");
    }
    return await re.badReq(res, "Note Not Found");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.delete("/deleteAll", async (req, res) => {
  try {
    const userId = normalizeId(req.query.userId);
    const result = await nr.deleteAll({ userId });
    if (result.deletedCount > 0) {
      return await re.actionDone(res, "all notes deleted successfully");
    }
    return await re.badReq(res, "there are no notes for this user");
  } catch (err) {
    return await re.serverError(res, err);
  }
});

noteRouter.delete("/:noteId", async (req, res) => {
  try {
    const noteId = normalizeId(req.params.noteId),
      userId = normalizeId(req.query.userId);
    const result = await nr.deleteNote({ noteId, userId });
    if (result) {
      return await re.actionDone(res, "data delete", result);
    }
    return await re.badReq(res, "you are not the Owner");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.get("/paginate-sort", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const where = normalizeId(req.query.userId);
    const sort = "createdAt";
    const data = await nr.RetrievePaginated({
      where,
      limit,
      page,
      sort,
    });
    if (data) {
      return await re.fetched(res, data);
    } else {
      return await re.badReq(res, "there is no data to fetch it");
    }
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.get("/note-by-content", async (req, res) => {
  try {
    const content = req.query.content;
    const userId = normalizeId(req.query.userId);
    const result = await nr.findByContentSearch({ content, userId });
    if (result) {
      if (result.onwer) {
        return await re.fetched(res, result.data);
      } else {
        return await re.badReq(res, "you are not the onwer");
      }
    }
    return await re.badReq(res, "no Note founded ");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.get("/note-with-user", async (req, res) => {
  try {
    const userId = normalizeId(req.query.userId);
    const data = await nr.getNotesAndUserInfo({ userId });
    if (data) return await re.fetched(res, data);
    return await re.badReq(res);
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.get("/aggregate", async (req, res) => {
  try {
    const title = req.query.title;
    const userId = normalizeId(req.query.userId);
    const result = await nr.getUsingAggregation({ title, userId });
    if (result) {
      return await re.fetched(res, result.data);
    }
    return await re.badReq(res, "no Note founded ");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.get("/:noteId", async (req, res) => {
  try {
    const noteId = normalizeId(req.params.noteId);
    const userId = normalizeId(req.query.userId);
    const result = await nr.findNoteById({ noteId, userId });
    if (result) {
      if (result.onwer) {
        return await re.fetched(res, result.data);
      } else {
        return await re.badReq(res, "you are not the onwer");
      }
    }
    return await re.badReq(res, "no Note founded ");
  } catch (err) {
    return await re.serverError(res, err);
  }
});
noteRouter.use(async (req, res, next) => {
  return await re.notFound(res);
});
noteRouter.use((err, req, res, next) => {
  return res.status(err.cause || 500).json({
    stack: err.stack,
    err,
  });
});
