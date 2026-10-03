import express from "express";
import { taskController } from "../../../controllers/index.js";
import auth from "../../../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, taskController.createTask);

router.get("/", auth, taskController.getTasks);

router.get("/:id", auth, taskController.getTaskById);

router.patch("/:id", auth, taskController.updateTaskById);

router.delete("/:id", auth, taskController.deleteTaskById);

export default router;