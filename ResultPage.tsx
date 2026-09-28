import React, { useState } from 'react';
import { Career, Page, SkillCategory } from '../types';
import { useGameState } from '../context/GameStateContext';
import { GAMES_METADATA } from '../data/gamesMetadata';
import { getPersonalityArchetype } from '../utils/skillCalculator';
import { SkillChart } from './SkillChart';
import { CareerCard } from './CareerCard';
import { CareerDetailModal } from './CareerDetailModal';
import { motion } from 'motion/react';
import { Trophy, Sparkles, Award, ArrowRight, RotateCcw, Compass, Info, Play, Share2, LayoutDashboard } from 'lucide-react';

interface ResultPageProps {
  onNavigate: (page: Page) => void;
  onPlayGame: (gameId: any) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ onNavigate, onPlayGame }) => {
  const { skillScores, recommendedCareers, completedGamesCount } = useGameState();
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const archetype = getPersonalityArchetype(skillScores);

  // Top 3 Strongest Abilities
  const sortedSkillEntries = (Object.entries(skillScores) as [SkillCategory, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const top3 = sortedSkillEntries.slice(0, 3);

  const skillBadges: Record<string, string> = {
    'Problem Solving': '🏆',
    'Logical Thinking': '🧠',
    'Strategic Thinking': '📊',
    'Creativity': '🎨',
    'Decision Making': '⚡',
    'Leadership': '👑',
    'Communication': '💬',
    'Adaptability': '🔄',
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-3.5 h-3.5 text-purple-600" />
          <span>Performance-Based Cognitive Map</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight mb-3">
          Your Career Profile 🎯
        </h1>
        <p className="text-lg text-slate-600">
          Your results reveal how you naturally approach challenges.
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <button
            id="results-to-dashboard-btn"
            onClick={() => onNavigate('user-dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Personalized Dashboard</span>
          </button>
        </div>

        {completedGamesCount < GAMES_METADATA.length && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Profile based on {completedGamesCount} of {GAMES_METADATA.length} completed games. Play more games in the arena to refine precision!
            </span>
          </div>
        )}
      </div>

      {/* Top 3 Strongest Abilities Highlight */}
      <div className="mb-12">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 text-center mb-4">
          Your Strongest Abilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {top3.map(([skill, score], i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{skillBadges[skill] || '⭐'}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Rank #{i + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 font-display leading-tight">
                    {skill}
                  </h4>
                </div>
              </div>
              <span className="text-2xl font-black text-indigo-600 font-display">
                {score}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Personality Archetype Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              {archetype.badge}
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                Primary Cognitive Archetype
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
                "{archetype.title}"
              </h2>
            </div>
          </div>

          <p className="text-purple-200 text-base font-medium italic mb-4">
            {archetype.tagline}
          </p>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            {archetype.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10 text-xs">
            <span className="text-purple-300 font-semibold">Core Strengths:</span>
            {archetype.coreStrengths.map((str) => (
              <span
                key={str}
                className="px-3 py-1 rounded-lg bg-white/10 text-white font-medium border border-white/10"
              >
                {str}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skill Breakdown Chart */}
      <div className="mb-14">
        <SkillChart skillScores={skillScores} />
      </div>

      {/* Important Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed mb-12 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">Important Guidance for Students:</strong>
          CareerQuest recommendations represent suggested career trajectories based on your demonstrated gameplay performance.
          Your results are a starting point, not a final decision. Continue exploring, experimenting, and growing!
        </div>
      </div>

      {/* Career Recommendations Section */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Personalized Recommendations
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Careers that may fit you
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ranked dynamically by cognitive alignment with your 8-skill profile
            </p>
          </div>

          <button
            id="browse-all-careers-btn"
            onClick={() => onNavigate('careers')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Browse All 16+ Careers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCareers.slice(0, 6).map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onExplore={(c) => setSelectedCareer(c)}
            />
          ))}
        </div>
      </div>

      {/* Career Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        onClose={() => setSelectedCareer(null)}
      />

      {/* Bottom Actions */}
      <div className="p-8 rounded-3xl bg-slate-100 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            Want to sharpen your cognitive scores?
          </h4>
          <p className="text-xs text-slate-600">
            Replay challenges anytime to improve your accuracy, speed, and strategic adaptability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="share-profile-btn"
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
          </button>

          <button
            id="play-more-games-btn"
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Games Arena</span>
          </button>
        </div>
      </div>
    </div>
  );
};
