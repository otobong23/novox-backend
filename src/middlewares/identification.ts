import { UnauthorizedError } from "../Errors/Errors";
import { Request, Response, NextFunction } from "express"
import JWTService from "./JWT.service";



export const identifer = (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.client === 'not-browser') token = req.cookies['Authorization'];
    else token = req.headers.authorization;
    if (!token) throw new UnauthorizedError('No token provided');
    try {
        const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        const jwtVerified: payloadType = JWTService.verifyToken<payloadType>(actualToken);
        req.user = jwtVerified
        next()
    } catch (error: any) {
        throw new UnauthorizedError(error.message ?? "Invalid or expired token");
    }
}