import { Router } from 'express';
import { getBalance, deposit, withdraw, transfer } from '../controllers/walletController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/balance/:playerId', getBalance);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
export default router;
