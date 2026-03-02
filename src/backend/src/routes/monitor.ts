import { Router } from 'express';
import { getAllMachines, getMachineStatus, getDashboardStats, getAlerts } from '../controllers/monitorController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/machines', getAllMachines);
router.get('/machines/:id', getMachineStatus);
router.get('/dashboard', getDashboardStats);
router.get('/alerts', getAlerts);

export default router;
