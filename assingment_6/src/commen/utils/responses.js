import { StatusCodes } from "http-status-codes";

export const fetched = (res, data, message = "Data Fetched") => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: message,
    data: data,
  });
};

export const created = (res, message = "Data Created") => {
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: message,
  });
};

export const actionDone = (res, message = "Action is done") => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: message,
  });
};

export const notFound = (res, message = "Page not found ") => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: message,
  });
};

export const badReq = (res, message = "bad Request") => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: message,
  });
};

export const serverError = (
  res,
  error = null,
  message = "There is something worrng in the server",
) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: message,
    error: error.stack,
    //     error: process.env.NODE_ENV === "development" ? error?.message : undefined,
  });
};
