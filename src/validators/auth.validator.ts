import Joi from 'joi';

// Validation Schemas
export const signupSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty'
    }),
  
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username is required',
      'string.empty': 'Username cannot be empty'
    }),
  
  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must not exceed 20 characters',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty'
    }),
  
  referral_code: Joi.string()
    .optional()
    .allow('', null)
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty'
    })
});

export const sendVerificationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty'
    })
});