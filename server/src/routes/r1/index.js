import express from "express";
import taskRoute from "./task/task.route.js";
import authRoute from "./auth/auth.route.js";

const router = express.Router();

router.use("/tasks", taskRoute);
router.use("/auth", authRoute);

export default router;
