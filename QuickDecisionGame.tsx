import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Zap, ArrowRight, RotateCcw, ShieldCheck, Shuffle, Target, Compass, Award } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

interface DecisionOption {
  id: string;
  label: string;
  text: string;
  trait: 'Prioritization' | 'Adaptability' | 'Risk Awareness' | 'Decisiveness';
  scoreValue: number; // 60-100
  traitDescription: string;
}

interface DecisionScenario {
  id: number;
  category: string;
  situation: string;
  context: string;
  options: DecisionOption[];
}

const SCENARIOS: DecisionScenario[] = [
  {
    id: 1,
    category: 'Team Crisis & Deadline',
    situation: 'You are leading a project presentation tomorrow morning, and your teammate suddenly messages that they cannot complete their crucial slides.',
    context: 'The presentation is worth 40% of the course grade and clients are attending.',
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'Take over and stay up all night building their entire deck yourself.',
        trait: 'Decisiveness',
        scoreValue: 75,
        traitDescription: 'High immediate ownership, but risks severe burnout and bottlenecking.',
      },
      {
        id: 'B',
        label: 'B',
        text: 'Call a quick 10-minute sync to understand blockers, trim non-essential slides, and redistribute the core points across the rest of the team.',
        trait: 'Prioritization',
        scoreValue: 96,
        traitDescription: 'Exemplary triage: separates must-haves from nice-to-haves while rallying team resources.',
      },
      {
        id: 'C',
        label: 'C',
        text: 'Ask the teammate to submit whatever rough notes they have right now, and pivot the presentation into an interactive live Q&A.',
        trait: 'Adaptability',
        scoreValue: 88,
        traitDescription: 'High situational agility: transforms an unexpected gap into a dynamic format.',
      },
      {
        id: 'D',
        label: 'D',
        text: 'Inform the client immediately about the delay, requesting a 24-hour extension to preserve quality.',
        trait: 'Risk Awareness',
        scoreValue: 80,
        traitDescription: 'Proactive transparent communication, prioritizing quality over rushed output.',
      },
    ],
  },
  {
    id: 2,
    category: 'Product Launch Dilemma',
    situation: 'Ten minutes before a live app launch, your QA tester flags a minor visual bug on older iPhone screens. Fixing it will delay the marketing launch by 2 hours.',
    context: 'Over 2,000 users are waiting on a live stream for the download link.',
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'Proceed with the launch as scheduled, post a known-issues note, and push an over-the-air hotfix this evening.',
        trait: 'Prioritization',
        scoreValue: 92,
        traitDescription: 'Pragmatic commercial focus: understands that momentum outweighs non-critical cosmetic flaws.',
      },
      {
        id: 'B',
        label: 'B',
        text: 'Delay the launch 2 hours to guarantee zero bugs on every single device before any user touches it.',
        trait: 'Risk Awareness',
        scoreValue: 78,
        traitDescription: 'High perfectionism and quality defense, though risks momentum loss.',
      },
      {
        id: 'C',
        label: 'C',
        text: 'Launch an invite-only beta cohort first to observe real impact while engineering completes the patch.',
        trait: 'Adaptability',
        scoreValue: 94,
        traitDescription: 'Innovative staged rollout that mitigates risk while retaining live audience excitement.',
      },
      {
        id: 'D',
        label: 'D',
        text: 'Take a rapid team vote within 3 minutes and commit 100% to the majority verdict.',
        trait: 'Decisiveness',
        scoreValue: 82,
        traitDescription: 'Fast democratic consensus, ensuring full team alignment under pressure.',
      },
    ],
  },
  {
    id: 3,
    category: 'Ethical Resource Allocation',
    situation: 'Your company budget was unexpectedly slashed by 25%. You must decide where to trim costs without firing junior interns.',
    context: 'Departments include Marketing, Tooling/Software Subscriptions, and Research Experiments.',
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'Audit and consolidate redundant software SaaS licenses and pause speculative ad campaigns for 60 days.',
        trait: 'Prioritization',
        scoreValue: 95,
        traitDescription: 'High strategic cost-efficiency: eliminates organizational waste before touching productive assets.',
      },
      {
        id: 'B',
        label: 'B',
        text: 'Cut all exploratory research projects and channel 100% of remaining funds into immediate sales revenue.',
        trait: 'Decisiveness',
        scoreValue: 78,
        traitDescription: 'Short-term survival instinct, though sacrifices future innovation.',
      },
      {
        id: 'C',
        label: 'C',
        text: 'Negotiate bulk discounts with existing vendors and partner with university labs to split research costs.',
        trait: 'Adaptability',
        scoreValue: 90,
        traitDescription: 'Resourceful win-win negotiation that preserves core capabilities through collaboration.',
      },
      {
        id: 'D',
        label: 'D',
        text: 'Apply an equal 25% haircut across every single budget line to ensure fairness across all managers.',
        trait: 'Risk Awareness',
        scoreValue: 72,
        traitDescription: 'Preserves political diplomacy, though often harms high-leverage initiatives indiscriminately.',
      },
    ],
  },
  {
    id: 4,
    category: 'Client Ambiguity',
    situation: 'A high-paying client requests a complete pivot in your design concept two days before the milestone review.',
    context: 'Their new idea is exciting but untested, while your current version is proven and nearly finished.',
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'Present the completed proven version as the recommended baseline, alongside a fast prototype mockup of their new concept to let data guide the choice.',
        trait: 'Risk Awareness',
        scoreValue: 96,
        traitDescription: 'Masterful stakeholder navigation: honors client creativity while protecting sunk investment and timeline.',
      },
      {
        id: 'B',
        label: 'B',
        text: 'Discard the old version immediately and sprint non-stop to deliver their new vision 100%.',
        trait: 'Adaptability',
        scoreValue: 80,
        traitDescription: 'Extreme customer dedication, though assumes high risk with untested assumptions.',
      },
      {
        id: 'C',
        label: 'C',
        text: 'Firmly decline the change, explaining that project scope was locked in the initial contract.',
        trait: 'Decisiveness',
        scoreValue: 74,
        traitDescription: 'Protects contractual boundaries, but may damage long-term collaborative trust.',
      },
      {
        id: 'D',
        label: 'D',
        text: 'Scope out Phase 1 (current design) for tomorrow, scheduling the client’s new idea as the highlight for Phase 2 next month.',
        trait: 'Prioritization',
        scoreValue: 93,
        traitDescription: 'Smart roadmap phasing: gives the client both immediate security and future innovation.',
      },
    ],
  },
  {
    id: 5,
    category: 'Unexpected Competition',
    situation: 'A major competitor just announced an AI tool identical to the core feature your student venture was about to release.',
    context: 'Your team feels disheartened and questions if the venture should be shut down.',
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'Narrow your focus to a hyper-specific niche (e.g., student athletes or creative writers) that the giant competitor ignores.',
        trait: 'Adaptability',
        scoreValue: 96,
        traitDescription: 'Classic agile strategy: wins in niche community depth where incumbents are too generic to compete.',
      },
      {
        id: 'B',
        label: 'B',
        text: 'Double down on building a cleaner, simpler, and 10x faster user interface.',
        trait: 'Prioritization',
        scoreValue: 88,
        traitDescription: 'Product craftsmanship focus: users frequently choose ease-of-use over feature bloat.',
      },
      {
        id: 'C',
        label: 'C',
        text: 'Pivot entirely to a brand-new idea before spending any more energy.',
        trait: 'Decisiveness',
        scoreValue: 72,
        traitDescription: 'Fast cut-losses response, but risks premature surrender before testing real customer loyalty.',
      },
      {
        id: 'D',
        label: 'D',
        text: 'Interview 20 users who tested the competitor’s tool to discover its flaws, then market your strengths directly against those gaps.',
        trait: 'Risk Awareness',
        scoreValue: 94,
        traitDescription: 'Strategic intelligence: turns the competitor’s public launch into free market research.',
      },
    ],
  },
];

interface QuickDecisionGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const QuickDecisionGame: React.FC<QuickDecisionGameProps> = ({ onComplete, onExit }) => {
  const { saveGameResult } = useGameState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(18);
  const [chosenOptions, setChosenOptions] = useState<DecisionOption[]>([]);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isGameFinished, setIsGameFinished] = useState(false);

  const currentScenario = SCENARIOS[currentIndex];

  useEffect(() => {
    if (isGameFinished || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isGameFinished]);

  const handleTimeOut = () => {
    // Default to a balanced option on timeout
    const defaultOpt = currentScenario.options[0];
    handleSelect(defaultOpt);
  };

  const handleSelect = (opt: DecisionOption) => {
    if (isAnswered) return;

    const elapsed = Math.round(((Date.now() - questionStartTime) / 1000) * 10) / 10;
    setResponseTimes(prev => [...prev, elapsed]);
    setSelectedOption(opt);
    setChosenOptions(prev => [...prev, opt]);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(18);
      setQuestionStartTime(Date.now());
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const allOptions = [...chosenOptions, selectedOption!].filter(Boolean);
    const avgScoreValue = allOptions.length > 0
      ? Math.round(allOptions.reduce((acc, opt) => acc + opt.scoreValue, 0) / allOptions.length)
      : 80;

    const avgSpeed = responseTimes.length > 0
      ? Math.round((responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) * 10) / 10
      : 6;

    // Speed bonus for rapid clarity
    const speedBonus = avgSpeed < 6 ? 6 : avgSpeed < 10 ? 3 : 0;
    const finalScore = Math.min(100, Math.max(50, avgScoreValue + speedBonus));

    saveGameResult('quick-decision', {
      score: finalScore,
      speedSeconds: avgSpeed,
      breakdown: {
        avgDecisionTime: `${avgSpeed}s`,
        topTrait: getDominantTrait(allOptions),
      },
    });

    setIsGameFinished(true);
  };

  const getDominantTrait = (options: DecisionOption[]) => {
    const counts: Record<string, number> = {};
    options.forEach(o => {
      counts[o.trait] = (counts[o.trait] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Strategic Prioritization';
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(18);
    setChosenOptions([]);
    setResponseTimes([]);
    setIsGameFinished(false);
    setQuestionStartTime(Date.now());
  };

  if (isGameFinished) {
    const avgScore = chosenOptions.length > 0
      ? Math.round(chosenOptions.reduce((acc, opt) => acc + opt.scoreValue, 0) / chosenOptions.length)
      : 85;
    const avgSpeed = responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : '5.2';

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-amber-200 mx-auto mb-6">
            ⚡
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Decision Protocol Analyzed!
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            You handled ambiguous and high-stakes trade-offs with structured clarity and speed.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-3xl font-black text-amber-600 font-display">{avgScore}</span>
              <span className="text-xs text-slate-500 block">/ 100</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Decision Speed</span>
              <span className="text-3xl font-black text-indigo-600 font-display">{avgSpeed}s</span>
              <span className="text-xs text-slate-500 block">per dilemma</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Primary Mode</span>
              <span className="text-lg font-black text-emerald-600 font-display truncate block mt-1">
                {getDominantTrait(chosenOptions)}
              </span>
              <span className="text-xs text-slate-500 block">Demonstrated</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl mb-8 text-left">
            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2 mb-1">
              <Compass className="w-4 h-4 text-amber-600" />
              Strategic Judgment Profile:
            </h4>
            <p className="text-sm text-amber-900">
              Rather than panicking or defaulting to extremes, your choices emphasized resource triage, proactive communication, and smart milestone phasing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="quick-decision-replay-btn"
              onClick={restartGame}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Scenarios
            </button>
            <button
              id="quick-decision-continue-btn"
              onClick={onComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-200 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Creative Lab
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Game 2 of 6</span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Quick Decision</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 text-sm font-medium">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Scenario {currentIndex + 1} of {SCENARIOS.length}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-colors ${
            timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-50 text-amber-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / SCENARIOS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Scenario Card */}
      <motion.div
        key={currentScenario.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
            {currentScenario.category}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Timed Decision
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
          {currentScenario.situation}
        </h3>

        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-sm text-slate-600 mb-6 flex items-start gap-2">
          <Target className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <span><strong className="text-slate-700">Context:</strong> {currentScenario.context}</span>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentScenario.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            let cardStyle = 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 text-slate-800';

            if (isAnswered) {
              if (isSelected) {
                cardStyle = 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400';
              } else {
                cardStyle = 'bg-slate-50/60 border-slate-100 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                id={`decision-opt-${opt.id}`}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${cardStyle}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {opt.label}
                </div>

                <div className="flex-1">
                  <p className="text-base font-semibold leading-relaxed mb-1">{opt.text}</p>
                  {isAnswered && isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 pt-2 border-t border-amber-200 text-xs text-amber-800"
                    >
                      <span className="font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                        {opt.trait} Analysis:
                      </span>
                      {opt.traitDescription}
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 flex justify-end"
            >
              <button
                id="decision-next-btn"
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {currentIndex < SCENARIOS.length - 1 ? 'Next Scenario' : 'View Decision Analysis'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
