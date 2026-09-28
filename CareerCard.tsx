import React from 'react';
import { Career } from '../types';
import { ArrowRight, Bookmark, Check, Sparkles } from 'lucide-react';
import { useGameState } from '../context/GameStateContext';

interface CareerCardProps {
  career: Career;
  onExplore: (career: Career) => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, onExplore }) => {
  const { userProfile, toggleSaveCareer } = useGameState();
  const isSaved = userProfile.savedCareerIds.includes(career.id);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar: Icon, category, match tag */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:scale-105 transition-transform">
              {career.icon}
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {career.category}
              </span>
              <h4 className="text-xl font-bold text-slate-900 font-display">
                {career.name}
              </h4>
            </div>
          </div>

          {career.matchPercentage && (
            <div className="flex flex-col items-end">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                {career.matchPercentage}% Match
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Potential Match</span>
            </div>
          )}
        </div>

        {/* Why it matches */}
        {career.whyItMatches && (
          <div className="p-3 bg-indigo-50/60 rounded-xl text-xs text-indigo-950 font-medium mb-4 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{career.whyItMatches}</p>
          </div>
        )}

        {/* Short description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {career.shortDescription}
        </p>

        {/* Important Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {career.importantSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
            >
              {skill}
            </span>
          ))}
          {career.importantSkills.length > 3 && (
            <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-50 text-slate-400">
              +{career.importantSkills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Action buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          id={`save-btn-${career.id}`}
          onClick={() => toggleSaveCareer(career.id)}
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
            isSaved
              ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save career'}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>

        <button
          id={`explore-btn-${career.id}`}
          onClick={() => onExplore(career)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Explore Career</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
