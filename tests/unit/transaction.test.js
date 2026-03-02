import { describe, it, expect, beforeEach } from 'vitest';
// Transaction service mock
class TransactionService {
    transactions = new Map();
    players = new Map();
    constructor() {
        // Initialize test players
        this.players.set('player1', {
            id: 'player1',
            playerCode: 'P001',
            username: 'testplayer',
            balance: 10000,
            status: 'active'
        });
    }
    createTransaction(data) {
        const player = this.players.get(data.playerId || '');
        const balanceBefore = player?.balance || 0;
        const balanceAfter = balanceBefore + (data.amount || 0);
        const transaction = {
            id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            transactionId: `TXN${Date.now()}`,
            type: data.type || 'deposit',
            amount: data.amount || 0,
            balanceBefore,
            balanceAfter,
            playerId: data.playerId || '',
            machineId: data.machineId,
            status: 'completed',
            createdAt: new Date()
        };
        this.transactions.set(transaction.id, transaction);
        // Update player balance
        if (player) {
            player.balance = balanceAfter;
        }
        return transaction;
    }
    // 開分 (Credit In / Score Opening)
    creditIn(playerId, amount, machineId) {
        return this.createTransaction({
            type: 'deposit',
            amount: Math.abs(amount),
            playerId,
            machineId
        });
    }
    // 洗分 (Credit Out / Score Washing)
    creditOut(playerId, amount, machineId) {
        return this.createTransaction({
            type: 'withdrawal',
            amount: -Math.abs(amount),
            playerId,
            machineId
        });
    }
    // 下注 (Bet)
    placeBet(playerId, amount, machineId) {
        const player = this.players.get(playerId);
        if (!player || player.balance < amount) {
            throw new Error('Insufficient balance');
        }
        return this.createTransaction({
            type: 'bet',
            amount: -Math.abs(amount),
            playerId,
            machineId
        });
    }
    // 派彩 (Win/Settlement)
    settleWin(playerId, amount, machineId) {
        return this.createTransaction({
            type: 'win',
            amount: Math.abs(amount),
            playerId,
            machineId
        });
    }
    getPlayerBalance(playerId) {
        return this.players.get(playerId)?.balance || 0;
    }
    getTransactions(playerId) {
        const all = Array.from(this.transactions.values());
        if (playerId) {
            return all.filter(t => t.playerId === playerId);
        }
        return all;
    }
}
describe('Transaction Unit Tests', () => {
    let service;
    beforeEach(() => {
        service = new TransactionService();
    });
    describe('Credit Operations (開分/洗分)', () => {
        it('should perform 開分 (credit in)', () => {
            const initialBalance = service.getPlayerBalance('player1');
            const txn = service.creditIn('player1', 1000, 'machine1');
            expect(txn.type).toBe('deposit');
            expect(txn.amount).toBe(1000);
            expect(txn.balanceAfter).toBe(initialBalance + 1000);
            expect(txn.machineId).toBe('machine1');
        });
        it('should perform 洗分 (credit out)', () => {
            const initialBalance = service.getPlayerBalance('player1');
            const txn = service.creditOut('player1', 500, 'machine1');
            expect(txn.type).toBe('withdrawal');
            expect(txn.amount).toBe(-500);
            expect(txn.balanceAfter).toBe(initialBalance - 500);
        });
        it('should handle multiple credit operations', () => {
            service.creditIn('player1', 1000);
            service.creditIn('player1', 2000);
            service.creditOut('player1', 500);
            const balance = service.getPlayerBalance('player1');
            // Initial 10000 + 1000 + 2000 - 500 = 12500
            expect(balance).toBe(12500);
        });
    });
    describe('Bet Operations', () => {
        it('should place bet successfully', () => {
            const initialBalance = service.getPlayerBalance('player1'); // 10000
            const txn = service.placeBet('player1', 100, 'machine1');
            expect(txn.type).toBe('bet');
            expect(txn.amount).toBe(-100);
            expect(txn.balanceAfter).toBe(initialBalance - 100);
        });
        it('should reject bet with insufficient balance', () => {
            expect(() => {
                service.placeBet('player1', 20000, 'machine1');
            }).toThrow('Insufficient balance');
        });
    });
    describe('Win/Settlement Operations', () => {
        it('should settle win correctly', () => {
            const initialBalance = service.getPlayerBalance('player1');
            const txn = service.settleWin('player1', 500, 'machine1');
            expect(txn.type).toBe('win');
            expect(txn.amount).toBe(500);
            expect(txn.balanceAfter).toBe(initialBalance + 500);
        });
    });
    describe('Transaction History', () => {
        it('should retrieve all transactions', () => {
            // Use unique operations to create separate transactions
            service.creditIn('player1', 1000);
            service.placeBet('player1', 100, 'machine1');
            service.settleWin('player1', 200, 'machine1');
            const txns = service.getTransactions();
            expect(txns.length).toBe(3);
        });
        it('should filter transactions by player', () => {
            service.creditIn('player1', 1000);
            service.creditIn('player1', 2000);
            const txns = service.getTransactions('player1');
            expect(txns.length).toBe(2);
        });
    });
});
//# sourceMappingURL=transaction.test.js.map