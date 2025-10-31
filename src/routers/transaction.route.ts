import TransactionController from "controllers/transaction.controller";
import { asyncResponseHandler } from "Errors/ErrorHandler";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { depositSchema, getPlanSchema, resolveDetailsSchema, withdrawSchema } from "validators/transaction.validator";

const TransactionRouter = Router();

TransactionRouter.use(identifer)
TransactionRouter.post('/deposit', validate(depositSchema), asyncResponseHandler(TransactionController.deposit))
TransactionRouter.post('/withdraw', validate(withdrawSchema), asyncResponseHandler(TransactionController.withdraw))
TransactionRouter.get('/', asyncResponseHandler(TransactionController.getTransactions))
TransactionRouter.post('/getPlan', asyncResponseHandler(TransactionController.getPlan))
TransactionRouter.post('/mine', validate(getPlanSchema), asyncResponseHandler(TransactionController.mine))
TransactionRouter.post('/resolve_account', validate(resolveDetailsSchema), asyncResponseHandler(TransactionController.resolveAccount))
TransactionRouter.get('/spin-wheel', asyncResponseHandler(TransactionController.spinWheel))

export default TransactionRouter;