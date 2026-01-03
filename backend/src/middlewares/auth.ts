import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Direct Supabase verification - this is the standard way to verify a session on the server
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('[Auth] Verification failed:', error?.message || 'No user found');
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('[Auth] Unexpected error:', err);
        return res.status(500).json({ error: 'Auth service error' });
    }
};

export const requireRole = (roles: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const roleList = Array.isArray(roles) ? roles : [roles];

        // Direct check against the database
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (!profile || !roleList.includes(profile.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    };
};

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
