import { Request, Response, NextFunction } from 'express';
import { ITierDetails, IUser } from 'models/user/userModel.types';
import ProfileService from 'services/Profile.service';

class ProfileController {
   // private profileService: typeof ProfileService;

   // constructor() {
   //    this.profileService = ProfileService;
   // }

   async getProfile(req: Request, res: Response) {
      const result = await ProfileService.getUserProfile(req.user);
      res.json(result);
   }

   async deleteUser(req: Request, res: Response) {
      const result = await ProfileService.deleteUser(req.user.email);
      res.json(result);
   }

   async updateProfile(req: Request, res: Response) {
      const email = req.user.email;
      const updateProfileDto: IUser = req.body;
      const result = await ProfileService.updateUser(email, updateProfileDto);
      res.json(result);
   }

   async updatePlan(req: Request, res: Response) {
      const email = req.user.email;
      const newPlan:{ type: string, title: string, details: ITierDetails, expiring_date: string } = req.body;
      const result = await ProfileService.updateCurrentPlan(email, newPlan);
      res.json(result);
   }
}

export default new ProfileController();