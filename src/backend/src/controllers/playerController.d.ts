import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Player, ApiResponse, PaginatedResponse } from '../models/index.js';
export declare const getPlayers: (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Player>>>) => void;
export declare const getPlayerById: (req: AuthRequest, res: Response<ApiResponse<Player>>) => void;
export declare const createPlayer: (req: AuthRequest, res: Response<ApiResponse<Player>>) => void;
export declare const updatePlayer: (req: AuthRequest, res: Response<ApiResponse<Player>>) => void;
export declare const deletePlayer: (req: AuthRequest, res: Response<ApiResponse>) => void;
//# sourceMappingURL=playerController.d.ts.map