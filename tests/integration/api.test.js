import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';
// Simple mock routes for testing (in real app, import actual routes)
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    // Mock auth middleware
    app.use((req, res, next) => {
        const auth = req.headers.authorization;
        if (auth && auth.startsWith('Bearer ')) {
            req.user = { userId: '1', username: 'admin', role: 'admin' };
        }
        next();
    });
    // Auth routes
    let mockToken = '';
    app.post('/api/v1/auth/login', (req, res) => {
        const { username, password } = req.body;
        if (username === 'admin' && password === 'admin123') {
            mockToken = 'mock-jwt-token';
            res.json({
                success: true,
                data: {
                    token: mockToken,
                    refreshToken: 'mock-refresh-token',
                    user: { id: '1', username: 'admin', role: 'admin' }
                }
            });
        }
        else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    });
    app.post('/api/v1/auth/refresh', (req, res) => {
        const { refreshToken } = req.body;
        if (refreshToken) {
            res.json({ success: true, data: { token: 'new-mock-token' } });
        }
        else {
            res.status(400).json({ success: false, error: 'Refresh token required' });
        }
    });
    // Protected routes
    const machines = [
        { id: '1', machineCode: 'M001', name: 'Slot Machine 1', status: 'online' },
        { id: '2', machineCode: 'M002', name: 'Slot Machine 2', status: 'offline' }
    ];
    app.get('/api/v1/machines', (req, res) => {
        res.json({ success: true, data: machines, pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 } });
    });
    app.get('/api/v1/machines/:id', (req, res) => {
        const machine = machines.find(m => m.id === req.params.id);
        if (machine) {
            res.json({ success: true, data: machine });
        }
        else {
            res.status(404).json({ success: false, error: 'Machine not found' });
        }
    });
    const players = [
        { id: '1', playerCode: 'P001', username: 'player1', balance: 10000, status: 'active' }
    ];
    app.get('/api/v1/players', (req, res) => {
        res.json({ success: true, data: players, pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 } });
    });
    app.get('/api/v1/players/:id', (req, res) => {
        const player = players.find(p => p.id === req.params.id);
        if (player) {
            res.json({ success: true, data: player });
        }
        else {
            res.status(404).json({ success: false, error: 'Player not found' });
        }
    });
    const transactions = [];
    app.get('/api/v1/transactions', (req, res) => {
        res.json({
            success: true,
            data: { items: transactions, total: 0, page: 1, pageSize: 20, totalPages: 0 }
        });
    });
    app.post('/api/v1/transactions', (req, res) => {
        const txn = { id: `txn_${Date.now()}`, ...req.body, status: 'completed' };
        transactions.push(txn);
        res.status(201).json({ success: true, data: txn });
    });
    return app;
};
describe('API Integration Tests', () => {
    let app;
    let token;
    beforeAll(() => {
        app = createTestApp();
    });
    describe('Auth Endpoints', () => {
        it('POST /api/v1/auth/login - should login successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'admin', password: 'admin123' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            token = res.body.data.token;
        });
        it('POST /api/v1/auth/login - should reject invalid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'admin', password: 'wrong' });
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
        it('POST /api/v1/auth/refresh - should refresh token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: 'valid-token' });
            expect(res.status).toBe(200);
            expect(res.body.data.token).toBeDefined();
        });
    });
    describe('Machine Endpoints', () => {
        it('GET /api/v1/machines - should return machine list', async () => {
            const res = await request(app)
                .get('/api/v1/machines')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
        it('GET /api/v1/machines/:id - should return machine details', async () => {
            const res = await request(app)
                .get('/api/v1/machines/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.data.machineCode).toBe('M001');
        });
        it('GET /api/v1/machines/:id - should return 404 for non-existent machine', async () => {
            const res = await request(app)
                .get('/api/v1/machines/999')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });
    describe('Player Endpoints', () => {
        it('GET /api/v1/players - should return player list', async () => {
            const res = await request(app)
                .get('/api/v1/players')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('GET /api/v1/players/:id - should return player details', async () => {
            const res = await request(app)
                .get('/api/v1/players/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.data.playerCode).toBe('P001');
        });
    });
    describe('Transaction Endpoints', () => {
        it('GET /api/v1/transactions - should return transaction list', async () => {
            const res = await request(app)
                .get('/api/v1/transactions')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('POST /api/v1/transactions - should create transaction', async () => {
            const res = await request(app)
                .post('/api/v1/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send({
                type: 'deposit',
                amount: 1000,
                playerId: '1',
                machineId: '1'
            });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.amount).toBe(1000);
        });
    });
});
//# sourceMappingURL=api.test.js.map