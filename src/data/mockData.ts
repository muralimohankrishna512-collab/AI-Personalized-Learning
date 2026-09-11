import { 
  UserProfile, 
  UserSkill, 
  RoleSkillRequirement, 
  SkillGapItem, 
  Course, 
  LearningRoadmapNode, 
  QuizQuestion, 
  DepartmentAnalytics, 
  EmergingSkill,
  CompetencyHistoryItem
} from "../types";

export const initialUserProfile: UserProfile = {
  id: "USR-MOSPI-2024-882",
  fullName: "Arun Kumar Sharma",
  email: "arun.sharma@mospi.gov.in",
  employeeId: "SSO-LBR-4419",
  department: "Labour Statistics",
  designation: "Statistical Officer",
  jobRole: "Statistical Officer",
  currentAssignment: "Periodic Labour Force Survey (PLFS) Quarterly Microdata Tabulation & Estimation",
  educationalQualification: "M.Sc. in Mathematical Statistics (University of Delhi)",
  experienceYears: 3,
  careerGoal: "Senior Data Scientist & Deputy Director (National Statistical Systems)",
  preferredLanguage: "English",
  role: "Learner",
  overallCompetencyScore: 72,
  completedCoursesCount: 4,
  learningHours: 38,
  learningStreakDays: 12,
  assessmentAverage: 82,
};

// Demo user's current assessed skills (Section 52)
export const initialUserSkills: UserSkill[] = [
  { skillId: "sk-stat", name: "Statistics", category: "Statistical", level: 3, assessedScore: 78, lastAssessedDate: "2026-08-15" },
  { skillId: "sk-samp", name: "Sampling", category: "Statistical", level: 2, assessedScore: 58, lastAssessedDate: "2026-08-15" },
  { skillId: "sk-py", name: "Python", category: "Technical", level: 2, assessedScore: 54, lastAssessedDate: "2026-08-10" },
  { skillId: "sk-sql", name: "SQL", category: "Technical", level: 3, assessedScore: 76, lastAssessedDate: "2026-08-12" },
  { skillId: "sk-aiml", name: "AI/ML", category: "Technical", level: 1, assessedScore: 40, lastAssessedDate: "2026-08-05" },
  { skillId: "sk-dataviz", name: "Data Visualization", category: "Technical", level: 2, assessedScore: 59, lastAssessedDate: "2026-08-14" },
  { skillId: "sk-comm", name: "Communication", category: "Behavioural", level: 3, assessedScore: 75, lastAssessedDate: "2026-08-01" },
  // Extended framework competencies
  { skillId: "sk-gis", name: "GIS", category: "Technical", level: 1, assessedScore: 35, lastAssessedDate: "2026-07-20" },
  { skillId: "sk-cloud", name: "Cloud", category: "Technical", level: 2, assessedScore: 48, lastAssessedDate: "2026-07-22" },
  { skillId: "sk-cyber", name: "Cybersecurity", category: "Digital Governance", level: 2, assessedScore: 52, lastAssessedDate: "2026-08-03" },
  { skillId: "sk-lead", name: "Leadership", category: "Behavioural", level: 2, assessedScore: 50, lastAssessedDate: "2026-07-15" },
  { skillId: "sk-natacc", name: "National Accounts", category: "Statistical", level: 2, assessedScore: 55, lastAssessedDate: "2026-07-18" },
  { skillId: "sk-price", name: "Price Statistics", category: "Statistical", level: 3, assessedScore: 70, lastAssessedDate: "2026-07-19" },
  { skillId: "sk-dataqual", name: "Data Quality Frameworks", category: "Statistical", level: 3, assessedScore: 72, lastAssessedDate: "2026-07-25" },
];

// Required competencies for Statistical Officer (Section 52 & 7)
export const statisticalOfficerRequirements: RoleSkillRequirement[] = [
  { skillId: "sk-stat", name: "Statistics", requiredLevel: 4, priority: "Mandatory" },
  { skillId: "sk-samp", name: "Sampling", requiredLevel: 4, priority: "Mandatory" },
  { skillId: "sk-py", name: "Python", requiredLevel: 4, priority: "Mandatory" },
  { skillId: "sk-sql", name: "SQL", requiredLevel: 3, priority: "Mandatory" },
  { skillId: "sk-aiml", name: "AI/ML", requiredLevel: 3, priority: "Mandatory" },
  { skillId: "sk-dataviz", name: "Data Visualization", requiredLevel: 3, priority: "Mandatory" },
  { skillId: "sk-comm", name: "Communication", requiredLevel: 3, priority: "Mandatory" },
  { skillId: "sk-gis", name: "GIS", requiredLevel: 2, priority: "Optional" },
  { skillId: "sk-cloud", name: "Cloud", requiredLevel: 3, priority: "Optional" },
  { skillId: "sk-cyber", name: "Cybersecurity", requiredLevel: 3, priority: "Mandatory" },
  { skillId: "sk-lead", name: "Leadership", requiredLevel: 3, priority: "Optional" },
];

// Function to calculate skill gaps deterministically
export function calculateSkillGaps(userSkills: UserSkill[], requirements: RoleSkillRequirement[]): SkillGapItem[] {
  return requirements.map(req => {
    const userSkill = userSkills.find(s => s.skillId === req.skillId);
    const currentLevel = userSkill ? userSkill.level : 0;
    const gap = Math.max(0, req.requiredLevel - currentLevel);
    
    let priority: SkillGapItem["priority"] = "No Gap";
    if (gap >= 4) priority = "Critical";
    else if (gap === 3) priority = "Critical";
    else if (gap === 2) priority = "High";
    else if (gap === 1) priority = "Medium";

    let rationale = "";
    if (req.name === "Python") {
      rationale = "Required for high-speed microdata processing in PLFS surveys, replacing legacy batch macros.";
    } else if (req.name === "Sampling") {
      rationale = "Critical for applying probability proportional to size (PPS) sampling and Jackknife variance estimation.";
    } else if (req.name === "AI/ML") {
      rationale = "Required for automated occupational code mapping (NCO-2015) and smart outlier validation.";
    } else if (req.name === "Statistics") {
      rationale = "Required for small area estimation and cross-sectional labor econometric modeling.";
    } else if (req.name === "Data Visualization") {
      rationale = "Needed for interactive MoSPI public dashboards and ministry flash reports.";
    }

    return {
      skillId: req.skillId,
      name: req.name,
      category: userSkill?.category || "Technical",
      currentLevel,
      requiredLevel: req.requiredLevel,
      gap,
      priority,
      rationale
    };
  }).sort((a, b) => b.gap - a.gap);
}

// Course Catalogue combining iGOT Karmayogi Mock API + NSSTA/TPAC Programmes
export const mockCourses: Course[] = [
  {
    id: "CRS-IGOT-PY-401",
    title: "Python for Data Analysis & Official Microdata Processing",
    description: "Comprehensive hands-on training with pandas, NumPy, and vectorised survey data pipelines for official statistical surveys.",
    provider: "iGOT Karmayogi",
    category: "Technical - Data Science",
    skillsCovered: ["Python", "Data Visualization", "SQL"],
    targetGapSkill: "Python",
    difficulty: "Intermediate",
    durationHours: 12,
    language: "English / Hindi",
    prerequisites: ["Basic Programming Logic"],
    learningOutcomes: [
      "Vectorized survey weighting with pandas",
      "Automated imputation for missing enterprise data",
      "High-performance parquet serialization for PLFS microdata"
    ],
    matchScore: 94,
    matchReason: "Directly addresses your highest-priority Python gap (Level 2 → Level 4) for Statistical Officers in Labour Statistics.",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_mospi_py401",
    isMock: true,
    status: "in-progress",
    progressPercent: 45,
    bannerGradient: "from-blue-600 to-indigo-800"
  },
  {
    id: "CRS-NSSTA-SMP-502",
    title: "Advanced Sampling Techniques & Complex Variance Estimation",
    description: "NSSTA/TPAC residential module on multi-stage stratified designs, replication methods (Jackknife/BRR), and small area estimation.",
    provider: "NSSTA / TPAC",
    category: "Statistical Methodology",
    skillsCovered: ["Sampling", "Statistics"],
    targetGapSkill: "Sampling",
    difficulty: "Advanced",
    durationHours: 24,
    language: "English",
    prerequisites: ["Sampling Theory (Level 2)"],
    learningOutcomes: [
      "Probability proportional to size (PPS) sampling allocation",
      "Calibrated estimation under non-response",
      "Replication variance estimation for complex survey microdata"
    ],
    matchScore: 91,
    matchReason: "Addresses high-priority Sampling gap (Level 2 → Level 4), essential for NSSO and PLFS estimation algorithms.",
    url: "https://nssta.gov.in/programmes/smp-502",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-emerald-600 to-teal-800"
  },
  {
    id: "CRS-NSSTA-AIML-301",
    title: "Applied Machine Learning for Official Statistics & Survey Analytics",
    description: "Practical implementations of supervised classification for labor activity status, NLP for free-text industry descriptions, and outlier detection.",
    provider: "NSSTA / TPAC",
    category: "Emerging Technologies",
    skillsCovered: ["AI/ML", "Python", "Statistics"],
    targetGapSkill: "AI/ML",
    difficulty: "Intermediate",
    durationHours: 18,
    language: "English",
    prerequisites: ["Python Level 3", "Statistical Analysis Level 3"],
    learningOutcomes: [
      "Automated National Classification of Occupations (NCO) text classification",
      "Isolation Forest for survey outlier identification",
      "Ethical AI & validation frameworks in official statistics"
    ],
    matchScore: 88,
    matchReason: "Bridges your AI/ML skill gap (Level 1 → Level 3) in alignment with MoSPI's digital modernization initiatives.",
    url: "https://nssta.gov.in/programmes/aiml-301",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-purple-600 to-violet-900"
  },
  {
    id: "CRS-IGOT-VIZ-204",
    title: "Official Statistical Data Storytelling & Interactive Visualizations",
    description: "Learn how to build policy-ready dashboards, choropleth maps, and statistical infographics using open-source tools.",
    provider: "iGOT Karmayogi",
    category: "Data Visualization",
    skillsCovered: ["Data Visualization", "Communication"],
    targetGapSkill: "Data Visualization",
    difficulty: "Intermediate",
    durationHours: 8,
    language: "English / Hindi",
    prerequisites: ["Basic Tabulation"],
    learningOutcomes: [
      "Best practices in displaying statistical uncertainty and confidence bands",
      "Designing accessible public data portals",
      "State-wise thematic mapping of labor indicators"
    ],
    matchScore: 84,
    matchReason: "Closes your Data Visualization gap (Level 2 → Level 3) for quarterly press releases and interactive bulletins.",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_mospi_viz204",
    isMock: true,
    status: "completed",
    progressPercent: 100,
    bannerGradient: "from-amber-600 to-orange-800"
  },
  {
    id: "CRS-IGOT-CYB-105",
    title: "Data Protection, Microdata Confidentiality & Cyber Governance",
    description: "Comprehensive coverage of the Digital Personal Data Protection (DPDP) Act, anonymization techniques, and secure cloud workflows in government.",
    provider: "iGOT Karmayogi",
    category: "Digital Governance",
    skillsCovered: ["Cybersecurity", "Digital Governance"],
    targetGapSkill: "Cybersecurity",
    difficulty: "Intermediate",
    durationHours: 10,
    language: "English",
    prerequisites: ["General Government Guidelines"],
    learningOutcomes: [
      "Statistical Disclosure Control (SDC) algorithms",
      "k-anonymity and differential privacy basics",
      "Government cloud security protocols for official data"
    ],
    matchScore: 81,
    matchReason: "Mandatory compliance course addressing Digital Governance & Cybersecurity requirement for all Statistical Officers.",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_mospi_cyb105",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-slate-700 to-cyan-900"
  },
  {
    id: "CRS-NSSTA-LDR-601",
    title: "Leadership & Statistical Project Management for Division Heads",
    description: "Developing executive capacity in survey field operations, inter-ministerial data sharing protocols, and team mentoring.",
    provider: "NSSTA / TPAC",
    category: "Behavioural & Leadership",
    skillsCovered: ["Leadership", "Communication"],
    targetGapSkill: "Leadership",
    difficulty: "Advanced",
    durationHours: 16,
    language: "English",
    prerequisites: ["5+ Years Service / SDO Grade"],
    learningOutcomes: [
      "Agile management in large-scale national census and survey rounds",
      "Crisis communication and statistical revision diplomacy",
      "Mentoring junior statistical cadres"
    ],
    matchScore: 74,
    matchReason: "Prepares you for the Senior Statistical Officer promotional competency criteria.",
    url: "https://nssta.gov.in/programmes/ldr-601",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-rose-600 to-red-900"
  },
  {
    id: "CRS-IGOT-SQL-202",
    title: "SQL & Relational Microdata Warehousing for Official Registries",
    description: "Master complex analytical window functions, indexed querying on decennial census datasets, and partitioned data lake storage.",
    provider: "iGOT Karmayogi",
    category: "Technical - Database Systems",
    skillsCovered: ["SQL", "Data Systems"],
    targetGapSkill: "SQL",
    difficulty: "Intermediate",
    durationHours: 14,
    language: "English / Hindi",
    prerequisites: ["Basic Relational Concepts"],
    learningOutcomes: [
      "Query optimization across millions of survey household records",
      "Dynamic SQL pivot tables for quarterly labour tabulations",
      "Data integrity constraints and primary key validation"
    ],
    matchScore: 89,
    matchReason: "Directly improves your SQL querying speed for PLFS and Annual Survey of Industries (ASI) processing.",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_sql202",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-teal-600 to-emerald-800"
  },
  {
    id: "CRS-NSSTA-GIS-403",
    title: "Spatial Statistics & Thematic GIS Mapping using ISRO Bhuvan & BharatMaps",
    description: "Practical geospatial integration for primary sampling units (PSU), urban frame surveys (UFS), and satellite-derived indicators.",
    provider: "NSSTA / TPAC",
    category: "Geospatial & Remote Sensing",
    skillsCovered: ["GIS", "Statistics"],
    targetGapSkill: "GIS",
    difficulty: "Advanced",
    durationHours: 20,
    language: "English",
    prerequisites: ["Basic Statistics"],
    learningOutcomes: [
      "Georeferencing enumeration blocks on Bhuvan portal",
      "Spatial autocorrelation (Moran's I) for regional labour trends",
      "Automated choropleth atlas rendering"
    ],
    matchScore: 86,
    matchReason: "Empowers statistical officers to modernize Urban Frame Survey (UFS) digitally.",
    url: "https://nssta.gov.in/programmes/gis-403",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-emerald-700 to-teal-900"
  },
  {
    id: "CRS-IGOT-NAC-305",
    title: "System of National Accounts (SNA 2008) & Gross Value Added (GVA) Estimation",
    description: "In-depth training on institutional sectors, input-output tables, deflators, and chain volume measures for GDP calculation.",
    provider: "iGOT Karmayogi",
    category: "Macroeconomic Statistics",
    skillsCovered: ["National Accounts", "Statistics"],
    targetGapSkill: "National Accounts",
    difficulty: "Advanced",
    durationHours: 22,
    language: "English",
    prerequisites: ["Macroeconomic Principles"],
    learningOutcomes: [
      "Quarterly GDP flash estimation algorithms",
      "Corporate MCA-21 database integration into national accounts",
      "Supply and Use Tables (SUT) reconciliation"
    ],
    matchScore: 85,
    matchReason: "Mandatory qualification course for officers rotating into National Accounts Division (NAD).",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_sna305",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-amber-600 to-yellow-800"
  },
  {
    id: "CRS-IGOT-CPI-210",
    title: "Consumer Price Index (CPI) & Inflation Dynamics Methodology",
    description: "Laspeyres price aggregation, geometric mean item relatives, housing rent imputation, and dealing with item non-response in rural/urban markets.",
    provider: "iGOT Karmayogi",
    category: "Price & Economic Statistics",
    skillsCovered: ["Price Statistics", "Sampling"],
    targetGapSkill: "Price Statistics",
    difficulty: "Intermediate",
    durationHours: 12,
    language: "English / Hindi",
    prerequisites: ["Statistical Foundations"],
    learningOutcomes: [
      "Calculating elementary price aggregates and upper-level indices",
      "Handling seasonal product disappearance in market quotations",
      "Mobile web portal validation for price collectors"
    ],
    matchScore: 92,
    matchReason: "Highly recommended for Price Statistics Division (PSD) field officers and supervisors.",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_cpi210",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-sky-600 to-indigo-800"
  },
  {
    id: "CRS-NSSTA-DQF-101",
    title: "Data Quality Assurance, Audit & UN Fundamental Principles of Official Statistics",
    description: "Standard operating procedures for statistical credibility, non-sampling error reduction, metadata documentation, and code of conduct.",
    provider: "NSSTA / TPAC",
    category: "Statistical Quality Frameworks",
    skillsCovered: ["Data Quality Frameworks", "Cybersecurity"],
    targetGapSkill: "Data Quality Frameworks",
    difficulty: "Beginner",
    durationHours: 8,
    language: "English / Hindi",
    prerequisites: ["None - Universal Cadre Course"],
    learningOutcomes: [
      "Generic Statistical Business Process Model (GSBPM) implementation",
      "Confidentiality safeguards under Collection of Statistics Act",
      "Open Data portal publishing standards"
    ],
    matchScore: 90,
    matchReason: "Annual mandatory ethics & quality compliance course for all MoSPI personnel.",
    url: "https://nssta.gov.in/programmes/dqf-101",
    isMock: true,
    status: "completed",
    progressPercent: 100,
    bannerGradient: "from-indigo-600 to-purple-800"
  },
  {
    id: "CRS-IGOT-CLD-304",
    title: "Government Cloud Infrastructure & High-Performance Survey Tabulations",
    description: "Containerized data crunching on NIC MeghRaj cloud, distributed Apache Spark jobs, and secure API gateways for public dashboards.",
    provider: "iGOT Karmayogi",
    category: "Technical - Cloud Architecture",
    skillsCovered: ["Cloud", "Python"],
    targetGapSkill: "Cloud",
    difficulty: "Intermediate",
    durationHours: 16,
    language: "English",
    prerequisites: ["Basic Linux & Python"],
    learningOutcomes: [
      "Deploying scalable survey microservices on MeghRaj",
      "Distributed memory processing for large sample surveys",
      "Automated CI/CD for statistical bulletin generators"
    ],
    matchScore: 82,
    matchReason: "Supports the IT modernization roadmap of the National Statistical Systems.",
    url: "https://igotkarmayogi.gov.in/app/toc/lex_course_cld304",
    isMock: true,
    status: "not-started",
    progressPercent: 0,
    bannerGradient: "from-blue-700 to-slate-900"
  }
];

// 3D Personalized Learning Roadmap Nodes (Section 67 & 16)
export const mockRoadmapNodes: LearningRoadmapNode[] = [
  {
    id: "node-1",
    stage: 1,
    title: "Python Fundamentals & Vectorization",
    subtitle: "Core Syntax & Numerical Methods",
    courseId: "CRS-IGOT-PY-101",
    skillGained: "Python Level 2 (Foundational)",
    duration: "8 Hours",
    matchScore: 98,
    status: "completed",
    description: "Data types, loops, vectorized arrays, and reading government microdata formats (CSV, DAT, STATA).",
    provider: "iGOT Karmayogi"
  },
  {
    id: "node-2",
    stage: 2,
    title: "Python for Data Analysis & Microdata Pipelines",
    subtitle: "Active Learning Course",
    courseId: "CRS-IGOT-PY-401",
    skillGained: "Python Level 3 (Applied Tabulation)",
    duration: "12 Hours",
    matchScore: 94,
    status: "in-progress",
    description: "Vectorized survey weighting with pandas, automated imputation, and building reproducible scripts for PLFS.",
    provider: "iGOT Karmayogi"
  },
  {
    id: "node-3",
    stage: 3,
    title: "Advanced Sampling & Complex Variance Estimation",
    subtitle: "Core Statistical Prerequisite",
    courseId: "CRS-NSSTA-SMP-502",
    skillGained: "Sampling Level 4 (Expert Estimator)",
    duration: "24 Hours",
    matchScore: 91,
    status: "upcoming",
    description: "Stratified multi-stage designs, replication methods (Jackknife/BRR), and small area estimation for sub-state tables.",
    provider: "NSSTA / TPAC"
  },
  {
    id: "node-4",
    stage: 4,
    title: "Machine Learning for Official Statistics",
    subtitle: "Advanced Analytics",
    courseId: "CRS-NSSTA-AIML-301",
    skillGained: "AI/ML Level 3 (Survey Analytics)",
    duration: "18 Hours",
    matchScore: 88,
    status: "upcoming",
    description: "Supervised classification for labor activity status, NLP for free-text industry descriptions, and outlier detection.",
    provider: "NSSTA / TPAC"
  },
  {
    id: "node-5",
    stage: 5,
    title: "Target Role: Senior Statistical Data Scientist",
    subtitle: "Full Competency Mastery",
    courseId: "TARGET-MILESTONE",
    skillGained: "Full Competency Qualified",
    duration: "Goal Reached",
    matchScore: 100,
    status: "upcoming",
    description: "Equipped to lead national survey architectures, automated microdata releases, and AI-assisted official statistics.",
    provider: "MoSPI Career Pathway"
  }
];

// Sample Statistical Documents for Document Upload & AI Quiz Generation (Section 73 & 18)
export const sampleStatisticalDocuments = [
  {
    id: "doc-plfs-manual",
    title: "Periodic Labour Force Survey (PLFS) Sampling & Estimation Procedure Manual (MoSPI)",
    category: "Survey Methodology",
    size: "2.4 MB PDF",
    pages: 48,
    excerpt: `The Periodic Labour Force Survey (PLFS) adopts a stratified multi-stage design. The first stage units (FSUs) are the Urban Frame Survey (UFS) blocks in urban areas and Census villages in rural areas. The selection of FSUs is done with Probability Proportional to Size with Replacement (PPSWR) in rural sectors and Simple Random Sampling Without Replacement (SRSWOR) in urban sectors. Within each selected FSU, households are listed and stratified into second-stage strata based on educational and activity criteria. Multiplier estimation is derived using inverse probability weighting adjusted for non-response.`
  },
  {
    id: "doc-python-microdata",
    title: "MoSPI Technical Handbook: Vectorized Python for Official Statistics & Microdata Validation",
    category: "Technical Guidelines",
    size: "1.8 MB PDF",
    pages: 36,
    excerpt: `When handling survey datasets with exceeding 500,000 respondent records, traditional Python loops incur unacceptable latency. Standard operational procedure mandates utilizing pandas DataFrame vectorized operations and numpy boolean masks. Memory footprint optimization involves categorical casting of district and industry codes (NCO/NIC). Automated imputation algorithms must preserve the empirical distribution of continuous income variables using bounded hot-deck or predictive mean matching.`
  },
  {
    id: "doc-data-governance",
    title: "Government Data Privacy & Fundamental Principles of Official Statistics Directive",
    category: "Digital Governance",
    size: "1.2 MB PDF",
    pages: 28,
    excerpt: `Under UN Fundamental Principle 6 adopted by MoSPI, individual respondent records are sacrosanct. Statistical Disclosure Control (SDC) requires top-coding of sensitive variables, perturbation of high-leverage outliers, and adherence to k-anonymity (k >= 5) before public microdata release. Digital signatures using public-key infrastructure (PKI) authenticate official publication integrity across government portals.`
  }
];

// Pre-generated Questions for immediate fallback or initial demo
export const defaultQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "In two-stage stratified sampling for household surveys, what is the primary purpose of selecting First Stage Units (FSUs) with Probability Proportional to Size (PPS)?",
    option_a: "To eliminate the need for sampling weights in the final estimation",
    option_b: "To ensure equal probability of selection for Ultimate Stage Units (USUs) across all strata",
    option_c: "To minimize variance when unit characteristics correlate strongly with the size measure",
    option_d: "To guarantee non-response rates remain zero during field enumeration",
    correct_answer: "C",
    explanation: "Probability Proportional to Size (PPS) sampling of FSUs minimizes the sampling variance of estimates when the variable of interest correlates positively with the size indicator.",
    difficulty: "Intermediate",
    competency: "Sampling",
    topic: "Multi-Stage Sampling Design",
    source_reference: "PLFS Sampling Manual, Section 4.1"
  },
  {
    id: 2,
    question: "In Python's pandas library, which method is best suited for vectorised conditional imputation of missing survey weights without mutating the original dataframe?",
    option_a: "df.replace(np.nan, 0)",
    option_b: "df['weight'].assign(lambda x: x.fillna(x.median()))",
    option_c: "df.assign(weight=np.where(df['weight'].isna(), df['weight'].median(), df['weight']))",
    option_d: "df.loc[:, 'weight'] = df['weight'].interpolate()",
    correct_answer: "C",
    explanation: "np.where() combined with DataFrame.assign returns a new modified dataframe in a vectorized manner, preserving immutability and high memory efficiency for large microdata sets.",
    difficulty: "Intermediate",
    competency: "Python",
    topic: "Microdata Cleaning & Imputation",
    source_reference: "MoSPI Python Guidelines, Module 2"
  },
  {
    id: 3,
    question: "Under the Fundamental Principles of Official Statistics (Principle 6), how must individual data collected by statistical agencies for statistical compilation be treated?",
    option_a: "Made accessible to commercial credit rating agencies upon formal request",
    option_b: "Strictly confidential and used exclusively for statistical purposes",
    option_c: "Published in unmasked microdata portals with direct identifiers",
    option_d: "Shared with taxation enforcement authorities for individual compliance checks",
    correct_answer: "B",
    explanation: "Principle 6 of UN/MoSPI Fundamental Principles mandates that individual data collected for statistical compilation, whether referring to natural or legal entities, must be strictly confidential and used exclusively for statistical purposes.",
    difficulty: "Beginner",
    competency: "Digital Governance",
    topic: "Statistical Ethics & Data Privacy",
    source_reference: "MoSPI Data Quality Framework, Section 1.4"
  },
  {
    id: 4,
    question: "When computing the Consumer Price Index (CPI) using the Laspeyres index formula, what represents the primary known statistical bias?",
    option_a: "Underestimating inflation due to chained base period deflation",
    option_b: "Substitution bias, because fixed base-period weights ignore consumer shifts to cheaper alternatives",
    option_c: "Outlier magnification from logarithmic harmonic mean weighting",
    option_d: "Hedonic quality adjustment overestimation",
    correct_answer: "B",
    explanation: "Laspeyres uses fixed base-period quantity weights, which tends to overstate the true cost of living increase because consumers naturally substitute away from goods whose relative prices have risen.",
    difficulty: "Intermediate",
    competency: "Statistics",
    topic: "Price Statistics & Index Numbers",
    source_reference: "Price Statistics Handbook, Section 3"
  },
  {
    id: 5,
    question: "In machine learning classification for labor force categorization (Employed, Unemployed, Out of Labour Force), what metric is preferred over accuracy when class imbalance is severe?",
    option_a: "Macro-averaged F1-score and Balanced Accuracy",
    option_b: "Mean Squared Error (MSE)",
    option_c: "Raw R-squared coefficient",
    option_d: "Variance Inflation Factor (VIF)",
    correct_answer: "A",
    explanation: "With high imbalance (e.g., low unemployment rates relative to overall workforce), accuracy can be deceptively high by predicting only majority classes. Macro F1 treats each category with equal importance.",
    difficulty: "Advanced",
    competency: "AI/ML",
    topic: "Model Evaluation for Imbalanced Microdata",
    source_reference: "AI for Official Statistics, Unit 3"
  },
  {
    id: 6,
    question: "Which variance estimation method is most suitable for complex survey designs when analytical variance formulas are mathematically intractable?",
    option_a: "Linear Ordinary Least Squares residual variance",
    option_b: "Replication techniques such as Balanced Repeated Replication (BRR) or Jackknife",
    option_c: "Simple Random Sampling without replacement approximation",
    option_d: "Gini coefficient dispersion index",
    correct_answer: "B",
    explanation: "Resampling and replication techniques like Jackknife, Bootstrap, and BRR reproduce the complex survey sample design repeatedly to derive robust empirical variance estimates.",
    difficulty: "Advanced",
    competency: "Sampling",
    topic: "Complex Survey Variance Estimation",
    source_reference: "Sampling Manual, Section 7"
  },
  {
    id: 7,
    question: "In Python, which geospatial library provides vectorized spatial joins (sjoin) for mapping village-level survey coordinates to administrative district polygons?",
    option_a: "geopandas",
    option_b: "matplotlib",
    option_c: "sqlite3",
    option_d: "beautifulsoup4",
    correct_answer: "A",
    explanation: "GeoPandas extends pandas data types to allow spatial operations on geometric types, including fast spatial indexing via R-tree for spatial joins.",
    difficulty: "Intermediate",
    competency: "GIS",
    topic: "Spatial Statistical Analysis",
    source_reference: "GIS in Official Statistics, Chapter 2"
  },
  {
    id: 8,
    question: "What is the key difference between Current Weekly Status (CWS) and Usual Principal Status (UPS) in India's Periodic Labour Force Survey?",
    option_a: "CWS has a reference period of 7 days preceding inquiry, while UPS has a reference period of 365 days",
    option_b: "CWS applies only to rural sectors, whereas UPS applies to urban sectors",
    option_c: "CWS does not account for casual labor",
    option_d: "UPS measures hourly wage fluctuations while CWS measures monthly salary",
    correct_answer: "A",
    explanation: "In official Indian labor statistics, CWS captures economic activity during the last 7 days, reflecting short-term seasonal fluctuations, whereas UPS captures the major time spent over the past 365 days.",
    difficulty: "Intermediate",
    competency: "Labour Statistics",
    topic: "PLFS Methodology & Activity Status",
    source_reference: "PLFS Manual, Section 2.3"
  },
  {
    id: 9,
    question: "Which SQL clause is essential to compute a running cumulative total of completed enterprise survey interviews ordered by date without collapsing the rows?",
    option_a: "GROUP BY date HAVING count(*) > 0",
    option_b: "SUM(completed_count) OVER (ORDER BY interview_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
    option_c: "SELECT DISTINCT ON (interview_date)",
    option_d: "ORDER BY interview_date LIMIT 100",
    correct_answer: "B",
    explanation: "Window functions with OVER (ORDER BY ... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) compute progressive aggregates while keeping every individual record intact.",
    difficulty: "Intermediate",
    competency: "SQL",
    topic: "Analytical Window Functions",
    source_reference: "Data Engineering for Statistics, Chapter 4"
  },
  {
    id: 10,
    question: "In government digital public infrastructure, what cryptographic principle guarantees that official statistical releases cannot be repudiated by the publishing agency?",
    option_a: "Asymmetric public-key cryptography with digital signatures (PKI)",
    option_b: "Base64 string encoding",
    option_c: "Symmetric XOR obfuscation",
    option_d: "Dynamic IP packet filtering",
    correct_answer: "A",
    explanation: "Digital signatures using Public Key Infrastructure (PKI) provide non-repudiation, integrity, and authenticity, ensuring that published statistical releases can be authoritatively validated.",
    difficulty: "Beginner",
    competency: "Digital Governance",
    topic: "Digital Signatures & DPI Security",
    source_reference: "Digital Governance Manual, Section 5"
  }
];

// Initial Competency History
export const initialCompetencyHistory: CompetencyHistoryItem[] = [
  {
    id: "CH-01",
    date: "2026-06-10",
    skill: "Statistics",
    previousLevel: 2,
    newLevel: 3,
    evidence: "Completed NSSTA Foundation in National Accounts (Score: 84%)",
    confidence: "High (Assessment Verified)"
  },
  {
    id: "CH-02",
    date: "2026-07-02",
    skill: "SQL",
    previousLevel: 2,
    newLevel: 3,
    evidence: "Assessment on PostgreSQL Analytical Window Functions (Score: 88%)",
    confidence: "High (Assessment Verified)"
  },
  {
    id: "CH-03",
    date: "2026-07-28",
    skill: "Data Visualization",
    previousLevel: 1,
    newLevel: 2,
    evidence: "Completed iGOT Data Storytelling Module (Score: 80%)",
    confidence: "Moderate (Coursework)"
  }
];

// Departmental Analytics for Admin Dashboard (Sections 29 & 30)
export const departmentAnalyticsData: DepartmentAnalytics[] = [
  {
    department: "Labour Statistics",
    totalEmployees: 412,
    activeLearners: 348,
    avgCompetency: 68.4,
    skillGaps: [
      { skill: "Python", gapPercent: 62 },
      { skill: "AI/ML", gapPercent: 58 },
      { skill: "Data Visualization", gapPercent: 47 },
      { skill: "Cloud", gapPercent: 39 },
      { skill: "Sampling", gapPercent: 35 }
    ],
    topNeed: "Python microdata pipelines for high-frequency PLFS releases"
  },
  {
    department: "National Accounts (NAD)",
    totalEmployees: 320,
    activeLearners: 285,
    avgCompetency: 74.2,
    skillGaps: [
      { skill: "Cloud", gapPercent: 54 },
      { skill: "Python", gapPercent: 49 },
      { skill: "Data Engineering", gapPercent: 44 },
      { skill: "AI/ML", gapPercent: 41 }
    ],
    topNeed: "Supply-Use Table automation and corporate balance sheet ingestion"
  },
  {
    department: "Price Statistics (CPI/WPI)",
    totalEmployees: 290,
    activeLearners: 240,
    avgCompetency: 71.8,
    skillGaps: [
      { skill: "AI/ML", gapPercent: 65 },
      { skill: "GIS", gapPercent: 52 },
      { skill: "Python", gapPercent: 46 }
    ],
    topNeed: "Web-scraping price data and hedonic quality adjustment models"
  },
  {
    department: "Agricultural & Environmental Statistics",
    totalEmployees: 380,
    activeLearners: 310,
    avgCompetency: 64.9,
    skillGaps: [
      { skill: "GIS", gapPercent: 72 },
      { skill: "AI/ML", gapPercent: 61 },
      { skill: "Sampling", gapPercent: 48 }
    ],
    topNeed: "Satellite remote sensing integration with crop yield estimation"
  },
  {
    department: "Social Statistics & SDG Monitoring",
    totalEmployees: 260,
    activeLearners: 235,
    avgCompetency: 76.1,
    skillGaps: [
      { skill: "Data Visualization", gapPercent: 51 },
      { skill: "Cybersecurity", gapPercent: 42 },
      { skill: "Cloud", gapPercent: 38 }
    ],
    topNeed: "Interactive SDG dashboard telemetry and state-level metadata harmonization"
  }
];

// Emerging Skills (Section 31)
export const emergingSkillsData: EmergingSkill[] = [
  {
    name: "Generative AI & LLMs in Official Statistics",
    category: "Artificial Intelligence",
    currentReadiness: 28,
    requiredReadiness: 75,
    futureDemand: "Very High",
    growthRate: "+180% YoY",
    description: "Automated survey coding (NCO/NIC), tabular synthetic data generation, and conversational query interfaces for public microdata."
  },
  {
    name: "Automated Survey Microdata Pipelines (Python/Polars)",
    category: "Data Engineering",
    currentReadiness: 42,
    requiredReadiness: 85,
    futureDemand: "Very High",
    growthRate: "+125% YoY",
    description: "Transitioning legacy monthly survey processing into fully automated, version-controlled cloud ETL pipelines."
  },
  {
    name: "Geospatial & Satellite Remote Sensing Analytics",
    category: "GIS & Spatial Stats",
    currentReadiness: 34,
    requiredReadiness: 70,
    futureDemand: "High",
    growthRate: "+90% YoY",
    description: "Earth observation datasets fused with ground enumeration for dynamic agricultural and urbanization metrics."
  },
  {
    name: "Government Cloud & Data Sovereignty Architecture",
    category: "Cloud Infrastructure",
    currentReadiness: 45,
    requiredReadiness: 80,
    futureDemand: "High",
    growthRate: "+75% YoY",
    description: "Migration of massive census and survey repositories to MeghRaj / sovereign government cloud."
  },
  {
    name: "Differential Privacy & Synthetic Data Disclosure Control",
    category: "Digital Governance",
    currentReadiness: 30,
    requiredReadiness: 78,
    futureDemand: "Very High",
    growthRate: "+140% YoY",
    description: "Mathematical privacy preservation frameworks allowing open public microdata exploration without individual respondent disclosure."
  }
];
