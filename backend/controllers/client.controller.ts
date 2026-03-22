import type { Request, Response } from "express";
import { getAllClients } from "../services/client.service";

export const getAllClientsController = async (req: Request, res: Response) => {
  try {
    const clients = await getAllClients();
    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get clients",
      error: error,
    });
  }
};
