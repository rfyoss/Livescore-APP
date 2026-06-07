import { Request, Response, NextFunction } from 'express';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    error: {
      message: `Cannot ${req.method} ${req.originalUrl} - Route Not Found.`,
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
};
