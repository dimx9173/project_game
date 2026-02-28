import { Router } from 'express';
import { login, logout, verify, refresh } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/verify', authenticate, verify);
router.post('/refresh', refresh);
export default router;
//# sourceMappingURL=auth.js.map