import { Router } from "express";
import * as us from "./user.service.js";
export const userRouter = Router();
userRouter.post("/signup", async (req, res) => {
  try {
    let user = await us.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "user created",
      data: user,
    });
  } catch (err) {
    if (err.parent?.errno === 1062) {
      return res.status(400).json({
        success: false,
        message: "user email is exsits",
      });
    } else {
      return res.status(500).json({
        message: "there is something worrng in the server",
      });
    }
  }
});
userRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    const [user, create] = await us.upsertUser(id, data);
    return res.status(create ? 201 : 200).json({
      success: true,
      message: create ? "user created" : "user updated",
      data: user,
    });
  } catch (err) {
    if (err.parent?.errno === 1062) {
      return res.status(400).json({
        success: false,
        message: "user email is exsits",
      });
    } else {
      return res.status(500).json({
        message: "there is something worrng in the server",
      });
    }
  }
});
userRouter.get("/by-email", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await us.getUserByEmail(email);
    if (user) {
      return res.json({
        success: true,
        data: user,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "there is no user email",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "there is something worrng in server" });
  }
});
userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await us.getUserPK(id);
    if (user) {
      return res.json({
        success: true,
        data: user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "there is something worrng in server" });
  }
});
