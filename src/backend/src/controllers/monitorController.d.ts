import { Response } from 'express';
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
export declare const getAllMachines: (req: AuthRequest, res: Response<ApiResponse<MonitorData[]>>) => void;
export declare const getMachineStatus: (req: AuthRequest, res: Response<ApiResponse<MonitorData>>) => void;
export declare const getDashboardStats: (req: AuthRequest, res: Response<ApiResponse<any>>) => void;
export declare const getAlerts: (req: AuthRequest, res: Response<ApiResponse<any[]>>) => void;
export {};
//# sourceMappingURL=monitorController.d.ts.map