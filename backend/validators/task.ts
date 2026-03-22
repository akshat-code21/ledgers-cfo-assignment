import z from "zod";
import { Priority, TaskStatus } from "../generated/prisma/enums";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  due_date: z.coerce.date(),
  status: z.enum([
    TaskStatus.PENDING,
    TaskStatus.COMPLETED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.CANCELLED,
  ]),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
});


export const updateTaskStatusSchema = z.object({
  status: z.enum([
    TaskStatus.PENDING,
    TaskStatus.COMPLETED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.CANCELLED,
  ]),
});