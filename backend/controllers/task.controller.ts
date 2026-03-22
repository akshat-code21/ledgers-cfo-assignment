import type { TaskStatus } from "../generated/prisma/enums";
import {
  createTask,
  getAllTasks,
  updateTaskStatus,
} from "../services/task.service";
import type { Request, Response } from "express";
import { createTaskSchema, updateTaskStatusSchema } from "../validators/task";

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const tasks = await getAllTasks(clientId as string);
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get tasks",
      error: error,
    });
  }
};

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const { success, data: taskData } = createTaskSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
      return;
    }
    const task = await createTask(clientId as string, taskData);
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error,
    });
  }
};

export const updateTaskStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { clientId, taskId } = req.params;
    const { success, data: taskData } = updateTaskStatusSchema.safeParse(
      req.body,
    );
    if (!success) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
      return;
    }
    const task = await updateTaskStatus(
      clientId as string,
      taskId as string,
      taskData.status as TaskStatus,
    );
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error,
    });
  }
};
