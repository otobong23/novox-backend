import dotenv from 'dotenv'
import { ModelModule } from "models/Model.module";
import CrewService from "./Crew.service";
import AdminModel from "models/admin/adminModel";
import axios from 'axios';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'Errors/Errors';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { sendMail } from 'mailers/mailer';
import { IUser } from 'models/user/userModel.types';
import { IUserTransaction } from 'models/transaction/userTransactionModel.types';
dotenv.config()

const to = process.env.EMAIL_USER!

export class TransactionServiceFunction extends ModelModule {
   private adminModel: typeof AdminModel
   private httpService: typeof axios

   constructor() {
      super();
      this.adminModel = AdminModel
      this.httpService = axios
   }

   private async findUserByEmail(email: string): Promise<IUser> {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
         throw new NotFoundError('User not found. Please sign up.');
      }
      return user;
   }


   async deposit(depositDto: {
      amount: number,
      image: string,
      transactionID: string
   }, email: string) {
      const existingUser = await this.userModel.findOne({ email });

      if (!existingUser) throw new NotFoundError('User not found. Please sign up.');

      if (existingUser.ActivateBot) {

         const { amount } = depositDto;
         const newTransaction = new this.userTransactionModel({ transactionID: depositDto.transactionID, email, type: 'deposit', amount, image: depositDto.image, status: 'pending', date: new Date() }) as IUserTransaction & { _id: any };

         await newTransaction.save();
         const mailSent = await sendMail(to, existingUser.email, Number(amount), newTransaction._id.toString(), 'deposit')
         // await this.crewService.updateCrewOnTransaction(existingUser.userID, "deposit", amount)
         if (!mailSent) {
            throw new InternalServerError('Failed to send Review email')
         }
         return { message: 'Deposit request submitted successfully', newTransaction }
      } else {
         throw new NotFoundError('User not Found, please signup')
      }

   }

   async withdraw(withdrawDto: {
      amount: number,
      walletAddress: string,
      accountNumber: string,
      accountName: string,
      bankName: string,
   }, email: string) {
      const { accountName, accountNumber, bankName, walletAddress, amount } = withdrawDto;
      const existingUser = await this.userModel.findOne({ email })
      if (existingUser) {
         if (existingUser.ActivateBot) {
            existingUser.withdrawalWallet = { walletAddress, amount: Number(amount) }
            existingUser.withdrawStatus = 'pending';
            if (existingUser.balance < amount) {
               throw new InternalServerError('Insufficient balance for withdrawal')
            }
            existingUser.balance -= amount;
            const newTransaction = new this.userTransactionModel({ email, type: 'withdrawal', amount, status: 'pending', withdrawWalletAddress: walletAddress, accountName, accountNumber, bankName, date: new Date() }) as IUserTransaction & { _id: any };
            await newTransaction.save();
            const percent = Number(amount) * 0.9
            const mailSent = await sendMail(to, existingUser.email, percent, newTransaction._id.toString(), 'withdrawal')
            if (!mailSent) {
               throw new InternalServerError('Failed to send withdrawal Confirmation email')
            }

            await existingUser.save();
            // await this.crewService.updateCrewOnTransaction(existingUser.userID, "withdraw", amount)
            return { message: 'Withdrawal request submitted successfully', newTransaction }
         } else {
            throw new ConflictError('Your account has been suspended. Please Vist Customer Care')
         }
      } else {
         throw new NotFoundError('User not Found, please signup')
      }
   }

   async getTransactionHistory(email: string, limit: number = 50, page: number = 1) {
      limit = Math.max(1, Math.min(limit, 100))
      page = Math.max(1, page)
      const offset = (page - 1) * limit;

      const user = await this.findUserByEmail(email);

      const transactions = await this.userTransactionModel
         .find({ email })
         .sort({ date: -1 })
         .limit(limit)
         .skip(offset)
         .exec();

      const total = await this.userTransactionModel.countDocuments({ email })
      const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

      return {
         transactions,
         page,
         total,
         totalPages,
         user: {
            email: user.email,
            balance: user.balance,
         },
      };
   }

   async mine(email: string, amount: number) {
      const existingUser = await this.findUserByEmail(email);
      if (!existingUser) throw new NotFoundError('User not Found, please signup');
      if (existingUser.ActivateBot) {
         existingUser.balance += amount;
         existingUser.totalYield += amount;
         await CrewService.awardReferralBonus(existingUser.userID, amount, "mining_profit")
         const newTransaction = new this.userTransactionModel({ email, type: 'yield', amount, status: 'completed', date: new Date() })
         await newTransaction.save()
         await existingUser.save();
         return existingUser.balance;
      } else {
         throw new ConflictError('Your account has been suspended. Please Vist Customer Care')
      }
   }

   async getPlan(email: string, amount: number, plan: string) {
      const existingUser = await this.findUserByEmail(email);
      if (!existingUser) throw new NotFoundError('User not Found, please signup');
      if (existingUser.ActivateBot) {
         if (existingUser.balance < amount) {
            throw new InternalServerError('Insufficient balance for withdrawal');
         }
         existingUser.balance -= amount;
         const newTransaction = new this.userTransactionModel({ email, type: 'tier', amount, plan, status: 'completed', date: new Date() })
         await newTransaction.save()
         await existingUser.save();
         return existingUser.balance;
      } else {
         throw new ConflictError('Your account has been suspended. Please Vist Customer Care')
      }
   }

   async resolveAccount(account_number: string, account_bank: string) {
      const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
      try {
         const response = await this.httpService.post(
            'https://api.flutterwave.com/v3/accounts/resolve',
            {
               account_number,
               account_bank,
            },
            {
               headers: {
                  Authorization: `Bearer ${FLW_SECRET_KEY}`,
                  'Content-Type': 'application/json',
               },
            }
         )
         return response.data;
      } catch (error) {
         console.log(error)
         if (error instanceof AxiosError) throw new Error(error.response?.data || 'Flutterwave error');
         if (error instanceof Error) throw new InternalServerError(error.message);
         throw new InternalServerError('An unknown error occurred');
      }
   }

   async spinReward(email: string, amount: number) {
      const existingUser = await this.findUserByEmail(email);
      if (!existingUser) throw new NotFoundError('user not Found, please signup');
      if (existingUser.ActivateBot) {
         const startTime = new Date(existingUser.spinWheelTimerStart);
         const currentTime = new Date();
         const timeDifference = currentTime.getTime() - startTime.getTime();
         const hoursInMilliseconds = 24 * 60 * 60 * 1000;
         if (timeDifference < hoursInMilliseconds) throw new BadRequestError('Time for next spin has not elapsed. Please try again later.');
         try {
            existingUser.balance += amount;
            existingUser.spinWheelTimerStart = Date.now();
            const newTransaction = new this.userTransactionModel({ email, type: 'bonus', amount, status: 'completed', date: new Date() })
            await newTransaction.save()
            await existingUser.save();
            return existingUser.balance;
         } catch (err) {
            console.error('Error processing spin reward:', err)
            const errMsg = err instanceof Error ? err.message : String(err);
            throw new InternalServerError('An error occurred while processing your spin reward. please try again later. Error: ' + errMsg)
         }
      }
   }
}

const TransactionService = new TransactionServiceFunction();
export default TransactionService;