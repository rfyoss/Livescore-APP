import { Router } from 'express';
import { getStandingsByLeague } from '../controllers/standingsController';

const router = Router();

router.get('/:leagueId', getStandingsByLeague);

export default router;
