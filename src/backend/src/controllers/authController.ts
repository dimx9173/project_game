import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, generateToken, generateRefreshToken } from '../middleware/auth.js';
import { LoginRequest, LoginResponse, ApiResponse, User } from '../models/index.js';

const users = new Map<string, User & { passwordHash: string }>([
  ['admin', { id: '1', username: 'admin', passwordHash: 'hashed', role: 'admin', email: 'admin@game.com', status: 'active', createdAt: new Date(), updatedAt: new Date() }]
]);

export const login = (req: Request, res: Response<ApiResponse<LoginResponse>>): void => {
  const { username, password } = req.body as LoginRequest;
  const user = users.get(username);
  
  if (!user || password !== 'admin123') {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }

  const token = generateToken({ userId: user.id, username: user.username, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, username: user.username, role: user.role });

  const { passwordHash, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: { token, refreshToken, user: userWithoutPassword }
  });
};

export const logout = (req: AuthRequest, res: Response<ApiResponse>): void => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const verify = (req: AuthRequest, res: Response<ApiResponse>): void => {
  res.json({ success: true, data: req.user });
};

export const refresh = async (req: Request, res: Response<ApiResponse<{ token: string }>>): Promise<void> => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    res.status(400).json({ success: false, error: 'Refresh token required' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'dev-secret-key') as { userId: string; username: string; role: 'admin' | 'manager' | 'operator' | 'viewer' };
    const newToken = generateToken(decoded);
    res.json({ success: true, data: { token: newToken } });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
};
