import { Request, Response, NextFunction } from 'express';

const tryCatch =
  (controller: (req: Request, res: Response, next: NextFunction) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };

export default tryCatch;
