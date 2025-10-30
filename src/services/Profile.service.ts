import { ModelModule } from "models/Model.module";
import CrewService from "./Crew.service";
import AdminModel from "models/admin/adminModel";
import { ConflictError, NotFoundError } from "Errors/Errors";
import { ITier, ITierDetails, IUser } from "models/user/userModel.types";


type TIER_LIST_TYPE = {
   type: string
   title: string,
   image?: string,
   icon?: string
   details: ITierDetails
   expiring_date?: string
   createdAt?: string
}

export class ProfileServiceFunctions extends ModelModule {
   private crewService: typeof CrewService
   private adminModel: typeof AdminModel

   constructor() {
      super();
      this.crewService = CrewService
      this.adminModel = AdminModel
   }

   private async handleVIP(email: string) {
      const existingUser = await this.userModel.findOne({ email })
      if (!existingUser) throw new NotFoundError('user not found');
      const existingUserCrew = await this.crewService.getUserCrew(email)
      if (!existingUserCrew) throw new NotFoundError('user not found')
      if (existingUserCrew?.totalCrewDeposits >= 3000) existingUser.vip = 1
      if (existingUserCrew?.totalCrewDeposits >= 5000) existingUser.vip = 2
      if (existingUserCrew?.totalCrewDeposits >= 10000) existingUser.vip = 3

      await existingUser.save();
   }

   private async handleMeter(email: string) {
      const existingUser = await this.userModel.findOne({ email });
      if (!existingUser) throw new NotFoundError('User not found');
      const existingUserCrew = await this.crewService.getUserCrew(email);
      if (!existingUserCrew) throw new NotFoundError('User crew not found');
      const tc = existingUserCrew.totalCrewDeposits ?? 0;
      let meter = 0;

      if (tc < 3000) {
         meter = Math.round((tc / 3000) * 100);
      } else if (tc >= 3000 && tc < 5000) {
         meter = Math.round(((tc - 3000) / 2000) * 100);
      } else if (tc >= 5000 && tc < 10000) {
         meter = Math.round(((tc - 5000) / 5000) * 100);
      } else {
         meter = 100;
      }

      existingUser.meter = meter;
      await existingUser.save();
   }

   private async handleExpiredPlans(email: string): Promise<void> {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundError('User not found, please login');

      const now = new Date();

      const stillActivePlans: ITier[] = [];
      const expiredPlans: ITier[] = [];

      for (const plan of user.currentPlan) {
         const expiringDate = plan.expiring_date ? new Date(plan.expiring_date) : null;

         if (expiringDate && expiringDate <= now) {
            expiredPlans.push(plan);
         } else {
            stillActivePlans.push(plan);
         }
      }

      if (expiredPlans.length > 0) {
         user.currentPlan = stillActivePlans;
         user.previousPlan.push(...expiredPlans);
         await user.save();
      }
   }


   async getUserProfileByUserID(userID: string) {
      const existingUser = await this.userModel.findOne({ userID })
      if (!existingUser) throw new NotFoundError('User not Found');
      return { ...existingUser.toObject(), password: undefined, __v: undefined, _id: undefined }
   }

   async getUserProfile({ email }: { email: string }) {
      const existingUser = await this.userModel.findOne({ email: email })
      const existingAdmin = await this.adminModel.findOne()
      if (existingUser) {
         await this.handleVIP(email);
         await this.handleMeter(email)
         await this.handleExpiredPlans(email)
         if (existingAdmin) {
            existingUser.depositAddress = existingAdmin.walletAddress
         }
         return { ...existingUser.toObject(), password: undefined, __v: undefined, _id: undefined }
      } else {
         throw new NotFoundError('User not Found, please signup')
      }
   }

   async deleteUser(email: string) {
      const existingUser = await this.userModel.findOne({ email })
      if (!existingUser) throw new NotFoundError('User not Found, please signup');
      await this.userTransactionModel.deleteMany({ email })
      await this.crewModel.findOneAndDelete({ userID: existingUser.userID })
      await this.userModel.findOneAndDelete({ email })
      return { message: 'user deleted successfully' }
   }

   async updateUser(email: string, updateData: IUser) {
      const existingUser = await this.userModel.findOneAndUpdate({ email }, updateData, { new: true })
      if (existingUser) {
         if (existingUser.ActivateBot) {
            await this.handleVIP(email);
            await this.handleMeter(email)
            return { ...existingUser.toObject(), ...updateData, password: undefined, __v: undefined, _id: undefined }
         } else {
            throw new ConflictError('Your account has been suspended. Please Vist Customer Care')
         }
      } else {
         throw new NotFoundError('User not Found, please signup')
      }
   }

   async updateCurrentPlan(email: string, newPlan: {
      type: string,
      title: string,
      details: ITierDetails,
      expiring_date: string
   }) {
      const existingUser = await this.userModel.findOneAndUpdate({ email }, { $push: { currentPlan: newPlan } }, { new: true })
      if (!existingUser) throw new NotFoundError('User not Found, please signup');
      if (existingUser.ActivateBot) {
         await this.handleVIP(email);
         await this.handleMeter(email)
         return { ...existingUser.toObject(), password: undefined, __v: undefined, _id: undefined }
      } else {
         throw new ConflictError('Your account has been suspended. Please Vist Customer Care')
      }
   }
}

const ProfileService = new ProfileServiceFunctions()
export default ProfileService;