import { GameId, GameResult, SkillCategory, SkillScores } from '../types';

export const INITIAL_SKILL_SCORES: SkillScores = {
  'Logical Thinking': 50,
  'Creativity': 50,
  'Problem Solving': 50,
  'Decision Making': 50,
  'Leadership': 50,
  'Communication': 50,
  'Strategic Thinking': 50,
  'Adaptability': 50,
};

export function calculateSkillScores(gameResults: Record<GameId, GameResult>): SkillScores {
  const p1 = gameResults['pattern-hunt'];
  const p2 = gameResults['quick-decision'];
  const p3 = gameResults['creative-lab'];
  const p4 = gameResults['problem-solver'];
  const p5 = gameResults['resource-master'];
  const p6 = gameResults['team-strategy'];
  const p7 = gameResults['think-outside-the-box'];

  // Default baselines if no games played yet
  const scores: SkillScores = { ...INITIAL_SKILL_SCORES };

  // Logical Thinking: Pattern Hunt (60%) + Problem Solver (30%) + Quick Decision speed (10%)
  const g1Score = p1?.completed ? p1.score : null;
  const g4Score = p4?.completed ? p4.score : null;
  const g2Score = p2?.completed ? p2.score : null;
  const g7Score = p7?.completed ? p7.score : null;

  if (g1Score !== null || g4Score !== null) {
    const s1 = g1Score ?? 60;
    const s4 = g4Score ?? s1;
    scores['Logical Thinking'] = Math.round(s1 * 0.65 + s4 * 0.35);
  }

  // Creativity: Creative Lab + Think Outside the Box (AI-evaluated) + Problem Solver
  const g3Score = p3?.completed ? p3.score : null;
  if (g3Score !== null || g7Score !== null) {
    const s4 = g4Score ?? 65;
    if (g3Score !== null && g7Score !== null) {
      scores['Creativity'] = Math.round(g7Score * 0.5 + g3Score * 0.4 + s4 * 0.1);
    } else if (g7Score !== null) {
      scores['Creativity'] = Math.round(g7Score * 0.8 + s4 * 0.2);
    } else {
      scores['Creativity'] = Math.round((g3Score ?? 65) * 0.75 + s4 * 0.25);
    }
  }

  // Problem Solving: Problem Solver (45%) + Pattern Hunt (25%) + Resource Master (15%) + Think Outside the Box (15%)
  const g5Score = p5?.completed ? p5.score : null;
  if (g4Score !== null || g1Score !== null || g7Score !== null) {
    const s4 = g4Score ?? 65;
    const s1 = g1Score ?? s4;
    const s5 = g5Score ?? 65;
    const s7 = g7Score ?? s4;
    scores['Problem Solving'] = Math.round(s4 * 0.45 + s1 * 0.25 + s5 * 0.15 + s7 * 0.15);
  }

  // Decision Making: Quick Decision (65%) + Resource Master (25%) + Pattern Hunt speed (10%)
  if (g2Score !== null || g5Score !== null) {
    const s2 = g2Score ?? 65;
    const s5 = g5Score ?? s2;
    const speedBonus = p1?.speedSeconds && p1.speedSeconds < 8 ? 5 : 0;
    scores['Decision Making'] = Math.min(99, Math.round(s2 * 0.65 + s5 * 0.35 + speedBonus));
  }

  // Strategic Thinking: Resource Master (60%) + Team Strategy (25%) + Problem Solver (15%)
  const g6Score = p6?.completed ? p6.score : null;
  if (g5Score !== null || g6Score !== null) {
    const s5 = g5Score ?? 65;
    const s6 = g6Score ?? s5;
    const s4 = g4Score ?? 65;
    scores['Strategic Thinking'] = Math.round(s5 * 0.6 + s6 * 0.25 + s4 * 0.15);
  }

  // Leadership: Team Strategy (70%) + Quick Decision (30%)
  if (g6Score !== null || g2Score !== null) {
    const s6 = g6Score ?? 65;
    const s2 = g2Score ?? s6;
    scores['Leadership'] = Math.round(s6 * 0.7 + s2 * 0.3);
  }

  // Communication: Team Strategy (55%) + Creative Lab storytelling (25%) + Think Outside the Box (20%)
  if (g6Score !== null || g3Score !== null || g7Score !== null) {
    const s6 = g6Score ?? 65;
    const s3 = g3Score ?? s6;
    const s7 = g7Score ?? s3;
    scores['Communication'] = Math.round(s6 * 0.55 + s3 * 0.25 + s7 * 0.20);
  }

  // Adaptability: Quick Decision (40%) + Creative Lab (30%) + Resource Master unexpected events (30%)
  if (g2Score !== null || g3Score !== null || g5Score !== null) {
    const s2 = g2Score ?? 65;
    const s3 = g3Score ?? s2;
    const s5 = g5Score ?? s2;
    scores['Adaptability'] = Math.round(s2 * 0.4 + s3 * 0.3 + s5 * 0.3);
  }

  // Clamp all to 20-99 range for clean visual progress
  (Object.keys(scores) as SkillCategory[]).forEach(skill => {
    scores[skill] = Math.max(20, Math.min(99, scores[skill]));
  });

  return scores;
}

export interface PersonalityArchetype {
  title: string;
  tagline: string;
  description: string;
  badge: string;
  coreStrengths: string[];
  recommendedEnvironments: string[];
}

export function getPersonalityArchetype(skillScores: SkillScores): PersonalityArchetype {
  // Sort skills by highest score
  const sorted = (Object.keys(skillScores) as SkillCategory[]).sort(
    (a, b) => skillScores[b] - skillScores[a]
  );

  const top1 = sorted[0];
  const top2 = sorted[1];

  if ((top1 === 'Logical Thinking' && top2 === 'Problem Solving') || (top1 === 'Problem Solving' && top2 === 'Logical Thinking')) {
    return {
      title: 'The Analytical Creator',
      tagline: 'Precision meets curiosity to build powerful systems.',
      description: 'You naturally combine rigorous logical deductions with structured problem solving. You excel at deconstructing complicated puzzles, discovering underlying trends, and crafting reliable, elegant solutions that stand up under pressure.',
      badge: '🧩',
      coreStrengths: ['Pattern Decomposition', 'Systematic Reasoning', 'Algorithmic Optimization'],
      recommendedEnvironments: ['Tech engineering hubs', 'Advanced R&D labs', 'High-complexity software squads'],
    };
  }

  if (top1 === 'Creativity' || top2 === 'Creativity') {
    return {
      title: 'The Creative Innovator',
      tagline: 'Divergent thinking that turns raw ideas into captivating reality.',
      description: 'You demonstrate vivid imagination, cognitive flexibility, and original out-of-the-box thinking. Where others see standard constraints, you uncover fresh angles, aesthetic harmony, and human-centered opportunities.',
      badge: '🎨',
      coreStrengths: ['Divergent Thinking', 'Visual & Experiential Intuition', 'Rapid Conceptual Prototyping'],
      recommendedEnvironments: ['Design studios', 'Creative agencies', 'Gaming & immersive tech collectives'],
    };
  }

  if (top1 === 'Leadership' || top2 === 'Leadership' || top1 === 'Strategic Thinking' && top2 === 'Decision Making') {
    return {
      title: 'The Strategic Leader',
      tagline: 'Orchestrating teams and navigating complex roadmaps with clarity.',
      description: 'You exhibit strong decision-making under uncertainty, forward-looking strategic vision, and the ability to align diverse talents toward a unified mission. You balance empathy with execution efficiency.',
      badge: '👑',
      coreStrengths: ['Team Empowerment', 'High-Stakes Prioritization', 'Resource Optimization'],
      recommendedEnvironments: ['High-growth venture teams', 'Strategic consulting', 'Cross-functional program offices'],
    };
  }

  if (top1 === 'Problem Solving' || top2 === 'Adaptability') {
    return {
      title: 'The Agile Troubleshooter',
      tagline: 'Calm in chaos, resourceful in execution.',
      description: 'You thrive when conditions shift and challenges arise unexpectedly. Your high adaptability paired with resourcefulness enables you to pivot smoothly and fix bottlenecks before others even diagnose them.',
      badge: '⚡',
      coreStrengths: ['Real-time Resilience', 'Rapid Diagnosis', 'Resourceful Execution'],
      recommendedEnvironments: ['Crisis response units', 'Fast-moving tech scale-ups', 'Robotics & operations'],
    };
  }

  // Fallback balanced archetype
  return {
    title: 'The Dynamic Visionary',
    tagline: 'A versatile synthesizer of ideas, action, and strategy.',
    description: 'You bring a well-rounded cognitive balance across analytical reasoning, strategic planning, and interpersonal intuition. You seamlessly connect technical realities with creative possibilities.',
    badge: '🌟',
    coreStrengths: ['Multidisciplinary Synthesis', 'Balanced Judgement', 'Holistic Problem Framing'],
    recommendedEnvironments: ['Product management', 'Entrepreneurship', 'Interdisciplinary tech ventures'],
  };
}
