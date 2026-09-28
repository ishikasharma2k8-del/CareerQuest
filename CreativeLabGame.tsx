import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Palette, Lightbulb, ArrowRight, RotateCcw, Check, Plus, Layers, Flame, Award } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

interface CreativeOption {
  id: string;
  title: string;
  icon: string;
  category: string;
  originalityScore: number; // 70-100
  desc: string;
}

interface CreativePrompt {
  id: number;
  badge: string;
  title: string;
  scenario: string;
  promptGoal: string;
  minSelect: number;
  maxSelect: number;
  options: CreativeOption[];
}

const CREATIVE_PROMPTS: CreativePrompt[] = [
  {
    id: 1,
    badge: 'Divergent Thinking',
    title: 'The Infinite Cardboard Box',
    scenario: 'You have an ordinary cardboard box. Most people just pack books in it or throw it in recycling. How can you reimagine this simple object?',
    promptGoal: 'Select 2 to 4 ideas that exhibit the most innovative, functional, or unexpected thinking:',
    minSelect: 2,
    maxSelect: 4,
    options: [
      {
        id: 'opt-1',
        title: 'Modular Cat Eco-Mansion',
        icon: '🐱',
        category: 'Pet Product',
        originalityScore: 82,
        desc: 'Stack and connect boxes with cut-out tunnels and scratching pads.',
      },
      {
        id: 'opt-2',
        title: 'Smartphone Hologram Projector',
        icon: '📱',
        category: 'Optics & Tech',
        originalityScore: 96,
        desc: 'Line inside with black velvet and a plastic pyramid prism for 3D visual projection.',
      },
      {
        id: 'opt-3',
        title: 'Biodegradable Herb Planter',
        icon: '🌱',
        category: 'Sustainability',
        originalityScore: 88,
        desc: 'Layer with coffee grounds and soil to decompose directly into garden beds.',
      },
      {
        id: 'opt-4',
        title: 'Acoustic Sound-Proofing Tiles',
        icon: '🎙️',
        category: 'Audio Engineering',
        originalityScore: 92,
        desc: 'Origami fold into geometric diffusers for home podcast and music studios.',
      },
      {
        id: 'opt-5',
        title: 'Solar S’mores Oven',
        icon: '☀️',
        category: 'Thermodynamics',
        originalityScore: 90,
        desc: 'Line lid with aluminum foil and plastic wrap to trap radiant thermal heat.',
      },
      {
        id: 'opt-6',
        title: 'Emergency Footstool & Laptop Stand',
        icon: '💻',
        category: 'Ergonomics',
        originalityScore: 78,
        desc: 'Fold with internal cross-bracing to hold 50kg of weight at eye-level.',
      },
    ],
  },
  {
    id: 2,
    badge: 'Concept Mashup',
    title: 'Crazy Product Fusion',
    scenario: 'Breakthrough inventions often come from colliding two unrelated industries: Drone Tech + Urban Commuting.',
    promptGoal: 'Pick 2 to 3 hybrid concepts you believe would delight commuters or solve real logistics:',
    minSelect: 2,
    maxSelect: 3,
    options: [
      {
        id: 'drone-1',
        title: 'Hands-Free Floating Umbrella Drone',
        icon: '☂️',
        category: 'Weather Tech',
        originalityScore: 94,
        desc: 'Hovers 2 feet above your head in heavy rain using ultrasonic distance tracking.',
      },
      {
        id: 'drone-2',
        title: 'Aerial Bike-Lane Pathfinder',
        icon: '🚴',
        category: 'Mobility Safety',
        originalityScore: 88,
        desc: 'Flies 20 meters ahead of night cyclists projecting a bright laser safety corridor.',
      },
      {
        id: 'drone-3',
        title: 'Instant Rooftop Coffee Courier',
        icon: '☕',
        category: 'Micro-Delivery',
        originalityScore: 80,
        desc: 'Delivers warm pour-overs directly to subway station exit pods before your train pulls up.',
      },
      {
        id: 'drone-4',
        title: 'Emergency Mobile Battery Tether',
        icon: '🔋',
        category: 'Hardware Logistics',
        originalityScore: 92,
        desc: 'Lends instant inductive wireless charging to stranded electric scooters and phones on the move.',
      },
    ],
  },
  {
    id: 3,
    badge: 'City of 2040',
    title: 'The Zero-Traffic Metropolis',
    scenario: 'Traditional cars are banned in the downtown core. How do we move 500,000 citizens swiftly without overcrowding trains?',
    promptGoal: 'Select 2 to 3 bold civic experiments that transform city life:',
    minSelect: 2,
    maxSelect: 3,
    options: [
      {
        id: 'city-1',
        title: 'High-Speed Magnetic Moving Walkways',
        icon: '🏃',
        category: 'Infrastructure',
        originalityScore: 90,
        desc: 'Multi-lane pedestrian express belts with progressive acceleration zones.',
      },
      {
        id: 'city-2',
        title: 'Canal Hydrofoil Gondolas',
        icon: '🛶',
        category: 'Water Transit',
        originalityScore: 92,
        desc: 'Quiet electric water-skimmers utilizing repurposed stormwater canals.',
      },
      {
        id: 'city-3',
        title: 'Rooftop Zip-Line & Cable Gliders',
        icon: '🚡',
        category: 'Aerial Transit',
        originalityScore: 95,
        desc: 'Inter-building solar cable cars for rapid cross-neighborhood hops.',
      },
      {
        id: 'city-4',
        title: 'Community Cargo Tricycle Swarms',
        icon: '🚲',
        category: 'Micro-Mobility',
        originalityScore: 82,
        desc: 'Open-source electric trikes free to ride between solar docks.',
      },
    ],
  },
];

interface CreativeLabGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const CreativeLabGame: React.FC<CreativeLabGameProps> = ({ onComplete, onExit }) => {
  const { saveGameResult } = useGameState();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [accumulatedOriginality, setAccumulatedOriginality] = useState<number[]>([]);
  const [totalIdeasCount, setTotalIdeasCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const currentPrompt = CREATIVE_PROMPTS[currentPromptIndex];

  const handleToggleOption = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= currentPrompt.maxSelect) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleContinuePrompt = () => {
    if (selectedIds.length < currentPrompt.minSelect) return;

    // Calculate prompt scores
    const chosen = currentPrompt.options.filter(o => selectedIds.includes(o.id));
    const avgScore = chosen.reduce((acc, curr) => acc + curr.originalityScore, 0) / chosen.length;

    setAccumulatedOriginality(prev => [...prev, avgScore]);
    setTotalIdeasCount(count => count + chosen.length);

    if (currentPromptIndex < CREATIVE_PROMPTS.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setSelectedIds([]);
    } else {
      finishGame([...accumulatedOriginality, avgScore], totalIdeasCount + chosen.length);
    }
  };

  const finishGame = (scores: number[], totalIdeas: number) => {
    const rawAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const finalScore = Math.min(100, Math.round(rawAvg));

    saveGameResult('creative-lab', {
      score: finalScore,
      breakdown: {
        totalIdeasExplored: totalIdeas,
        divergenceRating: 'High - Out of Box',
        originalityScore: finalScore,
      },
    });

    setIsGameFinished(true);
  };

  const restartGame = () => {
    setCurrentPromptIndex(0);
    setSelectedIds([]);
    setAccumulatedOriginality([]);
    setTotalIdeasCount(0);
    setIsGameFinished(false);
  };

  if (isGameFinished) {
    const avgScore = accumulatedOriginality.length > 0
      ? Math.round(accumulatedOriginality.reduce((a, b) => a + b, 0) / accumulatedOriginality.length)
      : 88;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-pink-100 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-pink-200 mx-auto mb-6">
            🎨
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Creative Lab Completed!
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            Your originality and conceptual flexibility shine. You see unconventional possibilities where others see everyday objects.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-3xl font-black text-pink-600 font-display">{avgScore}</span>
              <span className="text-xs text-slate-500 block">/ 100</span>
            </div>
            <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Originality</span>
              <span className="text-3xl font-black text-purple-600 font-display">94%</span>
              <span className="text-xs text-slate-500 block">Top Percentile</span>
            </div>
            <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Ideation Breadth</span>
              <span className="text-3xl font-black text-emerald-600 font-display">{totalIdeasCount}</span>
              <span className="text-xs text-slate-500 block">Synthesized Concepts</span>
            </div>
          </div>

          <div className="p-4 bg-pink-50 border border-pink-200 rounded-2xl mb-8 text-left flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-pink-950">Divergent Thinking Profile:</h4>
              <p className="text-sm text-pink-800">
                You gravitate toward high-utility, aesthetic, and cross-disciplinary innovations. You connect physical materials with digital and environmental possibilities.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="creative-lab-replay-btn"
              onClick={restartGame}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Re-explore Ideas
            </button>
            <button
              id="creative-lab-continue-btn"
              onClick={onComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Problem Solver
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isValidSelection = selectedIds.length >= currentPrompt.minSelect;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Game 3 of 6</span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Creative Lab</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-xl text-pink-700 text-sm font-medium">
            <Lightbulb className="w-4 h-4 text-pink-600" />
            <span>Challenge {currentPromptIndex + 1} of {CREATIVE_PROMPTS.length}</span>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600">
            Selected: <strong className="text-pink-600">{selectedIds.length}</strong> / {currentPrompt.maxSelect}
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
          animate={{ width: `${((currentPromptIndex) / CREATIVE_PROMPTS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Challenge Card */}
      <motion.div
        key={currentPrompt.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-800">
            {currentPrompt.badge}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Multi-selection challenge
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3 font-display">
          {currentPrompt.title}
        </h3>

        <p className="text-base text-slate-600 mb-6 leading-relaxed">
          {currentPrompt.scenario}
        </p>

        <div className="p-3 bg-pink-50/60 rounded-xl text-sm font-medium text-pink-900 mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-600 flex-shrink-0" />
          <span>{currentPrompt.promptGoal}</span>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentPrompt.options.map((option) => {
            const isSelected = selectedIds.includes(option.id);

            return (
              <div
                key={option.id}
                id={`creative-opt-${option.id}`}
                onClick={() => handleToggleOption(option.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/50 shadow-md shadow-pink-100'
                    : 'border-slate-200 bg-white hover:border-pink-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{option.icon}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-pink-600 border-pink-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 block mb-1">
                  {option.category}
                </span>

                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {option.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {option.desc}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-pink-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Originality rating</span>
                    <span className="font-bold text-pink-700 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-pink-500" />
                      {option.originalityScore}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {isValidSelection
              ? `Ready to proceed with ${selectedIds.length} creative concepts.`
              : `Select at least ${currentPrompt.minSelect - selectedIds.length} more concept${currentPrompt.minSelect - selectedIds.length > 1 ? 's' : ''} to unlock.`}
          </p>

          <button
            id="creative-lab-next-btn"
            onClick={handleContinuePrompt}
            disabled={!isValidSelection}
            className={`px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              isValidSelection
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-200 hover:from-pink-500 hover:to-rose-500 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentPromptIndex < CREATIVE_PROMPTS.length - 1 ? 'Next Creative Challenge' : 'Complete Creative Lab'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
