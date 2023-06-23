import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ValidationError,
  NotFoundError,
  NotNullViolationError,
} from 'objection';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status = StatusCodes.BAD_REQUEST;
  let message = err.message;
  let type: string | undefined;
  const data = {};

  if (err instanceof ValidationError) {
    status = StatusCodes.UNPROCESSABLE_ENTITY;
    type = err.type || 'ValidationError';
  } else if (err instanceof NotFoundError) {
    status = StatusCodes.NOT_FOUND;
    type = 'NotFound';
  } else if (err instanceof NotNullViolationError) {
    message = 'Missing required data';
    type = err.name;
  }

  type ||= 'UnknownError';

  return res.status(status).json({ message, type, data });
};

export default errorHandler;
