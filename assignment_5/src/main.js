import express from "express";
import { PORT } from "./config/config.service.js";
import { connect } from "./db/connection.js";
import { data } from "./db/index.js";
import { userRouter, postRouter, commentRouter } from "./modules/index.js";
const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
await connect();
app.get("/", (req, res) => res.send("hello"));
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
app.use((err, req, res, next) => {
  return res.status(err.cause || 500).json({
    stack: err.stack,
    err,
  });
});
