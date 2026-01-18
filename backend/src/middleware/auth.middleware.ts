import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../utils/helpers';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: string;
      level: string;
    };

    (req as any).user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes((req as any).user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};
