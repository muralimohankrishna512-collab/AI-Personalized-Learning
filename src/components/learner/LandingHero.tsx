import React from "react";
import { CompetencySphere } from "../3d/CompetencySphere";
import { DataParticles } from "../3d/DataParticles";
import { UserSkill, RoleSkillRequirement, SkillGapItem, Language } from "../../types";
import { translations } from "../../translations";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  BrainCircuit, 
  Target, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap,
  ShieldCheck
} from "lucide-react";

interface LandingHeroProps {
  userSkills: UserSkill[];
  requirements: RoleSkillRequirement[];
  skillGaps: SkillGapItem[];
  onSelectSkill: (skillName: string) => void;
  onStartCourse?: (courseId: string) => void;
  onGetStarted: () => void;
  onExplore: () => void;
  language: Language;
  reducedMotion?: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  userSkills,
  requirements,
  skillGaps,
  onSelectSkill,
  onStartCourse,
  onGetStarted,
  onExplore,
  language,
  reducedMotion = false,
}) => {
  const t = translations[language] || translations.en;

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* 3D Background Data Particles & Grid */}
      <DataParticles reducedMotion={reducedMotion} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Top Tagline */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 shadow-inner mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              National Statistical Systems Training Academy (NSSTA) & iGOT Karmayogi
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-[1.15]">
            {t.heroTitle}
          </h1>

          <p className="mt-4 text-base sm:text-xl font-medium text-sky-300 max-w-2xl tracking-wide">
            {t.heroSubtitle}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            See what skills you have, discover what you need to learn, get personalized courses, test your knowledge with smart quizzes, and boost your official skill profile.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-xl shadow-sky-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>{t.getStarted} (Statistical Officer Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExplore}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-semibold shadow-md transition-all hover:border-slate-500"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>{t.explorePlatform}</span>
            </button>
          </div>
        </div>

        {/* Central 3D Interactive Competency Sphere Hero Visualization (Sections 63 & 64) */}
        <div className="mt-6 mb-16">
          <CompetencySphere
            userSkills={userSkills}
            requirements={requirements}
            skillGaps={skillGaps}
            onSelectSkill={onSelectSkill}
            onStartCourse={onStartCourse}
            overallScore={72}
            reducedMotion={reducedMotion}
            language={language}
          />
        </div>

        {/* Continuous Learning Loop Workflow (Section 25) */}
        <div className="w-full bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md mb-16">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Closed-Loop Capability Engine
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Continuous Statistical Workforce Competency Cycle
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { step: "1", title: "ASSESS", desc: "Diagnostic Baseline", icon: "📊" },
              { step: "2", title: "IDENTIFY GAP", desc: "Level vs Role Req", icon: "🎯" },
              { step: "3", title: "RECOMMEND", desc: "iGOT & NSSTA AI Match", icon: "💡" },
              { step: "4", title: "LEARN", desc: "Interactive Roadmap", icon: "📚" },
              { step: "5", title: "ASSESS AGAIN", desc: "AI Document Quizzes", icon: "📝" },
              { step: "6", title: "UPDATE LEVEL", desc: "Dynamic Score Delta", icon: "📈" },
              { step: "7", title: "NEXT PATH", desc: "Target Readiness", icon: "🏆" },
            ].map((cycle, i) => (
              <div
                key={cycle.step}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-sky-500/40 transition group"
              >
                <div className="w-8 h-8 rounded-full bg-sky-950 text-sky-300 font-mono text-xs font-bold flex items-center justify-center mb-2 border border-sky-800 group-hover:bg-sky-600 group-hover:text-white transition">
                  {cycle.step}
                </div>
                <div className="text-lg mb-1">{cycle.icon}</div>
                <div className="text-xs font-bold text-white">{cycle.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{cycle.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid with Enterprise Aesthetics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Explainable AI Recommendations
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every course suggestion provides structured mathematical and role justifications, explaining which skill gap is targeted, required levels, and prerequisite sequencing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              iGOT Karmayogi & NSSTA Integration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unified training catalog merging Mission Karmayogi digital e-learning courses with residential specialized programmes from the National Statistical Systems Training Academy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              AI Practice Quiz from Study Manuals
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload any official study manual or document to generate practice questions with instant grading, clear explanations, and official skill level upgrades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
