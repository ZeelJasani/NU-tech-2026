import { Router } from 'express';
import { getDrills, createDrill } from '../controllers/drills';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getDrills);
router.post('/', requireAuth, requireRole(['admin', 'trainer']), createDrill);

export default router;
