import ProfileController from "controllers/profile.controller";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { createTierSchema, userProfileSchema } from "validators/profile.validator";

const ProfileRouter = Router();

ProfileRouter.use(identifer)
ProfileRouter.get('/', ProfileController.getProfile)
ProfileRouter.delete('/', ProfileController.deleteUser)
ProfileRouter.patch('/update', validate(userProfileSchema), ProfileController.updateProfile)
ProfileRouter.patch('/update-plan', validate(createTierSchema), ProfileController.updatePlan)

export default ProfileRouter;