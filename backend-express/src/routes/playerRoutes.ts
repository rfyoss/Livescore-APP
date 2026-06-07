import { Router } from 'express';
import { getPlayerById, searchPlayers } from '../controllers/playerController';

const router = Router();

router.get('/search', searchPlayers);
router.get('/:id', getPlayerById);

export default router;
