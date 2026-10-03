import express from "express";
import helmet from "helmet";
import ApiError from "./utils/apiError.js";
import router from "./routes/r1/index.js";
import httpStatus from "http-status";
import cors from "cors";
import passport from "passport";
import jwtStrategy from "./config/passport.js";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import asyncLocalStorage from "./utils/asyncLocalStorage.js";

const app = express();

app.use((req, res, next) => {
  asyncLocalStorage.run({ req }, () => {
    next();
  });
});

// security 4 HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

app.use(compression());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// r1 api routes
app.use("/r1", router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.status === 413) {
    return res.status(413).json({ message: "Payload too large" });
  }
  // next(err);
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    code: 0,
    message: err.message || "Something went wrong",
  });
});

export default app;
