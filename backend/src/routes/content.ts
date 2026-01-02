import { Router } from 'express';
import { createFullModule } from '../controllers/content';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/full-module', requireAuth, requireRole(['admin']), createFullModule);

export default router;
