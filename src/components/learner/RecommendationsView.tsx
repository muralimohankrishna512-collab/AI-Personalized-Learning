import React, { useState } from "react";
import { Course, Language } from "../../types";
import { CourseCard3D } from "../3d/CourseCard3D";
import { translations } from "../../translations";
import { 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Building2, 
  Briefcase,
  Layers,
  ChevronRight,
  Flame
} from "lucide-react";

interface RecommendationsViewProps {
  courses: Course[];
  onStartCourse: (courseId: string) => void;
  reducedMotion?: boolean;
  language?: Language;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  courses,
  onStartCourse,
  reducedMotion = false,
  language = "en",
}) => {
  const t = translations[language] || translations.en;
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [cadreFilter, setCadreFilter] = useState<string>("Statistical Officer");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesProvider =
      providerFilter === "All" ||
      (providerFilter === "iGOT" && c.provider.includes("iGOT")) ||
      (providerFilter === "NSSTA" && c.provider.includes("NSSTA"));
    
    const matchesDifficulty = difficultyFilter === "All" || c.difficulty === difficultyFilter;
    
    const matchesCategory =
      categoryFilter === "All" ||
      (categoryFilter === "Cadre Mandate" && (c.matchScore >= 88 || c.category.includes("Macroeconomic") || c.category.includes("Methodology"))) ||
      (categoryFilter === "Technical" && c.category.toLowerCase().includes("technical")) ||
      (categoryFilter === "Statistical" && (c.category.toLowerCase().includes("stat") || c.category.toLowerCase().includes("methodology"))) ||
      (categoryFilter === "Governance" && (c.category.toLowerCase().includes("governance") || c.category.toLowerCase().includes("leadership")));

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skillsCovered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProvider && matchesDifficulty && matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* 6,778+ iGOT & NSSTA National Catalog Banner (User Request: Show to all 6,778 courses & suggest for gov employee) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>National Civil Services Training Platform Integration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.courseCatalogTitle}
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {t.courseCatalogSubtitle}
            </p>
          </div>

          {/* 6,778 Counter Metric Badge */}
          <div className="flex items-center space-x-3 bg-slate-950/90 p-4 rounded-2xl border border-sky-500/30 shadow-inner shrink-0">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">6,778+</div>
              <div className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">
                Courses on iGOT & NSSTA
              </div>
            </div>
          </div>
        </div>

        {/* Government Employee Cadre Guidance Box */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-semibold">
              {t.govEmployeeNotice}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-medium">
              Target: 40 Annual Hours
            </span>
            <span>•</span>
            <span className="text-slate-300">Labour Statistics Division</span>
          </div>
        </div>
      </div>

      {/* Government Cadre Fast-Track Recommendations Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Cadre Learning Recommendations for Statistical Officers:</span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Filter by Cadre Level:</span>
            <select
              value={cadreFilter}
              onChange={(e) => setCadreFilter(e.target.value)}
              className="bg-slate-950 text-white text-xs border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500"
            >
              <option value="Statistical Officer">Statistical Officer (Current)</option>
              <option value="Senior Statistical Officer">Senior Statistical Officer (Promotion Track)</option>
              <option value="Director">Deputy Director / Division Head</option>
            </select>
          </div>
        </div>

        {/* Recommended Cadre Courses Horizontal Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: "Python for Data Analysis & Microdata Processing",
              provider: "iGOT Karmayogi",
              match: "94% Match",
              reason: "Highest-priority gap for PLFS survey automation",
              id: "CRS-IGOT-PY-401",
              tag: "⭐ Critical Gap",
              badgeColor: "bg-rose-950 text-rose-300 border-rose-800",
            },
            {
              title: "Advanced Sampling & Complex Variance Estimation",
              provider: "NSSTA / TPAC",
              match: "91% Match",
              reason: "Essential for NSSO and PLFS estimation algorithms",
              id: "CRS-NSSTA-SMP-502",
              tag: "⭐ Mandatory Cadre",
              badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
            },
            {
              title: "Consumer Price Index (CPI) Inflation Dynamics",
              provider: "iGOT Karmayogi",
              match: "92% Match",
              reason: "Laspeyres aggregation & price collector workflows",
              id: "CRS-IGOT-CPI-210",
              tag: "⭐ Highly Recommended",
              badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onStartCourse(item.id)}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-sky-500/60 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">{item.match}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {item.reason}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-sky-400 font-semibold">
                <span>{item.provider}</span>
                <span className="flex items-center space-x-1 group-hover:translate-x-0.5 transition">
                  <span>Start Course</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "All", label: "All (6,778+ Courses)" },
            { key: "Cadre Mandate", label: "🎯 Cadre Mandated" },
            { key: "Statistical", label: "📊 Statistical Methodology" },
            { key: "Technical", label: "💻 Technical & Data" },
            { key: "Governance", label: "🏛️ Digital Governance" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                categoryFilter === cat.key
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Secondary Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Provider:</span>
        {["All", "iGOT", "NSSTA"].map((prov) => (
          <button
            key={prov}
            onClick={() => setProviderFilter(prov)}
            className={`px-2.5 py-1 rounded-lg transition ${
              providerFilter === prov
                ? "bg-slate-800 text-sky-400 font-bold border border-sky-500/40"
                : "hover:text-white"
            }`}
          >
            {prov === "All" ? t.allProviders : prov === "iGOT" ? "iGOT Karmayogi" : "NSSTA / TPAC"}
          </button>
        ))}

        <span className="text-slate-600 mx-1">•</span>

        <span className="font-semibold text-slate-300">Level:</span>
        {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficultyFilter(diff)}
            className={`px-2.5 py-1 rounded-lg transition ${
              difficultyFilter === diff
                ? "bg-slate-800 text-sky-400 font-bold border border-sky-500/40"
                : "hover:text-white"
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Course Cards Grid with 3D Hover Tilt */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard3D
              key={course.id}
              course={course}
              onStartCourse={onStartCourse}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">No courses match your active filter criteria.</p>
          <button
            onClick={() => {
              setProviderFilter("All");
              setDifficultyFilter("All");
              setCategoryFilter("All");
              setSearchQuery("");
            }}
            className="mt-3 text-xs text-sky-400 hover:underline font-semibold"
          >
            {t.resetFilters}
          </button>
        </div>
      )}

      {/* National Portal Pagination / Catalog Count Footer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing <strong className="text-white">{filteredCourses.length}</strong> prioritized courses out of{" "}
          <strong className="text-sky-400">6,778+</strong> indexed programmes across National Cadres
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
          >
            {t.previous}
          </button>
          <span className="font-mono text-white px-2">Page {page} of 565</span>
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
};
