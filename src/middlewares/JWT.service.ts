import dotenv from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
dotenv.config()

export class JWTServiceFunctions {
   private jwtService: typeof jwt

   constructor() {
      this.jwtService = jwt
   }

   generateToken( payload: object, expiresIn: string = '30d' ) {
      return this.jwtService.sign(payload, process.env.JWT_SECRET!, { expiresIn } as SignOptions)
   }
   verifyToken<T>(token: string) {
      return this.jwtService.verify(token, process.env.JWT_SECRET!) as T & JwtPayloadBase
   }
}
const JWTService = new JWTServiceFunctions()
export default JWTService