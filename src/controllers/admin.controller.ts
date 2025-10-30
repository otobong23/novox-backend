import { Request, Response, NextFunction } from 'express';
import { IUser } from 'models/user/userModel.types';
import AdminService from 'services/Admin.service';

class AdminController {
  private adminService: typeof AdminService;

  constructor() {
    this.adminService = AdminService;
  }

  // ─────────────── ADMIN ───────────────
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogindto: { username: string, password: string } = req.body;
      const result = await this.adminService.login(adminLogindto);
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
      const result = await this.adminService.updateAdmin(email, adminDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getAdmin(req.user.email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────── USERS ───────────────
  async getTotalUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getTotalUsers();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const result = await this.adminService.getAllUsers(limit, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const result = await this.adminService.getUser(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const updateProfileDto: IUser = req.body;
      const result = await this.adminService.updateUser(email, updateProfileDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserByuserID(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.query;
      const result = await this.adminService.getUserByuserID(userID as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;
      const result = await this.adminService.searchUsers(keyword as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────── CREWS ───────────────
  async getTotalCrew(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.getTotalCrews();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllCrews(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const result = await this.adminService.getAllCrews(limit, page);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserCrew(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.query;
      const result = await this.adminService.getUserCrew(userID as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchCrews(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;
      const result = await this.adminService.searchCrews(keyword as string);
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
      const result = await this.adminService.getTransactions(limit, page);
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
      const result = await this.adminService.getUserTransactions(email as string, limit, page);
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
      const result = await this.adminService.updateTransaction(
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
      const result = await this.adminService.deleteUserCascade(userID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async globalData(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.globalData();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();