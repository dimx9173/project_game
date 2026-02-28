import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Transaction, ApiResponse, PaginatedResponse } from '../models/index.js';
export declare const getTransactions: (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Transaction>>>) => void;
export declare const getTransactionById: (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => void;
export declare const createTransaction: (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => void;
export declare const placeBet: (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => void;
export declare const settleWin: (req: AuthRequest, res: Response<ApiResponse<Transaction>>) => void;
//# sourceMappingURL=transactionController.d.ts.map