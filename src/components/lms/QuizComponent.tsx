"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { 
  CheckCircle2, 
  ChevronRight, 
  Circle, 
  Loader2, 
  RefreshCcw, 
  XCircle, 
  Trophy,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface Attempt {
  score: number;
  total: number;
  createdAt: string;
}

interface QuizComponentProps {
  sectionId: string;
}

export default function QuizComponent({ sectionId }: QuizComponentProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    results: { questionId: string; isCorrect: boolean; correctOptionId: string }[];
  } | null>(null);

  useEffect(() => {
    if (!userLoaded || !user?.id) return;

    const fetchQuiz = async () => {
      try {
        const data = await backendRequest<{ 
          ok: boolean; 
          item: Quiz & { lastAttempt: Attempt | null } 
        }>(`/quizzes/section/${sectionId}`, {
          clerkUserId: user.id
        });

        if (data.ok) {
          setQuiz(data.item);
          setLastAttempt(data.item.lastAttempt);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [sectionId, user?.id, userLoaded]);

  const handleSelect = (questionId: string, optionId: string) => {
    if (result) return;
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    
    try {
      const answers = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
        questionId,
        optionId
      }));

      const data = await backendRequest<{
        ok: boolean;
        item: {
          score: number;
          total: number;
          passed: boolean;
          results: any[];
          attempt: Attempt;
        }
      }>(`/quizzes/${quiz.id}/submit`, {
        method: "POST",
        clerkUserId: user?.id,
        body: { answers }
      });

      if (data.ok) {
        setResult(data.item);
        setLastAttempt(data.item.attempt);
      }
    } catch (err: any) {
      setError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Preparing your assessment...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/20">
        <Brain className="w-10 h-10 text-red-500 mx-auto mb-3 opacity-50" />
        <p className="text-red-600 dark:text-red-400 text-sm font-bold">
          {error || "No quiz available for this section yet."}
        </p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;
  const canSubmit = Object.keys(selectedOptions).length === quiz.questions.length;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="quiz-flow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Progress Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Brain className="text-violet-500" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Section Quiz</h3>
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest mt-1.5 font-bold">
                    Question {currentQuestionIdx + 1} of {quiz.questions.length}
                  </p>
                </div>
              </div>
              
              {lastAttempt && (
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 dark:text-gray-600 uppercase font-black tracking-widest">Last Score</p>
                  <p className="text-sm font-black text-slate-700 dark:text-gray-300">
                    {lastAttempt.score}/{lastAttempt.total}
                  </p>
                </div>
              )}
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-white/2 p-8 rounded-3xl border border-slate-200 dark:border-violet-500/15 shadow-xl shadow-slate-200/40 dark:shadow-none">
              <h4 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-8 leading-snug">
                {currentQuestion.text}
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptions[currentQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(currentQuestion.id, opt.id)}
                      className={`
                        w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group
                        ${isSelected 
                          ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/30" 
                          : "bg-slate-50 dark:bg-white/3 border-transparent text-slate-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5"}
                      `}
                    >
                      <span className="text-sm font-bold tracking-tight">{opt.text}</span>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                        ${isSelected ? "bg-white border-white text-violet-600" : "border-slate-300 dark:border-white/10 group-hover:border-violet-500/50"}
                      `}>
                        {isSelected && <CheckCircle2 size={12} fill="currentColor" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => setCurrentQuestionIdx(p => p - 1)}
                disabled={currentQuestionIdx === 0}
                className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-600 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-0"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-violet-600/30 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : "Finish & Grade"}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIdx(p => p + 1)}
                  disabled={!selectedOptions[currentQuestion.id]}
                  className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.03] transition-all disabled:opacity-30"
                >
                  Next Question
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-white/2 p-12 rounded-[3rem] border border-slate-200 dark:border-violet-500/15 shadow-2xl relative overflow-hidden"
          >
            {/* Result Header */}
            <div className={`mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl ${result.passed ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-500'}`}>
              {result.passed ? <Trophy size={48} /> : <Brain size={48} />}
            </div>

            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
              {result.passed ? "Nicely Done!" : "Almost There!"}
            </h2>
            <p className="text-slate-500 dark:text-gray-400 font-medium max-w-sm mx-auto mb-10">
              You scored <span className="text-slate-900 dark:text-white font-black">{result.score}</span> out of <span className="text-slate-900 dark:text-white font-black">{result.total}</span>. 
              {result.passed 
                ? " You've demonstrated a strong understanding of this section's core concepts."
                : " We recommend reviewing the section material and retrying to hit the 80% passing threshold."}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedOptions({});
                  setCurrentQuestionIdx(0);
                }}
                className="px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <RefreshCcw size={14} /> Try Again
              </button>
              
              {result.passed && (
                <button
                  className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.03] transition-all"
                >
                  Continue Learning
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
