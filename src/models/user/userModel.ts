import mongoose from "mongoose";
import { IUser, IWithdrawalWallet, IDepositWallet, ITier } from "./userModel.types";
import { Model } from "mongoose";

const DEPOSIT_ADDRESS = 'TFcGAio7carxRnPCeVmZgCqe2AnpvPtqAf';

const WithdrawalWalletSchema = new mongoose.Schema<IWithdrawalWallet>({
  walletAddress: { type: String },
  amount: { type: Number }
}, {
  timestamps: true,
  _id: false
});

const DepositWalletSchema = new mongoose.Schema<IDepositWallet>({
  amount: { type: Number },
  coin: { type: String },
  recieptImage: { type: String }
}, {
  timestamps: true,
  _id: false
});

const TierSchema = new mongoose.Schema<ITier>({
  type: { type: String, required: true },
  title: { type: String, required: true },
  details: {
    type: {
      price: { type: String, required: true },
      daily_yield: { type: String, required: true },
      duration: { type: String, required: true },
      roi: { type: String, required: true },
      purchase_limit: { type: String, required: true },
    },
    required: true
  },
  expiring_date: { type: String }
}, {
  timestamps: true,
  _id: false
});

const UserSchema = new mongoose.Schema<IUser>({
  userID: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, trim: true },
  balance: { type: Number, select: true, default: 0 },
  totalYield: { type: Number, select: true, default: 0 },
  totalWithdraw: { type: Number, select: true, default: 0 },
  totalDeposit: { type: Number, select: true, default: 0 },
  transactionCount: { type: Number, select: true, default: 0 },
  currentPlan: { type: [TierSchema], default: [] },
  previousPlan: { type: [TierSchema], default: [] },
  whatsappNo: { type: String, default: '' },
  facebook: { type: String, default: '' },
  telegram: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  forgotPasswordCode: { type: String, select: false, default: undefined },
  forgotPasswordCodeValidation: { type: Number, select: false, default: undefined },
  referral_code: { type: String, required: true },
  referredBy: { type: String, default: null },
  referral_count: { type: Number, default: 0 },
  usdtWallet: { type: String },
  bankName: { type: String },
  accountName: { type: String },
  accountNumber: { type: String },
  walletPassword: { type: String },
  withdrawalWallet: { type: WithdrawalWalletSchema },
  withdrawStatus: { type: String, enum: ['pending', 'completed', 'failed'] },
  depositAddress: { type: String, default: DEPOSIT_ADDRESS },
  twentyFourHourTimerStart: { type: String, default: undefined },
  spinWheelTimerStart: { type: Number, default: Date.now() },
  ActivateBot: { type: Boolean, default: true },
  vip: { type: Number, default: 0 },
  meter: { type: Number, default: 0 },
  oneTimeBonus: { type: Boolean, default: true },
  joinDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

UserSchema.statics.search = function (keyword: string) {
  const pattern = new RegExp(keyword, 'i'); // case-insensitive

  return this.find({
    $or: [
      { username: pattern },
      { email: pattern },
      { referral_code: pattern },
      { referredBy: pattern },
    ],
  });
};

const UserModel = mongoose.model<IUser, Model<IUser> & { search: (keyword: string) => Promise<IUser[]> }>('User', UserSchema);

export default UserModel;