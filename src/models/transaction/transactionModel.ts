import mongoose from "mongoose";
import { IUserTransaction } from "./userTransactionModel.types";
import { Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const UserTransactionSchema = new mongoose.Schema<IUserTransaction>({
  transactionID: { type: String, default: () => uuidv4(), unique: true },
  email: { type: String, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['deposit', 'withdrawal', 'tier', 'bonus', 'yield'] 
  },
  image: { type: String },
  amount: { type: Number, required: true },
  plan: { type: String },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'completed', 'failed'] 
  },
  Coin: { type: String, default: 'USDT' },
  withdrawWalletAddress: { type: String },
  bankName: { type: String },
  accountName: { type: String },
  accountNumber: { type: String },
  date: { type: Date }
}, {
  timestamps: true
});

const UserTransactionModel = mongoose.model<IUserTransaction, Model<IUserTransaction>>('UserTransaction', UserTransactionSchema);

export default UserTransactionModel;