import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Game, ApiResponse, PaginatedResponse } from '../models/index.js';
export declare const getGames: (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Game>>>) => void;
export declare const getGameById: (req: AuthRequest, res: Response<ApiResponse<Game>>) => void;
export declare const createGame: (req: AuthRequest, res: Response<ApiResponse<Game>>) => void;
export declare const updateGame: (req: AuthRequest, res: Response<ApiResponse<Game>>) => void;
//# sourceMappingURL=gameController.d.ts.map