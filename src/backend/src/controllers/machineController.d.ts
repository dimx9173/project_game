import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Machine, ApiResponse, PaginatedResponse } from '../models/index.js';
export declare const getMachines: (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Machine>>>) => void;
export declare const getMachineById: (req: AuthRequest, res: Response<ApiResponse<Machine>>) => void;
export declare const createMachine: (req: AuthRequest, res: Response<ApiResponse<Machine>>) => void;
export declare const updateMachine: (req: AuthRequest, res: Response<ApiResponse<Machine>>) => void;
export declare const deleteMachine: (req: AuthRequest, res: Response<ApiResponse>) => void;
//# sourceMappingURL=machineController.d.ts.map