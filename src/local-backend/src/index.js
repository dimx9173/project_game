import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files
const publicPath = path.join(PROJECT_ROOT, 'public');
app.use(express.static(publicPath));
// PIN Authentication
const PIN_SECRET = process.env.PIN_SECRET || '123456';
// SQLite Database
const db = new Database(path.join(PROJECT_ROOT, 'local.db'));
// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'offline',
    balance INTEGER DEFAULT 0,
    last_cash_in INTEGER DEFAULT 0,
    last_cash_out INTEGER DEFAULT 0,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    machine_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    operator_id TEXT NOT NULL,
    pin TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);
// PIN Middleware
const authenticatePIN = (req, res, next) => {
    const pin = req.headers['x-pin-code'];
    if (!pin || pin.length !== 6) {
        res.status(401).json({ success: false, error: 'Invalid PIN' });
        return;
    }
    next();
};
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', mode: 'local', database: 'sqlite', timestamp: new Date().toISOString() });
});
app.post('/api/verify-pin', authenticatePIN, (req, res) => {
    const pin = req.headers['x-pin-code'];
    res.json({ success: true, valid: pin === PIN_SECRET });
});
// Machines CRUD
app.get('/api/machines', authenticatePIN, (req, res) => {
    const stmt = db.prepare('SELECT * FROM machines ORDER BY id DESC');
    const items = stmt.all();
    res.json({ success: true, data: { items, total: items.length } });
});
app.get('/api/machines/:id', authenticatePIN, (req, res) => {
    const stmt = db.prepare('SELECT * FROM machines WHERE id = ?');
    const machine = stmt.get(req.params.id);
    machine ? res.json({ success: true, data: machine }) : res.status(404).json({ success: false, error: 'Machine not found' });
});
app.post('/api/machines', authenticatePIN, (req, res) => {
    const { machineCode, name } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO machines (machine_code, name, balance) VALUES (?, ?, 0)');
        const result = stmt.run(machineCode, name);
        const newMachine = db.prepare('SELECT * FROM machines WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: newMachine });
    }
    catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
});
// Cash In (開分)
app.post('/api/cash-in', authenticatePIN, (req, res) => {
    const { machineId, amount, operatorId } = req.body;
    const pin = req.headers['x-pin-code'];
    if (!machineId || !amount || !operatorId) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
    }
    const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(machineId);
    if (!machine) {
        res.status(404).json({ success: false, error: 'Machine not found' });
        return;
    }
    const previousBalance = machine.balance;
    const newBalance = previousBalance + amount;
    db.prepare('UPDATE machines SET balance = ?, last_cash_in = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newBalance, amount, machineId);
    db.prepare('INSERT INTO transactions (type, machine_id, amount, operator_id, pin) VALUES (?, ?, ?, ?, ?)')
        .run('cash_in', machineId, amount, operatorId, pin);
    res.json({ success: true, data: { machineId, previousBalance, currentBalance: newBalance, cashInAmount: amount } });
});
// Cash Out (洗分)
app.post('/api/cash-out', authenticatePIN, (req, res) => {
    const { machineId, amount, operatorId } = req.body;
    const pin = req.headers['x-pin-code'];
    if (!machineId || !amount || !operatorId) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
    }
    const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(machineId);
    if (!machine) {
        res.status(404).json({ success: false, error: 'Machine not found' });
        return;
    }
    if (machine.balance < amount) {
        res.status(400).json({ success: false, error: 'Insufficient balance', available: machine.balance });
        return;
    }
    const previousBalance = machine.balance;
    const newBalance = previousBalance - amount;
    db.prepare('UPDATE machines SET balance = ?, last_cash_out = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newBalance, amount, machineId);
    db.prepare('INSERT INTO transactions (type, machine_id, amount, operator_id, pin) VALUES (?, ?, ?, ?, ?)')
        .run('cash_out', machineId, amount, operatorId, pin);
    res.json({ success: true, data: { machineId, previousBalance, currentBalance: newBalance, cashOutAmount: amount } });
});
// Get Transactions
app.get('/api/transactions', authenticatePIN, (req, res) => {
    const { machineId, type, limit = 50 } = req.query;
    let sql = 'SELECT * FROM transactions';
    const params = [];
    if (machineId || type) {
        sql += ' WHERE';
        if (machineId) {
            sql += ' machine_id = ?';
            params.push(machineId);
        }
        if (type) {
            sql += params.length ? ' AND' : '';
            sql += ' type = ?';
            params.push(type);
        }
    }
    sql += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(Number(limit));
    const items = db.prepare(sql).all(...params);
    res.json({ success: true, data: { items, total: items.length } });
});
// Get Machine Balance
app.get('/api/balance/:machineId', (req, res) => {
    const machine = db.prepare('SELECT machine_code, balance FROM machines WHERE id = ?').get(req.params.machineId);
    if (!machine) {
        res.status(404).json({ success: false, error: 'Machine not found' });
        return;
    }
    res.json({ success: true, data: { machineId: machine.machine_code, balance: machine.balance } });
});
// Offline mode
app.post('/api/offline-mode', authenticatePIN, (req, res) => {
    const { enabled } = req.body;
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('offline_mode', enabled ? '1' : '0');
    res.json({ success: true, data: { offlineMode: enabled } });
});
// Check offline mode
app.get('/api/offline-mode', (req, res) => {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get('offline_mode');
    res.json({ success: true, data: { enabled: setting?.value === '1' } });
});
app.listen(PORT, () => {
    console.log(`🏠 Local Backend running on http://localhost:${PORT}`);
    console.log(`🔐 Default PIN: ${PIN_SECRET}`);
    console.log(`💾 Database: SQLite (local.db)`);
});
//# sourceMappingURL=index.js.map