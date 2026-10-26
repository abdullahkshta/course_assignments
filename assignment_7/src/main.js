import express from "express";
import { Path } from "./config/comfig.service.js";
import { con } from "./db/connction.js";
import { responses } from "./common/index.js";
import { userRouter, noteRouter } from "./module/index.js";
const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/notes", noteRouter);
console.log();
await con();
app.use(async (req, res, next) => {
  return await responses.notFound(res);
});
app.use((err, req, res, next) => {
  return res.status(err.cause || 500).json({
    stack: err.stack,
    err,
  });
});
app.listen(Path, () => console.log(`server is running on port ${Path}`));
