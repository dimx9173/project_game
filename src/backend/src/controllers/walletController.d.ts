import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../models/index.js';
interface WalletBalance {
    playerId: string;
    balance: number;
    lastUpdated: Date;
}
export declare const getBalance: (req: AuthRequest, res: Response<ApiResponse<WalletBalance>>) => void;
export declare const deposit: (req: AuthRequest, res: Response<ApiResponse<WalletBalance>>) => void;
export declare const withdraw: (req: AuthRequest, res: Response<ApiResponse<WalletBalance>>) => void;
export declare const transfer: (req: AuthRequest, res: Response<ApiResponse>) => void;
export {};
//# sourceMappingURL=walletController.d.ts.map