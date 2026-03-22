import type { TaskStatus } from "../generated/prisma/enums";
import {
  createTask,
  getAllTasks,
  updateTaskStatus,
} from "../services/task.service";
import type { Request, Response } from "express";

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
    const task = await createTask(clientId as string, req.body);
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
    const task = await updateTaskStatus(
      clientId as string,
      taskId as string,
      req.body.status as TaskStatus,
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
