declare class ApiService {
    private token;
    setToken(token: string | null): void;
    getToken(): string | null;
    private request;
    login(username: string, password: string): Promise<{
        success: boolean;
        data: {
            token: string;
            user: unknown;
        };
    }>;
    logout(): Promise<unknown>;
    verify(): Promise<unknown>;
    getMachines(params?: Record<string, unknown>): Promise<unknown>;
    getMachine(id: string): Promise<unknown>;
    createMachine(data: unknown): Promise<unknown>;
    updateMachine(id: string, data: unknown): Promise<unknown>;
    deleteMachine(id: string): Promise<unknown>;
    getPlayers(params?: Record<string, unknown>): Promise<unknown>;
    getPlayer(id: string): Promise<unknown>;
    createPlayer(data: unknown): Promise<unknown>;
    updatePlayer(id: string, data: unknown): Promise<unknown>;
    getTransactions(params?: Record<string, unknown>): Promise<unknown>;
}
export declare const api: ApiService;
export {};
//# sourceMappingURL=api.d.ts.map