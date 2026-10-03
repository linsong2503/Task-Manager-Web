import httpStatus from "http-status";
import ApiError from "../utils/apiError.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Please authenticate"
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden"
        )
      );
    }

    next();
  };
};

export default authorize;