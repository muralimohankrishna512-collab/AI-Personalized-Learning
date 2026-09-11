import React, { useState } from "react";
import { UserSkill, RoleSkillRequirement, SkillGapItem, Course, SkillCategory, Language } from "../../types";
import { CompetencySphere } from "../3d/CompetencySphere";
import { SkillGapTower } from "../3d/SkillGapTower";
import { FallbackView } from "../3d/FallbackView";
import { 
  Layers, 
  BarChart2, 
  Table, 
  Search, 
  Filter, 
  BookOpen, 
  Award, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface CompetencyExplorerProps {
  userSkills: UserSkill[];
  requirements: RoleSkillRequirement[];
  skillGaps: SkillGapItem[];
  courses: Course[];
  selectedSkill: string | null;
  onSelectSkill: (skill: string) => void;
  onStartCourse: (courseId: string) => void;
  onTakeAssessment: (competency: string) => void;
  reducedMotion?: boolean;
  language?: Language;
}

export const CompetencyExplorer: React.FC<CompetencyExplorerProps> = ({
  userSkills,
  requirements,
  skillGaps,
  courses,
  selectedSkill,
  onSelectSkill,
  onStartCourse,
  onTakeAssessment,
  reducedMotion = false,
  language = "en",
}) => {
  const [subView, setSubView] = useState<"sphere" | "towers" | "table">("sphere");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: ("All" | SkillCategory)[] = [
    "All",
    "Statistical",
    "Technical",
    "Digital Governance",
    "Behavioural",
  ];

  const filteredGaps = skillGaps.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeSkillGap = skillGaps.find(
    (g) => g.name.toLowerCase() === (selectedSkill || "Python").toLowerCase()
  ) || skillGaps[0];

  const matchingCourses = courses.filter((c) =>
    c.skillsCovered.some((s) => s.toLowerCase() === activeSkillGap.name.toLowerCase()) ||
    c.targetGapSkill.toLowerCase() === activeSkillGap.name.toLowerCase()
  );

  return (
    <div className="w-full space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white">Skill Mapping & Skills to Improve</h2>
          <p className="text-xs text-slate-400">
            Interactive 3D skills sphere, skill level comparison towers, and role standards.
          </p>
        </div>

        {/* 3D View Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubView("sphere")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "sphere" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Sphere</span>
          </button>
          <button
            onClick={() => setSubView("towers")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "towers" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>3D Towers</span>
          </button>
          <button
            onClick={() => setSubView("table")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "table" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Accessible 2D</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-slate-800 text-sky-400 border border-sky-500/40"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search statistical skill..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main Visual Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3D Visualization Canvas */}
        <div className="lg:col-span-2">
          {subView === "sphere" ? (
            <CompetencySphere
              userSkills={userSkills}
              requirements={requirements}
              skillGaps={filteredGaps}
              courses={courses}
              onSelectSkill={onSelectSkill}
              onStartCourse={onStartCourse}
              selectedSkill={selectedSkill}
              reducedMotion={reducedMotion}
              language={language}
            />
          ) : subView === "towers" ? (
            <SkillGapTower
              skillGaps={filteredGaps}
              onSelectSkill={onSelectSkill}
              selectedSkill={selectedSkill}
              reducedMotion={reducedMotion}
            />
          ) : (
            <FallbackView
              userSkills={userSkills}
              requirements={requirements}
              skillGaps={filteredGaps}
              onSelectSkill={onSelectSkill}
            />
          )}
        </div>

        {/* Right 1 Col: Selected Competency Deep-Dive Card */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                {activeSkillGap.category} Competency
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  activeSkillGap.gap >= 2
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : activeSkillGap.gap === 1
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                Gap: {activeSkillGap.gap} ({activeSkillGap.priority})
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{activeSkillGap.name}</h3>

            {/* Level Comparison Gauge */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current Assessed:</span>
                <span className="font-bold text-sky-400">Level {activeSkillGap.currentLevel} / 5</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Role Mandate (MoSPI):</span>
                <span className="font-bold text-indigo-400">Level {activeSkillGap.requiredLevel} / 5</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(activeSkillGap.currentLevel / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-4">
              <p>
                <strong className="text-white">Why This Skill Matters:</strong> {activeSkillGap.rationale || "Essential statistical skill for survey methods and data insights."}
              </p>
            </div>

            {/* Recommended Learning for this skill */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Recommended Courses ({matchingCourses.length})
              </span>
              {matchingCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold text-white truncate">{c.title}</div>
                    <div className="text-[10px] text-sky-400">{c.provider} • {c.matchScore}% Match</div>
                  </div>
                  <button
                    onClick={() => onStartCourse(c.id)}
                    className="shrink-0 p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition"
                    title="Start Course"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onTakeAssessment(activeSkillGap.name)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition text-center"
          >
            Take Assessment for {activeSkillGap.name}
          </button>
        </div>
      </div>
    </div>
  );
};
