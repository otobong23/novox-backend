import dotenv from 'dotenv'
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthorizedError, RequestTimeoutError } from '../Errors/Errors'
import hash, { validateHash } from '../helpers/hashing'
import JWTService from '../middlewares/JWT.service'
import { ModelModule } from '../models/Model.module'
import * as crypto from 'crypto';
import { IUser } from '../models/user/userModel.types'
import doHash from '../helpers/hashing'
import sendResetMail from 'mailers/mailer'
import CrewService from './Crew.service'

dotenv.config()

export function generateUserID(): string {
   return crypto.randomBytes(3).toString('hex'); // 6-char code like 'a4d2f1'
}

export class AuthServiceFunctions extends ModelModule {
   private jwtService: typeof JWTService
   private hashService: typeof hash
   private crewService: typeof CrewService

   constructor() {
      super();
      this.jwtService = JWTService
      this.hashService = hash
      this.crewService = CrewService
   }

   private async generateUniqueUserID(): Promise<string> {
      let userID: string;
      let exists = true;
      let attempts = 0;
      const MAX_ATTEMPTS = 10;

      while (exists && attempts < MAX_ATTEMPTS) {
         userID = generateUserID();
         const user = await this.userModel.findOne({ userID });
         exists = !!user;
         attempts++;
      }

      if (exists) throw new RequestTimeoutError('Failed to generate unique userID after multiple attempts');

      return userID!;
   }

   //login service functionalities 
   //start
   async validateUser({ email, password }: { email: string, password: string }): Promise<any> {
      const user = await this.userModel.findOne({ email });
      if (user && await validateHash(password, user.password)) {
         const { password, ...result } = user.toObject();
         return result;
      }
      throw new UnauthorizedError('Invalid credentials');
   }

   async login(user: IUser) {
      const payload = { username: user.username, email: user.email };
      const getCrew = await this.crewService.getUserCrew(user.email);
      if (!getCrew) await this.crewService.createCrew(user)
      return {
         success: true,
         access_token: this.jwtService.generateToken(payload, '60d'),
         message: 'login successful'
      };
   }
   //end

   //signup service functionalities
   //start
   async signup(signup: { email: string, username: string, password: string, referral_code?: string }) {
      const { email, username, password, referral_code } = signup;
      const existingUser = await this.userModel.findOne({ username });
      if (existingUser) {
         throw new ConflictError('User already exists');
      }
      const hashedPassword = await doHash(password, 10);

      let referredBy: string | undefined;
      if (referral_code) {
         const referrer = await this.userModel.findOne({ referral_code });
         if (!referrer) {
            throw new BadRequestError('Invalid referral code');
         }
         referredBy = referrer.referral_code;

         await this.userModel.findByIdAndUpdate(referrer._id, {
            $inc: { referral_count: 1 },
         });
      }

      // Generate unique userID
      const userID = await this.generateUniqueUserID();
      const newUser = new this.userModel({
         userID,
         email,
         username,
         password: hashedPassword,
         referral_code: userID, // user's referral code is their own userID
         referredBy,
      });
      await newUser.save();
      await this.crewService.createCrew(newUser);

      // Update the referrers' crew levels (up to 3 levels)
      if (referral_code) {
         await this.crewService.updateCrew(referral_code, newUser);
      }

      const payload = { username: newUser.username, email: newUser.email };
      return {
         access_token: this.jwtService.generateToken(payload, '60d'),
      };
   }
   //end

   //sendCode service functionalities
   //start
   async sendCode(email: string) {
      const existingUser = await this.userModel.findOne({ email });
      if (!existingUser) {
         throw new NotFoundError("User doesn't exists");
      }
      const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const info = await sendResetMail(email, existingUser.username, code)
      if (!info) {
         throw new InternalServerError(`Failed to send to Code to ${email}`)
      }
      existingUser.forgotPasswordCode = code
      existingUser.forgotPasswordCodeValidation = Date.now()
      existingUser.save()

      return { message: 'Code Sent Successfully!' }
   }
   //end

   //verifyCode service functionalities
   //start
   async verifyCode(email: string, code: string) {
      const existingUser = await this.userModel.findOne({ email }).select('+forgotPasswordCode +forgotPasswordCodeValidation')
      if (!existingUser) {
         throw new NotFoundError("User doesn't exists");
      }
      if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
         throw new InternalServerError('Something Went Wrong')
      }
      if (Date.now() - new Date(existingUser.forgotPasswordCodeValidation).getTime() > 10 * 60 * 1000) {
         throw new RequestTimeoutError('Code Has Been Expired!')
      }
      if (code === existingUser.forgotPasswordCode) {
         existingUser.forgotPasswordCode = undefined
         existingUser.forgotPasswordCodeValidation = undefined
         await existingUser.save()
         const token = this.jwtService.generateToken({ email }, '10m');
         return { token }
      } else {
         throw new ConflictError('Code is Invalid')
      }
   }
   //end

   //updatePassword service functionalities
   //start
   async updatePassword(email: string, newPassword: string) {
      const existingUser = await this.userModel.findOne({ email })
      if (!existingUser) {
         throw new NotFoundError("User doesn't exists");
      }
      const hashedPassword = await doHash(newPassword, 10);
      existingUser.password = hashedPassword
      await existingUser.save()
      return { success: true, message: 'Password Set Successfully' }
   }
   //end
}

const AuthService = new AuthServiceFunctions()
export default AuthService