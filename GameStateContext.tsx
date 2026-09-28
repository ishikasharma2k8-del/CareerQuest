import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameId, GameResult, SkillCategory, SkillScores, UserProfile, Career } from '../types';
import { calculateSkillScores, INITIAL_SKILL_SCORES } from '../utils/skillCalculator';
import { matchCareers } from '../utils/careerMatcher';
import { GAMES_METADATA } from '../data/gamesMetadata';
import confetti from 'canvas-confetti';

interface GameStateContextType {
  userProfile: UserProfile;
  gameResults: Record<GameId, GameResult>;
  unlockedGames: GameId[];
  skillScores: SkillScores;
  recommendedCareers: Career[];
  completedGamesCount: number;
  progressPercentage: number;
  overallScore: number;
  userLevel: {
    levelNumber: number;
    title: string;
    badge: string;
    nextMilestone: string;
  };
  strongestSkill: {
    name: SkillCategory;
    score: number;
  };
  saveGameResult: (gameId: GameId, result: Partial<GameResult>) => void;
  resetProgress: () => void;
  loadDemoScores: () => void;
  toggleSaveCareer: (careerId: string) => void;
  updateUserName: (name: string) => void;
  updateUserAvatar: (avatar: string) => void;
  isGameUnlocked: (gameId: GameId) => boolean;
}

const STORAGE_KEY = 'careerquest_state_v1';

const INITIAL_GAME_RESULTS: Record<GameId, GameResult> = {
  'pattern-hunt': { gameId: 'pattern-hunt', completed: false, score: 0 },
  'quick-decision': { gameId: 'quick-decision', completed: false, score: 0 },
  'creative-lab': { gameId: 'creative-lab', completed: false, score: 0 },
  'problem-solver': { gameId: 'problem-solver', completed: false, score: 0 },
  'resource-master': { gameId: 'resource-master', completed: false, score: 0 },
  'team-strategy': { gameId: 'team-strategy', completed: false, score: 0 },
  'think-outside-the-box': { gameId: 'think-outside-the-box', completed: false, score: 0 },
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  avatar: '🚀',
  createdAt: new Date().toISOString(),
  savedCareerIds: ['software-engineer', 'ui-ux-designer'],
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [gameResults, setGameResults] = useState<Record<GameId, GameResult>>(INITIAL_GAME_RESULTS);
  const [unlockedGames, setUnlockedGames] = useState<GameId[]>(['pattern-hunt', 'think-outside-the-box']);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
        if (parsed.gameResults) {
          setGameResults({ ...INITIAL_GAME_RESULTS, ...parsed.gameResults });
        }
        if (parsed.unlockedGames) {
          const unlocked = Array.isArray(parsed.unlockedGames) ? [...parsed.unlockedGames] : ['pattern-hunt'];
          if (!unlocked.includes('think-outside-the-box')) {
            unlocked.push('think-outside-the-box');
          }
          setUnlockedGames(unlocked);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          userProfile,
          gameResults,
          unlockedGames,
        })
      );
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }, [userProfile, gameResults, unlockedGames]);

  // Derived metrics
  const resultsList = Object.values(gameResults) as GameResult[];
  const completedGames = resultsList.filter(g => g && g.completed);
  const completedGamesCount = completedGames.length;
  const progressPercentage = Math.round((completedGamesCount / GAMES_METADATA.length) * 100);

  const overallScore = completedGamesCount > 0
    ? Math.round(completedGames.reduce((acc, g) => acc + (g.score || 0), 0) / completedGamesCount)
    : 0;

  // Level determination:
  // Level 1 — Explorer 🌱 (0 games)
  // Level 2 — Discoverer 🔍 (1-2 games)
  // Level 3 — Strategist 🧠 (3-5 games)
  // Level 4 — Career Explorer 🚀 (6 games)
  let userLevel = {
    levelNumber: 1,
    title: 'Level 1 — Explorer 🌱',
    badge: '🌱',
    nextMilestone: 'Complete 1 game to reach Discoverer',
  };

  if (completedGamesCount >= 6) {
    userLevel = {
      levelNumber: 4,
      title: 'Level 4 — Career Explorer 🚀',
      badge: '🚀',
      nextMilestone: 'All 6 challenges mastered! Full career map unlocked.',
    };
  } else if (completedGamesCount >= 3) {
    userLevel = {
      levelNumber: 3,
      title: 'Level 3 — Strategist 🧠',
      badge: '🧠',
      nextMilestone: `Complete ${6 - completedGamesCount} more game${6 - completedGamesCount > 1 ? 's' : ''} to reach Career Explorer`,
    };
  } else if (completedGamesCount >= 1) {
    userLevel = {
      levelNumber: 2,
      title: 'Level 2 — Discoverer 🔍',
      badge: '🔍',
      nextMilestone: `Complete ${3 - completedGamesCount} more game${3 - completedGamesCount > 1 ? 's' : ''} to reach Strategist`,
    };
  }

  // Skills
  const skillScores = calculateSkillScores(gameResults);

  // Strongest skill
  const skillEntries = Object.entries(skillScores) as [SkillCategory, number][];
  const sortedSkills = skillEntries.sort((a, b) => b[1] - a[1]);
  const strongestSkill = {
    name: sortedSkills[0][0],
    score: sortedSkills[0][1],
  };

  // Recommended careers
  const recommendedCareers = matchCareers(skillScores);

  const isGameUnlocked = (gameId: GameId): boolean => {
    return unlockedGames.includes(gameId);
  };

  const saveGameResult = (gameId: GameId, partialResult: Partial<GameResult>) => {
    setGameResults(prev => {
      const updated = {
        ...prev,
        [gameId]: {
          ...prev[gameId],
          ...partialResult,
          gameId,
          completed: true,
          completedAt: new Date().toISOString(),
        },
      };

      // Check unlocking next game
      const currentIndex = GAMES_METADATA.findIndex(g => g.id === gameId);
      if (currentIndex !== -1 && currentIndex + 1 < GAMES_METADATA.length) {
        const nextGameId = GAMES_METADATA[currentIndex + 1].id;
        setUnlockedGames(unlocked => {
          if (!unlocked.includes(nextGameId)) {
            return [...unlocked, nextGameId];
          }
          return unlocked;
        });
      }

      return updated;
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore in environments where canvas is restricted
    }
  };

  const resetProgress = () => {
    setGameResults(INITIAL_GAME_RESULTS);
    setUnlockedGames(['pattern-hunt']);
    setUserProfile(prev => ({
      ...prev,
      savedCareerIds: [],
    }));
  };

  const loadDemoScores = () => {
    const demoResults: Record<GameId, GameResult> = {
      'pattern-hunt': {
        gameId: 'pattern-hunt',
        completed: true,
        score: 92,
        accuracy: 100,
        speedSeconds: 5.2,
        attempts: 5,
        completedAt: new Date().toISOString(),
      },
      'quick-decision': {
        gameId: 'quick-decision',
        completed: true,
        score: 86,
        speedSeconds: 4.8,
        completedAt: new Date().toISOString(),
      },
      'creative-lab': {
        gameId: 'creative-lab',
        completed: true,
        score: 88,
        completedAt: new Date().toISOString(),
      },
      'problem-solver': {
        gameId: 'problem-solver',
        completed: true,
        score: 94,
        accuracy: 95,
        completedAt: new Date().toISOString(),
      },
      'resource-master': {
        gameId: 'resource-master',
        completed: true,
        score: 84,
        completedAt: new Date().toISOString(),
      },
      'team-strategy': {
        gameId: 'team-strategy',
        completed: true,
        score: 90,
        completedAt: new Date().toISOString(),
      },
      'think-outside-the-box': {
        gameId: 'think-outside-the-box',
        completed: true,
        score: 95,
        completedAt: new Date().toISOString(),
      },
    };

    setGameResults(demoResults);
    setUnlockedGames(GAMES_METADATA.map(g => g.id));

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }
  };

  const toggleSaveCareer = (careerId: string) => {
    setUserProfile(prev => {
      const exists = prev.savedCareerIds.includes(careerId);
      return {
        ...prev,
        savedCareerIds: exists
          ? prev.savedCareerIds.filter(id => id !== careerId)
          : [...prev.savedCareerIds, careerId],
      };
    });
  };

  const updateUserName = (name: string) => {
    setUserProfile(prev => ({ ...prev, name }));
  };

  const updateUserAvatar = (avatar: string) => {
    setUserProfile(prev => ({ ...prev, avatar }));
  };

  return (
    <GameStateContext.Provider
      value={{
        userProfile,
        gameResults,
        unlockedGames,
        skillScores,
        recommendedCareers,
        completedGamesCount,
        progressPercentage,
        overallScore,
        userLevel,
        strongestSkill,
        saveGameResult,
        resetProgress,
        loadDemoScores,
        toggleSaveCareer,
        updateUserName,
        updateUserAvatar,
        isGameUnlocked,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
