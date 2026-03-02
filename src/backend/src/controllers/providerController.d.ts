import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Provider, ApiResponse, PaginatedResponse } from '../models/index.js';
export declare const getProviders: (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Provider>>>) => void;
export declare const getProviderById: (req: AuthRequest, res: Response<ApiResponse<Provider>>) => void;
export declare const createProvider: (req: AuthRequest, res: Response<ApiResponse<Provider>>) => void;
export declare const updateProvider: (req: AuthRequest, res: Response<ApiResponse<Provider>>) => void;
//# sourceMappingURL=providerController.d.ts.map