import { client } from "../models";

export const getAllClients = async () => {
  try {
    const clients = await client.client.findMany();
    return clients;
  } catch (error) {
    throw new Error("Failed to get clients");
  }
};
