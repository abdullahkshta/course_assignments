import { Router } from "express";
import * as ps from "./post.service.js";
export const postRouter = Router();
postRouter.post("/", async (req, res) => {
  try {
    const post = await ps.createPost(req.body);
    if (post) {
      return res.status(201).json({
        success: true,
        message: "post created",
      });
    }
  } catch (err) {
    if (err.parent?.errno == 1452) {
      return res.status(400).json({
        success: false,
        message: "there is no user by this id ",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "there is something worrng in the server",
      });
    }
  }
});
postRouter.delete("/:postId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;
    const data = await ps.deletePost(Number(postId), userId);
    console.log(data);
    if (data) {
      return res.status(data.success ? 200 : 400).json(data);
    } else {
      res.status(400).json({
        success: false,
        message: "post id not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server",
    });
  }
});
postRouter.get("/details", async (req, res) => {
  try {
    const data = await ps.getAllDetails();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server",
    });
  }
});
postRouter.get("/comment-count", async (req, res) => {
  try {
    const data = await ps.getComment_countForPosts();
    return res.send(data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "there is something worrng in the server " + err,
    });
  }
});
