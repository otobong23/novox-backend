import { Request, Response, NextFunction } from 'express';
import { IUser } from 'models/user/userModel.types';
import AdminService from 'services/Admin.service';

class AdminController {
  // private adminService: typeof AdminService;

  // constructor() {
  //   this.adminService = AdminService;
  // }

  // ─────────────── ADMIN ───────────────
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogindto: { username: string, password: string } = req.body;
      const result = await AdminService.login(adminLogindto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user.email;
      const adminDto: {
        ProfitStop: number,
        totalTransactions: number,
        walletAddress: string,
        whatsappLink: string,
        telegramLink: string,
        email: string,
        password: string
      } = req.body;
      const result = await AdminService.updateAdmin(email, adminDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAdmin(req.user.email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────── USERS ───────────────
  async getTotalUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getTotalUsers();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const result = await AdminService.getAllUsers(limit, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const result = await AdminService.getUser(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const updateProfileDto: IUser = req.body;
      const result = await AdminService.updateUser(email, updateProfileDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserByuserID(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.query;
      const result = await AdminService.getUserByuserID(userID as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;
      const result = await AdminService.searchUsers(keyword as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────── CREWS ───────────────
  async getTotalCrew(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getTotalCrews();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllCrews(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const result = await AdminService.getAllCrews(limit, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserCrew(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.query;
      const result = await AdminService.getUserCrew(userID as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchCrews(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;
      const result = await AdminService.searchCrews(keyword as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────── TRANSACTIONS ───────────────
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const result = await AdminService.getTransactions(limit, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUsersTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const result = await AdminService.getUserTransactions(email as string, limit, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, transactionID } = req.query;
      const updateData: {
        status: 'completed' | 'failed',
        image?: string,
        amount?: number,
        action?: 'minus' | 'add'
      } = req.body;
      const result = await AdminService.updateTransaction(
        email as string,
        transactionID as string,
        updateData
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────── ACTIONS ───────────────
  async detachUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.body;
      const result = await AdminService.deleteUserCascade(userID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async globalData(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.globalData();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();