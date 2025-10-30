const Joi = require('joi');

// Deposit Validator
export const depositSchema = Joi.object({
  amount: Joi.number().required(),
  image: Joi.string().required(), // includes data:image/png;base64,...
  transactionID: Joi.string().required()
});

// Withdraw Validator
export const withdrawSchema = Joi.object({
  amount: Joi.number().required(),
  walletAddress: Joi.string().optional(),
  accountNumber: Joi.string().required(),
  accountName: Joi.string().required(),
  bankName: Joi.string().required()
});

// Use Balance Validator
export const useBalanceSchema = Joi.object({
  amount: Joi.number().required(),
  action: Joi.string().valid('add', 'minus').required()
});

// Get Plan Validator
export const getPlanSchema = Joi.object({
  amount: Joi.number().required(),
  plan: Joi.string().required()
});

// Resolve Details Validator
export const resolveDetailsSchema = Joi.object({
  account_number: Joi.string().required(),
  account_bank: Joi.string().required()
});

export const paginationValidator = Joi.object({
   page: Joi.number().integer().min(1).default(1),
   limit: Joi.number().integer().min(1).default(50),
   email: Joi.string().email({ tlds: { allow: false } }).min(6).max(50).optional()
})