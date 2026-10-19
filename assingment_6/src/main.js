import express from "express";
import { PORT } from "./config/config.service.js";
import { con, db } from "./db/connection.js";
import { collRouter } from "./modules/collection/collection.controller.js";
import { booksRouter } from "./modules/books/books.controller.js";
import { logRouter } from "./modules/logs/logs.controller.js";
import * as re from "./commen/utils/responses.js";
const app = express();
await con();
app.use(express.json());
app.use("/collection", collRouter);
app.use("/books", booksRouter);
app.use("/logs", logRouter);
app.use((req, res, next) => {
  return re.notFound(res);
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
app.use((err, req, res, next) => {
  return res.status(err.cause || 500).json({
    stack: err.stack,
    err,
  });
});
