import React, { useState } from 'react';
import { SkillCategory, SkillScores } from '../types';
import { motion } from 'motion/react';
import { Brain, Sparkles, Wrench, Zap, Users, MessageSquare, Compass, RefreshCw, BarChart2 } from 'lucide-react';

interface SkillChartProps {
  skillScores: SkillScores;
}

const SKILL_ICONS: Record<SkillCategory, React.ReactNode> = {
  'Logical Thinking': <Brain className="w-4 h-4 text-indigo-500" />,
  'Creativity': <Sparkles className="w-4 h-4 text-pink-500" />,
  'Problem Solving': <Wrench className="w-4 h-4 text-blue-500" />,
  'Decision Making': <Zap className="w-4 h-4 text-amber-500" />,
  'Leadership': <Users className="w-4 h-4 text-violet-500" />,
  'Communication': <MessageSquare className="w-4 h-4 text-emerald-500" />,
  'Strategic Thinking': <Compass className="w-4 h-4 text-teal-500" />,
  'Adaptability': <RefreshCw className="w-4 h-4 text-rose-500" />,
};

const SKILL_COLORS: Record<SkillCategory, string> = {
  'Logical Thinking': 'from-indigo-500 to-indigo-600',
  'Creativity': 'from-pink-500 to-rose-500',
  'Problem Solving': 'from-blue-500 to-cyan-500',
  'Decision Making': 'from-amber-500 to-orange-500',
  'Leadership': 'from-violet-500 to-purple-600',
  'Communication': 'from-emerald-500 to-teal-500',
  'Strategic Thinking': 'from-teal-500 to-emerald-600',
  'Adaptability': 'from-rose-500 to-pink-600',
};

export const SkillChart: React.FC<SkillChartProps> = ({ skillScores }) => {
  const [viewMode, setViewMode] = useState<'bars' | 'radar'>('bars');

  const skillsList = Object.keys(skillScores) as SkillCategory[];

  // Math for 8-axis Radar Chart
  const size = 320;
  const center = size / 2;
  const radius = center - 45;
  const angleStep = (Math.PI * 2) / skillsList.length;

  // Compute polygon points
  const polygonPoints = skillsList
    .map((skill, index) => {
      const score = skillScores[skill] || 50;
      const r = (score / 100) * radius;
      const angle = index * angleStep - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            Cognitive Abilities Profile
          </h3>
          <p className="text-xs text-slate-500">
            Dynamically measured across 8 functional skill dimensions
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            id="skill-view-bars"
            onClick={() => setViewMode('bars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'bars'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bars View
          </button>
          <button
            id="skill-view-radar"
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'radar'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Radar View
          </button>
        </div>
      </div>

      {/* Radar Mode */}
      {viewMode === 'radar' ? (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-[320px] h-[320px]">
            <svg width={size} height={size} className="overflow-visible">
              {/* Concentric Polygons / Circles */}
              {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                <polygon
                  key={i}
                  points={skillsList
                    .map((_, idx) => {
                      const r = radius * scale;
                      const angle = idx * angleStep - Math.PI / 2;
                      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={i < 3 ? '3 3' : undefined}
                />
              ))}

              {/* Axis lines */}
              {skillsList.map((_, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                );
              })}

              {/* User Score Filled Polygon */}
              <motion.polygon
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                points={polygonPoints}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#6366f1"
                strokeWidth="2.5"
              />

              {/* Points */}
              {skillsList.map((skill, idx) => {
                const score = skillScores[skill] || 50;
                const r = (score / 100) * radius;
                const angle = idx * angleStep - Math.PI / 2;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);

                // Label offset
                const labelRadius = radius + 22;
                const lx = center + labelRadius * Math.cos(angle);
                const ly = center + labelRadius * Math.sin(angle);

                return (
                  <g key={skill}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      className="fill-indigo-600 stroke-white stroke-2 shadow"
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-bold fill-slate-700"
                    >
                      {skill.split(' ')[0]} ({score}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Polygon area illustrates your balance across technical, creative, and interpersonal aptitudes.
          </p>
        </div>
      ) : (
        /* Bars Mode */
        <div className="space-y-4">
          {skillsList.map((skill) => {
            const score = skillScores[skill] || 50;
            const gradient = SKILL_COLORS[skill] || 'from-indigo-500 to-purple-500';

            return (
              <div key={skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 flex items-center gap-2">
                    {SKILL_ICONS[skill]}
                    <span>{skill}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {score}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
