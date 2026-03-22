import { Router } from "express";
import { getAllClientsController } from "../controllers/client.controller";
const clientRouter = Router();

clientRouter.get("/", getAllClientsController);

export default clientRouter;
