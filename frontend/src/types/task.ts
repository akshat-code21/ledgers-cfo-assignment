export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDING" | "COMPLETED" | "IN_PROGRESS" | "CANCELLED";

export type TaskData = {
  title: string;
  description: string;
  category: string;
  due_date: Date;
  status: TaskStatus;
  priority: Priority;
};

