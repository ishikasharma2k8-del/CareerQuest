import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, CheckCircle2, Award, Zap, Brain, Target, Compass, Sparkles } from 'lucide-react';
import { useGameState } from '../context/GameStateContext';

interface HowItWorksPageProps {
  onStartPlaying: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onStartPlaying }) => {
  const { loadDemoScores } = useGameState();

  const steps = [
    {
      num: '01',
      title: 'Play',
      icon: '🎮',
      color: 'from-indigo-500 to-blue-500',
      description: 'Take part in short interactive games.',
      details: 'Skip boring multiple-choice surveys. Solve sequence puzzles, navigate a robot through obstacle mazes, allocate startup budgets, and resolve live crisis scenarios.',
    },
    {
      num: '02',
      title: 'Analyze',
      icon: '⚡',
      color: 'from-amber-500 to-orange-500',
      description: 'Your performance is analyzed across multiple skill areas.',
      details: 'Our engine tracks your response latency, risk mitigation habits, spatial efficiency, creative divergence, and team collaboration tendencies in real-time.',
    },
    {
      num: '03',
      title: 'Understand',
      icon: '🧠',
      color: 'from-purple-500 to-pink-500',
      description: 'Discover your strongest abilities and behavioral patterns.',
      details: 'Receive an objective radar breakdown of 8 core cognitive skills: Logical Thinking, Creativity, Problem Solving, Decision Making, Leadership, Communication, Strategic Thinking, and Adaptability.',
    },
    {
      num: '04',
      title: 'Explore',
      icon: '🎯',
      color: 'from-pink-500 to-rose-500',
      description: 'Get personalized career recommendations.',
      details: 'Uncover high-fit careers matched directly to your demonstrated abilities with transparent reasons for why each path aligns with how your brain operates.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full inline-block mb-3">
          The Science of Game-Based Assessment
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight mb-4">
          How CareerQuest Works
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Traditional questionnaires measure what you <em>think</em> you like. CareerQuest measures how you <em>actually</em> solve problems, take risks, and lead under pressure.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black font-display text-slate-200 group-hover:text-indigo-400 transition-colors">
                  {step.num}
                </span>
                <span className="text-3xl">{step.icon}</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 font-display mb-2">
                {step.title}
              </h3>

              <p className="text-base font-semibold text-indigo-700 mb-3">
                "{step.description}"
              </p>

              <p className="text-xs text-slate-500 leading-relaxed">
                {step.details}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-slate-400">
              <span>Step {idx + 1} of 4</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Box */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white mb-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-black font-display mb-3">
            Why Games Beat Traditional Quizzes
          </h3>
          <p className="text-slate-400 text-sm">
            Old-school tests ask: "Are you a leader?" — everyone clicks yes. CareerQuest puts you in a simulated project crisis and measures how you prioritize.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">
              Traditional Career Quiz ❌
            </span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-rose-400">•</span> 50+ tedious, repetitive multiple-choice questions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">•</span> Prone to wishful self-reporting bias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">•</span> Abstract questions with zero context
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">•</span> Feels like a dull school exam
              </li>
            </ul>
          </div>

          <div className="bg-indigo-950/60 rounded-2xl p-6 border border-indigo-500/40">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              CareerQuest Experience ✨
            </span>
            <ul className="space-y-2.5 text-xs text-indigo-100">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> 6 interactive micro-games (2-4 mins each)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Real cognitive behavior & decision speed tracked
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Dynamic situations: crises, mazes, and startup budgets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Fun, gamified, and unlocking progress
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          id="how-it-works-start-btn"
          onClick={onStartPlaying}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-indigo-200 hover:from-indigo-500 hover:to-pink-500 transition-all cursor-pointer inline-flex items-center gap-3"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start Playing</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
