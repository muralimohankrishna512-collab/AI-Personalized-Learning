import { Language } from "../types";

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  getStarted: string;
  explorePlatform: string;
  
  // Navigation Tabs
  overview: string;
  dashboard: string;
  competencySphere: string;
  skillGaps: string;
  recommendations: string;
  learningPath: string;
  assessments: string;
  aiAssistant: string;
  adminAnalytics: string;

  // Header / Common
  overallCompetency: string;
  completedCourses: string;
  learningHours: string;
  streakDays: string;
  assessmentAverage: string;
  levelScale: string;
  startCourse: string;
  continueLearning: string;
  uploadDocument: string;
  generateQuiz: string;
  takeQuiz: string;
  reducedMotion: string;
  viewMode3D: string;
  viewMode2D: string;
  close: string;
  cancel: string;
  submit: string;
  previous: string;
  next: string;
  search: string;
  filter: string;
  all: string;
  role: string;
  department: string;
  loginPortal: string;
  backToTop: string;

  // User Profile / Dashboard
  welcome: string;
  assignedTo: string;
  employeeId: string;
  careerTarget: string;
  activeStreak: string;
  assessmentAvg: string;
  aiAnalysisTitle: string;
  refreshAI: string;
  synthesizing: string;
  viewAll: string;
  currentAssessed: string;
  requiredForRole: string;
  activeRoadmapStage: string;
  stageNumber: string;
  courseProgress: string;
  launchCourseModule: string;
  openRoadmap: string;
  recommendedCoursesTitle: string;
  recommendedCoursesSubtitle: string;
  gapPriorityCritical: string;
  gapPriorityHigh: string;
  gapPriorityMedium: string;
  provider: string;
  targetCompetency: string;

  // 3D Model Course Navigation & Competency Explorer
  sphereTitle: string;
  sphereSubtitle: string;
  typeCoursePrompt: string;
  goToCourse: string;
  orbitHint: string;
  clickToInspect: string;
  criticalGap: string;
  mediumGap: string;
  mastered: string;
  searchSkills: string;
  officialBenchmark: string;
  whySkillMatters: string;
  takeSkillQuiz: string;
  skillComparisonTowers: string;
  targetRoleGaps: string;
  allCategories: string;
  technicalSkills: string;
  domainSkills: string;
  leadershipSkills: string;
  currentVsRequired: string;

  // Course Recommendations & iGOT Catalog
  courseCatalogTitle: string;
  courseCatalogSubtitle: string;
  totalCoursesCount: string;
  govEmployeeNotice: string;
  govCadreBadge: string;
  annualCPDRequirement: string;
  mandatoryCourses: string;
  matchScore: string;
  duration: string;
  hours: string;
  launchCourse: string;
  resetFilters: string;
  allProviders: string;
  allLevels: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  sortByMatch: string;
  sortByDuration: string;
  skillsCovered: string;

  // Assessment Hub
  assessmentTitle: string;
  assessmentSubtitle: string;
  tabUpload: string;
  tabReview: string;
  tabTake: string;
  tabResults: string;
  aiDocAnalysis: string;
  aiRecommendQuestions: string;
  selectQuestionCount: string;
  quickCheck: string;
  standardRecommended: string;
  comprehensive: string;
  masteryTest: string;
  adaptiveDifficultyTitle: string;
  adaptiveDifficultyDesc: string;
  generateCustomAssessment: string;
  timeLeft: string;
  adaptiveTierBadge: string;
  revealMethodology: string;
  returnToQuestion: string;
  totalScore: string;
  percentage: string;
  status: string;
  grade: string;
  passedDistinction: string;
  passedMerit: string;
  passedCompetent: string;
  requiresRevision: string;
  retestRecommended: string;
  applyUpgrade: string;
  upgradeSuccess: string;
  retakeAssessment: string;
  uploadAnother: string;

  // Admin Analytics & TNA
  adminAnalyticsTitle: string;
  adminAnalyticsSubtitle: string;
  exportCSV: string;
  downloadedReport: string;
  totalOfficers: string;
  overallIndex: string;
  cpdCompliance: string;
  criticalGapsCount: string;
  departmentReadiness: string;
  topSkillGaps: string;

  // Learning Roadmap
  roadmapTitle: string;
  roadmapSubtitle: string;
  stageCompleted: string;
  stageInProgress: string;
  stageLocked: string;

  // Auth Modal & Footer
  authModalTitle: string;
  authModalSubtitle: string;
  selectRole: string;
  learnerRole: string;
  trainerRole: string;
  adminRole: string;
  cancelBtn: string;
  confirmRole: string;
  officialGovIndia: string;
  trainingWing: string;
  missionKarmayogi: string;
  statisticalFramework: string;

  // AI Assistant Drawer
  advisorTitle: string;
  advisorSubtitle: string;
  askAnything: string;
  send: string;
  quickPrompt1: string;
  quickPrompt2: string;
  quickPrompt3: string;
  quickPrompt4: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "AI Skill Intelligence & Personalized Learning Platform",
    appSubtitle: "Ministry of Statistics & Programme Implementation (MoSPI), Government of India",
    heroTitle: "AI-Powered Skill Intelligence for a Future-Ready Statistical Workforce",
    heroSubtitle: "Assess. Identify. Learn. Improve.",
    getStarted: "Get Started",
    explorePlatform: "Explore Platform",

    overview: "Overview",
    dashboard: "Learner Hub",
    competencySphere: "3D Skills Sphere",
    skillGaps: "Skills to Improve",
    recommendations: "Courses (6,778+)",
    learningPath: "Learning Roadmap",
    assessments: "AI Practice & Quizzes",
    aiAssistant: "AI Helper & Guide",
    adminAnalytics: "Reports & Staff Progress",

    overallCompetency: "Overall Skill Level",
    completedCourses: "Completed Courses",
    learningHours: "Learning Hours",
    streakDays: "Day Streak",
    assessmentAverage: "Quiz Average Score",
    levelScale: "Skill Level (0: None, 1: Beginner, 2: Basic, 3: Intermediate, 4: Advanced, 5: Expert)",
    startCourse: "Start Course",
    continueLearning: "Continue Learning",
    uploadDocument: "Upload Study Manual / Document",
    generateQuiz: "Generate AI Practice Quiz",
    takeQuiz: "Take Skill Quiz",
    reducedMotion: "Reduced Motion",
    viewMode3D: "3D View",
    viewMode2D: "Simple List View",
    close: "Close",
    cancel: "Cancel",
    submit: "Submit Quiz",
    previous: "Previous",
    next: "Next",
    search: "Search courses, skills, or survey topics...",
    filter: "Filter",
    all: "All",
    role: "Job Role",
    department: "Department",
    loginPortal: "Government Officer Login",
    backToTop: "Back to Top",

    welcome: "Welcome, ",
    assignedTo: "Assigned to: ",
    employeeId: "Employee ID: ",
    careerTarget: "Career Target: ",
    activeStreak: "Active Streak",
    assessmentAvg: "Assessment Avg",
    aiAnalysisTitle: "AI Skill Diagnostic & Improvement Plan",
    refreshAI: "Refresh AI Analysis",
    synthesizing: "Synthesizing...",
    viewAll: "View All",
    currentAssessed: "Current Assessed: ",
    requiredForRole: "Required for Role: ",
    activeRoadmapStage: "Active Learning Stage",
    stageNumber: "Stage",
    courseProgress: "Course Progress: ",
    launchCourseModule: "Launch Course Module",
    openRoadmap: "Open Complete Roadmap",
    recommendedCoursesTitle: "Recommended Courses (iGOT & NSSTA)",
    recommendedCoursesSubtitle: "Matching your top skill gaps against official certified learning modules",
    gapPriorityCritical: "Critical Gap",
    gapPriorityHigh: "High Gap",
    gapPriorityMedium: "Medium Gap",
    provider: "Provider",
    targetCompetency: "Target Competency",

    sphereTitle: "Interactive 3D Skills Sphere",
    sphereSubtitle: "Explore your official skills and click any sphere to view or launch courses",
    typeCoursePrompt: "Type a skill or course (e.g. Python, Sampling, ML)...",
    goToCourse: "Open Course",
    orbitHint: "Drag to rotate • Click any sphere to view course details",
    clickToInspect: "Click to see course details",
    criticalGap: "Critical Skill (Needs 2+ Levels)",
    mediumGap: "Medium Skill (Needs 1 Level)",
    mastered: "On Target / Mastered",
    searchSkills: "Search skills (e.g., Python, Sampling, ML)...",
    officialBenchmark: "Official Role Benchmark",
    whySkillMatters: "Why This Skill Matters: ",
    takeSkillQuiz: "Take Skill Quiz",
    skillComparisonTowers: "Skill Level Comparison",
    targetRoleGaps: "Skills You Need to Improve",
    allCategories: "All Categories",
    technicalSkills: "Technical Skills",
    domainSkills: "Domain Knowledge",
    leadershipSkills: "Leadership & Management",
    currentVsRequired: "Current Level vs Required Level",

    courseCatalogTitle: "Recommended Courses & Training",
    courseCatalogSubtitle: "Matching the skills you need against 6,778+ courses across iGOT Karmayogi & NSSTA",
    totalCoursesCount: "6,778+ Government Courses Available on iGOT Karmayogi & NSSTA",
    govEmployeeNotice: "Recommended for Government Officers: Statistical Officer (MoSPI / SSS)",
    govCadreBadge: "Official MoSPI Mandate",
    annualCPDRequirement: "Mission Karmayogi Goal: 40 Hours of Annual Training",
    mandatoryCourses: "Required Courses for Your Role",
    matchScore: "Match Score",
    duration: "Duration",
    hours: "Hours",
    launchCourse: "Start Course on iGOT",
    resetFilters: "Reset Filters",
    allProviders: "All Providers",
    allLevels: "All Levels",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    sortByMatch: "Sort by Match Score",
    sortByDuration: "Sort by Duration",
    skillsCovered: "Skills Covered",

    assessmentTitle: "Official Statistics Skill Quizzes & Tests",
    assessmentSubtitle: "Upload any document to create practice questions with a live timer & smart question difficulty",
    tabUpload: "1. Upload & Settings",
    tabReview: "2. Review Questions",
    tabTake: "3. Live Quiz",
    tabResults: "4. Test Results",
    aiDocAnalysis: "AI Document Analysis & Word Count",
    aiRecommendQuestions: "AI Recommendation: 10 questions is ideal for quick and thorough practice.",
    selectQuestionCount: "How many questions would you like?",
    quickCheck: "5 Questions (Quick Check • ~7.5 Mins)",
    standardRecommended: "10 Questions (⭐ Recommended • ~15 Mins)",
    comprehensive: "15 Questions (In-Depth • ~22.5 Mins)",
    masteryTest: "20 Questions (Mastery Test • ~30 Mins)",
    adaptiveDifficultyTitle: "Smart Difficulty Active (Questions adjust to your score)",
    adaptiveDifficultyDesc: "Questions automatically become simpler or more challenging based on your answers.",
    generateCustomAssessment: "Create My Practice Quiz",
    timeLeft: "Time Remaining",
    adaptiveTierBadge: "Question Difficulty",
    revealMethodology: "Show Official Answer & Simple Guide (3D Flip)",
    returnToQuestion: "Return to Question",
    totalScore: "Total Score",
    percentage: "Score Percentage",
    status: "Quiz Status",
    grade: "Grade",
    passedDistinction: "OUTSTANDING (Grade: A+)",
    passedMerit: "PASSED WITH MERIT (Grade: A)",
    passedCompetent: "PASSED / SKILLED (Grade: B)",
    requiresRevision: "NEEDS PRACTICE (Grade: C)",
    retestRecommended: "RECOMMENDED TO RETAKE (Grade: D)",
    applyUpgrade: "Promote My Official Skill Level",
    upgradeSuccess: "✓ Skill Level Promoted & Updated Successfully!",
    retakeAssessment: "Retake Quiz",
    uploadAnother: "Upload Another Document",

    adminAnalyticsTitle: "National Statistical Team Skills & Training Reports",
    adminAnalyticsSubtitle: "Staff skills overview across National Accounts, Labour, Prices, Agriculture, and Field Operations.",
    exportCSV: "Export Report (CSV)",
    downloadedReport: "Downloaded Training Report",
    totalOfficers: "Total Officers",
    overallIndex: "Overall Competency Index",
    cpdCompliance: "CPD 40-Hour Compliance",
    criticalGapsCount: "Critical Gaps Identified",
    departmentReadiness: "Department Readiness",
    topSkillGaps: "Top Skill Gaps",

    roadmapTitle: "Personalized Statistical Career Roadmap",
    roadmapSubtitle: "Dynamic sequential path from current baseline to Target Role (Senior Statistical Specialist).",
    stageCompleted: "Completed",
    stageInProgress: "In Progress",
    stageLocked: "Upcoming Milestone",

    authModalTitle: "Government Officer Portal Sign-In",
    authModalSubtitle: "Select your cadre profile to view personalized skill mappings and training recommendations.",
    selectRole: "Select Profile Role",
    learnerRole: "Learner (Statistical Officer)",
    trainerRole: "Training Manager (NSSTA)",
    adminRole: "Ministry Administrator (MoSPI)",
    cancelBtn: "Cancel",
    confirmRole: "Confirm Role",
    officialGovIndia: "Government of India | Ministry of Statistics and Programme Implementation (MoSPI)",
    trainingWing: "NSSTA Training Wing",
    missionKarmayogi: "Mission Karmayogi Bharat",
    statisticalFramework: "Official Statistical Framework",

    advisorTitle: "Sankhya-AI Learning Helper & Guide",
    advisorSubtitle: "24/7 Intelligent Guide for Official Statistics & Platform Help",
    askAnything: "Ask any question or ask how to use any part of this platform...",
    send: "Send",
    quickPrompt1: "🧭 Show me around this platform",
    quickPrompt2: "🎯 Which courses should I take first?",
    quickPrompt3: "📝 How does the quiz generator work?",
    quickPrompt4: "📊 Explain CPI price index formulas simply",
  },
  hi: {
    appName: "आधिकारिक सांख्यिकी हेतु एआई कौशल एवं शिक्षण मंच",
    appSubtitle: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकार",
    heroTitle: "भविष्य-उन्मुख सांख्यिकी कार्यबल हेतु आसान एआई कौशल मंच",
    heroSubtitle: "कौशल परखें। सुधारें। ऑनलाइन सीखें। आगे बढ़ें।",
    getStarted: "शुरू करें",
    explorePlatform: "मंच देखें",

    overview: "अवलोकन",
    dashboard: "अधिकारी डैशबोर्ड",
    competencySphere: "3D कौशल क्षेत्र",
    skillGaps: "सुधारने योग्य कौशल",
    recommendations: "पाठ्यक्रम (6,778+)",
    learningPath: "सीखने का रोडमैप",
    assessments: "एआई अभ्यास एवं क्विज़",
    aiAssistant: "एआई सहायक एवं मार्गदर्शक",
    adminAnalytics: "रिपोर्ट एवं कार्मिक प्रगति",

    overallCompetency: "समग्र कौशल स्तर",
    completedCourses: "पूर्ण किए गए पाठ्यक्रम",
    learningHours: "शिक्षण घंटे",
    streakDays: "लगातार अध्ययन (दिन)",
    assessmentAverage: "औसत क्विज़ अंक",
    levelScale: "कौशल पैमाना (0: शून्य, 1: शुरुआती, 2: बुनियादी, 3: मध्यम, 4: उन्नत, 5: विशेषज्ञ)",
    startCourse: "कोर्स शुरू करें",
    continueLearning: "अध्ययन जारी रखें",
    uploadDocument: "अध्ययन सामग्री / दस्तावेज़ अपलोड करें",
    generateQuiz: "एआई अभ्यास क्विज़ बनाएं",
    takeQuiz: "कौशल क्विज़ दें",
    reducedMotion: "धीमी गति",
    viewMode3D: "3D दृश्य",
    viewMode2D: "सरल सूची दृश्य",
    close: "बंद करें",
    cancel: "रद्द करें",
    submit: "क्विज़ जमा करें",
    previous: "पिछला",
    next: "अगला",
    search: "कोर्स, कौशल या सांख्यिकी विषय खोजें...",
    filter: "फ़िल्टर",
    all: "सभी",
    role: "पद / भूमिका",
    department: "प्रभाग / विभाग",
    loginPortal: "शासकीय अधिकारी लॉगिन",
    backToTop: "शीर्ष पर जाएं",

    welcome: "स्वागत है, ",
    assignedTo: "वर्तमान तैनाती: ",
    employeeId: "कर्मचारी आईडी: ",
    careerTarget: "लक्ष्य पद: ",
    activeStreak: "सक्रिय अध्ययन",
    assessmentAvg: "औसत क्विज़ अंक",
    aiAnalysisTitle: "एआई कौशल विश्लेषण एवं सुधार योजना",
    refreshAI: "एआई विश्लेषण ताज़ा करें",
    synthesizing: "विश्लेषण हो रहा है...",
    viewAll: "सभी देखें",
    currentAssessed: "वर्तमान स्तर: ",
    requiredForRole: "पद हेतु आवश्यक: ",
    activeRoadmapStage: "सक्रिय अध्ययन चरण",
    stageNumber: "चरण",
    courseProgress: "कोर्स प्रगति: ",
    launchCourseModule: "कोर्स शुरू करें",
    openRoadmap: "पूरा रोडमैप देखें",
    recommendedCoursesTitle: "अनुशंसित पाठ्यक्रम (iGOT एवं NSSTA)",
    recommendedCoursesSubtitle: "आपके मुख्य कौशल सुधारों के अनुरूप सरकारी प्रमाणित पाठ्यक्रम",
    gapPriorityCritical: "अत्यंत आवश्यक",
    gapPriorityHigh: "उच्च प्राथमिकता",
    gapPriorityMedium: "मध्यम प्राथमिकता",
    provider: "संस्थान / प्रदाता",
    targetCompetency: "लक्षित कौशल",

    sphereTitle: "इंटरैक्टिव 3D कौशल क्षेत्र",
    sphereSubtitle: "अपने आधिकारिक कौशल देखें और कोर्स खोलने हेतु किसी भी गोले पर क्लिक करें",
    typeCoursePrompt: "कौशल या कोर्स टाइप करें (उदा. पायथन, सैंपलिंग, एमएल)...",
    goToCourse: "कोर्स खोलें",
    orbitHint: "घुमाने हेतु खींचें • विवरण देखने हेतु किसी भी गोले पर क्लिक करें",
    clickToInspect: "कोर्स विवरण देखने हेतु क्लिक करें",
    criticalGap: "अत्यंत आवश्यक कौशल (2+ स्तर आवश्यक)",
    mediumGap: "सुधार योग्य कौशल (1 स्तर आवश्यक)",
    mastered: "मानक अनुसार / दक्ष",
    searchSkills: "कौशल खोजें (उदा. पायथन, सैंपलिंग, एमएल)...",
    officialBenchmark: "आधिकारिक पद मानक",
    whySkillMatters: "यह कौशल क्यों आवश्यक है: ",
    takeSkillQuiz: "कौशल क्विज़ दें",
    skillComparisonTowers: "कौशल स्तर तुलना",
    targetRoleGaps: "सुधार हेतु आवश्यक कौशल",
    allCategories: "सभी श्रेणियां",
    technicalSkills: "तकनीकी कौशल",
    domainSkills: "सांख्यिकी विषय ज्ञान",
    leadershipSkills: "नेतृत्व एवं प्रबंधन",
    currentVsRequired: "वर्तमान स्तर बनाम आवश्यक स्तर",

    courseCatalogTitle: "अनुशंसित पाठ्यक्रम एवं प्रशिक्षण",
    courseCatalogSubtitle: "iGOT कर्मयोगी एवं NSSTA के 6,778+ पाठ्यक्रमों में से उपयुक्त चयन",
    totalCoursesCount: "iGOT कर्मयोगी एवं NSSTA पर 6,778+ सरकारी पाठ्यक्रम उपलब्ध",
    govEmployeeNotice: "शासकीय अधिकारियों हेतु अनुशंसित: सांख्यिकी अधिकारी (MoSPI / SSS)",
    govCadreBadge: "आधिकारिक MoSPI अधिदेश",
    annualCPDRequirement: "मिशन कर्मयोगी लक्ष्य: वार्षिक 40 घंटे अनिवार्य प्रशिक्षण",
    mandatoryCourses: "आपके पद हेतु अनिवार्य पाठ्यक्रम",
    matchScore: "प्रासंगिकता स्कोर",
    duration: "अवधि",
    hours: "घंटे",
    launchCourse: "iGOT पर कोर्स शुरू करें",
    resetFilters: "फ़िल्टर हटाएं",
    allProviders: "सभी प्रदाता",
    allLevels: "सभी स्तर",
    beginner: "शुरुआती",
    intermediate: "मध्यम",
    advanced: "उन्नत",
    sortByMatch: "प्रासंगिकता अनुसार",
    sortByDuration: "अवधि अनुसार",
    skillsCovered: "शामिल कौशल",

    assessmentTitle: "आधिकारिक सांख्यिकी कौशल परीक्षा एवं अभ्यास",
    assessmentSubtitle: "दस्तावेज़ अपलोड कर लाइव टाइमर और अनुकूलित प्रश्नों के साथ अभ्यास करें",
    tabUpload: "1. अपलोड एवं सेटिंग्स",
    tabReview: "2. प्रश्न समीक्षा",
    tabTake: "3. लाइव क्विज़",
    tabResults: "4. परीक्षा परिणाम",
    aiDocAnalysis: "एआई दस्तावेज़ विश्लेषण एवं शब्द गणना",
    aiRecommendQuestions: "एआई सलाह: त्वरित एवं प्रभावी अभ्यास हेतु 10 प्रश्न आदर्श हैं।",
    selectQuestionCount: "आप कितने प्रश्न चाहते हैं?",
    quickCheck: "5 प्रश्न (त्वरित जांच • ~7.5 मिनट)",
    standardRecommended: "10 प्रश्न (⭐ अनुशंसित मानक • ~15 मिनट)",
    comprehensive: "15 प्रश्न (विस्तृत अभ्यास • ~22.5 मिनट)",
    masteryTest: "20 प्रश्न (दक्षता परीक्षा • ~30 मिनट)",
    adaptiveDifficultyTitle: "स्मार्ट कठिनाई स्तर सक्रिय (प्रश्नों का स्तर आपके अंकों अनुसार बदलता है)",
    adaptiveDifficultyDesc: "आपके सही या गलत उत्तरों के आधार पर प्रश्नों का स्तर सरल या चुनौतीपूर्ण होता है।",
    generateCustomAssessment: "मेरा अभ्यास क्विज़ बनाएं",
    timeLeft: "शेष समय",
    adaptiveTierBadge: "प्रश्न स्तर",
    revealMethodology: "सही उत्तर एवं सरल व्याख्या देखें (3D फ्लिप)",
    returnToQuestion: "प्रश्न पर वापस जाएं",
    totalScore: "कुल अंक",
    percentage: "प्राप्तांक प्रतिशत",
    status: "क्विज़ स्थिति",
    grade: "ग्रेड",
    passedDistinction: "उत्कृष्ट प्रदर्शन (ग्रेड: A+)",
    passedMerit: "मेरिट के साथ उत्तीर्ण (ग्रेड: A)",
    passedCompetent: "सफलतापूर्वक उत्तीर्ण (ग्रेड: B)",
    requiresRevision: "पुनः अभ्यास आवश्यक (ग्रेड: C)",
    retestRecommended: "दोबारा परीक्षा अनुशंसित (ग्रेड: D)",
    applyUpgrade: "आधिकारिक कौशल स्तर पदोन्नत करें",
    upgradeSuccess: "✓ कौशल स्तर सफलतापूर्वक पदोन्नत एवं अद्यतित किया गया!",
    retakeAssessment: "क्विज़ पुनः दें",
    uploadAnother: "अन्य दस्तावेज़ अपलोड करें",

    adminAnalyticsTitle: "राष्ट्रीय सांख्यिकी कार्यबल कौशल एवं प्रशिक्षण रिपोर्ट",
    adminAnalyticsSubtitle: "राष्ट्रीय लेखा, श्रम, मूल्य, कृषि एवं क्षेत्रीय कार्य प्रभागों की समग्र कौशल स्थिति।",
    exportCSV: "रिपोर्ट डाउनलोड करें (CSV)",
    downloadedReport: "प्रशिक्षण रिपोर्ट डाउनलोड हुई",
    totalOfficers: "कुल अधिकारी",
    overallIndex: "समग्र दक्षता सूचकांक",
    cpdCompliance: "40-घंटे प्रशिक्षण अनुपालन",
    criticalGapsCount: "चिह्नित मुख्य कौशल कमियां",
    departmentReadiness: "प्रभाग तत्परता",
    topSkillGaps: "प्रमुख कौशल कमियां",

    roadmapTitle: "व्यक्तिगत सांख्यिकी करियर रोडमैप",
    roadmapSubtitle: "वर्तमान स्तर से वरिष्ठ सांख्यिकी अधिकारी पद तक का स्पष्ट चरणबद्ध मार्ग।",
    stageCompleted: "पूर्ण",
    stageInProgress: "प्रगति पर",
    stageLocked: "आगामी चरण",

    authModalTitle: "शासकीय अधिकारी पोर्टल लॉगिन",
    authModalSubtitle: "व्यक्तिगत कौशल मैपिंग और प्रशिक्षण सिफारिशें देखने हेतु अपना पद चुनें।",
    selectRole: "पद / प्रोफाइल चुनें",
    learnerRole: "शिक्षार्थी (सांख्यिकी अधिकारी)",
    trainerRole: "प्रशिक्षण प्रबंधक (NSSTA)",
    adminRole: "मंत्रालय प्रशासक (MoSPI)",
    cancelBtn: "रद्द करें",
    confirmRole: "पद पुष्टि करें",
    officialGovIndia: "भारत सरकार | सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)",
    trainingWing: "एनएसएसटीए प्रशिक्षण विंग",
    missionKarmayogi: "मिशन कर्मयोगी भारत",
    statisticalFramework: "आधिकारिक सांख्यिकी ढांचा",

    advisorTitle: "संख्या-एआई शिक्षण सहायक एवं मार्गदर्शक",
    advisorSubtitle: "24/7 आधिकारिक सांख्यिकी एवं मंच संचालन हेतु बुद्धिमान सहायक",
    askAnything: "कोई भी प्रश्न पूछें या मंच के किसी भी भाग के उपयोग में सहायता लें...",
    send: "भेजें",
    quickPrompt1: "🧭 मुझे इस मंच की पूरी जानकारी दें",
    quickPrompt2: "🎯 मुझे सबसे पहले कौन से कोर्स करने चाहिए?",
    quickPrompt3: "📝 क्विज़ जनरेटर कैसे काम करता है?",
    quickPrompt4: "📊 सीपीआई मुद्रास्फीति सूचकांक सूत्र सरलता से समझाएं",
  },
  te: {
    appName: "అధికారిక గణాంకాల కొరకు AI నైపుణ్య & అభ్యాస వేదిక",
    appSubtitle: "గణాంకాలు మరియు కార్యక్రమ అమలు మంత్రిత్వ శాఖ (MoSPI), భారత ప్రభుత్వం",
    heroTitle: "భవిష్యత్ సన్నద్ధ గణాంక సిబ్బంది కొరకు AI ఆధారిత నైపుణ్య వేదిక",
    heroSubtitle: "నైపుణ్యాలు తెలుసుకోండి. మెరుగుపరచండి. ఆన్‌లైన్‌లో నేర్చుకోండి. ఎదగండి.",
    getStarted: "ప్రారంభించండి",
    explorePlatform: "ప్లాట్‌ఫారమ్‌ను చూడండి",

    overview: "అవలోకనం",
    dashboard: "లెర్నర్ డ్యాష్‌బోర్డ్",
    competencySphere: "3D నైపుణ్యాల గోళం",
    skillGaps: "సులభంగా మెరుగుపరిచే నైపుణ్యాలు",
    recommendations: "కోర్సులు (6,778+)",
    learningPath: "అభ్యాస రోడ్‌మ్యాప్",
    assessments: "AI ప్రాక్టీస్ & క్విజ్‌లు",
    aiAssistant: "AI సహాయకుడు & మార్గదర్శి",
    adminAnalytics: "నివేదికలు & సిబ్బంది పురోగతి",

    overallCompetency: "మొత్తం నైపుణ్య స్థాయి",
    completedCourses: "పూర్తయిన కోర్సులు",
    learningHours: "నేర్చుకున్న గంటలు",
    streakDays: "యాక్టివ్ రోజులు (స్ట్రీక్)",
    assessmentAverage: "క్విజ్ సగటు స్కోరు",
    levelScale: "నైపుణ్య స్థాయి (0: ఏమీ లేదు, 1: ప్రారంభం, 2: ప్రాథమిక, 3: మధ్యస్థ, 4: అధునాతన, 5: నిపుణుడు)",
    startCourse: "కోర్సు ప్రారంభించండి",
    continueLearning: "నేర్చుకోవడం కొనసాగించండి",
    uploadDocument: "అధ్యయన పత్రం / మాన్యువల్ అప్‌లోడ్ చేయండి",
    generateQuiz: "AI ప్రాక్టీస్ క్విజ్ తయారు చేయండి",
    takeQuiz: "నైపుణ్య పరీక్ష రాయండి",
    reducedMotion: "తక్కువ కదలిక",
    viewMode3D: "3D వీక్షణ",
    viewMode2D: "సులభ జాబితా వీక్షణ",
    close: "మూసివేయి",
    cancel: "రద్దు చేయి",
    submit: "క్విజ్ సమర్పించండి",
    previous: "మునుపటి",
    next: "తరువాతి",
    search: "కోర్సులు, నైపుణ్యాలు లేదా గణాంక అంశాలను శోధించండి...",
    filter: "ఫిల్టర్",
    all: "అన్నీ",
    role: "ఉద్యోగ పాత్ర",
    department: "విభాగం",
    loginPortal: "ప్రభుత్వ అధికారి లాగిన్",
    backToTop: "పైకి వెళ్ళండి",

    welcome: "స్వాగతం, ",
    assignedTo: "ప్రస్తుత విభాగం: ",
    employeeId: "ఉద్యోగి ఐడీ: ",
    careerTarget: "కెరీర్ లక్ష్యం: ",
    activeStreak: "యాక్టివ్ రోజులు",
    assessmentAvg: "సగటు పరీక్ష స్కోరు",
    aiAnalysisTitle: "AI నైపుణ్య విశ్లేషణ & మెరుగుదల ప్రణాళిక",
    refreshAI: "AI విశ్లేషణ రిఫ్రెష్ చేయండి",
    synthesizing: "విశ్లేషిస్తోంది...",
    viewAll: "అన్నీ చూడండి",
    currentAssessed: "ప్రస్తుత స్థాయి: ",
    requiredForRole: "పాత్రకు అవసరమైనది: ",
    activeRoadmapStage: "ప్రస్తుత అభ్యాస దశ",
    stageNumber: "దశ",
    courseProgress: "కోర్సు పురోగతి: ",
    launchCourseModule: "కోర్సు ప్రారంభించండి",
    openRoadmap: "పూర్తి రోడ్‌మ్యాప్ చూడండి",
    recommendedCoursesTitle: "సిఫార్సు చేసిన కోర్సులు (iGOT & NSSTA)",
    recommendedCoursesSubtitle: "మీ ముఖ్య నైపుణ్యాల కొరకు అధికారిక సర్టిఫైడ్ అభ్యాస కోర్సులు",
    gapPriorityCritical: "అత్యంత ముఖ్యం",
    gapPriorityHigh: "అధిక ప్రాధాన్యత",
    gapPriorityMedium: "మధ్యస్థ ప్రాధాన్యత",
    provider: "సంస్థ / ప్రొవైడర్",
    targetCompetency: "లక్ష్య నైపుణ్యం",

    sphereTitle: "ఇంటరాక్టివ్ 3D నైపుణ్యాల గోళం",
    sphereSubtitle: "మీ అధికారిక నైపుణ్యాలను చూడండి మరియు కోర్సు తెరవడానికి ఏదైనా గోళంపై క్లిక్ చేయండి",
    typeCoursePrompt: "నైపుణ్యం లేదా కోర్సు పేరు రాయండి (ఉదా: Python, Sampling, ML)...",
    goToCourse: "కోర్సు తెరవండి",
    orbitHint: "తిప్పడానికి డ్రాగ్ చేయండి • వివరాలు చూడటానికి క్లిక్ చేయండి",
    clickToInspect: "కోర్సు వివరాలు చూడటానికి క్లిక్ చేయండి",
    criticalGap: "ముఖ్యమైన నైపుణ్యం (2+ స్థాయిలు అవసరం)",
    mediumGap: "సిఫార్సు చేసిన నైపుణ్యం (1 స్థాయి అవసరం)",
    mastered: "లక్ష్యం చేరారు / నిపుణులు",
    searchSkills: "నైపుణ్యాలను శోధించండి (ఉదా: Python, Sampling, ML)...",
    officialBenchmark: "అధికారిక ఉద్యోగ ప్రమాణాలు",
    whySkillMatters: "ఈ నైపుణ్యం ఎందుకు ముఖ్యం: ",
    takeSkillQuiz: "నైపుణ్య క్విజ్ తీసుకోండి",
    skillComparisonTowers: "నైపుణ్య స్థాయిల పోలిక",
    targetRoleGaps: "మీరు మెరుగుపరుచుకోవలసిన నైపుణ్యాలు",
    allCategories: "అన్ని రకాలు",
    technicalSkills: "సాంకేతిక నైపుణ్యాలు",
    domainSkills: "గణాంక విషయ పరిజ్ఞానం",
    leadershipSkills: "నాయకత్వం & నిర్వహణ",
    currentVsRequired: "ప్రస్తుత స్థాయి వర్సెస్ అవసరమైన స్థాయి",

    courseCatalogTitle: "సిఫార్సు చేసిన కోర్సులు & శిక్షణ",
    courseCatalogSubtitle: "iGOT కర్మయోగి & NSSTA లోని 6,778+ కోర్సుల నుండి మీ కొరకు కోర్సులు",
    totalCoursesCount: "iGOT కర్మయోగి & NSSTA లో 6,778+ ప్రభుత్వ కోర్సులు అందుబాటులో ఉన్నాయి",
    govEmployeeNotice: "ప్రభుత్వ అధికారులకు సిఫార్సు: స్టాటిస్టికల్ ఆఫీసర్ (MoSPI / SSS)",
    govCadreBadge: "MoSPI అధికారిక మార్గదర్శకాలు",
    annualCPDRequirement: "మిషన్ కర్మయోగి లక్ష్యం: సంవత్సరానికి 40 గంటల శిక్షణ",
    mandatoryCourses: "మీ పాత్రకు అవసరమైన కోర్సులు",
    matchScore: "మ్యాచ్ స్కోరు",
    duration: "వ్యవధి",
    hours: "గంటలు",
    launchCourse: "iGOT లో కోర్సు ప్రారంభించండి",
    resetFilters: "ఫిల్టర్లు రీసెట్ చేయండి",
    allProviders: "అన్ని ప్రొవైడర్లు",
    allLevels: "అన్ని స్థాయిలు",
    beginner: "ప్రారంభ",
    intermediate: "మధ్యస్థ",
    advanced: "అధునాతన",
    sortByMatch: "మ్యాచ్ స్కోర్ ప్రకారం",
    sortByDuration: "వ్యవధి ప్రకారం",
    skillsCovered: "కవర్ చేసే నైపుణ్యాలు",

    assessmentTitle: "అధికారిక గణాంక నైపుణ్య పరీక్షలు & క్విజ్",
    assessmentSubtitle: "పత్రం అప్‌లోడ్ చేసి లైవ్ టైమర్ మరియు సులభమైన ప్రశ్నలతో వెంటనే ప్రాక్టీస్ చేయండి",
    tabUpload: "1. అప్‌లోడ్ & సెట్టింగ్‌లు",
    tabReview: "2. ప్రశ్నల సమీక్ష",
    tabTake: "3. లైవ్ క్విజ్",
    tabResults: "4. ఫలితాలు",
    aiDocAnalysis: "AI పత్ర విశ్లేషణ & పదాల సంఖ్య",
    aiRecommendQuestions: "AI సిఫార్సు: సులభమైన అభ్యాసం కొరకు 10 ప్రశ్నలు ఉత్తమం.",
    selectQuestionCount: "ఎన్ని ప్రశ్నలు రూపొందించాలనుకుంటున్నారు?",
    quickCheck: "5 ప్రశ్నలు (త్వరిత క్విజ్ • ~7.5 నిమిషాలు)",
    standardRecommended: "10 ప్రశ్నలు (⭐ సిఫార్సు చేసిన ప్రామాణికం • ~15 నిమిషాలు)",
    comprehensive: "15 ప్రశ్నలు (లోతైన క్విజ్ • ~22.5 నిమిషాలు)",
    masteryTest: "20 ప్రశ్నలు (మాస్టరీ క్విజ్ • ~30 నిమిషాలు)",
    adaptiveDifficultyTitle: "స్మార్ట్ క్లిష్టత సక్రియం (మీ స్కోరును బట్టి ప్రశ్నలు సర్దుబాటు అవుతాయి)",
    adaptiveDifficultyDesc: "మీ సమాధానాల ఆధారంగా ప్రశ్నలు మరింత సులభంగా లేదా సవాలుగా మారుతాయి.",
    generateCustomAssessment: "నా ప్రాక్టీస్ క్విజ్ తయారు చేయండి",
    timeLeft: "మిగిలిన సమయం",
    adaptiveTierBadge: "ప్రశ్న క్లిష్టత",
    revealMethodology: "సరైన సమాధానం & సరళమైన వివరణ చూడండి (3D ఫ్లిప్)",
    returnToQuestion: "ప్రశ్నకు తిరిగి వెళ్లండి",
    totalScore: "మొత్తం స్కోరు",
    percentage: "శాతం",
    status: "క్విజ్ స్థితి",
    grade: "గ్రేడ్",
    passedDistinction: "అత్యుత్తమం (గ్రేడ్: A+)",
    passedMerit: "మెరిట్‌తో ఉత్తీర్ణత (గ్రేడ్: A)",
    passedCompetent: "ఉత్తీర్ణత (గ్రేడ్: B)",
    requiresRevision: "అభ్యాసం అవసరం (గ్రేడ్: C)",
    retestRecommended: "మళ్లీ రాయడం మంచిది (గ్రేడ్: D)",
    applyUpgrade: "అధికారిక నైపుణ్య స్థాయిని అప్‌డేట్ చేయండి",
    upgradeSuccess: "✓ నైపుణ్య స్థాయి విజయవంతంగా అప్‌డేట్ అయింది!",
    retakeAssessment: "క్విజ్ మళ్లీ రాయండి",
    uploadAnother: "మరొక పత్రాన్ని అప్‌లోడ్ చేయండి",

    adminAnalyticsTitle: "జాతీయ గణాంక సిబ్బంది నైపుణ్య & శిక్షణ నివేదికలు",
    adminAnalyticsSubtitle: "జాతీయ ఖాతాలు, శ్రమ, ధరలు, వ్యవసాయం మరియు క్షేత్ర కార్యకలాపాల సిబ్బంది వివరాలు.",
    exportCSV: "నివేదిక డౌన్‌లోడ్ (CSV)",
    downloadedReport: "శిక్షణ నివేదిక డౌన్‌లోడ్ అయింది",
    totalOfficers: "మొత్తం అధికారులు",
    overallIndex: "సమగ్ర నైపుణ్య సూచిక",
    cpdCompliance: "40-గంటల శిక్షణ పూర్తి",
    criticalGapsCount: "గుర్తించిన ముఖ్య నైపుణ్య లోపాలు",
    departmentReadiness: "విభాగ సంసిద్ధత",
    topSkillGaps: "ప్రధాన నైపుణ్య లోపాలు",

    roadmapTitle: "వ్యక్తిగత గణాంక కెరీర్ రోడ్‌మ్యాప్",
    roadmapSubtitle: "ప్రస్తుత స్థాయి నుండి సీనియర్ స్టాటిస్టికల్ ఆఫీసర్ స్థాయికి చేరుకునే స్పష్టమైన మార్గం.",
    stageCompleted: "పూర్తయింది",
    stageInProgress: "పురోగతిలో ఉంది",
    stageLocked: "రాబోయే దశ",

    authModalTitle: "ప్రభుత్వ అధికారి పోర్టల్ లాగిన్",
    authModalSubtitle: "వ్యక్తిగతీకరించిన నైపుణ్యాలు మరియు కోర్సులను చూడటానికి మీ ప్రొఫైల్‌ను ఎంచుకోండి.",
    selectRole: "ప్రొఫైల్ ఎంచుకోండి",
    learnerRole: "అభ్యాసకుడు (స్టాటిస్టికల్ ఆఫీసర్)",
    trainerRole: "శిక్షణ నిర్వాహకుడు (NSSTA)",
    adminRole: "మంత్రిత్వ శాఖ అడ్మినిస్ట్రేటర్ (MoSPI)",
    cancelBtn: "రద్దు చేయి",
    confirmRole: "పాత్రను నిర్ధారించండి",
    officialGovIndia: "భారత ప్రభుత్వం | గణాంకాలు మరియు కార్యక్రమ అమలు మంత్రిత్వ శాఖ (MoSPI)",
    trainingWing: "NSSTA శిక్షణ విభాగం",
    missionKarmayogi: "మిషన్ కర్మయోగి భారత్",
    statisticalFramework: "అధికారిక గణాంక నిబంధనలు",

    advisorTitle: "సంఖ్య-AI సహాయకుడు & మార్గదర్శి",
    advisorSubtitle: "24/7 గణాంకాలు & ప్లాట్‌ఫారమ్ సహాయం కొరకు స్మార్ట్ గైడ్",
    askAnything: "ఏదైనా ప్రశ్న అడగండి లేదా ఈ ప్లాట్‌ఫారమ్‌ను ఉపయోగించడంలో సహాయం పొందండి...",
    send: "పంపండి",
    quickPrompt1: "🧭 ఈ ప్లాట్‌ఫారమ్‌ను ఎలా ఉపయోగించాలో చూపించండి",
    quickPrompt2: "🎯 నేను మొదట ఏ కోర్సులు తీసుకోవాలి?",
    quickPrompt3: "📝 క్విజ్ ఎలా తయారు చేయాలి?",
    quickPrompt4: "📊 ధరల సూచిక సూత్రాలను సులభంగా వివరించండి",
  },
};

export function getTranslations(lang: Language): TranslationStrings {
  return translations[lang] || translations.en;
}
