import { Router } from "express";
import * as cs from "./comment.service.js";
export const commentRouter = Router();
commentRouter.post("/", async (req, res) => {
  try {
    let data = [];
    const { comments } = req.body;
    //     console.log(req.body);
    //     return res.json({ data: comments });
    for await (let comm of comments) {
      console.log(data);
      const comment = await cs.createComment(comm);
      data.push(comment);
    }
    if (data.length > 0) {
      return res.status(201).json({
        success: true,
        message: "comments created",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
commentRouter.post("/find-or-create", async (req, res) => {
  try {
    const data = req.body;
    const [comment, created] = await cs.findOrCreate(data);
    console.log(comment, created);
    if (created) {
      return res
        .status(201)
        .json({ success: true, message: "comment created" });
    } else if (comment) {
      return res.status(200).json({ success: true, data: comment });
    }
  } catch (err) {
    if (err.parent.errno == 1452) {
      return res.status(400).json({
        success: false,
        message: "there is foreign key notFound not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "there is something worrnge ",
    });
  }
});
commentRouter.get("/newest/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(Number(postId));
    const data = await cs.findRecentcomments(Number(postId));
    if (data.length > 0) {
      return res.json({
        success: true,
        data: data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "there are no comments for this postId",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server" + err,
    });
  }
});
commentRouter.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cs.getCommentByItsDetails(Number(id));
    console.log(data);
    if (data) {
      return res.json({
        success: true,
        data: data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "there is no comment id",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server" + err,
    });
  }
});
commentRouter.get("/search", async (req, res) => {
  try {
    const { word } = req.query;
    const { count, rows } = await cs.searchfor(word);
    if (count > 0) {
      return res.json({
        success: true,
        data: {
          count: count,
          comments: rows,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `there are no comments has this value -> (${word})`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server" + err,
    });
  }
});
commentRouter.patch("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const data = req.body;
    const result = await cs.editComment(Number(commentId), data);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server" + err,
    });
  }
});
