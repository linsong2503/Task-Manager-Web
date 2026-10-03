import express from "express";

import { authController } from "../../../controllers/index.js";
import validate from "../../../middlewares/validate.js";
import auth from "../../../middlewares/auth.js";

const router = express.Router();

router.post(
  "/users",
  validate(authController.register),
  authController.register
);

router.post(
  "/login",
  validate(authController.login),
  authController.login
);

router.post(
  "/logout",
  validate(authController.logout),
  authController.logout
);

router.post(
  "/refresh-tokens",
  validate(authController.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/forgot-password",
  validate(authController.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authController.resetPassword),
  authController.resetPassword
);

router.post(
  "/change-password",
  auth,
  validate(authController.changePassword),
  authController.changePassword
);

router.post(
  "/send-verification-email",
  auth,
  authController.sendVerificationEmail
);

router.post(
  "/verify-email",
  validate(authController.verifyEmail),
  authController.verifyEmail
);

export default router;