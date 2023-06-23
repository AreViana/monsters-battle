import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection';

const errorHandler = (err: Error, _req: Request, res: Response) => {
  let status = StatusCodes.BAD_REQUEST;
  const message = err.message || 'Something went wrong';
  let type: string | undefined;
  let data = {};

  if (err instanceof ValidationError) {
    status = StatusCodes.UNPROCESSABLE_ENTITY;
    type = err.type;
    switch (err.type) {
      case 'ModelValidation':
        data = err.data;
        break;
      case 'RelationExpression':
        type = 'RelationExpression';
        break;
      default:
        type = err.type || 'UnknownValidationError';
        break;
    }
  } else if (err instanceof NotFoundError) {
    status = StatusCodes.NOT_FOUND;
    type = 'NotFound';
  } else if (err instanceof UniqueViolationError) {
    status = StatusCodes.CONFLICT;
    type = 'UniqueViolation';
    data = {
      columns: err.columns,
      table: err.table,
      constraint: err.constraint,
    };
  } else if (err instanceof NotNullViolationError) {
    type = 'NotNullViolation';
    data = {
      column: err.column,
      table: err.table,
    };
  } else if (err instanceof ForeignKeyViolationError) {
    status = StatusCodes.CONFLICT;
    type = 'ForeignKeyViolation';
    data = {
      table: err.table,
      constraint: err.constraint,
    };
  } else if (err instanceof CheckViolationError) {
    type = 'CheckViolation';
    data = {
      table: err.table,
      constraint: err.constraint,
    };
  } else if (err instanceof DataError) {
    type = 'InvalidData';
  } else if (err instanceof DBError) {
    status = StatusCodes.INTERNAL_SERVER_ERROR;
    type = 'UnknownDatabaseError';
  } else {
    status = StatusCodes.INTERNAL_SERVER_ERROR;
    type = 'UnknownError';
  }

  return res.status(status).json({ message, type, data });
};

export default errorHandler;
