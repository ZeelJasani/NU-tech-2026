import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const quizQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    correct: z.number()
});

const fullModuleSchema = z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    videoUrl: z.string(),
    points: z.array(z.string()),
    quiz: z.array(quizQuestionSchema)
});

export const createFullModule = async (req: Request, res: Response) => {
    try {
        const validatedData = fullModuleSchema.parse(req.body);
        const slug = validatedData.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

        // 1. Create Hazard
        const { data: hazard, error: hazardError } = await supabase
            .from('hazards')
            .insert([{
                title: validatedData.title,
                description: validatedData.description,
                icon: validatedData.icon,
                slug: slug
            }])
            .select()
            .single();

        if (hazardError) throw hazardError;

        // 2. Create Module
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .insert([{
                hazard_id: hazard.id,
                title: validatedData.title,
                description: validatedData.description,
                video_url: validatedData.videoUrl,
                content: JSON.stringify({ points: validatedData.points }),
                order_index: 0
            }])
            .select()
            .single();

        if (moduleError) throw moduleError;

        // 3. Create Quiz
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .insert([{
                module_id: module.id,
                title: `${validatedData.title} Quiz`,
                passing_score: Math.ceil(validatedData.quiz.length * 0.7)
            }])
            .select()
            .single();

        if (quizError) throw quizError;

        // 4. Create Questions
        const questionsToInsert = validatedData.quiz.map((q, idx) => ({
            quiz_id: quiz.id,
            question_text: q.question,
            options: q.options,
            correct_option: q.correct,
            order_index: idx
        }));

        const { error: questionsError } = await supabase
            .from('questions')
            .insert(questionsToInsert);

        if (questionsError) throw questionsError;

        res.status(201).json({
            success: true,
            message: 'Full module created successfully',
            data: { hazard_id: hazard.id }
        });

    } catch (error: any) {
        console.error('Error creating full module:', error);
        res.status(400).json({ error: error.message || 'Failed to create module' });
    }
};
