import { Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  totalDeposit: number;
  totalWithdraw: number;
  ProfitStop: number;
  totalTransactions: number;
  walletAddress: string;
  whatsappLink: string;
  telegramLink: string;
}