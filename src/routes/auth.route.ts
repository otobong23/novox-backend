import AuthController from "controllers/auth.controller";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { loginSchema, sendVerificationSchema, signupSchema } from "validators/auth.validator";

const AuthRouter = Router();

AuthRouter.post('login', validate(loginSchema), AuthController.login)
AuthRouter.post('signup', validate(signupSchema), AuthController.signup)
AuthRouter.patch('sendVerificationCode', validate(sendVerificationSchema), AuthController.sendVerification)
AuthRouter.patch('verify-code', AuthController.verifyCode)
AuthRouter.patch('change-password', identifer, AuthController.changePassword)

export default AuthRouter;