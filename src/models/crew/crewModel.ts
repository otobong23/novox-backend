import mongoose from "mongoose";
import { ICrew, ICrewMember } from "./crewModel.types";
import { Model } from "mongoose";

// Crew Member Schema
const CrewMemberSchema = new mongoose.Schema<ICrewMember>({
  userID: { type: String, required: true },
  username: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 3 },
  joinedAt: { type: Date, default: Date.now },
  totalDeposits: { type: Number, default: 0 },
  totalWithdrawals: { type: Number, default: 0 },
  transactionCount: { type: Number, default: 0 },
  currentPlan: { type: [String], default: undefined }
}, {
  timestamps: true
});

// Main Crew Schema - represents the entire referral tree for a user
const CrewSchema = new mongoose.Schema<ICrew>({
  userID: { type: String, ref: 'User', required: true, unique: true },
  ownerUsername: { type: String, required: true },
  ownerReferralCode: { type: String, required: true },
  level_1: { type: [CrewMemberSchema], default: [] },
  level_2: { type: [CrewMemberSchema], default: [] },
  level_3: { type: [CrewMemberSchema], default: [] },
  totalMembers: { type: Number, default: 0 },
  totalCrewDeposits: { type: Number, default: 0 },
  totalCrewWithdrawals: { type: Number, default: 0 },
  totalCrewTransactions: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Static Search Method
CrewSchema.statics.search = function (keyword: string) {
  const pattern = new RegExp(keyword, 'i');
  return this.find({
    $or: [
      { ownerUsername: pattern },
      { ownerReferralCode: pattern },
      { userID: pattern },
    ],
  });
};

const CrewModel = mongoose.model<ICrew, Model<ICrew> & { search: (keyword: string) => Promise<ICrew[]> }>('Crew', CrewSchema);

export default CrewModel;