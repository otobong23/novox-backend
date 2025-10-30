
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // helps distinguish from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}


// 400 – Bad Request
export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

// 401 – Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// 403 – Forbidden
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// 404 – Not Found
export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

// 408 – Request Timeout
export class RequestTimeoutError extends AppError {
  constructor(message = "Request Timeout") {
    super(message, 408);
  }
}


// 409 – Conflict
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

// 422 – Unprocessable Entity (e.g., validation errors)
export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
  }
}

// 500 – Internal Server Error
export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}
