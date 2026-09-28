import React, { useState } from 'react';
import { Page } from '../types';
import { useGameState } from '../context/GameStateContext';
import { Compass, Sparkles, Trophy, BookOpen, User, Menu, X, Play, RefreshCw, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { userLevel, progressPercentage, completedGamesCount } = useGameState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Games', icon: <Play className="w-4 h-4" /> },
    { id: 'user-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'results', label: 'My Results', icon: <Trophy className="w-4 h-4" /> },
    { id: 'careers', label: 'Careers', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              CQ
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-display flex items-center gap-1.5">
                CareerQuest
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider hidden sm:inline-block">
                  Beta
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Play. Discover. Find Your Future.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'dashboard' && completedGamesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Level Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="header-level-badge"
              onClick={() => handleNav('user-dashboard')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              <span>{userLevel.badge}</span>
              <span>{userLevel.title.split('—')[1] || userLevel.title}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-indigo-600">{progressPercentage}%</span>
            </button>

            <button
              id="cta-play-nav"
              onClick={() => handleNav('dashboard')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play Games
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-play-quick"
              onClick={() => handleNav('dashboard')}
              className="p-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Games
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors flex items-center gap-3 ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              User Status: <strong className="text-indigo-600">{userLevel.title}</strong>
            </div>
            <button
              onClick={() => handleNav('dashboard')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
