"use client";

import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Zap,
  Shield,
  Terminal,
  ChevronRight,
  BookOpen,
  Filter,
  Sparkles,
  Award,
  BarChart,
  Lightbulb,
} from "lucide-react";
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, QuizQuestion, QuizOption } from "@/data/quizData";

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Stats State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "All Categories") {
      return QUIZ_QUESTIONS;
    }
    return QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const currentQuestion: QuizQuestion | undefined = filteredQuestions[currentQuestionIndex];

  // Calculate score summary
  const scoreSummary = useMemo(() => {
    let correctCount = 0;
    filteredQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (userAns) {
        const correctOpt = q.options.find((opt) => opt.isCorrect);
        if (correctOpt && correctOpt.id === userAns) {
          correctCount++;
        }
      }
    });

    const total = filteredQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return { correctCount, total, percentage };
  }, [filteredQuestions, userAnswers]);

  // Handle Category Change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setUserAnswers({});
    setStreak(0);
    setIsQuizCompleted(false);
  };

  // Handle Select Option
  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedOptionId || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    const chosenOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = chosenOption?.isCorrect ?? false;

    // Record answer
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOptionId }));

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Reset Quiz
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setUserAnswers({});
    setStreak(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMAND & FLAG KNOWLEDGE MASTERY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cybersecurity <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Flag & Syntax Quiz</span>
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Test and sharpen your mastery of terminal commands, tool flags, Wireshark packet filter syntax, and OSINT techniques. Answer questions to build your streak and review detailed technical breakdowns!
          </p>
        </div>

        {/* Live Quiz Metrics */}
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Current Streak</div>
              <div className="text-lg font-bold text-white font-mono">{streak} 🔥</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Best Streak</div>
              <div className="text-lg font-bold text-amber-400 font-mono">{bestStreak}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Score Rate</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {scoreSummary.percentage}%
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <BarChart className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Progress</div>
              <div className="text-lg font-bold text-purple-300 font-mono">
                {currentQuestionIndex + 1} / {filteredQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {QUIZ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer border ${
              selectedCategory === cat
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10"
                : "bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN QUIZ CARD OR COMPLETED SCORECARD */}
      {!isQuizCompleted && currentQuestion ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          {/* Question Header & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                {currentQuestion.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${
                  currentQuestion.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : currentQuestion.difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          {/* Scenario Context Box if available */}
          {currentQuestion.scenario && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed font-mono">
                <strong className="text-amber-400">Scenario Context:</strong> {currentQuestion.scenario}
              </div>
            </div>
          )}

          {/* Question Prompt */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQuestion.question}
            </h2>
            <div className="text-xs text-cyan-400 font-mono">
              Reference Tool: <strong>{currentQuestion.toolReference}</strong>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let optionStyle =
                "border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300";

              if (isAnswerSubmitted) {
                if (option.isCorrect) {
                  optionStyle = "border-emerald-500/60 bg-emerald-950/30 text-emerald-200 shadow-md shadow-emerald-500/10";
                } else if (isSelected && !option.isCorrect) {
                  optionStyle = "border-rose-500/60 bg-rose-950/30 text-rose-200 shadow-md shadow-rose-500/10";
                } else {
                  optionStyle = "border-slate-800/50 bg-slate-950/40 text-slate-500 opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "border-purple-500 bg-purple-950/30 text-purple-200 shadow-md shadow-purple-500/20";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-xl border font-mono text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                      isAnswerSubmitted && option.isCorrect
                        ? "bg-emerald-500 text-slate-950 border-emerald-400"
                        : isAnswerSubmitted && isSelected && !option.isCorrect
                        ? "bg-rose-500 text-white border-rose-400"
                        : isSelected
                        ? "bg-purple-500 text-white border-purple-400"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {option.id.toUpperCase()}
                  </span>

                  <div className="flex-1 space-y-1">
                    <div>{option.text}</div>
                    {isAnswerSubmitted && (
                      <div
                        className={`text-xs mt-1 leading-relaxed ${
                          option.isCorrect ? "text-emerald-400" : isSelected ? "text-rose-400" : "text-slate-500"
                        }`}
                      >
                        {option.explanation}
                      </div>
                    )}
                  </div>

                  {isAnswerSubmitted && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when submitted */}
          {showExplanation && (
            <div className="p-4 sm:p-5 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>Technical Flag Explanation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Quiz</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  selectedOptionId
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:brightness-110"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Check Answer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>
                  {currentQuestionIndex < filteredQuestions.length - 1 ? "Next Question" : "View Score Summary"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* SCORE SUMMARY SCREEN */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Quiz Completed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Category: <span className="text-cyan-400">{selectedCategory}</span>
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-block p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-mono">
              {scoreSummary.correctCount} / {scoreSummary.total}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Accuracy: <strong className="text-emerald-400">{scoreSummary.percentage}%</strong> | Best Streak: <strong className="text-amber-400">{bestStreak} 🔥</strong>
            </div>
          </div>

          <div className="max-w-md mx-auto text-xs text-slate-400 leading-relaxed">
            {scoreSummary.percentage >= 80 ? (
              <span className="text-emerald-400">
                🌟 Outstanding! You have mastered command line flags, Wireshark filter syntax, and OSINT query parameters.
              </span>
            ) : scoreSummary.percentage >= 50 ? (
              <span className="text-amber-400">
                👍 Good job! Review the Command Explorer to solidify your flag knowledge for Nmap, Wireshark, and OSINT tools.
              </span>
            ) : (
              <span className="text-purple-400">
                💪 Keep practicing! Use the Commands & Tools section to study flag breakdowns and test again.
              </span>
            )}
          </div>

          {/* Reset Action */}
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-mono text-xs font-bold shadow-lg shadow-purple-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
