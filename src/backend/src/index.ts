import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import machineRoutes from './routes/machines.js';
import playerRoutes from './routes/players.js';
import transactionRoutes from './routes/transactions.js';
import gameRoutes from './routes/games.js';
import providerRoutes from './routes/providers.js';
import agentRoutes from './routes/agents.js';
import walletRoutes from './routes/wallet.js';
import monitorRoutes from './routes/monitor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/machines', machineRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/monitor', monitorRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
