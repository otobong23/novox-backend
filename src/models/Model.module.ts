import dotenv from 'dotenv'
import UserModel from './user/userModel'
import { NotFoundError } from 'Errors/Errors'
import CrewModel from 'models/crew/crewModel'
import UserTransactionModel from 'models/transaction/transactionModel'

dotenv.config()

export class ModelModule {
   protected userModel: typeof UserModel
   protected crewModel: typeof CrewModel
   protected userTransactionModel: typeof UserTransactionModel

   constructor() {
      this.userModel = UserModel
      this.crewModel = CrewModel
      this.userTransactionModel = UserTransactionModel
   }

   async getUserByEmail(email: string) {
      const existingUser = await this.userModel.findOne({ email })
      if (!existingUser) throw new NotFoundError('User does not exist');
      return existingUser;
   }
}

// const UserService = new UserServiceFunctions()
// export default UserService