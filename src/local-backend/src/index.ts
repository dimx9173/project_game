import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (admin dashboard) - fixed path
const publicPath = path.join(PROJECT_ROOT, 'public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// PIN Authentication (6-digit)
const PIN_SECRET = process.env.PIN_SECRET || '123456';

// In-memory data stores
interface Machine {
  id: string;
  machineCode: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  balance: number;
  lastCashIn?: number;
  lastCashOut?: number;
  lastUpdate: Date;
}

interface Transaction {
  id: string;
  type: 'cash_in' | 'cash_out' | 'adjust';
  machineId: string;
  amount: number;
  operatorId: string;
  pin: string;
  timestamp: Date;
}

const machines = new Map<string, Machine>();
const transactions: Transaction[] = [];

// PIN Middleware
const authenticatePIN = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const pin = req.headers['x-pin-code'] as string;
  if (!pin || pin.length !== 6) {
    res.status(401).json({ success: false, error: 'Invalid PIN' });
    return;
  }
  next();
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: 'local', timestamp: new Date().toISOString() });
});

app.post('/api/verify-pin', authenticatePIN, (req, res) => {
  const pin = req.headers['x-pin-code'] as string;
  res.json({ success: true, valid: pin === PIN_SECRET });
});

app.get('/api/machines', authenticatePIN, (req, res) => {
  const items = Array.from(machines.values());
  res.json({ success: true, data: { items, total: items.length } });
});

app.get('/api/machines/:id', authenticatePIN, (req, res) => {
  const machine = machines.get(req.params.id);
  machine ? res.json({ success: true, data: machine }) : res.status(404).json({ success: false, error: 'Machine not found' });
});

app.post('/api/machines', authenticatePIN, (req, res) => {
  const { machineCode, name } = req.body;
  const machine: Machine = {
    id: 'm_' + Date.now(),
    machineCode,
    name,
    status: 'offline',
    balance: 0,
    lastUpdate: new Date()
  };
  machines.set(machine.id, machine);
  res.status(201).json({ success: true, data: machine });
});

app.post('/api/cash-in', authenticatePIN, (req, res) => {
  const { machineId, amount, operatorId } = req.body;
  const pin = req.headers['x-pin-code'] as string;
  
  if (!machineId || !amount || !operatorId) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  const machine = machines.get(machineId);
  if (!machine) {
    res.status(404).json({ success: false, error: 'Machine not found' });
    return;
  }

  machine.balance += amount;
  machine.lastCashIn = amount;
  machine.lastUpdate = new Date();
  machines.set(machineId, machine);

  const txn: Transaction = {
    id: 'txn_' + Date.now(),
    type: 'cash_in',
    machineId,
    amount,
    operatorId,
    pin,
    timestamp: new Date()
  };
  transactions.push(txn);

  res.json({ 
    success: true, 
    data: { 
      machineId, 
      previousBalance: machine.balance - amount,
      currentBalance: machine.balance,
      cashInAmount: amount 
    } 
  });
});

app.post('/api/cash-out', authenticatePIN, (req, res) => {
  const { machineId, amount, operatorId } = req.body;
  const pin = req.headers['x-pin-code'] as string;
  
  if (!machineId || !amount || !operatorId) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  const machine = machines.get(machineId);
  if (!machine) {
    res.status(404).json({ success: false, error: 'Machine not found' });
    return;
  }

  if (machine.balance < amount) {
    res.status(400).json({ success: false, error: 'Insufficient balance', available: machine.balance });
    return;
  }

  machine.balance -= amount;
  machine.lastCashOut = amount;
  machine.lastUpdate = new Date();
  machines.set(machineId, machine);

  const txn: Transaction = {
    id: 'txn_' + Date.now(),
    type: 'cash_out',
    machineId,
    amount,
    operatorId,
    pin,
    timestamp: new Date()
  };
  transactions.push(txn);

  res.json({ 
    success: true, 
    data: { 
      machineId, 
      previousBalance: machine.balance + amount,
      currentBalance: machine.balance,
      cashOutAmount: amount 
    } 
  });
});

app.get('/api/transactions', authenticatePIN, (req, res) => {
  const { machineId, type, limit = 50 } = req.query;
  let items = [...transactions].reverse();
  
  if (machineId) items = items.filter(t => t.machineId === machineId);
  if (type) items = items.filter(t => t.type === type);
  
  res.json({ success: true, data: { items: items.slice(0, Number(limit)), total: items.length } });
});

app.get('/api/balance/:machineId', (req, res) => {
  const machine = machines.get(req.params.machineId);
  if (!machine) {
    res.status(404).json({ success: false, error: 'Machine not found' });
    return;
  }
  res.json({ success: true, data: { machineId: machine.machineCode, balance: machine.balance } });
});

app.post('/api/offline-mode', authenticatePIN, (req, res) => {
  const { enabled } = req.body;
  res.json({ success: true, data: { offlineMode: enabled, message: enabled ? 'System is now in offline mode' : 'System is now online' } });
});

// SPA fallback
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin.html'));
});

app.listen(PORT, () => {
  console.log('🏠 Local Backend running on http://localhost:' + PORT);
  console.log('🔐 Default PIN: ' + PIN_SECRET);
  console.log('📊 Admin Dashboard: http://localhost:' + PORT + '/admin');
});
