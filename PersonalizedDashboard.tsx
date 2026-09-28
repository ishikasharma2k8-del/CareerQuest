import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Sparkles,
  Brain,
  MessageSquare,
  Wrench,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Play,
  Briefcase,
  Star,
  Target,
  Flame,
  Award,
  BookOpen,
  Edit2,
  Check,
  Compass
} from 'lucide-react';
import { useGameState } from '../context/GameStateContext';
import { GameId, Page, SkillCategory } from '../types';
import { GAMES_METADATA } from '../data/gamesMetadata';
import { getPersonalityArchetype } from '../utils/skillCalculator';

interface PersonalizedDashboardProps {
  onNavigate: (page: Page) => void;
  onPlayGame: (gameId: GameId) => void;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  onNavigate,
  onPlayGame,
}) => {
  const {
    userProfile,
    gameResults,
    skillScores,
    completedGamesCount,
    progressPercentage,
    overallScore,
    userLevel,
    strongestSkill,
    recommendedCareers,
    updateUserName,
    updateUserAvatar,
  } = useGameState();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [avatarInput, setAvatarInput] = useState(userProfile.avatar);

  const archetype = getPersonalityArchetype(skillScores);

  // Key requested metrics:
  // 1. Total games completed: completedGamesCount / total
  // 2. Creative thinking score: skillScores['Creativity']
  // 3. Problem-solving score: skillScores['Problem Solving']
  // 4. Communication score: skillScores['Communication']
  // 5. Overall progress: progressPercentage
  // 6. Career-related strengths: derived from user's performance

  const creativeScore = skillScores['Creativity'];
  const problemSolvingScore = skillScores['Problem Solving'];
  const communicationScore = skillScores['Communication'];

  // Career-related strengths mapping based on top scores
  const getCareerStrengths = () => {
    const strengths: { title: string; desc: string; matchedField: string; icon: string }[] = [];

    if (creativeScore >= 70) {
      strengths.push({
        title: 'Divergent Innovation',
        desc: 'Excels at finding non-obvious angles and creative solutions for ambiguous challenges.',
        matchedField: 'Product Design & Creative Tech',
        icon: '🎨',
      });
    }

    if (problemSolvingScore >= 70) {
      strengths.push({
        title: 'Root-Cause Troubleshooting',
        desc: 'Diagnoses structural bottlenecks and solves multi-step puzzles under constraints.',
        matchedField: 'Software Engineering & Systems',
        icon: '🔧',
      });
    }

    if (communicationScore >= 70) {
      strengths.push({
        title: 'Cross-Functional Alignment',
        desc: 'Conveys strategic intent, motivates team peers, and builds shared understanding.',
        matchedField: 'Product Strategy & Team Leadership',
        icon: '🤝',
      });
    }

    if (skillScores['Logical Thinking'] >= 70) {
      strengths.push({
        title: 'Algorithmic Optimization',
        desc: 'Recognizes sequential patterns and executes precise logical deductions.',
        matchedField: 'Data Science & AI Architecture',
        icon: '🧩',
      });
    }

    if (skillScores['Strategic Thinking'] >= 70) {
      strengths.push({
        title: 'Venture Resource Planning',
        desc: 'Allocates finite capital, manages risks, and plans long-term operational horizons.',
        matchedField: 'Tech Entrepreneurship & Management',
        icon: '💰',
      });
    }

    // Default fallback strengths if user is just starting out
    if (strengths.length === 0) {
      strengths.push(
        {
          title: 'Curious Exploratory Mindset',
          desc: 'High cognitive openness eager to test new problem-solving waters.',
          matchedField: 'Emerging Tech & Design',
          icon: '✨',
        },
        {
          title: 'Adaptive Learning Capacity',
          desc: 'Absorbs new gameplay mechanics quickly and refines strategies iteratively.',
          matchedField: 'Full-Stack Innovation',
          icon: '🚀',
        }
      );
    }

    return strengths;
  };

  const careerStrengths = getCareerStrengths();

  const handleSaveProfile = () => {
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
    }
    if (avatarInput) {
      updateUserAvatar(avatarInput);
    }
    setIsEditingProfile(false);
  };

  // Find next unplayed game to recommend
  const unplayedGame = GAMES_METADATA.find(g => !gameResults[g.id]?.completed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-purple-500/30 border border-white/20">
                {userProfile.avatar}
              </div>
              <button
                id="edit-profile-avatar-btn"
                onClick={() => setIsEditingProfile(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Edit avatar"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-purple-200">
                  {userLevel.title}
                </span>
                <span className="text-xs text-slate-400">
                  {userLevel.nextMilestone}
                </span>
              </div>

              {isEditingProfile ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-bold outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                  <select
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg outline-hidden"
                  >
                    <option value="🚀">🚀</option>
                    <option value="💡">💡</option>
                    <option value="🎨">🎨</option>
                    <option value="🧩">🧩</option>
                    <option value="⚡">⚡</option>
                    <option value="🌟">🌟</option>
                  </select>
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                    Welcome back, {userProfile.name}!
                  </h1>
                  <button
                    id="edit-profile-name-btn"
                    onClick={() => setIsEditingProfile(true)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Personalized Student Discovery Dashboard • Dynamic cognitive tracking powered by interactive gameplay.
              </p>
            </div>
          </div>

          {/* Quick Start Next Challenge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {unplayedGame ? (
              <button
                id="dashboard-play-next-btn"
                onClick={() => onPlayGame(unplayedGame.id)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Next: {unplayedGame.title}</span>
              </button>
            ) : (
              <button
                id="dashboard-view-careers-btn"
                onClick={() => onNavigate('results')}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>All Games Mastered! View Report</span>
              </button>
            )}

            <button
              id="dashboard-games-hub-btn"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>All 7 Challenges</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Primary Required Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Core Competency & Progress Metrics
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Calculated across your gameplay performance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Total Games Completed */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Games Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">
                  {completedGamesCount}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  / {GAMES_METADATA.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {completedGamesCount === GAMES_METADATA.length
                  ? 'All challenges unlocked & verified!'
                  : `${GAMES_METADATA.length - completedGamesCount} challenges left to complete`}
              </p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedGamesCount / GAMES_METADATA.length) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Metric 2: Creative Thinking Score */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-purple-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Creative Thinking
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-purple-900">
                  {creativeScore}
                </span>
                <span className="text-sm font-bold text-purple-400">/100</span>
              </div>
              <p className="text-xs text-purple-700 mt-1">
                {gameResults['think-outside-the-box']?.completed
                  ? '✓ Evaluated by AI in Think Outside the Box'
                  : 'Play Think Outside the Box to optimize!'}
              </p>
            </div>
            <div className="w-full bg-purple-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${creativeScore}%` }}
              />
            </div>
          </motion.div>

          {/* Metric 3: Problem-Solving Score */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-blue-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Problem-Solving
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-900">
                  {problemSolvingScore}
                </span>
                <span className="text-sm font-bold text-blue-400">/100</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {gameResults['problem-solver']?.completed
                  ? '✓ Demonstrated in Problem Solver & Pattern Hunt'
                  : 'Play Problem Solver to test constraints'}
              </p>
            </div>
            <div className="w-full bg-blue-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${problemSolvingScore}%` }}
              />
            </div>
          </motion.div>

          {/* Metric 4: Communication Score */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-teal-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Communication
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-teal-900">
                  {communicationScore}
                </span>
                <span className="text-sm font-bold text-teal-400">/100</span>
              </div>
              <p className="text-xs text-teal-700 mt-1">
                {gameResults['team-strategy']?.completed
                  ? '✓ Assessed via Team Strategy delegation'
                  : 'Play Team Strategy to boost'}
              </p>
            </div>
            <div className="w-full bg-teal-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${communicationScore}%` }}
              />
            </div>
          </motion.div>

          {/* Metric 5: Overall Progress */}
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Overall Progress
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600">
                  {progressPercentage}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Assessment Journey Completion
              </p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Career-Related Strengths Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Career Strengths & Archetype */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Gameplay Insight
                </span>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Your Career-Related Strengths
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                {archetype.badge} {archetype.title}
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {archetype.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {careerStrengths.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                        {item.matchedField}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Strongest Natural Trait: <strong className="text-slate-800">{strongestSkill.name} ({strongestSkill.score}/100)</strong>
              </div>
              <button
                id="view-detailed-results-btn"
                onClick={() => onNavigate('results')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Full Cognitive Results & Spider Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Games Status Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Challenge Status & Scores
              </h3>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                View Games Arena →
              </button>
            </div>

            <div className="space-y-3">
              {GAMES_METADATA.map((game) => {
                const result = gameResults[game.id];
                const isCompleted = Boolean(result?.completed);

                return (
                  <div
                    key={game.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                        {game.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            #{game.number}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {game.title}
                          </h4>
                          {game.id === 'think-outside-the-box' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                              AI Powered
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Primary focus: {game.skillMeasured}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-600 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                            {result.score}/100
                          </span>
                          <button
                            onClick={() => onPlayGame(game.id)}
                            className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-2.5 py-1 rounded-xl hover:bg-white transition-colors cursor-pointer"
                          >
                            Replay
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onPlayGame(game.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Top Recommended Careers Based on Strengths */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Top Career Matches
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-600 px-2.5 py-0.5 rounded-full bg-purple-50">
                Active Match
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Careers ranked according to your creative, problem-solving, and communication scores:
            </p>

            <div className="space-y-3">
              {recommendedCareers.slice(0, 3).map((career) => (
                <div
                  key={career.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/80 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{career.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {career.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {career.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-indigo-600">
                        {career.matchPercentage}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {career.shortDescription}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{career.salaryRange}</span>
                    <button
                      onClick={() => onNavigate('careers')}
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              id="dashboard-explore-all-careers-btn"
              onClick={() => onNavigate('careers')}
              className="w-full mt-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center block"
            >
              Browse All Careers & Roadmaps →
            </button>
          </div>

          {/* Quick Motivational Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl mb-3">
              💡
            </div>
            <h4 className="text-base font-black font-display mb-1">
              Want to increase your score?
            </h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Replay games like "Think Outside the Box" to try new imaginative concepts and expand your creative thinking rating!
            </p>
            <button
              onClick={() => onPlayGame('think-outside-the-box')}
              className="px-4 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs shadow-xs hover:bg-purple-50 transition-colors cursor-pointer w-full text-center"
            >
              Play Think Outside the Box Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
