import { Router } from 'express';
import { getAgents, getAgentById, createAgent, updateAgent } from '../controllers/agentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/', getAgents);
router.get('/:id', getAgentById);
router.post('/', createAgent);
router.put('/:id', updateAgent);
export default router;
