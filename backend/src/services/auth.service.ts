import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../utils/helpers';

export class AuthService {
  async register(email: string, password: string, name: string) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        level: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = this.generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        level: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  private generateToken(user: any): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        level: user.level,
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
  }
}

export const authService = new AuthService();
