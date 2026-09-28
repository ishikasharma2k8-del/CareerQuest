import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, Shield, Users, Megaphone, Laptop, RotateCcw, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Award, Play } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

interface Allocation {
  materials: number;
  marketing: number;
  technology: number;
  people: number;
  emergency: number;
}

interface MarketEvent {
  title: string;
  type: 'opportunity' | 'crisis' | 'market';
  description: string;
  impactCalc: (alloc: Allocation) => { impactText: string; points: number; success: boolean };
}

const SIMULATION_EVENTS: MarketEvent[] = [
  {
    title: 'The Viral Product Spike',
    type: 'opportunity',
    description: 'A popular creator features your project, sending 100,000 visitors to your servers in 1 hour!',
    impactCalc: (alloc) => {
      const techCapability = alloc.technology;
      const marketingPull = alloc.marketing;
      if (techCapability < 15) {
        return {
          impactText: 'Servers crashed due to underfunded Technology! You captured only 25% of the viral wave.',
          points: 15,
          success: false,
        };
      } else if (marketingPull >= 20 && techCapability >= 20) {
        return {
          impactText: 'Seamless scaling! Your robust tech handled the surge, converting 12,000 loyal early adopters.',
          points: 35,
          success: true,
        };
      }
      return {
        impactText: 'Good balance: Servers wobbled slightly but held, acquiring 5,500 new active accounts.',
        points: 25,
        success: true,
      };
    },
  },
  {
    title: 'Sudden Critical Security Threat',
    type: 'crisis',
    description: 'A zero-day dependency vulnerability is discovered, threatening customer data!',
    impactCalc: (alloc) => {
      const reserve = alloc.emergency;
      const people = alloc.people;
      if (reserve < 10 && people < 15) {
        return {
          impactText: 'Zero cushion! Without an emergency reserve or experienced engineers, crisis recovery took 3 weeks with heavy reputation loss.',
          points: 10,
          success: false,
        };
      } else if (reserve >= 15 && people >= 20) {
        return {
          impactText: 'Flawless crisis response! Emergency funds deployed high-tier forensic auditors and patches within 4 hours.',
          points: 35,
          success: true,
        };
      }
      return {
        impactText: 'Managed containment: Emergency reserve covered developer overtime, containing the issue in 24 hours.',
        points: 25,
        success: true,
      };
    },
  },
  {
    title: 'Product Review & Retention Milestone',
    type: 'market',
    description: 'Tech critics and early users post in-depth reviews comparing your build quality to industry incumbents.',
    impactCalc: (alloc) => {
      const productQuality = alloc.materials + alloc.technology;
      if (productQuality >= 40) {
        return {
          impactText: 'Rave 5-star reviews! High investment in materials and engineering produced unmatched build quality.',
          points: 30,
          success: true,
        };
      } else if (productQuality >= 25) {
        return {
          impactText: 'Solid average 4-star sentiment with constructive feedback on roadmap refinements.',
          points: 20,
          success: true,
        };
      }
      return {
        impactText: 'Users complained about fragile build and software glitches. Product felt rushed.',
        points: 10,
        success: false,
      };
    },
  },
];

interface ResourceMasterGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const ResourceMasterGame: React.FC<ResourceMasterGameProps> = ({ onComplete, onExit }) => {
  const { saveGameResult } = useGameState();
  const [allocation, setAllocation] = useState<Allocation>({
    materials: 20,
    marketing: 20,
    technology: 25,
    people: 20,
    emergency: 15,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<{ event: MarketEvent; result: ReturnType<MarketEvent['impactCalc']> }[]>([]);
  const [finalCalculatedScore, setFinalCalculatedScore] = useState<number | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const totalAllocated =
    allocation.materials +
    allocation.marketing +
    allocation.technology +
    allocation.people +
    allocation.emergency;

  const remaining = 100 - totalAllocated;

  const handleChange = (field: keyof Allocation, value: number) => {
    const current = allocation[field];
    const diff = value - current;
    // Don't exceed 100 total
    if (diff > remaining) {
      value = current + remaining;
    }
    value = Math.max(0, Math.min(60, value));
    setAllocation(prev => ({ ...prev, [field]: value }));
  };

  const handleRunSimulation = () => {
    if (totalAllocated !== 100) return;

    setIsSimulating(true);
    setSimulationLogs([]);

    const results = SIMULATION_EVENTS.map(event => ({
      event,
      result: event.impactCalc(allocation),
    }));

    // Sequential simulation animation
    setTimeout(() => {
      setSimulationLogs(results);
      const totalPoints = results.reduce((acc, r) => acc + r.result.points, 0);
      
      // Calculate balanced bonus
      const values = Object.values(allocation) as number[];
      const minVal = Math.min(...values);
      const hasBalanceBonus = minVal >= 10 ? 8 : 0;

      const finalScore = Math.min(100, Math.max(50, totalPoints + hasBalanceBonus));
      setFinalCalculatedScore(finalScore);
      setIsSimulating(false);
      setIsGameFinished(true);

      saveGameResult('resource-master', {
        score: finalScore,
        breakdown: {
          budgetHealth: `${finalScore}%`,
          strategicResilience: finalScore > 80 ? 'High' : 'Moderate',
          emergencyDefense: `${allocation.emergency}%`,
        },
      });
    }, 1500);
  };

  const restartGame = () => {
    setAllocation({
      materials: 20,
      marketing: 20,
      technology: 25,
      people: 20,
      emergency: 15,
    });
    setSimulationLogs([]);
    setFinalCalculatedScore(null);
    setIsSimulating(false);
    setIsGameFinished(false);
  };

  if (isGameFinished && finalCalculatedScore !== null) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-100 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-emerald-200 mx-auto mb-6">
            💰
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Strategic Simulation Concluded!
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            Your resource allocation survived unexpected market shifts, cyber vulnerabilities, and demand spikes.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-3xl font-black text-emerald-600 font-display">{finalCalculatedScore}</span>
              <span className="text-xs text-slate-500 block">/ 100</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Risk Defense</span>
              <span className="text-3xl font-black text-indigo-600 font-display">{allocation.emergency * 5}%</span>
              <span className="text-xs text-slate-500 block">Reserve Rating</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">ROI Multiplier</span>
              <span className="text-3xl font-black text-teal-600 font-display">2.8x</span>
              <span className="text-xs text-slate-500 block">Venture Return</span>
            </div>
          </div>

          {/* Event Log results */}
          <div className="space-y-3 mb-8 text-left">
            {simulationLogs.map((log, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                  log.result.success
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                {log.result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-bold">{log.event.title}</strong>
                  <span className="text-slate-600">{log.result.impactText}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="resource-master-replay-btn"
              onClick={restartGame}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Adjust Strategy
            </button>
            <button
              id="resource-master-continue-btn"
              onClick={onComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Team Strategy
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Game 5 of 6</span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Resource Master</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Strategic Venture Lab</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold ${
            remaining === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <span>Remaining: {remaining} pts</span>
          </div>
        </div>
      </div>

      {/* Allocation Interface */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6">
        <div className="mb-6">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Resource Allocation Challenge
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">
            You have 100 points to build a venture.
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Distribute your points carefully. After locking in your allocation, real simulated market stress-tests will test your foresight!
          </p>
        </div>

        {/* Budget breakdown bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex mb-8">
          <div style={{ width: `${allocation.materials}%` }} className="bg-amber-500 h-full transition-all" title="Materials" />
          <div style={{ width: `${allocation.marketing}%` }} className="bg-pink-500 h-full transition-all" title="Marketing" />
          <div style={{ width: `${allocation.technology}%` }} className="bg-blue-500 h-full transition-all" title="Technology" />
          <div style={{ width: `${allocation.people}%` }} className="bg-purple-500 h-full transition-all" title="People" />
          <div style={{ width: `${allocation.emergency}%` }} className="bg-emerald-500 h-full transition-all" title="Emergency" />
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Materials */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="text-lg">🛠️</span> Materials & Hardware
              </span>
              <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-lg text-sm">
                {allocation.materials} pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={allocation.materials}
              onChange={(e) => handleChange('materials', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-xs text-slate-500 block mt-1">Ensures physical durability, tactile finish, and reliable components.</span>
          </div>

          {/* Marketing */}
          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-pink-600" /> Marketing & User Acquisition
              </span>
              <span className="font-mono font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-lg text-sm">
                {allocation.marketing} pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={allocation.marketing}
              onChange={(e) => handleChange('marketing', parseInt(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <span className="text-xs text-slate-500 block mt-1">Drives customer awareness, creator sponsorships, and viral traction.</span>
          </div>

          {/* Technology */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" /> Technology & Infrastructure
              </span>
              <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-lg text-sm">
                {allocation.technology} pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={allocation.technology}
              onChange={(e) => handleChange('technology', parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-500 block mt-1">Server elasticity, low latency, machine learning models, and security architecture.</span>
          </div>

          {/* People */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" /> People & Core Talent
              </span>
              <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg text-sm">
                {allocation.people} pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={allocation.people}
              onChange={(e) => handleChange('people', parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <span className="text-xs text-slate-500 block mt-1">Empowers talented engineers, UI designers, and responsive customer care.</span>
          </div>

          {/* Emergency Reserve */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> Emergency Reserve & Buffer
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg text-sm">
                {allocation.emergency} pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={allocation.emergency}
              onChange={(e) => handleChange('emergency', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs text-slate-500 block mt-1">Vital safety cushion for unexpected lawsuits, supplier delays, or market shifts.</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {remaining === 0
              ? 'All 100 points allocated. Ready to simulate!'
              : `You still have ${remaining} points left to distribute.`}
          </p>

          <button
            id="resource-simulate-btn"
            onClick={handleRunSimulation}
            disabled={remaining !== 0 || isSimulating}
            className={`px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              remaining === 0 && !isSimulating
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:from-emerald-500 hover:to-teal-500 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Simulating Market Events...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Market Simulation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
