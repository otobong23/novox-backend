import { Document } from "mongoose";

export interface ICrewMember {
  userID: string;
  username: string;
  level: number;
  joinedAt?: Date;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  currentPlan?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICrew extends Document {
  userID: string;
  ownerUsername: string;
  ownerReferralCode: string;
  level_1: ICrewMember[];
  level_2: ICrewMember[];
  level_3: ICrewMember[];
  totalMembers: number;
  totalCrewDeposits: number;
  totalCrewWithdrawals: number;
  totalCrewTransactions: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}