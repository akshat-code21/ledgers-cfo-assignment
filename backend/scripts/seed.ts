import type {
  EntityType,
  Priority,
  TaskStatus,
} from "../generated/prisma/enums";
import { client } from "../models";

export const clientSeed = async () => {
  const countries: string[] = [
    "US",
    "UK",
    "CA",
    "AU",
    "NZ",
    "SG",
    "HK",
    "JP",
    "KR",
    "CN",
  ];
  const entityTypes: string[] = [
    "PRIVATE_LIMITED",
    "PUBLIC",
    "ONE_PERSON_COMPANY",
    "LLP",
    "NON_PROFIT",
  ];
  const companyNames: string[] = [
    "Client 1",
    "Client 2",
    "Client 3",
    "Client 4",
    "Client 5",
    "Client 6",
    "Client 7",
    "Client 8",
    "Client 9",
    "Client 10",
  ];
  for (let i = 0; i < 10; i++) {
    await client.client.create({
      data: {
        company_name: companyNames[i] as string,
        country: countries[
          Math.floor(Math.random() * countries.length)
        ] as string,
        entity_type: entityTypes[
          Math.floor(Math.random() * entityTypes.length)
        ] as EntityType,
      },
    });
  }
};

// clientSeed()
//   .then(() => client.$disconnect())
//   .catch((e) => {
//     console.error(e);
//     client.$disconnect();
//     process.exit(1);
//   });

export const taskSeed = async () => {
  const clients = await client.client.findMany();
  const tasks: string[] = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"];
  const descriptions: string[] = [
    "Description 1",
    "Description 2",
    "Description 3",
    "Description 4",
    "Description 5",
  ];
  const categories: string[] = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];
  const priorities: string[] = ["LOW", "MEDIUM", "HIGH"];
  const statuses: string[] = [
    "PENDING",
    "COMPLETED",
    "IN_PROGRESS",
    "CANCELLED",
  ];
  for (let i = 0; i < clients.length; i++) {
    for (let j = 0; j < 5; j++) {
      await client.task.create({
        data: {
          title: tasks[j] as string,
          description: descriptions[j] as string,
          category: categories[j] as string,
          due_date: new Date(
            new Date().setDate(
              new Date().getDate() + Math.floor(Math.random() * 10),
            ),
          ),
          status: statuses[
            Math.floor(Math.random() * statuses.length)
          ] as TaskStatus,
          priority: priorities[
            Math.floor(Math.random() * priorities.length)
          ] as Priority,
          client_id: clients[i]?.id as string,
        },
      });
    }
  }
};


taskSeed()
  .then(() => client.$disconnect())
  .catch((e) => {
    console.error(e);
    client.$disconnect();
    process.exit(1);
  });
