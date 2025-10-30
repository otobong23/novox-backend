import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Controller } from "../@types/ErrorTypes";
import { AppError } from "./Errors";
// import { VoidExpression } from "typescript";


export const ValidatorErrorChecker = (schema: Joi.ObjectSchema) => {
   return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
         res.status(400).json({ success: false, message: error.details[0].message })
         return;
      }
      next();
   }
}

// export const ResponseErrorWrapper = (req: Request, res: Response, callBack: () => VoidExpression) => {
//    try {
//       callBack();
//    } catch (e) {
//       const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
//       res.status(500).send({ success: false, message: errorMessage })
//       return;
//    }
// }

export const asyncResponseHandler = (fn: Controller) => {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
   };
};


export const errorHandler = (err: unknown,req: Request, res: Response, next: NextFunction) => {
   console.error("Error:", err);

   if (err instanceof AppError) {
      return res.status(err.statusCode).json({
         success: false,
         message: err.message,
         stack: process.env.NODE_ENV === "production" ? undefined : err,
      });
   }

   // fallback for unexpected errors
   res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      stack: process.env.NODE_ENV === "production" ? undefined : err,
   });
};