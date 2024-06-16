import { Router } from 'express';
import currencyRoutes from './currency';
import subscriptionRoutes from './subscription';

const router = Router();

router.use('/', currencyRoutes, subscriptionRoutes);

export default router;
