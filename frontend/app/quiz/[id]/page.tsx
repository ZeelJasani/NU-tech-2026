"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { quizzes } from "../../../data/quizzes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
    const params = useParams();
    const quizId = params.id as string;
    const quiz = quizzes.find((q) => q.id === quizId);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    if (!quiz) {
        return (
            <div className="container mx-auto py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
                <Button asChild>
                    <Link href="/quiz">Return to Quizzes</Link>
                </Button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) {
            setScore(score + 1);
        }
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md text-center p-6 border-muted/60 bg-zinc-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <Trophy className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold mb-2">Quiz Completed!</CardTitle>
                        <p className="text-muted-foreground">
                            You scored {score} out of {totalQuestions}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-6xl font-black text-primary mb-6">
                            {Math.round((score / totalQuestions) * 100)}%
                        </div>
                        <p className="text-sm text-zinc-400">
                            {score === totalQuestions
                                ? "Perfect score! You are a disaster preparedness expert."
                                : score > totalQuestions / 2
                                    ? "Great job! You know your stuff."
                                    : "Keep learning! Review the materials and try again."}
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={handleRestart} className="w-full" size="lg">
                            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/quiz">Back to Quizzes</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8 max-w-4xl min-h-[85vh] flex flex-col justify-center">
            {/* Back & Progress Header */}
            <div className="mb-10 space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground hover:text-foreground" asChild>
                        <Link href="/quiz">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            <span className="font-medium">Exit Quiz</span>
                        </Link>
                    </Button>
                    <div className="text-sm font-medium text-muted-foreground">
                        Question <span className="text-foreground">{currentQuestionIndex + 1}</span> / {totalQuestions}
                    </div>
                </div>
                <div className="space-y-2">
                    <Progress value={progress} className="h-2 w-full bg-secondary" />
                    <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">{Math.round(progress)}% completed</span>
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <Card className="border-0 shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-white/5 overflow-hidden rounded-2xl">
                <CardHeader className="py-10 px-8 md:px-12 text-center border-b border-white/5 bg-zinc-900/40">
                    <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white mb-2">
                        {currentQuestion.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 md:p-12 space-y-6 bg-zinc-900/20">
                    <div className="grid gap-4 md:gap-5">
                        {currentQuestion.options.map((option, index) => {
                            let optionClass = "relative flex items-center justify-between w-full p-4 md:p-6 text-left text-base md:text-lg font-medium border-2 rounded-xl transition-all duration-200 outline-none";

                            if (isAnswered) {
                                if (index === currentQuestion.correctAnswer) {
                                    optionClass += " bg-emerald-500/10 border-emerald-500/50 text-emerald-400 opacity-100 z-10";
                                } else if (index === selectedOption) {
                                    optionClass += " bg-red-500/10 border-red-500/50 text-red-400 opacity-50";
                                } else {
                                    optionClass += " border-muted/20 text-muted-foreground opacity-50 blur-[0.5px]";
                                }
                            } else {
                                optionClass += selectedOption === index
                                    ? " border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(var(--primary),1)] z-10"
                                    : " border-muted/30 hover:border-primary/50 hover:bg-zinc-800/50 text-zinc-300 hover:text-white";
                            }

                            return (
                                <button
                                    key={index}
                                    className={optionClass}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isAnswered}
                                >
                                    <span className="pr-8">{option}</span>
                                    {isAnswered && index === currentQuestion.correctAnswer && (
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500 absolute right-4 md:right-6 animate-in zoom-in spin-in-12 duration-300" />
                                    )}
                                    {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                                        <XCircle className="h-6 w-6 text-red-500 absolute right-4 md:right-6 animate-in zoom-in duration-300" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
                <CardFooter className="p-8 md:px-12 bg-zinc-950/30 flex items-center justify-between border-t border-white/5 h-24">
                    <span className="text-sm text-zinc-500 hidden md:block">
                        {isAnswered ? (
                            selectedOption === currentQuestion.correctAnswer ? "Correct answer!" : "Incorrect answer."
                        ) : "Select an option to continue"}
                    </span>
                    {!isAnswered ? (
                        <Button
                            onClick={handleCheckAnswer}
                            disabled={selectedOption === null}
                            size="lg"
                            className="w-full md:w-auto px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all ml-auto"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            size="lg"
                            className="w-full md:w-auto px-8 py-6 text-lg font-semibold animate-in slide-in-from-right-4 fade-in duration-300 ml-auto"
                        >
                            <span className="mr-2">{currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Results"}</span>
                            {currentQuestionIndex < totalQuestions - 1 && <ArrowRight className="h-5 w-5" />}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
