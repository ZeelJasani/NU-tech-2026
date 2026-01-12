"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw, Loader2, History } from "lucide-react";
import Link from "next/link";
import { Quiz, QuizAttempt } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;
    const { getToken } = useAuth();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingHistory, setCheckingHistory] = useState(true);
    const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const fetchQuizAndHistory = async () => {
            try {
                const token = await getToken();

                const quizRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/quizzes/${quizId}`);
                if (quizRes.ok) {
                    const data = await quizRes.json();
                    setQuiz(data);
                }

                if (token) {
                    const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/quizzes/${quizId}/attempts`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (historyRes.ok) {
                        const history = await historyRes.json();
                        if (history && history.length > 0) {
                            setPreviousAttempt(history[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setCheckingHistory(false);
            }
        };

        if (quizId) {
            fetchQuizAndHistory();
        }
    }, [quizId, getToken]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasStarted && !showResult && !loading && currentQuestionIndex >= 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [showResult, loading, currentQuestionIndex, hasStarted]);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null || !quiz) return;

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) {
            setScore(score + 1);
        }
        setIsAnswered(true);
    };

    const handleNext = async () => {
        if (!quiz) return;

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            await submitQuiz();
        }
    };

    const submitQuiz = async () => {
        if (!quiz) return;
        setSubmitting(true);
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    score: score,
                    totalQuestions: quiz.questions.length
                })
            });

            if (res.ok) {
                setShowResult(true);
            } else {
                toast.error("Failed to save results. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving your results.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetake = () => {
        setPreviousAttempt(null);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
        setHasStarted(true);
    };

    const handleExit = () => {
        router.push('/quiz');
    };

    const handleStart = () => {
        setHasStarted(true);
    };

    if (loading || checkingHistory) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="container mx-auto py-24 text-center bg-background text-foreground min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
                <Button variant="outline" asChild>
                    <Link href="/quiz">Return to Quizzes</Link>
                </Button>
            </div>
        );
    }

    // View: Preview / Already Attempted Unified (Simplified)
    if (!hasStarted && !showResult) {
        return (
            <div className="container mx-auto py-24 px-4 flex flex-col items-center justify-center min-h-[90vh] text-center max-w-2xl">
                {previousAttempt && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-muted-foreground text-xs font-medium mb-6">
                        <History className="h-3.5 w-3.5" />
                        <span>Last attempt: {new Date(previousAttempt.completedAt).toLocaleDateString()}</span>
                    </div>
                )}

                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                    {quiz.title}
                </h1>

                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                    {quiz.description}
                </p>

                <div className="flex items-center justify-center gap-8 mb-12 py-6 border-y border-border w-full max-w-md">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">Questions</span>
                        <span className="text-xl font-bold text-foreground">{quiz.questions.length}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">Duration</span>
                        <span className="text-xl font-bold text-foreground">~5 min</span>
                    </div>
                    {previousAttempt && (
                        <>
                            <div className="w-px h-8 bg-border" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">Best Score</span>
                                <span className="text-xl font-bold text-emerald-500">{previousAttempt.score}/{previousAttempt.totalQuestions}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button onClick={previousAttempt ? handleRetake : handleStart} size="lg" className="h-12 px-10 font-bold transition-all">
                        {previousAttempt ? "Retake Quiz" : "Start Assessment"}
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-10 font-bold transition-all" asChild>
                        <Link href="/quiz">Cancel</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // View: Results
    if (showResult) {
        return (
            <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[90vh]">
                <div className="w-full max-w-lg text-center p-12 rounded-2xl border border-border bg-card shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-muted flex items-center justify-center rounded-full mb-8 border border-border">
                        <Trophy className="h-8 w-8 text-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Assessment Complete</h2>
                    <p className="text-muted-foreground mb-8">
                        You&apos;ve finished {quiz.title}
                    </p>

                    <div className="flex flex-col gap-2 mb-10">
                        <div className="text-6xl font-bold text-foreground tracking-tight">
                            {score} / {quiz.questions.length}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Final Score</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleRetake} size="lg" className="flex-1">
                            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                        <Button variant="outline" onClick={handleExit} size="lg" className="flex-1">
                            Exit to Quizzes
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // View: Taking Quiz (Minimalist Redesign)
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    const totalQuestions = quiz.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl min-h-[90vh] flex flex-col">
            {/* Minimal Header */}
            <div className="flex items-center justify-between mb-12">
                <Button variant="ghost" onClick={handleExit} className="text-muted-foreground hover:text-foreground hover:bg-transparent p-0 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Exit</span>
                </Button>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <Progress value={progress} className="h-1 w-32 bg-muted" />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 leading-tight max-w-2xl">
                    {currentQuestion.question}
                </h2>

                <div className="grid gap-3 mb-16">
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const isSelected = selectedOption === index;

                        const baseClass = "group relative w-full p-6 text-left text-lg font-medium rounded-xl border transition-all duration-200 outline-none";
                        let borderClass = "border-border hover:border-foreground/20 bg-transparent text-muted-foreground hover:text-foreground";

                        if (isAnswered) {
                            if (isCorrect) {
                                borderClass = "border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400";
                            } else if (isSelected) {
                                borderClass = "border-red-500/50 bg-red-500/5 text-red-600 dark:text-red-400";
                            } else {
                                borderClass = "border-border opacity-50 text-muted-foreground";
                            }
                        } else if (isSelected) {
                            borderClass = "border-primary bg-primary/5 text-foreground ring-1 ring-primary/10";
                        }

                        return (
                            <button
                                key={index}
                                className={`${baseClass} ${borderClass}`}
                                onClick={() => handleOptionSelect(index)}
                                disabled={isAnswered}
                            >
                                <div className="flex items-center justify-between pointer-events-none">
                                    <span>{option}</span>
                                    {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-border">
                    <div className="text-sm font-medium">
                        {isAnswered ? (
                            <span className={selectedOption === currentQuestion.correctAnswer ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                                {selectedOption === currentQuestion.correctAnswer ? "Correct" : "Incorrect"}
                            </span>
                        ) : (
                            <span className="text-muted-foreground/60">Choose one to proceed</span>
                        )}
                    </div>

                    {!isAnswered ? (
                        <Button
                            onClick={handleCheckAnswer}
                            disabled={selectedOption === null}
                            size="lg"
                            className="h-12 px-8 font-bold"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            size="lg"
                            className="h-12 px-8 font-bold"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Complete Quiz"}</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
