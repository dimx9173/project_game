import { Router } from 'express';
import { getGames, getGameById, createGame, updateGame } from '../controllers/gameController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', createGame);
router.put('/:id', updateGame);
export default router;
//# sourceMappingURL=games.js.map