import type { Priority, TaskStatus } from "../generated/prisma/enums";


export type TaskData = {
  title: string;
  description: string;
  category: string;
  due_date: Date;
  status: TaskStatus;
  priority: Priority;
};
