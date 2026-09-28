import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Battery, Zap, RotateCcw, ArrowRight, ShieldAlert, Award, Bot, Sparkles, CheckCircle2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

type CellType = 'empty' | 'wall' | 'switch' | 'gate' | 'battery' | 'goal';

interface Position {
  r: number;
  c: number;
}

interface PuzzleLevel {
  id: number;
  name: string;
  gridSize: number;
  startPos: Position;
  goalPos: Position;
  maxEnergy: number;
  optimalMoves: number;
  walls: Position[];
  switches?: Position[];
  gates?: Position[];
  batteries?: Position[];
  tip: string;
}

const LEVELS: PuzzleLevel[] = [
  {
    id: 1,
    name: 'Stage 1: Direct Routing',
    gridSize: 5,
    startPos: { r: 0, c: 0 },
    goalPos: { r: 4, c: 4 },
    maxEnergy: 10,
    optimalMoves: 8,
    walls: [
      { r: 1, c: 1 },
      { r: 2, c: 1 },
      { r: 2, c: 2 },
      { r: 2, c: 3 },
    ],
    batteries: [{ r: 3, c: 1 }],
    tip: 'Navigate around obstacles and grab the battery cell for bonus energy!',
  },
  {
    id: 2,
    name: 'Stage 2: Circuit Breaker',
    gridSize: 5,
    startPos: { r: 4, c: 0 },
    goalPos: { r: 0, c: 4 },
    maxEnergy: 12,
    optimalMoves: 9,
    walls: [
      { r: 1, c: 2 },
      { r: 2, c: 2 },
      { r: 3, c: 2 },
    ],
    switches: [{ r: 4, c: 4 }],
    gates: [{ r: 0, c: 2 }],
    batteries: [{ r: 1, c: 1 }],
    tip: 'The laser gate blocks the charging dock! Step on the switch button first to lower the gate.',
  },
  {
    id: 3,
    name: 'Stage 3: Complex Optimization',
    gridSize: 6,
    startPos: { r: 5, c: 0 },
    goalPos: { r: 0, c: 5 },
    maxEnergy: 14,
    optimalMoves: 10,
    walls: [
      { r: 4, c: 1 },
      { r: 4, c: 2 },
      { r: 2, c: 3 },
      { r: 2, c: 4 },
      { r: 3, c: 3 },
    ],
    switches: [{ r: 0, c: 1 }],
    gates: [{ r: 2, c: 2 }],
    batteries: [{ r: 5, c: 4 }],
    tip: 'Plan multi-step efficiency. Collect energy or trigger the bypass switch to reach the terminal.',
  },
];

interface ProblemSolverGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const ProblemSolverGame: React.FC<ProblemSolverGameProps> = ({ onComplete, onExit }) => {
  const { saveGameResult } = useGameState();
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];

  const [robotPos, setRobotPos] = useState<Position>(currentLevel.startPos);
  const [energy, setEnergy] = useState<number>(currentLevel.maxEnergy);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [collectedBatteries, setCollectedBatteries] = useState<Position[]>([]);
  const [stageCleared, setStageCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [levelScores, setLevelScores] = useState<number[]>([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const resetCurrentStage = () => {
    setRobotPos(currentLevel.startPos);
    setEnergy(currentLevel.maxEnergy);
    setMoveCount(0);
    setSwitchActive(false);
    setCollectedBatteries([]);
    setStageCleared(false);
    setIsGameOver(false);
  };

  const handleMove = (dr: number, dc: number) => {
    if (stageCleared || isGameOver) return;

    const newR = robotPos.r + dr;
    const newC = robotPos.c + dc;

    // Boundary check
    if (newR < 0 || newR >= currentLevel.gridSize || newC < 0 || newC >= currentLevel.gridSize) {
      return;
    }

    // Wall check
    const isWall = currentLevel.walls.some(w => w.r === newR && w.c === newC);
    if (isWall) return;

    // Laser gate check (if not switched off)
    const isGate = currentLevel.gates?.some(g => g.r === newR && g.c === newC);
    if (isGate && !switchActive) {
      return;
    }

    // Valid move
    const newPos = { r: newR, c: newC };
    let newEnergy = energy - 1;

    // Check battery pickup
    const hitBattery = currentLevel.batteries?.some(
      b => b.r === newR && b.c === newC && !collectedBatteries.some(cb => cb.r === newR && cb.c === newC)
    );
    if (hitBattery) {
      newEnergy += 4;
      setCollectedBatteries(prev => [...prev, newPos]);
    }

    // Check switch
    const hitSwitch = currentLevel.switches?.some(s => s.r === newR && s.c === newC);
    if (hitSwitch) {
      setSwitchActive(true);
    }

    setRobotPos(newPos);
    setMoveCount(m => m + 1);
    setEnergy(newEnergy);

    // Check goal reach
    if (newPos.r === currentLevel.goalPos.r && newPos.c === currentLevel.goalPos.c) {
      handleStageSuccess(moveCount + 1, newEnergy);
      return;
    }

    // Out of energy
    if (newEnergy <= 0) {
      setIsGameOver(true);
    }
  };

  const handleStageSuccess = (totalMoves: number, remainingEnergy: number) => {
    setStageCleared(true);
    // Score based on efficiency vs optimal
    const efficiency = Math.max(0.6, Math.min(1.0, currentLevel.optimalMoves / totalMoves));
    const score = Math.round(efficiency * 85 + (remainingEnergy > 0 ? 15 : 5));
    setLevelScores(prev => [...prev, score]);
  };

  const handleNextStage = () => {
    if (levelIndex < LEVELS.length - 1) {
      const nextIdx = levelIndex + 1;
      setLevelIndex(nextIdx);
      const nextLvl = LEVELS[nextIdx];
      setRobotPos(nextLvl.startPos);
      setEnergy(nextLvl.maxEnergy);
      setMoveCount(0);
      setSwitchActive(false);
      setCollectedBatteries([]);
      setStageCleared(false);
      setIsGameOver(false);
    } else {
      finishAllLevels();
    }
  };

  const finishAllLevels = () => {
    const avgScore = levelScores.length > 0
      ? Math.round(levelScores.reduce((a, b) => a + b, 0) / levelScores.length)
      : 92;

    saveGameResult('problem-solver', {
      score: avgScore,
      accuracy: 95,
      breakdown: {
        stagesSolved: `${LEVELS.length} of ${LEVELS.length}`,
        planningEfficiency: `${avgScore}%`,
      },
    });

    setIsGameFinished(true);
  };

  if (isGameFinished) {
    const avg = levelScores.length > 0
      ? Math.round(levelScores.reduce((a, b) => a + b, 0) / levelScores.length)
      : 94;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-blue-100 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-blue-200 mx-auto mb-6">
            🔧
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Puzzle Stages Mastered!
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            You deployed systematic spatial reasoning and optimal resource usage to solve every maze challenge.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-3xl font-black text-blue-600 font-display">{avg}</span>
              <span className="text-xs text-slate-500 block">/ 100</span>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Stages Cleared</span>
              <span className="text-3xl font-black text-emerald-600 font-display">3 / 3</span>
              <span className="text-xs text-slate-500 block">100% Solved</span>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Path Efficiency</span>
              <span className="text-3xl font-black text-purple-600 font-display">94%</span>
              <span className="text-xs text-slate-500 block">Near-Optimal</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-8 text-left">
            <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-blue-600" />
              Cognitive Problem-Solving Trait:
            </h4>
            <p className="text-sm text-blue-900">
              You demonstrate high forward-planning capabilities. You anticipate obstacles, manage energy constraints, and calculate detour trade-offs before acting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="problem-solver-replay-btn"
              onClick={() => {
                setLevelIndex(0);
                setLevelScores([]);
                setIsGameFinished(false);
                resetCurrentStage();
              }}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Puzzles
            </button>
            <button
              id="problem-solver-continue-btn"
              onClick={onComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-200 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Resource Master
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
          <span className="text-2xl">🔧</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Game 4 of 6</span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Problem Solver</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl text-blue-700 text-sm font-medium">
            <Award className="w-4 h-4 text-blue-600" />
            <span>{currentLevel.name}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
            energy <= 3 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <Battery className="w-4 h-4" />
            <span>Energy: {energy}</span>
          </div>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Guide Volt-E to the Power Station
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentLevel.tip}</p>
          </div>

          <button
            onClick={resetCurrentStage}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Stage
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-6 bg-slate-50 p-2.5 rounded-xl">
          <span className="flex items-center gap-1 font-medium"><span className="text-base">🤖</span> Volt-E</span>
          <span className="flex items-center gap-1 font-medium"><span className="text-base">⚡</span> Charging Dock</span>
          <span className="flex items-center gap-1 font-medium"><span className="text-base">🧱</span> Wall</span>
          {currentLevel.switches && <span className="flex items-center gap-1 font-medium"><span className="text-base">🔘</span> Switch ({switchActive ? 'ON' : 'OFF'})</span>}
          {currentLevel.gates && <span className="flex items-center gap-1 font-medium"><span className="text-base">🛑</span> Laser Gate</span>}
          {currentLevel.batteries && <span className="flex items-center gap-1 font-medium"><span className="text-base">🔋</span> Battery (+4)</span>}
        </div>

        {/* Grid Canvas */}
        <div className="flex flex-col items-center justify-center my-4">
          <div
            className="grid gap-2 p-3 bg-slate-900 rounded-2xl shadow-inner max-w-full overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
              width: `${Math.min(380, currentLevel.gridSize * 65)}px`,
            }}
          >
            {Array.from({ length: currentLevel.gridSize }).map((_, r) =>
              Array.from({ length: currentLevel.gridSize }).map((_, c) => {
                const isRobot = robotPos.r === r && robotPos.c === c;
                const isGoal = currentLevel.goalPos.r === r && currentLevel.goalPos.c === c;
                const isWall = currentLevel.walls.some(w => w.r === r && w.c === c);
                const isSwitch = currentLevel.switches?.some(s => s.r === r && s.c === c);
                const isGate = currentLevel.gates?.some(g => g.r === r && g.c === c);
                const hasBattery = currentLevel.batteries?.some(
                  b => b.r === r && b.c === c && !collectedBatteries.some(cb => cb.r === r && cb.c === c)
                );

                let cellBg = 'bg-slate-800/80 border border-slate-700/50';
                if (isWall) cellBg = 'bg-slate-700 border-slate-600';
                if (isGate) cellBg = switchActive ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-rose-950/60 border-rose-500/60';
                if (isSwitch) cellBg = switchActive ? 'bg-emerald-900/40 border-emerald-400' : 'bg-amber-950/40 border-amber-500';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all relative ${cellBg}`}
                  >
                    {isRobot ? (
                      <motion.div
                        layoutId="robot"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/50"
                      >
                        🤖
                      </motion.div>
                    ) : isGoal ? (
                      <span className="animate-pulse">⚡</span>
                    ) : isWall ? (
                      <span className="opacity-80">🧱</span>
                    ) : isGate ? (
                      <span>{switchActive ? '🔓' : '🛑'}</span>
                    ) : isSwitch ? (
                      <span>{switchActive ? '✅' : '🔘'}</span>
                    ) : hasBattery ? (
                      <span className="animate-bounce">🔋</span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Direction Controls */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <button
            id="solver-up-btn"
            onClick={() => handleMove(-1, 0)}
            disabled={stageCleared || isGameOver}
            className="w-14 h-14 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <button
              id="solver-left-btn"
              onClick={() => handleMove(0, -1)}
              disabled={stageCleared || isGameOver}
              className="w-14 h-14 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-xs font-bold text-slate-500">
              <span>{moveCount}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Moves</span>
            </div>
            <button
              id="solver-right-btn"
              onClick={() => handleMove(0, 1)}
              disabled={stageCleared || isGameOver}
              className="w-14 h-14 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <button
            id="solver-down-btn"
            onClick={() => handleMove(1, 0)}
            disabled={stageCleared || isGameOver}
            className="w-14 h-14 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Stage Status Alerts */}
        <AnimatePresence>
          {stageCleared && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Stage Complete!</h4>
                  <p className="text-xs text-emerald-800">
                    Solved in {moveCount} moves with {energy} energy remaining.
                  </p>
                </div>
              </div>

              <button
                id="solver-next-stage-btn"
                onClick={handleNextStage}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors flex items-center gap-2 cursor-pointer text-sm"
              >
                {levelIndex < LEVELS.length - 1 ? 'Next Puzzle Stage' : 'Complete Challenge'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {isGameOver && !stageCleared && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
                <div>
                  <h4 className="text-sm font-bold text-rose-950">Energy Depleted!</h4>
                  <p className="text-xs text-rose-800">Volt-E ran out of battery moves before reaching the station.</p>
                </div>
              </div>

              <button
                id="solver-retry-stage-btn"
                onClick={resetCurrentStage}
                className="px-5 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
