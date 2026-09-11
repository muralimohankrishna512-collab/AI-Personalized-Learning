import React, { useState } from "react";
import { 
  UserProfile, 
  UserSkill, 
  RoleSkillRequirement, 
  SkillGapItem, 
  Course, 
  LearningRoadmapNode, 
  UserRole, 
  Language, 
  ViewMode 
} from "./types";
import { 
  initialUserProfile, 
  initialUserSkills, 
  statisticalOfficerRequirements as roleRequirements, 
  mockCourses as coursesCatalog, 
  mockRoadmapNodes as initialRoadmapNodes, 
  departmentAnalyticsData as departmentsAnalyticsData,
  calculateSkillGaps
} from "./data/mockData";
import { Navbar } from "./components/common/Navbar";
import { LandingHero } from "./components/learner/LandingHero";
import { LearnerDashboard } from "./components/learner/LearnerDashboard";
import { CompetencyExplorer } from "./components/learner/CompetencyExplorer";
import { RecommendationsView } from "./components/learner/RecommendationsView";
import { LearningRoadmap3D } from "./components/3d/LearningRoadmap3D";
import { AssessmentHub } from "./components/assessment/AssessmentHub";
import { AdminAnalyticsView } from "./components/admin/AdminAnalyticsView";
import { AIAssistantDrawer } from "./components/common/AIAssistantDrawer";
import { AuthModal } from "./components/auth/AuthModal";
import { CheckCircle2, ArrowRight, ExternalLink, X, BookOpen, Clock, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  // State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [userSkills, setUserSkills] = useState<UserSkill[]>(initialUserSkills);
  const [courses, setCourses] = useState<Course[]>(coursesCatalog);
  const [roadmapNodes, setRoadmapNodes] = useState<LearningRoadmapNode[]>(initialRoadmapNodes);

  // Navigation & Preferences
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [userRole, setUserRole] = useState<UserRole>("Learner");
  const [language, setLanguage] = useState<Language>("en");
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Modals & Assistant
  const [selectedSkill, setSelectedSkill] = useState<string | null>("Python");
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // AI Analysis Cache
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);

  // Derive Dynamic Skill Gaps
  const skillGaps: SkillGapItem[] = calculateSkillGaps(userSkills, roleRequirements);

  // Action: Elevate Competency Score (Section 24)
  const handleUpdateCompetencyScore = (skillName: string, newLevel: number, evidence: string) => {
    setUserSkills((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase() === skillName.toLowerCase()) {
          return {
            ...s,
            level: newLevel,
            lastAssessedDate: new Date().toISOString().split("T")[0],
            evidenceOfCompetency: evidence,
          };
        }
        return s;
      })
    );

    // Update overall user profile score
    setUserProfile((prev) => ({
      ...prev,
      overallCompetencyScore: Math.min(100, prev.overallCompetencyScore + 6),
      assessmentAverage: Math.min(100, prev.assessmentAverage + 4),
    }));

    // Update corresponding roadmap node to completed if applicable
    setRoadmapNodes((prev) =>
      prev.map((node) => {
        if (node.skillGained.toLowerCase().includes(skillName.toLowerCase())) {
          return { ...node, status: "completed" as const };
        }
        return node;
      })
    );

    if (!reducedMotion) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  // Action: Trigger Server AI Competency Synthesis
  const handleGenerateAIAnalysis = async () => {
    setIsAnalyzingAI(true);
    try {
      const response = await fetch("/api/ai/analyze-competency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          userSkills,
          roleRequirements,
        }),
      });
      const data = await response.json();
      setAiAnalysisText(data.analysis || data.summary);
    } catch (e) {
      setAiAnalysisText(
        "AI Diagnostic: Official Statistical Officer in Labour Statistics currently possesses strong foundations in Sampling Design and Survey Quality Control (Level 4). Immediate training priority is addressing the Level 2 gap in Python microdata automation and automated tabulations."
      );
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Action: Start / Continue Course Modal
  const handleStartCourse = (courseId: string) => {
    setActiveCourseId(courseId);
  };

  const activeCourse = courses.find((c) => c.id === activeCourseId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        userRole={userRole}
        onSelectRole={setUserRole}
        language={language}
        onSelectLanguage={setLanguage}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => prev === "3d" ? "2d" : "3d")}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(prev => !prev)}
        userProfile={userProfile}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "landing" && (
          <LandingHero
            userSkills={userSkills}
            requirements={roleRequirements}
            skillGaps={skillGaps}
            onSelectSkill={(skill) => {
              setSelectedSkill(skill);
              setCurrentTab("competencies");
            }}
            onStartCourse={handleStartCourse}
            onGetStarted={() => setCurrentTab("dashboard")}
            onExplore={() => setCurrentTab("competencies")}
            language={language}
            reducedMotion={reducedMotion}
          />
        )}

        {currentTab === "dashboard" && (
          <LearnerDashboard
            userProfile={userProfile}
            skillGaps={skillGaps}
            userSkills={userSkills}
            courses={courses}
            roadmapNodes={roadmapNodes}
            onStartCourse={handleStartCourse}
            onNavigateTab={setCurrentTab}
            onSelectSkill={(skill) => {
              setSelectedSkill(skill);
              setCurrentTab("competencies");
            }}
            onGenerateAIAnalysis={handleGenerateAIAnalysis}
            aiAnalysisText={aiAnalysisText}
            isAnalyzingAI={isAnalyzingAI}
            reducedMotion={reducedMotion}
            language={language}
          />
        )}

        {currentTab === "competencies" && (
          <CompetencyExplorer
            userSkills={userSkills}
            requirements={roleRequirements}
            skillGaps={skillGaps}
            courses={courses}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
            onStartCourse={handleStartCourse}
            onTakeAssessment={(skill) => {
              setSelectedSkill(skill);
              setCurrentTab("assessment");
            }}
            reducedMotion={reducedMotion}
            language={language}
          />
        )}

        {currentTab === "recommendations" && (
          <RecommendationsView
            courses={courses}
            onStartCourse={handleStartCourse}
            reducedMotion={reducedMotion}
            language={language}
          />
        )}

        {currentTab === "roadmap" && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white">
                Personalized 3D Statistical Career Roadmap
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Dynamic sequential path from current baseline to Target Role (Senior Statistical Specialist / Data Scientist). Click milestone nodes to inspect prerequisites and launch courses.
              </p>
            </div>
            <LearningRoadmap3D
              nodes={roadmapNodes}
              onStartCourse={handleStartCourse}
              reducedMotion={reducedMotion}
            />
          </div>
        )}

        {currentTab === "assessment" && (
          <AssessmentHub
            userProfile={userProfile}
            onUpdateCompetencyScore={handleUpdateCompetencyScore}
            reducedMotion={reducedMotion}
            language={language}
          />
        )}

        {currentTab === "analytics" && (
          <AdminAnalyticsView
            departments={departmentsAnalyticsData}
            reducedMotion={reducedMotion}
          />
        )}
      </main>

      {/* Course Detail / Start Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveCourseId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="text-sky-400">{activeCourse.provider}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">{activeCourse.matchScore}% Match Score</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{activeCourse.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{activeCourse.description}</p>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5 mb-4 text-xs">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Addresses {activeCourse.targetGapSkill} Skill Gap</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {activeCourse.matchReason}
              </p>
              <div className="flex items-center space-x-4 pt-1 text-slate-400 text-[11px]">
                <span>Duration: <strong className="text-white">{activeCourse.durationHours} Hours</strong></span>
                <span>•</span>
                <span>Level: <strong className="text-white">{activeCourse.difficulty}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5 mb-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Competencies & Outcomes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCourse.skillsCovered.map((s) => (
                  <span key={s} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveCourseId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Mark as completed or in-progress demo action
                  setCourses((prev) =>
                    prev.map((c) =>
                      c.id === activeCourse.id
                        ? { ...c, status: "completed" as const }
                        : c
                    )
                  );
                  handleUpdateCompetencyScore(activeCourse.targetGapSkill, 3, `Completed ${activeCourse.title} on ${activeCourse.provider}`);
                  setActiveCourseId(null);
                }}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition"
              >
                <span>Launch & Complete Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userProfile={userProfile}
        skillGaps={skillGaps}
        onSelectSkill={(s) => {
          setSelectedSkill(s);
          setCurrentTab("competencies");
          setIsAssistantOpen(false);
        }}
        onStartCourse={(cId) => {
          handleStartCourse(cId);
          setIsAssistantOpen(false);
        }}
        reducedMotion={reducedMotion}
        language={language}
      />

      {/* 3D Government Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectRole={(r) => {
          setUserRole(r || "Learner");
          setCurrentTab("dashboard");
        }}
        currentRole={userRole}
      />

      {/* Official Government of India Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-medium">
              Ministry of Statistics and Programme Implementation (MoSPI)
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>NSSTA Training Wing</span>
            <span>•</span>
            <span>Mission Karmayogi Bharat</span>
            <span>•</span>
            <span>Official Statistical Framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
