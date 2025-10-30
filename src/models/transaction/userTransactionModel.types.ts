import { Document } from "mongoose";

export interface IUserTransaction extends Document {
  transactionID: string;
  email: string;
  type: 'deposit' | 'withdrawal' | 'tier' | 'bonus' | 'yield';
  image?: string;
  amount: number;
  plan?: string;
  status: 'pending' | 'completed' | 'failed';
  Coin: string;
  withdrawWalletAddress?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}