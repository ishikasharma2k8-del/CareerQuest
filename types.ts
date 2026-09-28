export type Page = 
  | 'home'
  | 'how-it-works'
  | 'dashboard'
  | 'user-dashboard'
  | 'game'
  | 'results'
  | 'careers'
  | 'profile';

export type GameId = 
  | 'pattern-hunt'
  | 'quick-decision'
  | 'creative-lab'
  | 'problem-solver'
  | 'resource-master'
  | 'team-strategy'
  | 'think-outside-the-box';

export type SkillCategory = 
  | 'Logical Thinking'
  | 'Creativity'
  | 'Problem Solving'
  | 'Decision Making'
  | 'Leadership'
  | 'Communication'
  | 'Strategic Thinking'
  | 'Adaptability';

export interface GameMetadata {
  id: GameId;
  number: number;
  title: string;
  icon: string;
  shortDesc: string;
  skillMeasured: string;
  primarySkills: SkillCategory[];
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GameResult {
  gameId: GameId;
  completed: boolean;
  score: number; // 0 to 100
  accuracy?: number; // percentage
  speedSeconds?: number;
  attempts?: number;
  completedAt?: string;
  breakdown?: Record<string, number | string>;
}

export interface SkillScores {
  'Logical Thinking': number;
  'Creativity': number;
  'Problem Solving': number;
  'Decision Making': number;
  'Leadership': number;
  'Communication': number;
  'Strategic Thinking': number;
  'Adaptability': number;
}

export interface Career {
  id: string;
  name: string;
  category: 'Technology' | 'Engineering' | 'Design' | 'Business' | 'Science' | 'Healthcare' | 'Creative' | 'Finance' | 'Media';
  icon: string;
  matchPercentage?: number;
  shortDescription: string;
  whyItMatches?: string;
  importantSkills: string[];
  whatTheyDo: string;
  educationPath: string;
  workEnvironment: string;
  salaryRange: string;
  relatedCareers: string[];
  requiredSkillWeights: Partial<Record<SkillCategory, number>>;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio?: string;
  targetInterests?: string[];
  createdAt: string;
  savedCareerIds: string[];
}
