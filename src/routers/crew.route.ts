import CrewController from "controllers/crew.controller";
import { asyncResponseHandler } from "Errors/ErrorHandler";
import { Router } from "express";
import { identifer } from "middlewares/identification";

const CrewRouter = Router();

CrewRouter.use(identifer)
CrewRouter.get('/', asyncResponseHandler(CrewController.getUserCrew))

export default CrewRouter;