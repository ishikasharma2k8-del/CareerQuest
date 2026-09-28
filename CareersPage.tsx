import React, { useState, useMemo } from 'react';
import { Career } from '../types';
import { useGameState } from '../context/GameStateContext';
import { CareerCard } from './CareerCard';
import { CareerDetailModal } from './CareerDetailModal';
import { Search, Filter, Bookmark, Sparkles } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const { recommendedCareers, userProfile } = useGameState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const categories = [
    'All',
    'Technology',
    'Design',
    'Business',
    'Engineering',
    'Science',
    'Healthcare',
    'Creative',
    'Finance',
    'Media',
  ];

  const filteredCareers = useMemo(() => {
    return recommendedCareers.filter((career) => {
      // Saved filter
      if (showSavedOnly && !userProfile.savedCareerIds.includes(career.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && career.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = career.name.toLowerCase().includes(query);
        const matchesDesc = career.shortDescription.toLowerCase().includes(query);
        const matchesSkills = career.importantSkills.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      return true;
    });
  }, [recommendedCareers, searchQuery, selectedCategory, showSavedOnly, userProfile.savedCareerIds]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full inline-block mb-3">
          Career Database
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight mb-3">
          Explore Career Trajectories
        </h1>
        <p className="text-base text-slate-600">
          Match percentages are calculated in real-time based on your game performance profile.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="career-search-input"
              type="text"
              placeholder="Search careers, skills (e.g. Python, Design, Leadership)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Favorites filter toggle */}
          <button
            id="filter-favorites-btn"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              showSavedOnly
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-indigo-600 text-indigo-600' : ''}`} />
            <span>Saved ({userProfile.savedCareerIds.length})</span>
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count and Disclaimer */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredCareers.length}</strong> careers
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Sorted by cognitive match alignment
        </span>
      </div>

      {/* Careers Grid */}
      {filteredCareers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onExplore={(c) => setSelectedCareer(c)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No careers matched your search</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        onClose={() => setSelectedCareer(null)}
      />
    </div>
  );
};
