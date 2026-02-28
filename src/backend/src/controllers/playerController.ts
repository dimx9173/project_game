import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Player, ApiResponse, PaginatedResponse } from '../models/index.js';

const players = new Map<string, Player>();

export const getPlayers = (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Player>>>): void => {
  const { page = 1, pageSize = 20, status, level, agentId } = req.query;
  
  let items = Array.from(players.values());
  
  if (status) items = items.filter(p => p.status === status);
  if (level) items = items.filter(p => p.level === Number(level));
  if (agentId) items = items.filter(p => p.agentId === agentId);

  const total = items.length;
  const pageNum = Number(page);
  const size = Number(pageSize);
  
  res.json({
    success: true,
    data: {
      items: items.slice((pageNum - 1) * size, pageNum * size),
      total,
      page: pageNum,
      pageSize: size,
      totalPages: Math.ceil(total / size)
    }
  });
};

export const getPlayerById = (req: AuthRequest, res: Response<ApiResponse<Player>>): void => {
  const { id } = req.params;
  const player = players.get(id);
  
  if (!player) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }
  
  res.json({ success: true, data: player });
};

export const createPlayer = (req: AuthRequest, res: Response<ApiResponse<Player>>): void => {
  const { username, phone, email, level = 1, agentId } = req.body;
  
  const player: Player = {
    id: `player_${Date.now()}`,
    playerCode: `P${Date.now()}`,
    username,
    phone,
    email,
    level,
    balance: 0,
    status: 'active',
    agentId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  players.set(player.id, player);
  res.status(201).json({ success: true, data: player });
};

export const updatePlayer = (req: AuthRequest, res: Response<ApiResponse<Player>>): void => {
  const { id } = req.params;
  const player = players.get(id);
  
  if (!player) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }
  
  const updated = { ...player, ...req.body, updatedAt: new Date() };
  players.set(id, updated);
  res.json({ success: true, data: updated });
};

export const deletePlayer = (req: AuthRequest, res: Response<ApiResponse>): void => {
  const { id } = req.params;
  
  if (!players.has(id)) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }
  
  players.delete(id);
  res.json({ success: true, message: 'Player deleted' });
};
