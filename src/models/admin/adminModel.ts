import mongoose from "mongoose";
import { IAdmin } from "./adminModel.types";
import { Model } from "mongoose";

const DEPOSIT_ADDRESS = 'TFcGAio7carxRnPCeVmZgCqe2AnpvPtqAf';
const whatsappLink = 'https://wa.me/447447247209';
const telegramLink = 'https://t.me/+kWTXS1QL1qlkZTQ0';
const USER_PASS = '12345678';

const AdminSchema = new mongoose.Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: USER_PASS },
  totalDeposit: { type: Number, default: 0 },
  totalWithdraw: { type: Number, default: 0 },
  ProfitStop: { type: Number, default: 0 },
  totalTransactions: { type: Number, default: 0 },
  walletAddress: { type: String, default: DEPOSIT_ADDRESS },
  whatsappLink: { type: String, default: whatsappLink },
  telegramLink: { type: String, default: telegramLink }
});

const AdminModel = mongoose.model<IAdmin, Model<IAdmin>>('Admin', AdminSchema);

export default AdminModel;