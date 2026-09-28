import React from 'react';
import { Career } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, Check, Briefcase, GraduationCap, Building, Sparkles, Compass } from 'lucide-react';
import { useGameState } from '../context/GameStateContext';

interface CareerDetailModalProps {
  career: Career | null;
  onClose: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({ career, onClose }) => {
  const { userProfile, toggleSaveCareer, skillScores } = useGameState();

  if (!career) return null;

  const isSaved = userProfile.savedCareerIds.includes(career.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-slate-100 rounded-2xl">{career.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {career.category}
                  </span>
                  {career.matchPercentage && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {career.matchPercentage}% Match
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display mt-1">
                  {career.name}
                </h3>
              </div>
            </div>

            <button
              id="career-modal-close"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Match Rationale Callout */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100/70 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Why CareerQuest Thinks It May Suit You:
            </h4>
            <p className="text-sm text-indigo-950 leading-relaxed font-medium">
              {career.whyItMatches || `Your balanced problem-solving and cognitive flexibility measured across the mini-games indicate high potential satisfaction in this role.`}
            </p>
          </div>

          {/* Section: What they do */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              What They Do:
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {career.whatTheyDo}
            </p>
          </div>

          {/* Section: Important Skills */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Capabilities:
            </h4>
            <div className="flex flex-wrap gap-2">
              {career.importantSkills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 2-col info: Education & Work Environment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Education Path:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {career.educationPath}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5" />
                Typical Environment:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {career.workEnvironment}
              </p>
            </div>
          </div>

          {/* Related Careers */}
          {career.relatedCareers && career.relatedCareers.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Related Career Paths:
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.relatedCareers.map(rel => (
                  <span
                    key={rel}
                    className="text-xs text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-lg font-medium"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              id={`bookmark-career-${career.id}`}
              onClick={() => toggleSaveCareer(career.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isSaved
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-indigo-600" />
                  Saved in Favorites
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save Career
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done Exploring
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
