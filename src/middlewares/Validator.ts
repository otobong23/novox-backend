import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Middleware factory function
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields from the validated data
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        errors
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Usage example in routes:
// app.post('/signup', validate(signupSchema), signupController);
// app.post('/login', validate(loginSchema), loginController);
// app.post('/send-verification', validate(sendVerificationSchema), sendVerificationController);