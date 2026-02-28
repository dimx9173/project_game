import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { LoginResponse, ApiResponse } from '../models/index.js';
export declare const login: (req: Request, res: Response<ApiResponse<LoginResponse>>) => void;
export declare const logout: (req: AuthRequest, res: Response<ApiResponse>) => void;
export declare const verify: (req: AuthRequest, res: Response<ApiResponse>) => void;
export declare const refresh: (req: Request, res: Response<ApiResponse<{
    token: string;
}>>) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map