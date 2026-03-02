import { Router } from 'express';
import { getProviders, getProviderById, createProvider, updateProvider } from '../controllers/providerController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', getProviders);
router.get('/:id', getProviderById);
router.post('/', createProvider);
router.put('/:id', updateProvider);
export default router;
//# sourceMappingURL=providers.js.map