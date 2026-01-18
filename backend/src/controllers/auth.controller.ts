import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/helpers';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);

    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  });

  login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = await authService.getMe((req as any).user!.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  });
}

export const authController = new AuthController();
