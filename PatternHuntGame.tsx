import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, XCircle, Zap, ArrowRight, RotateCcw, Brain, Award } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

interface PatternQuestion {
  id: number;
  sequence: (number | string)[];
  options: number[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ruleHint: string;
}

const QUESTIONS: PatternQuestion[] = [
  {
    id: 1,
    sequence: [2, 4, 8, 16, '?'],
    options: [20, 24, 32, 36],
    correctAnswer: 32,
    explanation: 'Each number is multiplied by 2 (Geometric progression: 16 × 2 = 32).',
    difficulty: 'Easy',
    ruleHint: 'Doubling pattern',
  },
  {
    id: 2,
    sequence: [3, 6, 12, 24, '?'],
    options: [36, 42, 48, 54],
    correctAnswer: 48,
    explanation: 'Doubling each term: 24 × 2 = 48.',
    difficulty: 'Easy',
    ruleHint: 'Consecutive ×2',
  },
  {
    id: 3,
    sequence: [1, 4, 9, 16, '?'],
    options: [20, 24, 25, 36],
    correctAnswer: 25,
    explanation: 'Square numbers: 1², 2², 3², 4², so next is 5² = 25.',
    difficulty: 'Medium',
    ruleHint: 'Perfect squares (n²)',
  },
  {
    id: 4,
    sequence: [2, 6, 12, 20, '?'],
    options: [24, 28, 30, 32],
    correctAnswer: 30,
    explanation: 'Differences increase by 2: (+4, +6, +8, +10) -> 20 + 10 = 30.',
    difficulty: 'Hard',
    ruleHint: 'Expanding intervals',
  },
  {
    id: 5,
    sequence: [5, 10, 20, 40, '?'],
    options: [60, 75, 80, 90],
    correctAnswer: 80,
    explanation: 'Each term is doubled: 40 × 2 = 80.',
    difficulty: 'Easy',
    ruleHint: 'Constant ratio',
  },
  {
    id: 6,
    sequence: [1, 1, 2, 3, 5, 8, '?'],
    options: [11, 12, 13, 15],
    correctAnswer: 13,
    explanation: 'Fibonacci sequence: each number is the sum of previous two (5 + 8 = 13).',
    difficulty: 'Hard',
    ruleHint: 'Additive recurrence',
  },
];

interface PatternHuntGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const PatternHuntGame: React.FC<PatternHuntGameProps> = ({ onComplete, onExit }) => {
  const { saveGameResult } = useGameState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQ = QUESTIONS[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isGameFinished || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isGameFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-999); // Indicated timeout
    const elapsed = (Date.now() - questionStartTime) / 1000;
    setResponseTimes(prev => [...prev, elapsed]);
  };

  const handleSelectOption = (opt: number) => {
    if (isAnswered) return;

    const elapsed = Math.round(((Date.now() - questionStartTime) / 1000) * 10) / 10;
    setResponseTimes(prev => [...prev, elapsed]);

    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQ.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setQuestionStartTime(Date.now());
    } else {
      // Game completed!
      finishGame();
    }
  };

  const finishGame = () => {
    const accuracy = Math.round((correctCount / QUESTIONS.length) * 100);
    const avgSpeed = responseTimes.length > 0 
      ? Math.round((responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) * 10) / 10 
      : 8;

    // Calculate score /100 based on accuracy and speed
    const speedBonus = avgSpeed < 5 ? 10 : avgSpeed < 9 ? 5 : 0;
    const finalScore = Math.min(100, Math.max(25, accuracy + speedBonus));

    saveGameResult('pattern-hunt', {
      score: finalScore,
      accuracy,
      speedSeconds: avgSpeed,
      attempts: QUESTIONS.length,
      breakdown: {
        correct: correctCount,
        total: QUESTIONS.length,
        avgSpeedSeconds: avgSpeed,
      },
    });

    setIsGameFinished(true);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setTimeLeft(15);
    setTotalTimeSpent(0);
    setResponseTimes([]);
    setIsGameFinished(false);
    setQuestionStartTime(Date.now());
  };

  // Result screen after all questions
  if (isGameFinished) {
    const accuracy = Math.round((correctCount / QUESTIONS.length) * 100);
    const avgSpeed = responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : '6.0';
    const finalScore = Math.min(100, Math.max(25, accuracy + (Number(avgSpeed) < 6 ? 10 : 5)));

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-indigo-200 mx-auto mb-6">
            🎉
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Pattern Hunt Complete!
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            Your logical thinking is developing strongly. You solved sequences with systematic reasoning.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-3xl font-black text-indigo-600 font-display">{finalScore}</span>
              <span className="text-xs text-slate-500 block">/ 100</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Accuracy</span>
              <span className="text-3xl font-black text-emerald-600 font-display">{accuracy}%</span>
              <span className="text-xs text-slate-500 block">{correctCount} of {QUESTIONS.length} correct</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Avg Speed</span>
              <span className="text-3xl font-black text-purple-600 font-display">{avgSpeed}s</span>
              <span className="text-xs text-slate-500 block">per challenge</span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl mb-8 text-left flex items-start gap-3">
            <Brain className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-950">Demonstrated Logical Trait:</h4>
              <p className="text-sm text-indigo-800">
                You detect mathematical progressions and exponential increments rapidly under time constraints.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="pattern-hunt-replay-btn"
              onClick={restartGame}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Challenge
            </button>
            <button
              id="pattern-hunt-continue-btn"
              onClick={onComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Next Game
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧩</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Game 1 of 6</span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Pattern Hunt</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 text-sm font-medium">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Challenge {currentIndex + 1} of {QUESTIONS.length}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-colors ${
            timeLeft <= 4 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-indigo-50 text-indigo-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
          animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Sequence Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
            {currentQ.difficulty} Difficulty • {currentQ.ruleHint}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Question {currentIndex + 1}
          </span>
        </div>

        <h3 className="text-base text-slate-600 mb-6 font-medium">
          Identify the visual logic sequence and select the missing term:
        </h3>

        {/* Visual Sequence Tokens */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 my-8">
          {currentQ.sequence.map((term, i) => (
            <React.Fragment key={i}>
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-display text-xl sm:text-2xl font-bold transition-all ${
                  term === '?'
                    ? 'border-2 border-dashed border-indigo-400 bg-indigo-50 text-indigo-600 shadow-inner'
                    : 'bg-slate-900 text-white shadow-md'
                }`}
              >
                {term === '?' && isAnswered ? selectedOption ?? '?' : term}
              </div>
              {i < currentQ.sequence.length - 1 && (
                <span className="text-slate-300 font-bold text-xl">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentQ.correctAnswer;
            let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400';
              } else if (isSelected) {
                btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 line-through';
              } else {
                btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                id={`pattern-opt-${opt}`}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`py-4 px-6 rounded-2xl border-2 text-xl font-bold font-display transition-all flex items-center justify-between ${btnStyle} cursor-pointer`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
              </button>
            );
          })}
        </div>

        {/* Explanation and Next button */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-2.5">
                {selectedOption === currentQ.correctAnswer ? (
                  <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-rose-100 rounded-xl text-rose-700">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedOption === currentQ.correctAnswer ? 'Correct deduction!' : 'Incorrect'}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{currentQ.explanation}</p>
                </div>
              </div>

              <button
                id="pattern-next-btn"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer self-end sm:self-center"
              >
                {currentIndex < QUESTIONS.length - 1 ? 'Next Pattern' : 'See Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
