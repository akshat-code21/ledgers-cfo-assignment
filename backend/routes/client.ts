import { Router } from "express";
import { getAllClients } from "../services/client.service";
const clientRouter = Router();

clientRouter.get("/", getAllClients);

export default clientRouter;
