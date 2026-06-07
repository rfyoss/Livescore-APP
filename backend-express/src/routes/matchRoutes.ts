import { Router } from 'express';
import { getMatches, getLiveMatches, getUpcomingMatches, getMatchById } from '../controllers/matchController';

const router = Router();

router.get('/', getMatches);
router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);

export default router;
