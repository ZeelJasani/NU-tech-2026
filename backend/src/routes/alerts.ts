import { Router } from 'express';
import { getAlerts, createAlert, deactivateAlert } from '../controllers/alerts';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getAlerts);

// Admin routes
router.post('/', requireAuth, requireRole('admin'), createAlert);
router.put('/:id/deactivate', requireAuth, requireRole('admin'), deactivateAlert);

export default router;
