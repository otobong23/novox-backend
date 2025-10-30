import Joi from "joi";

// Validation Schemas
export const adminLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const adminUpdateSchema = Joi.object({
  ProfitStop: Joi.number().optional(),
  totalTransactions: Joi.number().optional(),
  walletAddress: Joi.string().optional(),
  whatsappLink: Joi.string().optional(),
  telegramLink: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().optional()
});

export const updateTransactionSchema = Joi.object({
  status: Joi.string().valid('completed', 'failed').required(),
  image: Joi.string().optional(),
  amount: Joi.number().optional(),
  action: Joi.string().valid('minus', 'add').optional()
});
