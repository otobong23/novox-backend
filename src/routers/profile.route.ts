import ProfileController from "controllers/profile.controller";
import { asyncResponseHandler } from "Errors/ErrorHandler";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { createTierSchema, userProfileSchema } from "validators/profile.validator";

const ProfileRouter = Router();

ProfileRouter.use(identifer)
ProfileRouter.get('/', asyncResponseHandler(ProfileController.getProfile))
ProfileRouter.delete('/', asyncResponseHandler(ProfileController.deleteUser))
ProfileRouter.patch('/update', validate(userProfileSchema), asyncResponseHandler(ProfileController.updateProfile))
ProfileRouter.patch('/update-plan', validate(createTierSchema), asyncResponseHandler(ProfileController.updatePlan))

export default ProfileRouter;