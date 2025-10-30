import TransactionController from "controllers/transaction.controller";
import { Router } from "express";
import { identifer } from "middlewares/identification";
import { validate } from "middlewares/Validator";
import { depositSchema, getPlanSchema, resolveDetailsSchema, withdrawSchema } from "validators/transaction.validator";

const TransactionRouter = Router();

TransactionRouter.use(identifer)
TransactionRouter.post('/deposit', validate(depositSchema), TransactionController.deposit)
TransactionRouter.post('/withdraw', validate(withdrawSchema), TransactionController.withdraw)
TransactionRouter.get('/', TransactionController.getTransactions)
TransactionRouter.post('/getPlan', TransactionController.getPlan)
TransactionRouter.post('/mine', validate(getPlanSchema), TransactionController.mine)
TransactionRouter.post('/resolve_account', validate(resolveDetailsSchema), TransactionController.resolveAccount)
TransactionRouter.get('/spin-wheel', TransactionController.spinWheel)

export default TransactionRouter;