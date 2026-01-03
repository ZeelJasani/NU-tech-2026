import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const AlertSchema = z.object({
    title: z.string().min(1),
    message: z.string().min(1),
    severity: z.enum(['info', 'warning', 'critical']),
    region: z.string().optional(),
    active: z.boolean().default(true),
    expires_at: z.string().optional()
});

export const getAlerts = async (req: Request, res: Response) => {
    const { region } = req.query;
    let query = supabase
        .from('alerts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (region) {
        query = query.or(`region.eq.${region},region.eq.All`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('[Alerts] Database error:', error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
};

export const createAlert = async (req: Request, res: Response) => {
    try {
        const validatedData = AlertSchema.parse(req.body);
        const { data, error } = await supabase
            .from('alerts')
            .insert([validatedData])
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deactivateAlert = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('alerts')
        .update({ active: false })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
};
