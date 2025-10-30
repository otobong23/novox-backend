import { Request, Response, NextFunction } from 'express';
import TransactionService from 'services/Transaction.service';

class TransactionController {
   private transactionService: typeof TransactionService;

   constructor() {
      this.transactionService = TransactionService;
   }

   async deposit(req: Request, res: Response) {
      const email = req.user.email;
      const depositDto: { amount: number, image: string, transactionID: string } = req.body;
      const { image } = depositDto;

      if (image.length > 10 * 1024 * 1024) {
         return res.status(400).json({ message: 'File too large' });
      }

      const result = await this.transactionService.deposit(depositDto, email);
      res.json(result);
   }

   async withdraw(req: Request, res: Response) {
      const email = req.user.email;
      const withdrawDto: { amount: number, walletAddress: string, accountNumber: string, accountName: string, bankName: string } = req.body;
      const result = await this.transactionService.withdraw(withdrawDto, email);
      res.json(result);
   }

   async getTransactions(req: Request, res: Response) {
      const email = req.user.email;
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;

      const result = await this.transactionService.getTransactionHistory(email, limit, page);
      res.json(result);
   }

   async getPlan(req: Request, res: Response) {
      const email = req.user.email;
      const getPlanDto: { amount: number, plan: string } = req.body;
      const result = await this.transactionService.getPlan(email, getPlanDto.amount, getPlanDto.plan);
      res.json(result);
   }

   async mine(req: Request, res: Response, next: NextFunction) {
      try {
         const email = req.user.email;
         const { amount } = req.body;
         const result = await this.transactionService.mine(email, amount);
         res.json(result);
      } catch (error) {
         next(error)
      }
   }

   async resolveAccount(req: Request, res: Response, next: NextFunction) {
      try {
         const resolveDetailsDTO: { account_number: string, account_bank: string } = req.body;
         const result = await this.transactionService.resolveAccount(
            resolveDetailsDTO.account_number,
            resolveDetailsDTO.account_bank
         );
         res.json(result);
      } catch (error) {
         next(error)
      }
   }

   async spinWheel(req: Request, res: Response, next: NextFunction) {
      try {
         const email = req.user.email;
         const result = await this.transactionService.spinReward(email, 0.01);
         res.json(result);
      } catch (error) {
         next(error)
      }
   }
}

export default new TransactionController();