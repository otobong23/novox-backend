import AuthController from "../controllers/auth.controller";
import { asyncResponseHandler } from "../Errors/ErrorHandler";
import { Request, Response, Router } from "express";
import { identifer } from "../middlewares/identification";
import { validate } from "../middlewares/Validator";
import { loginSchema, sendVerificationSchema, signupSchema } from "../validators/auth.validator";

const AuthRouter = Router();

AuthRouter.post('/login', validate(loginSchema), asyncResponseHandler(AuthController.login))
AuthRouter.post('/signup', validate(signupSchema), asyncResponseHandler(AuthController.signup))
AuthRouter.patch('/sendVerificationCode', validate(sendVerificationSchema), asyncResponseHandler(AuthController.sendVerification))
AuthRouter.patch('/verify-code', asyncResponseHandler(AuthController.verifyCode))
AuthRouter.patch('/change-password', identifer, asyncResponseHandler(AuthController.changePassword))

export default AuthRouter;