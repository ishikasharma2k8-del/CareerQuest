import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Award, RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, UserCheck } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  superpower: string;
  blindspot: string;
  stats: {
    technical: number;
    design: number;
    operations: number;
    communication: number;
  };
}

interface ProjectTask {
  id: string;
  title: string;
  icon: string;
  description: string;
  bestFitMemberId: string;
  requiredAttribute: 'technical' | 'design' | 'operations' | 'communication';
  taskWhy: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'alex',
    name: 'Alex Chen',
    role: 'Systems Architect',
    avatar: '👨‍💻',
    superpower: 'Algorithmic logic, database concurrency, secure cloud backends.',
    blindspot: 'Public keynote speeches and marketing copywriting.',
    stats: { technical: 96, design: 55, operations: 75, communication: 50 },
  },
  {
    id: 'maya',
    name: 'Maya Rivera',
    role: 'UX & Product Lead',
    avatar: '👩‍🎨',
    superpower: 'User research, empathy interviewing, aesthetic interface design.',
    blindspot: 'Low-level server scripting and mathematical algorithms.',
    stats: { technical: 52, design: 95, operations: 70, communication: 85 },
  },
  {
    id: 'jordan',
    name: 'Jordan Blake',
    role: 'Sprint & Ops Strategist',
    avatar: '🧑‍💼',
    superpower: 'Timeline sequencing, bottleneck elimination, risk triage.',
    blindspot: 'Visual branding and color theory.',
    stats: { technical: 72, design: 50, operations: 95, communication: 80 },
  },
  {
    id: 'sam',
    name: 'Sam Taylor',
    role: 'Pitch & Brand Director',
    avatar: '🎤',
    superpower: 'Client persuasion, compelling storytelling, venture pitches.',
    blindspot: 'Hardware debugging and database schemas.',
    stats: { technical: 45, design: 78, operations: 65, communication: 98 },
  },
];

const PROJECT_TASKS: ProjectTask[] = [
  {
    id: 'task-1',
    title: 'Mission 1: Scalable Cloud Architecture',
    icon: '⚡',
    description: 'Design the database schemas, handle 50,000 requests/sec, and ensure zero downtime.',
    bestFitMemberId: 'alex',
    requiredAttribute: 'technical',
    taskWhy: 'Requires top-tier algorithmic reasoning and backend systems expertise.',
  },
  {
    id: 'task-2',
    title: 'Mission 2: Interactive User Journey & Design',
    icon: '🎨',
    description: 'Conduct user interviews, design intuitive mobile interfaces, and eliminate friction.',
    bestFitMemberId: 'maya',
    requiredAttribute: 'design',
    taskWhy: 'Requires high human empathy and visual product craftsmanship.',
  },
  {
    id: 'task-3',
    title: 'Mission 3: Milestone Timeline & Risk Triage',
    icon: '📋',
    description: 'Align sprint velocity, eliminate cross-team blockers, and manage operational budget.',
    bestFitMemberId: 'jordan',
    requiredAttribute: 'operations',
    taskWhy: 'Requires structured organizational planning and resource orchestration.',
  },
  {
    id: 'task-4',
    title: 'Mission 4: Investor Pitch & Client Presentation',
    icon: '🚀',
    description: 'Deliver a breathtaking 5-minute keynote to secure next-stage funding from venture partners.',
    bestFitMemberId: 'sam',
    requiredAttribute: 'communication',
    taskWhy: 'Requires magnetic charisma, audience persuasion, and compelling storytelling.',
  },
];

interface TeamStrategyGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const TeamStrategyGame: React.FC<TeamStrategyGameProps> = ({ onComplete, onExit }) => {
  const { saveGameResult } = useGameState();
  const [assignments, setAssignments] = useState<Record<string, string>>({
    'task-1': '',
    'task-2': '',
    'task-3': '',
    'task-4': '',
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [synergyResults, setSynergyResults] = useState<{ task: ProjectTask; member: TeamMember; isOptimal: boolean }[]>([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const assignedMemberIds = Object.values(assignments).filter(Boolean);
  const allTasksAssigned = Object.values(assignments).every(val => Boolean(val));

  const handleAssign = (taskId: string, memberId: string) => {
    setAssignments(prev => ({
      ...prev,
      [taskId]: memberId,
    }));
  };

  const handleEvaluateTeam = () => {
    if (!allTasksAssigned) return;

    setIsSimulating(true);

    const results = PROJECT_TASKS.map(task => {
      const memberId = assignments[task.id];
      const member = TEAM_MEMBERS.find(m => m.id === memberId)!;
      const isOptimal = member.id === task.bestFitMemberId;
      return { task, member, isOptimal };
    });

    setTimeout(() => {
      setSynergyResults(results);

      // Score calculation:
      // Each optimal assignment gives 25 points.
      // If someone has high matching stats even if not exact optimal, give partial
      let scoreAcc = 0;
      results.forEach(r => {
        const memberStat = r.member.stats[r.task.requiredAttribute];
        scoreAcc += Math.round((memberStat / 100) * 25);
      });

      const totalScore = Math.min(100, Math.max(50, scoreAcc));
      setFinalScore(totalScore);
      setIsSimulating(false);
      setIsGameFinished(true);

      saveGameResult('team-strategy', {
        score: totalScore,
        breakdown: {
          leadershipRating: totalScore >= 90 ? 'Exceptional' : 'Strong',
          synergyAccuracy: `${totalScore}%`,
        },
      });
    }, 1200);
  };

  const restartGame = () => {
    setAssignments({
      'task-1': '',
      'task-2': '',
      'task-3': '',
      'task-4': '',
    });
    setFinalScore(null);
    setSynergyResults([]);
    setIsGameFinished(false);
  };

  if (isGameFinished && finalScore !== null) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-violet-100 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-violet-200 mx-auto mb-6">
            🤝
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
            Team Strategy Mastered!
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            You delegated tasks according to personal strengths, optimizing collective output and morale.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-3xl font-black text-violet-600 font-display">{finalScore}</span>
              <span className="text-xs text-slate-500 block">/ 100</span>
            </div>
            <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Synergy Match</span>
              <span className="text-3xl font-black text-emerald-600 font-display">
                {synergyResults.filter(r => r.isOptimal).length} / 4
              </span>
              <span className="text-xs text-slate-500 block">Optimal Roles</span>
            </div>
            <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Leadership Trait</span>
              <span className="text-lg font-black text-indigo-600 font-display truncate block mt-1">
                Empathetic Architect
              </span>
              <span className="text-xs text-slate-500 block">Demonstrated</span>
            </div>
          </div>

          {/* Detailed Assignment Feedback */}
          <div className="space-y-3 mb-8 text-left">
            {synergyResults.map((item, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                  item.isOptimal
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-violet-50/70 border-violet-200 text-violet-950'
                }`}
              >
                <span className="text-2xl">{item.member.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="font-bold">{item.task.title}</strong>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80">
                      Assigned: {item.member.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {item.isOptimal
                      ? `Perfect role match! ${item.member.name} utilized their superpower in ${item.task.requiredAttribute}.`
                      : `Decent execution, though ${item.member.name}'s peak strength is in another domain.`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="team-strategy-replay-btn"
              onClick={restartGame}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Re-assign Team
            </button>
            <button
              id="team-strategy-continue-btn"
              onClick={onComplete}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              View My Career Profile 🎯
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
          <span className="text-2xl">🤝</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Game 6 of 6</span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Team Strategy</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-xl text-violet-700 text-sm font-medium">
            <Award className="w-4 h-4 text-violet-600" />
            <span>Collaboration & Leadership</span>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700">
            Assigned: <strong className="text-violet-600">{assignedMemberIds.length}</strong> / 4
          </div>
        </div>
      </div>

      {/* Intro & Team Roster */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6">
        <div className="mb-6">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-800">
            Leadership Delegation Challenge
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">
            Assign the Right Person to Each Critical Task
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Review each team member’s superpowers and blindspots, then delegate the 4 project missions to maximize collective synergy.
          </p>
        </div>

        {/* Team Members Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {TEAM_MEMBERS.map(member => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
            >
              <span className="text-3xl">{member.avatar}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  {member.name}
                  <span className="text-[11px] font-medium text-slate-500">({member.role})</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  <strong>Superpower:</strong> {member.superpower}
                </p>
                <p className="text-xs text-rose-700 mt-0.5">
                  <strong>Blindspot:</strong> {member.blindspot}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Missions / Tasks */}
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Assign 4 Project Missions:
        </h4>

        <div className="space-y-4">
          {PROJECT_TASKS.map(task => {
            const currentAssigned = assignments[task.id];

            return (
              <div
                key={task.id}
                className="p-5 rounded-2xl border-2 border-slate-200/80 bg-white hover:border-violet-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 max-w-md">
                  <span className="text-2xl mt-0.5">{task.icon}</span>
                  <div>
                    <h5 className="text-base font-bold text-slate-900">{task.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{task.description}</p>
                    <span className="text-[11px] text-violet-700 font-medium block mt-1">
                      Requirement: {task.taskWhy}
                    </span>
                  </div>
                </div>

                {/* Member selection dropdown or radio chips */}
                <div className="flex-shrink-0">
                  <select
                    id={`assign-select-${task.id}`}
                    value={currentAssigned}
                    onChange={(e) => handleAssign(task.id, e.target.value)}
                    className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                  >
                    <option value="">Select Member...</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {allTasksAssigned
              ? 'All 4 project missions assigned. Ready to evaluate synergy!'
              : `Assign all 4 tasks to unlock team simulation.`}
          </p>

          <button
            id="team-evaluate-btn"
            onClick={handleEvaluateTeam}
            disabled={!allTasksAssigned || isSimulating}
            className={`px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              allTasksAssigned && !isSimulating
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:from-violet-500 hover:to-indigo-500 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluating Team Output...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Simulate Team Output
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
