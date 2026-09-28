import React, { useState } from 'react';
import { Page, GameId, Career } from '../types';
import { useGameState } from '../context/GameStateContext';
import { GAMES_METADATA } from '../data/gamesMetadata';
import { CareerDetailModal } from './CareerDetailModal';
import { motion } from 'motion/react';
import { User, Trophy, Sparkles, RotateCcw, Trash2, Edit2, Check, Bookmark, Play, Award } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
  onPlayGame: (gameId: GameId) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, onPlayGame }) => {
  const {
    userProfile,
    setUserName,
    userLevel,
    completedGamesCount,
    overallScore,
    strongestSkill,
    gameResults,
    recommendedCareers,
    resetProgress,
    loadDemoScores,
    toggleSaveCareer,
  } = useGameState();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const savedCareers = recommendedCareers.filter((c) =>
    userProfile.savedCareerIds.includes(c.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 text-white">
              {userLevel.badge}
            </div>

            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      id="profile-name-input"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 text-xl font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      id="save-name-btn"
                      onClick={handleSaveName}
                      className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                      {userProfile.name}
                    </h1>
                    <button
                      id="edit-name-btn"
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                      title="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {userLevel.title}
                </span>
                <span className="text-xs text-slate-500">
                  Joined CareerQuest
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="profile-go-dashboard-btn"
              onClick={() => onNavigate('user-dashboard')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Dashboard</span>
            </button>
            <button
              id="profile-demo-btn"
              onClick={loadDemoScores}
              className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/60 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Scores</span>
            </button>
            <button
              id="profile-reset-btn"
              onClick={resetProgress}
              className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Current Level
            </span>
            <span className="text-xl font-black text-slate-900 font-display">
              {userLevel.levelNumber} ({userLevel.title.split('—')[1] || userLevel.title})
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Games Completed
            </span>
            <span className="text-xl font-black text-indigo-600 font-display">
              {completedGamesCount} / {GAMES_METADATA.length}
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Average Score
            </span>
            <span className="text-xl font-black text-purple-600 font-display">
              {overallScore}%
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Strongest Skill
            </span>
            <span className="text-sm font-black text-emerald-600 font-display truncate block mt-1">
              {strongestSkill.skill} ({strongestSkill.score}%)
            </span>
          </div>
        </div>
      </div>

      {/* Game Performance History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Challenge History & Replay
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Replaying any game recalculates your cognitive profile
          </span>
        </div>

        <div className="space-y-3">
          {GAMES_METADATA.map((game) => {
            const result = gameResults[game.id];
            const isCompleted = result?.completed;

            return (
              <div
                key={game.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{game.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {game.number}. {game.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Measured: <strong>{game.skillMeasured}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {isCompleted ? (
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg text-xs">
                        Score: {result.score}/100
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      Not completed yet
                    </span>
                  )}

                  <button
                    onClick={() => onPlayGame(game.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isCompleted ? 'Replay' : 'Play'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Careers List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Saved Careers ({savedCareers.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigate('careers')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Explore More Careers
          </button>
        </div>

        {savedCareers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedCareers.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                    <span className="text-xs text-emerald-700 font-bold">
                      {c.matchPercentage}% Potential Match
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCareer(c)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleSaveCareer(c.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No saved careers yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Click the bookmark icon on any career card to save it here for future reference.
            </p>
          </div>
        )}
      </div>

      <CareerDetailModal
        career={selectedCareer}
        onClose={() => setSelectedCareer(null)}
      />
    </div>
  );
};
