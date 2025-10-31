import AdminController from "controllers/admin.controller";
import { asyncResponseHandler } from "Errors/ErrorHandler";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { adminLoginSchema, adminUpdateSchema, updateTransactionSchema } from "validators/admin.validator";
import { userProfileSchema } from "validators/profile.validator";

const AdminRouter = Router();

// ─────────────── ADMIN ───────────────
AdminRouter.post('/auth/login', validate(adminLoginSchema), asyncResponseHandler(AdminController.login))
AdminRouter.patch('/updateAdmin', identifer, validate(adminUpdateSchema), asyncResponseHandler(AdminController.updateAdmin))
AdminRouter.get('/getAdmin', identifer, asyncResponseHandler(AdminController.getAdmin))

// ─────────────── USERS ───────────────
AdminRouter.get('/totalUser', identifer, asyncResponseHandler(AdminController.getTotalUsers))
AdminRouter.get('/users', identifer, asyncResponseHandler(AdminController.getAllUsers))
AdminRouter.get('/user/:email', identifer, asyncResponseHandler(AdminController.getUser))
AdminRouter.patch('/user/:email', identifer, validate(userProfileSchema), asyncResponseHandler(AdminController.updateProfile))
AdminRouter.get('/user', identifer, asyncResponseHandler(AdminController.getUserByuserID))
AdminRouter.get('/search/users', identifer, asyncResponseHandler(AdminController.searchUsers))

// ─────────────── CREWS ───────────────
AdminRouter.get('/totalCrews', identifer, asyncResponseHandler( AdminController.getTotalCrew))
AdminRouter.get('/crews', identifer, asyncResponseHandler(AdminController.getAllCrews))
AdminRouter.get('/crew', identifer, asyncResponseHandler(AdminController.getUserCrew))
AdminRouter.get('/search/crews', identifer, asyncResponseHandler(AdminController.searchCrews))

// ─────────────── TRANSACTIONS ───────────────
AdminRouter.get('/transactions', identifer, asyncResponseHandler(AdminController.getTransactions))
AdminRouter.get('/transactions/users', identifer, asyncResponseHandler(AdminController.getTransactions))
AdminRouter.patch('/transactions/update', identifer, validate(updateTransactionSchema), asyncResponseHandler(AdminController.updateTransaction))

// ─────────────── ACTIONS ───────────────
AdminRouter.patch('/detachUser', identifer, asyncResponseHandler(AdminController.detachUser))
AdminRouter.get('/globalData', asyncResponseHandler(AdminController.globalData))


export default AdminRouter;