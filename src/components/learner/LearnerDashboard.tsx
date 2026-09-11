import React, { useState } from "react";
import { UserProfile, SkillGapItem, Course, LearningRoadmapNode, UserSkill, Language } from "../../types";
import { translations } from "../../translations";
import { 
  Award, 
  Clock, 
  Flame, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  RefreshCw,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { CourseCard3D } from "../3d/CourseCard3D";

interface LearnerDashboardProps {
  userProfile: UserProfile;
  skillGaps: SkillGapItem[];
  userSkills: UserSkill[];
  courses: Course[];
  roadmapNodes: LearningRoadmapNode[];
  onStartCourse: (courseId: string) => void;
  onNavigateTab: (tab: string) => void;
  onSelectSkill: (skill: string) => void;
  onGenerateAIAnalysis: () => void;
  aiAnalysisText: string | null;
  isAnalyzingAI: boolean;
  reducedMotion?: boolean;
  language?: Language;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  userProfile,
  skillGaps,
  userSkills,
  courses,
  roadmapNodes,
  onStartCourse,
  onNavigateTab,
  onSelectSkill,
  onGenerateAIAnalysis,
  aiAnalysisText,
  isAnalyzingAI,
  reducedMotion = false,
  language = "en",
}) => {
  const t = translations[language] || translations.en;
  const topGaps = skillGaps.filter(g => g.gap > 0).slice(0, 4);
  const recommendedCourses = courses.slice(0, 3);
  const activeRoadmapNode = roadmapNodes.find(n => n.status === "in-progress") || roadmapNodes[1];

  return (
    <div className="w-full space-y-8">
      {/* Officer Header Card with Depth & Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/60 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-0.5 rounded-full">
                {userProfile.department}
              </span>
              <span className="text-xs text-slate-400">Employee ID: {userProfile.employeeId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {userProfile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Assigned to: <span className="text-white font-medium">{userProfile.currentAssignment}</span>
            </p>
            <div className="flex items-center space-x-2 text-xs text-sky-400 pt-1">
              <span>Career Target:</span>
              <span className="font-semibold text-white">{userProfile.careerGoal}</span>
            </div>
          </div>

          {/* Quick Stats Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Overall Competency</div>
              <div className="text-xl font-bold text-sky-400">{userProfile.overallCompetencyScore}%</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Learning Hours</div>
              <div className="text-xl font-bold text-indigo-400">{userProfile.learningHours}h</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Active Streak</div>
              <div className="text-xl font-bold text-amber-400 flex items-center justify-center space-x-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{userProfile.learningStreakDays}d</span>
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Assessment Avg</div>
              <div className="text-xl font-bold text-emerald-400">{userProfile.assessmentAverage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Competency Analysis Banner (Sections 10 & 42) */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              AI Competency Intelligence & Skill Gap Synthesis
            </h2>
          </div>
          <button
            onClick={onGenerateAIAnalysis}
            disabled={isAnalyzingAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingAI ? "animate-spin" : ""}`} />
            <span>{isAnalyzingAI ? "Synthesizing..." : "Refresh AI Analysis"}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {aiAnalysisText || (
            <>
              Your role as <strong className="text-white">Statistical Officer in Labour Statistics</strong> requires strong skills in <strong className="text-sky-300">Python (Level 4)</strong> and <strong className="text-sky-300">Sampling (Level 4)</strong>. Your current level in both is <strong className="text-rose-300">Level 2 (Basic)</strong>, which are key skills to improve for quarterly labour survey reports. Taking the recommended courses will help you master these skills within 6 to 8 weeks.
            </>
          )}
        </p>

        <div className="mt-4 pt-3 border-t border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-300">
          <span>Based on Official MoSPI Guidelines & NSSTA Training Standards</span>
          <button
            onClick={() => onNavigateTab("competencies")}
            className="hover:underline flex items-center space-x-1 font-semibold text-white"
          >
            <span>Explore 3D Skills Sphere & Level Towers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Skill Gaps & Active Learning Track */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Priority Skill Gaps */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Skills You Need to Improve (Statistical Officer)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Difference between your current skill rating and required job standards.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("competencies")}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              View All ({skillGaps.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topGaps.map((gap) => (
              <div
                key={gap.skillId}
                onClick={() => onSelectSkill(gap.name)}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-600 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm group-hover:text-sky-300 transition">
                    {gap.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      gap.priority === "Critical" || gap.priority === "High"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    Gap: {gap.gap} ({gap.priority})
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Assessed:</span>
                    <span className="font-semibold text-sky-400">Level {gap.currentLevel} / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Required for Role:</span>
                    <span className="font-semibold text-indigo-400">Level {gap.requiredLevel} / 5</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-1.5 rounded-full"
                      style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                  {gap.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Active Learning Pathway Quick Status */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Active Roadmap Stage
              </span>
              <span className="text-xs text-emerald-400 font-bold">Stage 2 of 5</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{activeRoadmapNode.title}</h3>
            <p className="text-xs text-slate-300 mb-4">{activeRoadmapNode.description}</p>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="text-sky-300 font-semibold">{activeRoadmapNode.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Competency:</span>
                <span className="text-white font-medium">{activeRoadmapNode.skillGained}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-300">{activeRoadmapNode.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Course Progress:</span>
                <span className="text-amber-400 font-bold">45% Completed</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full w-[45%]" />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onStartCourse(activeRoadmapNode.courseId)}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition text-center"
            >
              Continue Course on iGOT Karmayogi
            </button>
            <button
              onClick={() => onNavigateTab("roadmap")}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition text-center"
            >
              View Full 3D Learning Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Courses Section (Section 68 - 3D Course Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">AI-Recommended Training Courses</h2>
            <p className="text-xs text-slate-400">
              Ranked via multi-factor hybrid match: 40% skill gap weight, 25% department assignment, 20% prerequisites.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("recommendations")}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
          >
            Explore All Catalog ({courses.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard3D
              key={course.id}
              course={course}
              onStartCourse={onStartCourse}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
