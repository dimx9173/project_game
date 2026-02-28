import { Router } from 'express';
import { getMachines, getMachineById, createMachine, updateMachine, deleteMachine } from '../controllers/machineController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', getMachines);
router.get('/:id', getMachineById);
router.post('/', createMachine);
router.put('/:id', updateMachine);
router.delete('/:id', deleteMachine);
export default router;
//# sourceMappingURL=machines.js.map