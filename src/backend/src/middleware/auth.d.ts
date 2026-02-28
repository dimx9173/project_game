import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../models/index.js';
export interface AuthRequest extends Request {
    user?: TokenPayload;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const generateToken: (payload: TokenPayload) => string;
export declare const generateRefreshToken: (payload: TokenPayload) => string;
//# sourceMappingURL=auth.d.ts.map