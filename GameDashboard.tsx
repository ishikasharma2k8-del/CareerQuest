import React from 'react';
import { GameId, Page } from '../types';
import { GAMES_METADATA } from '../data/gamesMetadata';
import { useGameState } from '../context/GameStateContext';
import { motion } from 'motion/react';
import { Play, Lock, CheckCircle2, RotateCcw, Trophy, ArrowRight, Sparkles, Zap, Award } from 'lucide-react';

interface GameDashboardProps {
  onPlayGame: (gameId: GameId) => void;
  onNavigate: (page: Page) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ onPlayGame, onNavigate }) => {
  const {
    gameResults,
    unlockedGames,
    completedGamesCount,
    progressPercentage,
    overallScore,
    userLevel,
    isGameUnlocked,
    loadDemoScores,
  } = useGameState();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full inline-block mb-2">
            Interactive Assessment Arena
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            Welcome to CareerQuest 👋
          </h1>
          <p className="text-lg text-slate-600 mt-1">
            Let's discover how your mind works.
          </p>
        </div>

        {/* Quick Demo button for testers/evaluators */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="open-personalized-dashboard-btn"
            onClick={() => onNavigate('user-dashboard')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Dashboard</span>
          </button>

          <button
            id="quick-demo-scores-btn"
            onClick={loadDemoScores}
            className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Auto-fill sample scores across all games to inspect full results instantly"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Load Demo Scores</span>
          </button>

          {completedGamesCount > 0 && (
            <button
              id="view-results-banner-btn"
              onClick={() => onNavigate('results')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Results ({completedGamesCount}/{GAMES_METADATA.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 font-display">
              Overall Discovery Progress
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {completedGamesCount} of {GAMES_METADATA.length} Completed
            </span>
          </div>
          <span className="text-xl font-black text-indigo-600 font-display">
            {progressPercentage}% completed
          </span>
        </div>

        {/* Outer Bar */}
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <span>{userLevel.title}</span>
          <span>{userLevel.nextMilestone}</span>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES_METADATA.map((game, index) => {
          const isUnlocked = isGameUnlocked(game.id);
          const result = gameResults[game.id];
          const isCompleted = result?.completed;

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isCompleted
                  ? 'bg-white border-emerald-200/80 shadow-sm hover:shadow-md'
                  : isUnlocked
                  ? 'bg-white border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300'
                  : 'bg-slate-50/80 border-slate-200/60 opacity-70'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{game.icon}</span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Game {game.number} of {GAMES_METADATA.length}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 font-display">
                        {game.title}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isCompleted ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {result.score}/100
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                      Ready
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  "{game.shortDesc}"
                </p>

                {/* Skill measured */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Skill Measured:
                  </span>
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    {game.skillMeasured}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCompleted ? (
                  <div className="flex items-center gap-2">
                    <button
                      id={`game-replay-btn-${game.id}`}
                      onClick={() => onPlayGame(game.id)}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Replay
                    </button>
                    <button
                      onClick={() => onNavigate('results')}
                      className="py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Results
                    </button>
                  </div>
                ) : isUnlocked ? (
                  <button
                    id={`game-play-btn-${game.id}`}
                    onClick={() => onPlayGame(game.id)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Game</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Complete Game {game.number - 1} to Unlock</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Banner if all finished */}
      {completedGamesCount >= 6 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center shadow-xl shadow-indigo-200"
        >
          <span className="text-3xl block mb-2">🎉</span>
          <h3 className="text-2xl sm:text-3xl font-black font-display mb-2">
            All 6 Games Complete!
          </h3>
          <p className="text-indigo-100 text-sm sm:text-base max-w-lg mx-auto mb-6">
            Your comprehensive 8-skill cognitive assessment is ready. View your personalized career matches and personality archetype now.
          </p>
          <button
            id="view-full-results-btn"
            onClick={() => onNavigate('results')}
            className="px-8 py-3.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-lg hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>View Full Career Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
