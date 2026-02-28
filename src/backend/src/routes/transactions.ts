import { Router } from 'express';
import { getTransactions, getTransactionById, createTransaction, placeBet, settleWin } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.post('/bet', placeBet);
router.post('/win', settleWin);

export default router;
