import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const HazardSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image_url: z.string().optional(),
    slug: z.string().min(1),
    preparation_content: z.any().optional()
});

export const getHazards = async (req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('hazards')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const getHazardBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { data, error } = await supabase
        .from('hazards')
        .select('*, modules(*)')
        .eq('slug', slug)
        .single();

    if (error) return res.status(404).json({ error: 'Hazard not found' });
    res.json(data);
};

export const createHazard = async (req: Request, res: Response) => {
    try {
        const validatedData = HazardSchema.parse(req.body);
        const { data, error } = await supabase
            .from('hazards')
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

export const updateHazard = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const validatedData = HazardSchema.partial().parse(req.body);
        const { data, error } = await supabase
            .from('hazards')
            .update(validatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteHazard = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('hazards')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
};
