import React, { useState } from 'react';
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { Page, GameId } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { GameDashboard } from './components/GameDashboard';
import { ResultPage } from './components/ResultPage';
import { CareersPage } from './components/CareersPage';
import { ProfilePage } from './components/ProfilePage';
import { PersonalizedDashboard } from './components/PersonalizedDashboard';

// Games
import { PatternHuntGame } from './components/games/PatternHuntGame';
import { QuickDecisionGame } from './components/games/QuickDecisionGame';
import { CreativeLabGame } from './components/games/CreativeLabGame';
import { ProblemSolverGame } from './components/games/ProblemSolverGame';
import { ResourceMasterGame } from './components/games/ResourceMasterGame';
import { TeamStrategyGame } from './components/games/TeamStrategyGame';
import { ThinkOutsideTheBoxGame } from './components/games/ThinkOutsideTheBoxGame';

import { ArrowLeft, Compass, Heart, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);

  const handleStartGameJourney = () => {
    setActiveGameId(null);
    setCurrentPage('dashboard');
  };

  const handlePlayGame = (gameId: GameId) => {
    setActiveGameId(gameId);
    setCurrentPage('game');
  };

  const handleGameComplete = (currentGameId: GameId) => {
    // Determine next game
    const gameSequence: GameId[] = [
      'pattern-hunt',
      'quick-decision',
      'creative-lab',
      'problem-solver',
      'resource-master',
      'team-strategy',
      'think-outside-the-box',
    ];

    const currentIndex = gameSequence.indexOf(currentGameId);
    if (currentIndex >= 0 && currentIndex < gameSequence.length - 1) {
      const nextGame = gameSequence[currentIndex + 1];
      setActiveGameId(nextGame);
      setCurrentPage('game');
    } else {
      // Completed all games!
      setActiveGameId(null);
      setCurrentPage('results');
    }
  };

  const handleExitGame = () => {
    setActiveGameId(null);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar currentPage={currentPage} onNavigate={(p) => {
        setActiveGameId(null);
        setCurrentPage(p);
      }} />

      {/* Active Game Back Bar (Only visible when actively in a game) */}
      {currentPage === 'game' && activeGameId && (
        <div className="bg-white border-b border-slate-200/80 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              id="exit-game-top-btn"
              onClick={handleExitGame}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Games Dashboard</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Progress saves automatically upon completion
            </span>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage
                onNavigate={setCurrentPage}
                onStartGame={handleStartGameJourney}
              />
            </motion.div>
          )}

          {currentPage === 'how-it-works' && (
            <motion.div
              key="how-it-works"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HowItWorksPage onStartPlaying={handleStartGameJourney} />
            </motion.div>
          )}

          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GameDashboard
                onPlayGame={handlePlayGame}
                onNavigate={setCurrentPage}
              />
            </motion.div>
          )}

          {currentPage === 'user-dashboard' && (
            <motion.div
              key="user-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PersonalizedDashboard
                onNavigate={setCurrentPage}
                onPlayGame={handlePlayGame}
              />
            </motion.div>
          )}

          {currentPage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ResultPage
                onNavigate={setCurrentPage}
                onPlayGame={handlePlayGame}
              />
            </motion.div>
          )}

          {currentPage === 'careers' && (
            <motion.div
              key="careers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CareersPage />
            </motion.div>
          )}

          {currentPage === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProfilePage
                onNavigate={setCurrentPage}
                onPlayGame={handlePlayGame}
              />
            </motion.div>
          )}

          {currentPage === 'game' && activeGameId && (
            <motion.div
              key={`game-${activeGameId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeGameId === 'pattern-hunt' && (
                <PatternHuntGame
                  onComplete={() => handleGameComplete('pattern-hunt')}
                  onExit={handleExitGame}
                />
              )}
              {activeGameId === 'quick-decision' && (
                <QuickDecisionGame
                  onComplete={() => handleGameComplete('quick-decision')}
                  onExit={handleExitGame}
                />
              )}
              {activeGameId === 'creative-lab' && (
                <CreativeLabGame
                  onComplete={() => handleGameComplete('creative-lab')}
                  onExit={handleExitGame}
                />
              )}
              {activeGameId === 'problem-solver' && (
                <ProblemSolverGame
                  onComplete={() => handleGameComplete('problem-solver')}
                  onExit={handleExitGame}
                />
              )}
              {activeGameId === 'resource-master' && (
                <ResourceMasterGame
                  onComplete={() => handleGameComplete('resource-master')}
                  onExit={handleExitGame}
                />
              )}
              {activeGameId === 'team-strategy' && (
                <TeamStrategyGame
                  onComplete={() => handleGameComplete('team-strategy')}
                  onExit={handleExitGame}
                />
              )}
              {activeGameId === 'think-outside-the-box' && (
                <ThinkOutsideTheBoxGame
                  onComplete={() => handleGameComplete('think-outside-the-box')}
                  onExit={handleExitGame}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              CQ
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 font-display">
                CareerQuest
              </p>
              <p className="text-xs text-slate-500">
                Play. Discover. Find Your Future.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center sm:text-right">
            <p className="font-medium">
              Career recommendations are dynamic suggestions based on gameplay cognitive performance.
            </p>
            <p className="text-slate-400 mt-0.5">
              100% interactive & survey-free • Designed for students aged 15–25
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GameStateProvider>
      <MainContent />
    </GameStateProvider>
  );
}
