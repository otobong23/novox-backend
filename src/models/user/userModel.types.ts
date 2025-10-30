import { Document } from "mongoose";

export interface IWithdrawalWallet {
  walletAddress?: string;
  amount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDepositWallet {
  amount?: number;
  coin?: string;
  recieptImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITierDetails {
  price: string;
  daily_yield: string;
  duration: string;
  roi: string;
  purchase_limit: string;
}

export interface ITier {
  type: string;
  title: string;
  details: ITierDetails;
  expiring_date?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends Document {
  userID: string;
  username: string;
  email: string;
  password: string;
  balance: number;
  totalYield: number;
  totalWithdraw: number;
  totalDeposit: number;
  transactionCount: number;
  currentPlan: ITier[];
  previousPlan: ITier[];
  whatsappNo: string;
  facebook: string;
  telegram: string;
  profileImage: string;
  forgotPasswordCode?: string;
  forgotPasswordCodeValidation?: number;
  referral_code: string;
  referredBy?: string;
  referral_count: number;
  usdtWallet?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  walletPassword?: string;
  withdrawalWallet?: IWithdrawalWallet;
  withdrawStatus?: 'pending' | 'completed' | 'failed';
  depositAddress: string;
  twentyFourHourTimerStart?: string;
  spinWheelTimerStart: number;
  ActivateBot: boolean;
  vip: number;
  meter: number;
  oneTimeBonus: boolean;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}