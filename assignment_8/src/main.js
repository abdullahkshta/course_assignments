import express from "express";
import { configService } from "./config/comfig.service.js";
import { con } from "./db/connction.js";
import { errHandler, decryption } from "./common/index.js";
import { authRouter, userRouter } from "./module/index.js";

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
await con();
app.use((req, res, next) => {
  const error = new Error(`Page not found: ${req.originalUrl}`);
  error.cause = 404;
  next(error);
});

app.use(errHandler);
app.listen(configService.PATH, () =>
  console.log(`server is running on port ${configService.PATH}`),
);
