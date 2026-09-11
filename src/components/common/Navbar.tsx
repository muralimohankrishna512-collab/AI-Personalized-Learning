import React from "react";
import { UserRole, Language, ViewMode, UserProfile } from "../../types";
import { getTranslations } from "../../translations";
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  Award, 
  BarChart3, 
  Globe, 
  Bot, 
  UserCheck,
  Shield,
  Activity
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  userProfile: UserProfile;
  onOpenAssistant: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onSelectRole,
  language,
  onSelectLanguage,
  viewMode,
  onToggleViewMode,
  reducedMotion,
  onToggleReducedMotion,
  userProfile,
  onOpenAssistant,
  onOpenAuthModal,
}) => {
  const t = getTranslations(language);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 border-b border-slate-800/90 backdrop-blur-lg">
      {/* Top Gov Tricolor Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-amber-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & MoSPI Identity */}
          <div 
            onClick={() => onSelectTab("landing")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-sky-600/30 border border-sky-400/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  Sankhya-Pragya 3D
                </span>
                <span className="text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800/80 px-1.5 py-0.2 rounded">
                  MoSPI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab("landing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === "landing"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {t.overview}
            </button>
            <button
              onClick={() => onSelectTab("dashboard")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === "dashboard"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.dashboard}</span>
            </button>
            <button
              onClick={() => onSelectTab("competencies")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === "competencies"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.competencySphere}</span>
            </button>
            <button
              onClick={() => onSelectTab("recommendations")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === "recommendations"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.recommendations}</span>
            </button>
            <button
              onClick={() => onSelectTab("assessment")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === "assessment"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t.assessments}</span>
            </button>
            <button
              onClick={() => onSelectTab("analytics")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === "analytics"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.adminAnalytics}</span>
            </button>
          </nav>

          {/* Right Controls: AI Orb button, Language, 3D Toggle, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAssistant}
              className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition active:scale-95"
              aria-label="Open AI Learning Assistant"
            >
              <Bot className="w-4 h-4 text-sky-200 animate-pulse" />
              <span className="hidden sm:inline">{t.aiAssistant}</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value as Language)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            {/* Demo User Info / Login Modal trigger */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-2 pl-2 border-l border-slate-800 text-left hover:opacity-85 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
                AS
              </div>
              <div className="hidden xl:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  Arun K. Sharma
                </div>
                <div className="text-[10px] text-slate-400">
                  Statistical Officer ({userProfile.department})
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
