import React from 'react';
import { Page } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Trophy, Brain, Target, Compass, Play, CheckCircle2, Shield, Flame, Star, Bot } from 'lucide-react';
import { useGameState } from '../context/GameStateContext';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onStartGame: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onStartGame }) => {
  const { completedGamesCount, progressPercentage } = useGameState();

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/50 via-purple-50/30 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>The Anti-Quiz Career Discovery Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-display mb-6">
              Discover Your Career Through{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Play.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 font-normal">
              Forget boring career quizzes. Play interactive challenges, discover your natural strengths, and find careers that match YOU.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                id="hero-primary-cta"
                onClick={onStartGame}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white font-bold text-base shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Start Your Journey 🚀</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => onNavigate('how-it-works')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Game-Driven (Zero Boring Surveys)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Cognitive Analysis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Personalized Matches</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Illustration: Student Interacting with Game Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-indigo-600/10 via-purple-500/10 to-pink-500/10 border border-slate-200/60 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
              {/* Floating Game Card 1 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex items-center gap-3 w-64 self-start"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200">
                  🧩
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600">Mini-Game 1</span>
                  <p className="text-xs font-extrabold text-slate-800">Pattern Hunt: Solved!</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">+92 Logical Skill</span>
                </div>
              </motion.div>

              {/* Central Student & Gaming Hologram Art */}
              <div className="relative flex flex-col items-center justify-center py-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-6xl shadow-xl shadow-indigo-300">
                  🧑‍🎓
                </div>
                <div className="mt-3 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Cognitive Flow Active</span>
                </div>
              </div>

              {/* Floating Game Card 2 */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex items-center gap-3 w-72 self-end"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center text-xl shadow-md shadow-purple-200">
                  🎯
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-600">Career Match</span>
                  <p className="text-xs font-extrabold text-slate-800">Software Engineer (94%)</p>
                  <span className="text-[10px] text-slate-500">Based on Logical + Problem Solving</span>
                </div>
              </motion.div>

              {/* Micro badge chips */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                ⚡ Real Gameplay
              </div>
              <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg bg-pink-500 text-white text-[10px] font-bold shadow-sm">
                🎨 Creative Lab
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mb-2">
            "Your future isn't a question. It's an experience."
          </p>
          <p className="text-indigo-200 text-sm font-medium">
            See how you think, adapt, build, and lead through 6 interactive challenges.
          </p>
        </div>
      </section>

      {/* Three Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
            The Discovery Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            How CareerQuest Reveals Your Future
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: PLAY */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-6">
              🎮
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Phase 01
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-display mb-3">
              PLAY
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Complete fun challenges designed to reveal your natural abilities. From geometric sequences to timed crisis simulations and robot mazes.
            </p>
          </div>

          {/* Card 2: DISCOVER */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mb-6">
              🧠
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
              Phase 02
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-display mb-3">
              DISCOVER
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Your performance helps identify your strengths, thinking patterns and interests. Measure 8 core cognitive skills without answering a single multiple-choice quiz.
            </p>
          </div>

          {/* Card 3: MATCH */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-3xl mb-6">
              🎯
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 block mb-1">
              Phase 03
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-display mb-3">
              MATCH
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Get career recommendations personalized to your unique profile. Transparent match percentages explain exactly why each career fits your demonstrated strengths.
            </p>
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl shadow-indigo-200/50">
          <h3 className="text-3xl sm:text-4xl font-black font-display mb-4">
            Ready to test your natural abilities?
          </h3>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Challenge 1: Pattern Hunt is waiting. Takes under 3 minutes to reveal your logical thinking speed.
          </p>
          <button
            id="landing-bottom-cta"
            onClick={onStartGame}
            className="px-8 py-4 rounded-2xl bg-white text-indigo-900 font-black text-base shadow-lg hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Playing Challenge 1</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
