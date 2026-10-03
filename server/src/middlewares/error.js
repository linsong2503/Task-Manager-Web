import mongoose from "mongoose";
import httpStatus from "http-status";

import config from "../config/config.js";
import ApiError from "../utils/apiError.js";
import logger from "../config/logger.js";

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof mongoose.Error) {
      statusCode = httpStatus.BAD_REQUEST;
    }

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    const message = error.message || httpStatus[statusCode];

    error = new ApiError(
      statusCode,
      message,
      false,
      err.stack
    );
  }

  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && {
      stack: err.stack,
    }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export default {
  errorConverter,
  errorHandler,
};