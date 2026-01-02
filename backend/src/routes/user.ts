import { Router } from 'express';
import { getMyProfile, updateMyProfile, getAdminStats, getStudents } from '../controllers/user';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, updateMyProfile);

// Admin Analytics
router.get('/stats', requireAuth, requireRole('admin'), getAdminStats);
router.get('/students', requireAuth, requireRole('admin'), getStudents);

export default router;
