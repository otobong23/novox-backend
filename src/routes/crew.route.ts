import CrewController from "controllers/crew.controller";
import { Router } from "express";
import { identifer } from "middlewares/identification";

const CrewRouter = Router();

CrewRouter.use(identifer)
CrewRouter.get('/', CrewController.getUserCrew)

export default CrewRouter;