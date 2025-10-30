import AdminController from "controllers/admin.controller";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { adminLoginSchema, adminUpdateSchema, updateTransactionSchema } from "validators/admin.validator";
import { userProfileSchema } from "validators/profile.validator";

const AdminRouter = Router();

// ─────────────── ADMIN ───────────────
AdminRouter.post('/auth/login', validate(adminLoginSchema), AdminController.login)
AdminRouter.patch('/updateAdmin', identifer, validate(adminUpdateSchema), AdminController.updateAdmin)
AdminRouter.get('/getAdmin', identifer, AdminController.getAdmin)

// ─────────────── USERS ───────────────
AdminRouter.get('/totalUser', identifer, AdminController.getTotalUsers)
AdminRouter.get('/users', identifer, AdminController.getAllUsers)
AdminRouter.get('/user/:email', identifer, AdminController.getUser)
AdminRouter.patch('/user/:email', identifer, validate(userProfileSchema), AdminController.updateProfile)
AdminRouter.get('/user', identifer, AdminController.getUserByuserID)
AdminRouter.get('/search/users', identifer, AdminController.searchUsers)

// ─────────────── CREWS ───────────────
AdminRouter.get('/totalCrews', identifer, AdminController.getTotalCrew)
AdminRouter.get('/crews', identifer, AdminController.getAllCrews)
AdminRouter.get('/crew', identifer, AdminController.getUserCrew)
AdminRouter.get('/search/crews', identifer, AdminController.searchCrews)

// ─────────────── TRANSACTIONS ───────────────
AdminRouter.get('/transactions', identifer, AdminController.getTransactions)
AdminRouter.get('/transactions/users', identifer, AdminController.getTransactions)
AdminRouter.patch('/transactions/update', identifer, validate(updateTransactionSchema), AdminController.updateTransaction)

// ─────────────── ACTIONS ───────────────
AdminRouter.patch('/detachUser', identifer, AdminController.detachUser)
AdminRouter.get('/globalData', AdminController.globalData)


export default AdminRouter;