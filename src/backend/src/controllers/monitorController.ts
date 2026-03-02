import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../models/index.js';

interface MonitorData {
  machineId: string;
  status: 'online' | 'offline' | 'error';
  cpu: number;
  memory: number;
  networkLatency: number;
  lastHeartbeat: Date;
  gameId?: string;
  currentPlayer?: string;
  todayBet: number;
  todayWin: number;
}

// Simulated real-time data
const monitorData = new Map<string, MonitorData>();

export const getAllMachines = (req: AuthRequest, res: Response<ApiResponse<MonitorData[]>>): void => {
  const items = Array.from(monitorData.values());
  res.json({ success: true, data: items });
};

export const getMachineStatus = (req: AuthRequest, res: Response<ApiResponse<MonitorData>>): void => {
  const data = monitorData.get(req.params.id);
  data ? res.json({ success: true, data }) : res.status(404).json({ success: false, error: 'Machine not found' });
};

export const getDashboardStats = (req: AuthRequest, res: Response<ApiResponse<any>>): void => {
  const machines = Array.from(monitorData.values());
  const online = machines.filter(m => m.status === 'online').length;
  const offline = machines.filter(m => m.status === 'offline').length;
  const error = machines.filter(m => m.status === 'error').length;
  
  const totalBet = machines.reduce((sum, m) => sum + m.todayBet, 0);
  const totalWin = machines.reduce((sum, m) => sum + m.todayWin, 0);
  
  res.json({
    success: true,
    data: {
      totalMachines: machines.length,
      online,
      offline,
      error,
      totalBet,
      totalWin,
      netProfit: totalBet - totalWin,
      timestamp: new Date()
    }
  });
};

export const getAlerts = (req: AuthRequest, res: Response<ApiResponse<any[]>>): void => {
  const machines = Array.from(monitorData.values());
  const alerts = machines
    .filter(m => m.status === 'error' || m.cpu > 90 || m.memory > 90)
    .map(m => ({
      machineId: m.machineId,
      type: m.status === 'error' ? 'error' : m.cpu > 90 ? 'high_cpu' : 'high_memory',
      message: m.status === 'error' ? 'Machine error' : m.cpu > 90 ? 'High CPU usage' : 'High memory usage',
      timestamp: new Date()
    }));
  
  res.json({ success: true, data: alerts });
};
