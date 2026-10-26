import { StatusCodes } from "http-status-codes";

const responses = {
  fetched: (res, data, message = "Data Fetched") => {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: message,
      data: data,
    });
  },

  created: (res, message = "Data Created") => {
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: message,
    });
  },

  actionDone: (res, message = "Action is done", data = undefined) => {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: message,
      data: data ? data : "",
    });
  },

  notFound: (res, message = "Page not found ") => {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: message,
    });
  },

  badReq: (res, message = "bad Request") => {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: message,
    });
  },

  serverError: (
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
  },
};
export default responses;
