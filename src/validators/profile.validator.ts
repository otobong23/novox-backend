import Joi from 'joi';

// Withdrawal Wallet Schema
export const withdrawalWalletSchema = Joi.object({
  walletAddress: Joi.string().required(),
  amount: Joi.number().required()
});

// Tier Details Schema
export const tierDetailsSchema = Joi.object({
  price: Joi.string().required(),
  daily_yield: Joi.string().required(),
  duration: Joi.string().required(),
  roi: Joi.string().required(),
  purchase_limit: Joi.string().required()
});

// Create Tier Schema
export const createTierSchema = Joi.object({
  type: Joi.string().required(),
  title: Joi.string().required(),
  details: tierDetailsSchema.required(),
  expiring_date: Joi.string().optional()
});

// User Profile Schema
export const userProfileSchema = Joi.object({
  balance: Joi.number().optional(),
  totalYield: Joi.number().optional(),
  totalWithdraw: Joi.number().optional(),
  totalDeposit: Joi.number().optional(),
  transactionCount: Joi.number().optional(),
  currentPlan: Joi.array().items(createTierSchema).optional(),
  previousPlan: Joi.array().items(createTierSchema).optional(),
  whatsappNo: Joi.string().optional(),
  facebook: Joi.string().optional(),
  telegram: Joi.string().optional(),
  profileImage: Joi.string().optional(),
  forgotPasswordCode: Joi.string().optional(),
  forgotPasswordCodeValidation: Joi.number().optional(),
  referral_count: Joi.number().optional(),
  referredBy: Joi.string().optional(),
  referral_code: Joi.string().optional(),
  usdtWallet: Joi.string().optional(),
  bankName: Joi.string().optional(),
  accountNumber: Joi.string().optional(),
  accountName: Joi.string().optional(),
  walletPassword: Joi.string().optional(),
  withdrawalWallet: withdrawalWalletSchema.optional(),
  withdrawStatus: Joi.string().valid('pending', 'completed', 'failed').optional(),
  twentyFourHourTimerStart: Joi.string().optional(),
  ActivateBot: Joi.boolean().optional(),
  vip: Joi.number().optional(),
  joinDate: Joi.date().optional()
});

// Usage example:
// const { validate, userProfileSchema } = require('./validators');
// app.post('/api/user/profile', validate(userProfileSchema), (req, res) => {
//   // req.body is now validated
//   res.json({ success: true, data: req.body });
// });