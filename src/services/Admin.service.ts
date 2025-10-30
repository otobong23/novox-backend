import dotenv from 'dotenv'
import AdminModel from "models/admin/adminModel";
import { ModelModule } from "models/Model.module";
import CrewService from "./Crew.service";
import { BadRequestError, InternalServerError, UnauthorizedError } from 'Errors/Errors';
import JWTService from 'middlewares/JWT.service';
import { IAdmin } from 'models/admin/adminModel.types';
import { NotFoundError } from 'rxjs';
import ProfileService from './Profile.service';
import TransactionService from './Transaction.service';
import { sendTransactionStatus } from 'mailers/mailer';
import { IUser } from 'models/user/userModel.types';
import { ICrew } from 'models/crew/crewModel.types';
import CrewExtraService from './CrewExtra.service';

dotenv.config()

export class AdminServiceFunction extends ModelModule {
   private crewService: typeof CrewService = CrewService
   private adminModel: typeof AdminModel = AdminModel
   private jwtService: typeof JWTService = JWTService
   private profileService: typeof ProfileService = ProfileService
   private transactionService: typeof TransactionService = TransactionService
   private crewExtraService: typeof CrewExtraService = CrewExtraService

   constructor() {
      super();
   }

   async login(adminLogindto: {
      username: string,
      password: string
   }) {
      const EMAIL = process.env.EMAIL_USER!
      if (EMAIL === adminLogindto.username) {
         const existingAdmin = await this.adminModel.findOne()
         if (!existingAdmin) {
            const newAdmin = new this.adminModel({ email: EMAIL })
            await newAdmin.save()
         }
         if (existingAdmin?.password !== adminLogindto.password) throw new UnauthorizedError('Invalid credentials');
         return {
            success: true,
            access_token: this.jwtService.generateToken({ email: adminLogindto.username, password: adminLogindto.password }, '60d'),
            message: 'login successful'
         };
      }
      throw new UnauthorizedError('Invalid credentials');
   }

   async updateAdmin(email: string, updateData: Partial<IAdmin>) {
      const existingAdmin = await this.adminModel.findOneAndUpdate({ email }, updateData, { new: true })
      if (existingAdmin) {
         return { ...existingAdmin.toObject(), ...updateData, __v: undefined, _id: undefined }
      } else {
         throw new NotFoundError('Admin not Found, please signup')
      }
   }

   async getAdmin(email: string) {
      const existingAdmin = await this.adminModel.findOne({ email })
      if (!existingAdmin) throw new NotFoundError('Admin not Found, please signup')
      return { ...existingAdmin.toObject(), __v: undefined, _id: undefined }
   }

   async getTotalCrews() {
      return await this.crewModel.countDocuments()
   }

   async getAllCrews(limit = 50, page = 1) {
      limit = Math.max(1, Math.min(limit, 100))
      page = Math.max(1, page)
      const offset = (page - 1) * limit;

      const [crews, total] = await Promise.all([
         this.crewModel.find().skip(offset).limit(limit).exec(),
         this.crewModel.countDocuments()
      ]);

      if (!total) throw new NotFoundError('No Crew Found');
      const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
      return {
         crews,
         page,
         limit,
         total,
         totalPages,
      };
   }


   async getUserCrew(userID: string) {
      const user = await this.userModel.findOne({ userID })
      if (!user) throw new NotFoundError('User Not Found')
      return this.crewService.getCrew(userID)
   }

   async getTotalUsers() {
      return await this.userModel.countDocuments()
   }

   async getAllUsers(limit = 50, page = 1) {
      limit = Math.max(1, Math.min(limit, 100))
      page = Math.max(1, page)
      const offset = (page - 1) * limit;
      const [users, total] = await Promise.all([
         this.userModel.find().skip(offset).limit(limit).exec(),
         this.userModel.countDocuments()
      ]);
      if (!total) throw new NotFoundError('No User Found');
      const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
      return {
         users,
         page,
         limit,
         total,
         totalPages,
      };
   }

   async getUser(email: string) {
      return this.profileService.getUserProfile({ email })
   }

   async getUserByuserID(userID: string) {
      return this.profileService.getUserProfileByUserID(userID)
   }

   async getTransactions(limit: number = 50, page: number = 1) {
      limit = Math.max(1, Math.min(limit, 100))
      page = Math.max(1, page)
      const offset = (page - 1) * limit;
      const [transactions, total] = await Promise.all([
         this.userTransactionModel.find({ type: { $in: ['withdrawal', 'deposit'] } })
            .sort({ date: -1 })
            .limit(limit)
            .skip(offset)
            .exec(),
         this.userTransactionModel.countDocuments({ type: { $in: ['withdrawal', 'deposit'] } })
      ]);
      const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
      return {
         transactions,
         page,
         limit,
         totalPages,
         total
      };
   }

   async getUserTransactions(email: string, limit: number = 50, page: number = 1) {
      return this.transactionService.getTransactionHistory(email, limit, page)
   }

   async updateUser(email: string, updateData: Partial<IUser>) {
      const existingUser = await this.userModel.findOneAndUpdate({ email }, updateData, { new: true })
      if (!existingUser) throw new NotFoundError('User not Found, please signup')
      return { ...existingUser.toObject(), ...updateData, password: undefined, __v: undefined, _id: undefined }
   }

   private async useUserBalance(email: string, amount: number, action: 'minus' | 'add') {
      const existingUser = await this.userModel.findOne({ email });
      if (!existingUser) {
         throw new NotFoundError('User not Found, please signup');
      }
      if (action === 'minus') {
         // if (existingUser.balance < amount) {
         //   throw new BadRequestException('Insufficient balance for withdrawal');
         // }
         // existingUser.balance -= amount;
         existingUser.totalWithdraw += amount;
      } else if (action === 'add') {
         existingUser.balance += amount;
         existingUser.totalDeposit += amount;
      } else {
         throw new BadRequestError('Invalid action type');
      }
      await existingUser.save();
   }
   private async updateAdminTotals(type: 'deposit' | 'withdrawal', amount: number) {
      const admin = await this.adminModel.findOne(); // Assumes single admin account
      if (!admin) throw new NotFoundError('Admin not found');

      if (type === 'deposit') {
         admin.totalDeposit += amount;
      } else if (type === 'withdrawal') {
         admin.totalWithdraw += amount;
      }

      await admin.save();
   }

   async updateTransaction(email: string, transactionID: string, updateData: {
      status: 'completed' | 'failed',
      image?: string,
      amount?: number,
      action?: 'minus' | 'add'
   }) {
      const transaction = await this.userTransactionModel.findOne({ email, _id: transactionID });
      const existingUser = await this.userModel.findOne({ email });

      if (!transaction) throw new NotFoundError('Transaction not found or not authorized');
      if (!existingUser) throw new NotFoundError('User not found or not authorized');
      if (transaction.status !== 'pending') {
         throw new BadRequestError('Only pending transactions can be updated');
      }

      const isNowCompleted = updateData.status === 'completed';
      transaction.status = updateData.status;
      if (updateData.image) {
         transaction.image = updateData.image;
      }
      if (updateData.status === 'failed') {
         if (transaction.type === 'withdrawal') {
            existingUser.balance += transaction.amount;
            await existingUser.save()
         }
         const reason = 'The transaction was not approved.';
         const info = await sendTransactionStatus(
            email,
            email,
            transaction.amount,
            transactionID,
            transaction.type,
            'declined',
            reason
         );
         if (!info) {
            throw new InternalServerError(`Failed to send decline email to ${email}`);
         }
         return await transaction.save();
      }
      if (isNowCompleted) {
         if (typeof updateData.amount !== 'number' || !updateData.action) {
            throw new BadRequestError('Amount and action are required when completing a transaction');
         }
         if (transaction.type === 'deposit' || transaction.type === 'withdrawal') {
            const reason = '';

            const info = await sendTransactionStatus(
               email, // recipient
               email, // shown email in the email body
               updateData.amount,
               transactionID,
               transaction.type,
               'approved',
               reason,
            );

            if (!info) {
               throw new InternalServerError(`Failed to send transaction status email to ${email}`);
            }
            await this.useUserBalance(email, updateData.amount, updateData.action);
            if (transaction.type === 'deposit') {
               if (existingUser.oneTimeBonus) {
                  await this.crewService.awardReferralBonus(existingUser.userID, updateData.amount, "first_deposit");
                  existingUser.oneTimeBonus = false
               }
               await this.crewService.updateCrewOnTransaction(existingUser.userID, "deposit", updateData.amount)
            } else this.crewService.updateCrewOnTransaction(existingUser.userID, "withdraw", updateData.amount);
            await this.updateAdminTotals(transaction.type, updateData.amount);
         } else {
            throw new BadRequestError('Invalid transaction type');
         }
      }

      return await transaction.save();
   }

   async searchUsers(keyword: string): Promise<IUser[]> {
      return this.userModel.search(keyword);
   }

   async searchCrews(keyword: string): Promise<ICrew[]> {
      return this.crewModel.search(keyword);
   }

   async deleteUserCascade(userID: string) {
      return this.crewExtraService.deleteUser(userID)
   }

   async globalData() {
      const existingAdmin = await this.adminModel.findOne()
      if (!existingAdmin) throw new NotFoundError('Admin not Found, please signup')
      return { walletAddress: existingAdmin.walletAddress, whatsappLink: existingAdmin.whatsappLink, telegramLink: existingAdmin.telegramLink }
   }
}

const AdminService = new AdminServiceFunction();
export default AdminService;