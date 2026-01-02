import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getMyProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const updateMyProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
        .from('profiles')
        .update(req.body)
        .eq('id', req.user.id)
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'student');

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const { count: studentCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

        const { count: activeAlerts } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);

        res.json({
            totalStudents: studentCount || 0,
            averageScore: 81, // To be calculated from quiz_attempts
            drillsThisMonth: 8,
            activeAlerts: activeAlerts || 0
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
