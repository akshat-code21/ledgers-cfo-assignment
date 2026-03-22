import { Router } from "express";
import {
  createTaskController,
  getAllTasksController,
  updateTaskStatusController,
} from "../controllers/task.controller";
const taskRouter = Router();

taskRouter.get("/:clientId", getAllTasksController);
taskRouter.post("/:clientId", createTaskController);
taskRouter.put("/:clientId/:taskId/status", updateTaskStatusController);

export default taskRouter;
