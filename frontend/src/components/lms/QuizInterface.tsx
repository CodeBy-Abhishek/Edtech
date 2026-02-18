import React, { useState, useEffect } from 'react';
import {
    HelpCircle,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Timer,
    Trophy,
    AlertCircle,
    RotateCcw,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Question {
    id: string;
    text: string;
    options: { id: string; text: string }[];
}

interface Quiz {
    id: string;
    title: string;
    questions: Question[];
    passingScore: number;
}

export const QuizInterface = ({ quiz }: { quiz: Quiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion && quiz.questions.length > 0) return <div>No questions in this quiz.</div>;
    if (quiz.questions.length === 0) return (
        <div className="flex-1 flex items-center justify-center p-8 text-zinc-500 italic">
            This assessment has no questions configured yet.
        </div>
    );

    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleOptionSelect = (optionId: string) => {
        setAnswers({ ...answers, [currentQuestion.id]: optionId });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const submissionPayload = {
            quizId: quiz.id,
            answers: Object.entries(answers).map(([qId, oId]) => ({
                questionId: qId,
                optionId: oId
            }))
        };

        const submissionPromise = api.post('/assessments/quiz/submit', submissionPayload);

        toast.promise(submissionPromise, {
            loading: 'Evaluating your answers...',
            success: (res) => {
                setResult({ score: res.data.score, passed: res.data.passed });
                setIsSubmitted(true);
                return res.data.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed.';
            },
            error: (err) => {
                return err.response?.data?.message || 'Failed to submit quiz';
            }
        });

        try {
            await submissionPromise;
        } catch (e) {
            console.error("Quiz submission error", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted && result) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500 shadow-2xl shadow-indigo-500/10">
                    <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
                        result.passed ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                    )}>
                        {result.passed ? <Trophy className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-100 italic">
                        {result.passed ? "Knowledge Confirmed! 🎉" : "Keep Learning! 💪"}
                    </h2>
                    <p className="text-zinc-500 mt-2">
                        {result.passed
                            ? `Great job! You passed the assessment with a score of ${result.score}%.`
                            : `You scored ${result.score}%. The passing score is ${quiz.passingScore}%.`}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Score</p>
                            <p className={cn("text-xl font-bold mt-1", result.passed ? "text-emerald-400" : "text-red-400")}>{result.score}%</p>
                        </div>
                        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passing Grade</p>
                            <p className="text-xl font-bold mt-1 text-zinc-200">{quiz.passingScore}%</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        {result.passed ? (
                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 active:scale-95">
                                Continue Path
                            </button>
                        ) : (
                            <button
                                onClick={() => { setIsSubmitted(false); setCurrentQuestionIndex(0); setAnswers({}); }}
                                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Retry Assessment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full p-8 md:p-12">
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-zinc-100 italic">{quiz.title}</h1>
                            <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest opacity-60">Module Assessment • High Intensity</p>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        <span>Question {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                        <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Panel */}
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h2 className="text-2xl font-bold text-zinc-100 leading-tight tracking-tight italic">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={cn(
                                    "group flex items-center justify-between p-6 rounded-2xl border transition-all text-left relative overflow-hidden",
                                    answers[currentQuestion.id] === option.id
                                        ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-100 shadow-lg shadow-indigo-500/5"
                                        : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                <span className="text-sm font-semibold relative z-10">{option.text}</span>
                                <div className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all relative z-10",
                                    answers[currentQuestion.id] === option.id
                                        ? "bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/50"
                                        : "border-zinc-700 group-hover:border-zinc-500"
                                )}>
                                    {answers[currentQuestion.id] === option.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all disabled:opacity-0 flex items-center gap-2 shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!answers[currentQuestion.id] || isSubmitting}
                            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Deliver Final
                                    <CheckCircle2 className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            disabled={!answers[currentQuestion.id]}
                            className="px-10 py-4 bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-black rounded-xl transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-white/10"
                        >
                            Next Step
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
