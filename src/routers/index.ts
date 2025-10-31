import { Request, Response, Router } from "express";
import AuthRouter from "./auth.route";
import TransactionRouter from "./transaction.route";
import AdminRouter from "./admin.route";
import ProfileRouter from "./profile.route";
import CrewRouter from "./crew.route";

const AppRouter = Router();

AppRouter.use('/auth', AuthRouter)
AppRouter.use('/transaction', TransactionRouter)
AppRouter.use('/admin', AdminRouter)
AppRouter.use('/profile', ProfileRouter)
AppRouter.use('/crew', CrewRouter)

export default AppRouter;