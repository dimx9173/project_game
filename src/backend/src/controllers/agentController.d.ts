import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Agent, ApiResponse, PaginatedResponse } from '../models/index.js';
export declare const getAgents: (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Agent>>>) => void;
export declare const getAgentById: (req: AuthRequest, res: Response<ApiResponse<Agent>>) => void;
export declare const createAgent: (req: AuthRequest, res: Response<ApiResponse<Agent>>) => void;
export declare const updateAgent: (req: AuthRequest, res: Response<ApiResponse<Agent>>) => void;
//# sourceMappingURL=agentController.d.ts.map