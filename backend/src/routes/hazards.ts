import { Router } from 'express';
import { getHazards, getHazardBySlug, createHazard, updateHazard, deleteHazard } from '../controllers/hazards';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getHazards);
router.get('/:slug', getHazardBySlug);

// Admin routes
router.post('/', requireAuth, requireRole('admin'), createHazard);
router.put('/:id', requireAuth, requireRole('admin'), updateHazard);
router.delete('/:id', requireAuth, requireRole('admin'), deleteHazard);

export default router;
