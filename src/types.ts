export type UserRole = "Learner" | "Trainer" | "Admin";
export type Language = "en" | "hi" | "te";
export type ViewMode = "3d" | "2d";

export type SkillCategory = 
  | "Statistical" 
  | "Technical" 
  | "Digital Governance" 
  | "Behavioural";

export type GapPriority = "Critical" | "High" | "Medium" | "Low" | "No Gap";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  domain: string;
}

export interface UserSkill {
  skillId: string;
  name: string;
  category: SkillCategory;
  level: number; // 0 to 5
  lastAssessedDate?: string;
  assessedScore?: number;
}

export interface RoleSkillRequirement {
  skillId: string;
  name: string;
  requiredLevel: number; // 0 to 5
  priority: "Mandatory" | "Optional";
}

export interface SkillGapItem {
  skillId: string;
  name: string;
  category: SkillCategory;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: GapPriority;
  rationale?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  jobRole: string;
  currentAssignment: string;
  educationalQualification: string;
  experienceYears: number;
  careerGoal: string;
  preferredLanguage: string;
  avatarUrl?: string;
  role: UserRole;
  overallCompetencyScore: number; // 0 - 100 percentage
  completedCoursesCount: number;
  learningHours: number;
  learningStreakDays: number;
  assessmentAverage: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: "iGOT Karmayogi" | "NSSTA / TPAC" | "MoSPI Learning Portal";
  category: string;
  skillsCovered: string[];
  targetGapSkill: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationHours: number;
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  matchScore: number; // percentage e.g. 92%
  matchReason: string;
  url: string;
  isMock: boolean;
  status: "not-started" | "in-progress" | "completed";
  progressPercent: number;
  bannerGradient: string;
}

export interface LearningRoadmapNode {
  id: string;
  stage: number;
  title: string;
  subtitle: string;
  courseId: string;
  skillGained: string;
  duration: string;
  matchScore: number;
  status: "completed" | "in-progress" | "upcoming";
  description: string;
  provider: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  competency: string;
  topic: string;
  source_reference: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  competencyScores: Record<string, number>;
  feedback?: {
    overallFeedback: string;
    strengths: string[];
    areasForImprovement: string[];
    competencyUpdateAdvice: string;
    nextRecommendedCourse?: {
      title: string;
      provider: string;
      reason: string;
    };
  };
}

export interface CompetencyHistoryItem {
  id: string;
  date: string;
  skill: string;
  previousLevel: number;
  newLevel: number;
  evidence: string;
  confidence: string;
}

export interface DepartmentAnalytics {
  department: string;
  totalEmployees: number;
  activeLearners: number;
  avgCompetency: number;
  skillGaps: { skill: string; gapPercent: number }[];
  topNeed: string;
}

export interface EmergingSkill {
  name: string;
  category: string;
  currentReadiness: number; // 0 to 100
  requiredReadiness: number; // 0 to 100
  futureDemand: "Very High" | "High" | "Moderate";
  growthRate: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: "open-course" | "view-gap" | "take-quiz";
    payload?: string;
  };
}
