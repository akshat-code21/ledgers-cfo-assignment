import type { TaskStatus } from "../generated/prisma/enums";
import { client } from "../models";
import type { TaskData } from "../types/task";

export const getAllTasks = async (clientId: string) => {
  try {
    const tasks = await client.task.findMany({
      where: {
        client_id: clientId,
      },
      orderBy: { created_at: "asc" },
    });
    const pending = await client.task.count({
      where: {
        client_id: clientId,
        status: "PENDING",
      },
    });
    const completed = await client.task.count({
      where: {
        client_id: clientId,
        status: "COMPLETED",
      },
    });
    const inProgress = await client.task.count({
      where: {
        client_id: clientId,
        status: "IN_PROGRESS",
      },
    });
    const cancelled = await client.task.count({
      where: {
        client_id: clientId,
        status: "CANCELLED",
      },
    });
    return {
      tasks,
      total : tasks.length,
      pending,
      completed,
      inProgress,
      cancelled,
    };
  } catch (error) {
    throw new Error("Failed to get tasks for client");
  }
};

export const createTask = async (clientId: string, taskData: TaskData) => {
  try {
    const task = await client.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        due_date: taskData.due_date,
        status: taskData.status,
        priority: taskData.priority,
        client_id: clientId,
      },
    });
    return task;
  } catch (error) {
    throw new Error("Failed to create task");
  }
};

export const updateTaskStatus = async (
  clientId: string,
  taskId: string,
  status: TaskStatus,
) => {
  try {
    const clientTask = await client.task.findUnique({
      where: {
        client_id: clientId,
        id: taskId,
      },
    });

    if (!clientTask) {
      throw new Error("Task not found for client");
    }

    const task = await client.task.update({
      where: { id: taskId },
      data: { status },
    });
    
    return task;
  } catch (error) {
    throw new Error("Failed to update task status");
  }
};
