import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getDrills = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('drills')
            .select('*')
            .order('scheduled_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createDrill = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('drills')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
