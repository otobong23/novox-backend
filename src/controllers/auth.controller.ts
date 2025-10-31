import { Request, Response } from 'express';
import AuthService from '../services/Auth.service';

class AuthController {
   // private authService: typeof AuthService;

   // constructor() {
   //    this.authService = AuthService;
   // }

   async login(req: Request, res: Response) {
      const user = await AuthService.validateUser(req.body);
      const result = await AuthService.login(user);
      res.json(result);
   }

   async signup(req: Request, res: Response) {
      const result = await AuthService.signup(req.body);
      res.json(result);
   }

   async sendVerification(req: Request, res: Response) {
      const { email } = req.body;
      const result = await AuthService.sendCode(email);
      res.json(result);
   }

   async verifyCode(req: Request, res: Response) {
      const { email, code } = req.body;
      const result = await AuthService.verifyCode(email, code);
      res.json(result);
   }

   async changePassword(req: Request, res: Response) {
      const { newPassword } = req.body;
      const email = req.user.email; // Assumes JWT middleware attaches user to req
      const result = await AuthService.updatePassword(email, newPassword);
      res.json(result);
   }
}

export default new AuthController();