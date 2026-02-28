import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../models/index.js';

interface WalletBalance {
  playerId: string;
  balance: number;
  lastUpdated: Date;
}

const wallets = new Map<string, WalletBalance>();

export const getBalance = (req: AuthRequest, res: Response<ApiResponse<WalletBalance>>): void => {
  const { playerId } = req.params;
  const wallet = wallets.get(playerId);
  if (wallet) {
    res.json({ success: true, data: wallet });
  } else {
    res.json({ success: true, data: { playerId, balance: 0, lastUpdated: new Date() } });
  }
};

export const deposit = (req: AuthRequest, res: Response<ApiResponse<WalletBalance>>): void => {
  const { playerId, amount } = req.body;
  const current = wallets.get(playerId) || { playerId, balance: 0, lastUpdated: new Date() };
  const updated = { ...current, balance: current.balance + amount, lastUpdated: new Date() };
  wallets.set(playerId, updated);
  res.json({ success: true, data: updated });
};

export const withdraw = (req: AuthRequest, res: Response<ApiResponse<WalletBalance>>): void => {
  const { playerId, amount } = req.body;
  const current = wallets.get(playerId) || { playerId, balance: 0, lastUpdated: new Date() };
  if (current.balance < amount) {
    res.status(400).json({ success: false, error: 'Insufficient balance' });
    return;
  }
  const updated = { ...current, balance: current.balance - amount, lastUpdated: new Date() };
  wallets.set(playerId, updated);
  res.json({ success: true, data: updated });
};

export const transfer = (req: AuthRequest, res: Response<ApiResponse>): void => {
  const { fromPlayerId, toPlayerId, amount } = req.body;
  const from = wallets.get(fromPlayerId) || { playerId: fromPlayerId, balance: 0, lastUpdated: new Date() };
  const to = wallets.get(toPlayerId) || { playerId: toPlayerId, balance: 0, lastUpdated: new Date() };
  
  if (from.balance < amount) {
    res.status(400).json({ success: false, error: 'Insufficient balance' });
    return;
  }
  
  from.balance -= amount;
  to.balance += amount;
  wallets.set(fromPlayerId, { ...from, lastUpdated: new Date() });
  wallets.set(toPlayerId, { ...to, lastUpdated: new Date() });
  res.json({ success: true, message: 'Transfer completed' });
};
