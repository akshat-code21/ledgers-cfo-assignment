export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDING" | "COMPLETED" | "IN_PROGRESS" | "CANCELLED";
export type EntityType = "PRIVATE_LIMITED" | "PUBLIC" | "ONE_PERSON_COMPANY" | "LLP" | "NON_PROFIT";

export type TaskData = {
  title: string;
  description: string;
  category: string;
  due_date: Date;
  status: TaskStatus;
  priority: Priority;
};

export type Client = {
  id: string;
  company_name: string;
  country: string;
  entity_type: EntityType;
};

