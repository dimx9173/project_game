export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    createdAt: Date;
}
export interface Game {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'maintenance';
    createdAt: Date;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map