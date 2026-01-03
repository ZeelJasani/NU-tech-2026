"use client";

import { Plus, Trash2, Video, BookOpen, HelpCircle, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct: number;
}

export default function ModuleManagement() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("🛡️");
    const [videoUrl, setVideoUrl] = useState("");
    const [points, setPoints] = useState<string[]>([""]);
    const [quiz, setQuiz] = useState<QuizQuestion[]>([
        { id: 1, question: "", options: ["", "", "", ""], correct: 0 }
    ]);

    const addPoint = () => setPoints([...points, ""]);
    const removePoint = (index: number) => setPoints(points.filter((_, i) => i !== index));
    const updatePoint = (index: number, val: string) => {
        const newPoints = [...points];
        newPoints[index] = val;
        setPoints(newPoints);
    };

    const addQuestion = () => {
        setQuiz([...quiz, { id: quiz.length + 1, question: "", options: ["", "", "", ""], correct: 0 }]);
    };

    const removeQuestion = (index: number) => {
        setQuiz(quiz.filter((_, i) => i !== index));
    };

    const updateQuestion = <K extends keyof QuizQuestion>(index: number, field: K, value: QuizQuestion[K]) => {
        const newQuiz = [...quiz];
        (newQuiz[index] as QuizQuestion)[field] = value;
        setQuiz(newQuiz);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuiz = [...quiz];
        newQuiz[qIndex].options[oIndex] = value;
        setQuiz(newQuiz);
    };

    const handleSave = async () => {
        const moduleData = {
            title,
            description,
            icon,
            videoUrl,
            points: points.filter(p => p.trim() !== ""),
            quiz: quiz.filter(q => q.question.trim() !== "")
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("You must be logged in as an admin to save.");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/full-module`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(moduleData)
            });

            if (response.ok) {
                alert("Full Module (Hazard + Content + Quiz) created successfully!");
                // Reset form
                setTitle("");
                setDescription("");
                setVideoUrl("");
                setPoints([""]);
            } else {
                const error = await response.json();
                alert(`Failed to save: ${error.error}`);
            }
        } catch (err) {
            console.error("Error saving module:", err);
            alert("Network error. Is the backend running?");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Module Creator</h2>
                    <p className="text-slate-500 font-medium mt-1">Design new educational modules with video and quizzes</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#003366] text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:scale-105 active:scale-95 transition-all"
                >
                    <Save className="h-5 w-5" />
                    Save Module
                </button>
            </div>

            {/* Basic Info */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Module Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Advanced Earthquake Safety"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Module Icon (Emoji or URL)</label>
                        <input
                            type="text"
                            placeholder="🛡️"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Briefly describe what students will learn in this module..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        />
                    </div>
                </div>
            </section>

            {/* Video & Media */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                        <Video className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Media Content</h3>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Video Tutorial URL (YouTube/Vimeo)</label>
                    <input
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    />
                </div>
            </section>

            {/* Key Safety Points */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Key Safety Points</h3>
                    </div>
                    <button
                        onClick={addPoint}
                        className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Add Point
                    </button>
                </div>

                <div className="space-y-4">
                    {points.map((point, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder={`Safety Point #${idx + 1}`}
                                    value={point}
                                    onChange={(e) => updatePoint(idx, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                />
                            </div>
                            {points.length > 1 && (
                                <button
                                    onClick={() => removePoint(idx)}
                                    className="p-4 text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Quiz Section */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Knowledge Check (Quiz)</h3>
                    </div>
                    <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-widest hover:bg-amber-50 px-4 py-2 rounded-xl transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Add Question
                    </button>
                </div>

                <div className="space-y-12">
                    {quiz.map((q, qIdx) => (
                        <div key={qIdx} className="p-8 border-2 border-slate-100 rounded-3xl space-y-6 relative group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Question #{qIdx + 1}</span>
                                {quiz.length > 1 && (
                                    <button
                                        onClick={() => removeQuestion(qIdx)}
                                        className="text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter the question..."
                                    value={q.question}
                                    onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-base font-bold outline-none focus:border-amber-400 transition-all"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {q.options.map((option, oIdx) => (
                                        <div key={oIdx} className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuestion(qIdx, "correct", oIdx)}
                                                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${q.correct === oIdx
                                                    ? "bg-amber-500 border-amber-500 text-white"
                                                    : "border-slate-200 bg-white"
                                                    }`}
                                            >
                                                {q.correct === oIdx && <div className="h-2 w-2 bg-white rounded-full" />}
                                            </button>
                                            <input
                                                type="text"
                                                placeholder={`Option ${oIdx + 1}`}
                                                value={option}
                                                onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mt-2 italic">Select the golden dot for the correct answer</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
