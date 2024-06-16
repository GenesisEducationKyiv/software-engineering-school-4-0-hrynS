import { Router } from 'express';
import { getRate } from '../controllers/currencyController';

const router = Router();

router.get('/rate', getRate);

export default router;
