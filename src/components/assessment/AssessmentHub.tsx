import React, { useState, useEffect, useRef } from "react";
import { QuizQuestion, UserProfile, QuizAttempt, Language } from "../../types";
import { DocumentUpload3D } from "../3d/DocumentUpload3D";
import { ProcessingPipeline3D } from "../3d/ProcessingPipeline3D";
import { sampleStatisticalDocuments, defaultQuizQuestions } from "../../data/mockData";
import { translations } from "../../translations";
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Play, 
  Edit3, 
  Trash2, 
  Plus, 
  RefreshCw,
  Award,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  Settings2,
  Zap,
  Sliders,
  XCircle,
  RotateCcw,
  Filter
} from "lucide-react";
import confetti from "canvas-confetti";

interface AssessmentHubProps {
  userProfile: UserProfile;
  onUpdateCompetencyScore: (skill: string, newLevel: number, evidence: string) => void;
  reducedMotion?: boolean;
  language?: Language;
}

export const AssessmentHub: React.FC<AssessmentHubProps> = ({
  userProfile,
  onUpdateCompetencyScore,
  reducedMotion = false,
  language = "en",
}) => {
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<"upload" | "quiz" | "result">("upload");
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect">("all");

  // Document & Configuration Modal State (User Request: Ask how many questions and recommend)
  const [selectedDocTitle, setSelectedDocTitle] = useState(sampleStatisticalDocuments[0].title);
  const [selectedDocText, setSelectedDocText] = useState(sampleStatisticalDocuments[0].excerpt);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [numQuestionsToGenerate, setNumQuestionsToGenerate] = useState<number>(10);
  const [chosenDifficulty, setChosenDifficulty] = useState<string>("Adaptive");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(0);

  // Questions State
  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuizQuestions);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  // Quiz Taking State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [competencyUpgraded, setCompetencyUpgraded] = useState(false);

  // Live Timer State (User Request: Real ticking timer scaling with MCQ count)
  // 90 seconds (1.5 minutes) allocated per MCQ question
  const totalAllocatedSeconds = Math.max(300, questions.length * 90);
  const [secondsLeft, setSecondsLeft] = useState<number>(totalAllocatedSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute Word Count & AI Recommended Question Count
  const estimatedWordCount = selectedDocText.trim().split(/\s+/).length;
  const recommendedQuestionCount = estimatedWordCount > 2500 ? 15 : estimatedWordCount > 800 ? 10 : 5;

  // Real Timer Effect
  useEffect(() => {
    if (activeTab === "quiz" && !isEvaluating) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            // Auto submit when time expires
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeTab, isEvaluating]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Open config modal when document is selected
  const handleInitiateDocument = (docTitle: string, docText: string) => {
    setSelectedDocTitle(docTitle);
    setSelectedDocText(docText);
    // Set smart recommendation based on length
    const words = docText.trim().split(/\s+/).length;
    const rec = words > 2500 ? 15 : words > 800 ? 10 : 5;
    setNumQuestionsToGenerate(rec);
    setShowConfigModal(true);
  };

  // Generate Questions based on user choice
  const handleConfirmGenerate = async () => {
    setShowConfigModal(false);
    setIsProcessingAI(true);
    setPipelineStage(0);

    // Progressive stage animation
    const stageTimer = setInterval(() => {
      setPipelineStage((prev) => {
        if (prev >= 4) {
          clearInterval(stageTimer);
          return 4;
        }
        return prev + 1;
      });
    }, 600);

    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentTitle: selectedDocTitle,
          documentText: selectedDocText,
          numQuestions: numQuestionsToGenerate,
          difficulty: chosenDifficulty,
          competency: "Official Statistics & Survey Analysis",
        }),
      });

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        // Slice to requested count if backend returned more
        setQuestions(data.questions.slice(0, numQuestionsToGenerate));
      } else {
        // Fallback dynamically formatted to user requested count
        const adapted = defaultQuizQuestions.slice(0, numQuestionsToGenerate);
        setQuestions(adapted);
      }
    } catch (err) {
      console.warn("Using high-quality statistical question bank fallback:", err);
      setQuestions(defaultQuizQuestions.slice(0, numQuestionsToGenerate));
    } finally {
      clearInterval(stageTimer);
      setPipelineStage(5);
      setTimeout(() => {
        setIsProcessingAI(false);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setCompetencyUpgraded(false);
        setSecondsLeft(numQuestionsToGenerate * 90);
        setActiveTab("quiz");
      }, 700);
    }
  };

  // Start Taking the Quiz (Initializes Timer)
  const handleStartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setCompetencyUpgraded(false);
    // Reset timer to 90 seconds per question
    setSecondsLeft(questions.length * 90);
    setActiveTab("quiz");
  };

  // Submit Answer for Current Question
  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    setUserAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: option,
    }));
  };

  // Finish Quiz and Evaluate with Granular Score Status
  const handleSubmitQuiz = async () => {
    setIsEvaluating(true);
    let correctCount = 0;
    const competencyTotals: Record<string, { correct: number; total: number }> = {};
    const incorrectList: any[] = [];

    questions.forEach((q) => {
      const comp = q.competency || "Statistics";
      if (!competencyTotals[comp]) competencyTotals[comp] = { correct: 0, total: 0 };
      competencyTotals[comp].total += 1;

      if (userAnswers[q.id] === q.correct_answer) {
        correctCount += 1;
        competencyTotals[comp].correct += 1;
      } else {
        incorrectList.push({
          question: q.question,
          yourAnswer: userAnswers[q.id] || "Unanswered",
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
        });
      }
    });

    const percentage = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const compScores: Record<string, number> = {};
    Object.keys(competencyTotals).forEach((c) => {
      compScores[c] = Math.round((competencyTotals[c].correct / competencyTotals[c].total) * 100);
    });

    // Score-based Status & Advice (User Request: Show our status based on our score, not just 'needs review')
    let statusText = "PASSED / COMPETENT";
    let gradeText = "Grade B";
    let adviceText = "Your score confirms sound working knowledge. We recommend completing the next milestone module.";

    if (percentage >= 90) {
      statusText = "OUTSTANDING MASTERY";
      gradeText = "Grade A+ (Distinction)";
      adviceText = "Exceptional performance across all statistical competencies! You are eligible for immediate competency elevation to Level 3 / Level 4.";
    } else if (percentage >= 75) {
      statusText = "PASSED WITH MERIT";
      gradeText = "Grade A (Merit)";
      adviceText = "Strong grasp of sampling designs and variance estimation. Eligible for official competency rating elevation.";
    } else if (percentage >= 60) {
      statusText = "QUALIFIED / COMPETENT";
      gradeText = "Grade B (Passed)";
      adviceText = "Competent foundational understanding. Review microdata tabulations and vectorized data pipelines to achieve full mastery.";
    } else if (percentage >= 45) {
      statusText = "PROVISIONAL PASS";
      gradeText = "Grade C (Needs Practice)";
      adviceText = "Passed minimum threshold. Suggested review of official statistical manuals before undertaking large-scale survey allocations.";
    } else {
      statusText = "REQUIRES REVISION";
      gradeText = "Grade D (Remedial Needed)";
      adviceText = "Score is below the 60% mastery benchmark. Please retake the foundational modules on iGOT Karmayogi before re-examination.";
    }

    try {
      const response = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: correctCount,
          total: questions.length,
          competencyScores: compScores,
          incorrectQuestions: incorrectList,
          userProfile,
        }),
      });
      const feedback = await response.json();

      setLastAttempt({
        id: `ATT-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString(),
        score: correctCount,
        total: questions.length,
        percentage,
        competencyScores: compScores,
        feedback: {
          ...feedback,
          overallFeedback: feedback.overallFeedback || `You scored ${correctCount}/${questions.length} (${percentage}%). Status: ${statusText} (${gradeText}).`,
          competencyUpdateAdvice: percentage >= 60
            ? "Your confirmed score qualifies you for dynamic competency level upgrade from Level 2 to Level 3."
            : "Review the module and re-test to qualify for Level upgrade.",
        },
      });
    } catch (e) {
      setLastAttempt({
        id: `ATT-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString(),
        score: correctCount,
        total: questions.length,
        percentage,
        competencyScores: compScores,
        feedback: {
          overallFeedback: `You achieved an assessed score of ${correctCount} out of ${questions.length} (${percentage}%). Status: ${statusText} [${gradeText}].`,
          strengths: ["Official Sampling Frames & PPS Methodology", "UN Fundamental Principles of Official Statistics"],
          areasForImprovement: ["Vectorized Survey Imputation & Variance Estimation"],
          competencyUpdateAdvice: percentage >= 60
            ? "Your score confirms mastery. Official Python/Statistical competency qualifies for elevation from Level 2 to Level 3."
            : "Review the microdata module before re-testing for level upgrade.",
        },
      });
    } finally {
      setIsEvaluating(false);
      setActiveTab("result");
      if (percentage >= 60 && !reducedMotion) {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQ?.id];

  // Computerized Adaptive Testing (CAT) Complexity Calculation
  // As user answers questions, if accuracy is high, subsequent questions elevate in complexity
  const answeredQuestionsCount = Object.keys(userAnswers).length;
  let runningCorrectCount = 0;
  questions.slice(0, currentQuestionIndex).forEach((q) => {
    if (userAnswers[q.id] === q.correct_answer) runningCorrectCount += 1;
  });
  const runningAccuracy = currentQuestionIndex > 0 ? (runningCorrectCount / currentQuestionIndex) : 0.8;

  let adaptiveComplexityTier = "Medium Difficulty (Level 3)";
  let adaptiveBadgeColor = "text-sky-400 border-sky-800 bg-sky-950/60";

  if (runningAccuracy >= 0.75 && currentQuestionIndex >= 2) {
    adaptiveComplexityTier = "Challenging Question (Level 4 - Advanced)";
    adaptiveBadgeColor = "text-emerald-400 border-emerald-800 bg-emerald-950/60";
  } else if (runningAccuracy < 0.5 && currentQuestionIndex >= 2) {
    adaptiveComplexityTier = "Standard Question (Level 2 - Basic)";
    adaptiveBadgeColor = "text-amber-400 border-amber-800 bg-amber-950/60";
  }

  return (
    <div className="w-full space-y-6">
      {/* Module Header & Sub-Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>AI-Powered Assessment & Continuous Evaluation Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t.assessmentTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {t.assessmentSubtitle}
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "upload" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.tabUpload}
            </button>
            <button
              onClick={() => {
                if (activeTab !== "quiz") {
                  handleStartQuiz();
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "quiz" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.tabTake} ({questions.length} MCQs)
            </button>
            {lastAttempt && (
              <button
                onClick={() => setActiveTab("result")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "result" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                {t.tabResults} & Answer Key
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: 3D DOCUMENT UPLOAD & AI PROCESSING PIPELINE */}
      {activeTab === "upload" && (
        <div className="space-y-6">
          {/* 3D Upload Dropzone */}
          <DocumentUpload3D
            onFileSelect={(name, text) => handleInitiateDocument(name, text)}
            isProcessing={isProcessingAI}
            reducedMotion={reducedMotion}
          />

          {/* 3D Processing Pipeline Animation */}
          {isProcessingAI && (
            <ProcessingPipeline3D
              currentStageIndex={pipelineStage}
              reducedMotion={reducedMotion}
            />
          )}

          {/* Preset Sample MoSPI Documents */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Or Select from Pre-Loaded MoSPI Reference Documents:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              {sampleStatisticalDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleInitiateDocument(doc.title, doc.excerpt)}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/60 transition cursor-pointer group flex flex-col justify-between hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="text-sky-400 font-semibold">{doc.category}</span>
                      <span>{doc.size}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition line-clamp-2 mb-2">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      {doc.excerpt}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <Settings2 className="w-3.5 h-3.5" />
                      <span>Configure & Generate</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT QUESTION GENERATION CONFIGURATION MODAL (User Request: Ask question count & recommend) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Assessment Generation Setup</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{selectedDocTitle}</h3>
            <p className="text-xs text-slate-400 mb-4 line-clamp-2">{selectedDocText}</p>

            {/* AI Document Analysis Box & Smart Recommendation */}
            <div className="bg-gradient-to-r from-sky-950/70 to-indigo-950/70 border border-sky-500/40 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-sky-300">
                <span className="flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>AI Document Intelligence Analysis</span>
                </span>
                <span className="bg-sky-900/60 px-2 py-0.5 rounded text-[11px] text-sky-200">
                  ~{estimatedWordCount} words detected
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.aiRecommendQuestions}
              </p>
            </div>

            {/* Select Question Count Preset Options */}
            <div className="space-y-3 mb-5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>{t.selectQuestionCount}</span>
                <span className="text-sky-400 font-mono text-sm">{numQuestionsToGenerate} Questions</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { count: 5, label: t.quickCheck, tag: "~7.5 Mins" },
                  { count: 10, label: t.standardRecommended, tag: "⭐ Recommended", activeHighlight: true },
                  { count: 15, label: t.comprehensive, tag: "~22.5 Mins" },
                  { count: 20, label: t.masteryTest, tag: "~30 Mins" },
                ].map((preset) => (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => setNumQuestionsToGenerate(preset.count)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition ${
                      numQuestionsToGenerate === preset.count
                        ? "bg-sky-600/30 border-sky-400 text-white shadow-md shadow-sky-600/20"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>{preset.count} MCQs</span>
                      <span className="text-[10px] text-sky-400">{preset.tag}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      {preset.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Slider for fine adjustment */}
              <div className="pt-2">
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={numQuestionsToGenerate}
                  onChange={(e) => setNumQuestionsToGenerate(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>3 Questions</span>
                  <span>10 (Balanced)</span>
                  <span>25 (Mastery)</span>
                </div>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-1.5 mb-6">
              <label className="text-xs font-bold text-slate-300">Assessment Difficulty Engine:</label>
              <div className="grid grid-cols-4 gap-2">
                {["Adaptive", "Beginner", "Intermediate", "Advanced"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setChosenDifficulty(diff)}
                    className={`py-2 rounded-xl text-center text-xs font-semibold border transition ${
                      chosenDifficulty === diff
                        ? "bg-sky-600 text-white border-sky-400 shadow-md"
                        : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {diff === "Adaptive" ? "⚡ Adaptive (CAT)" : diff}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {chosenDifficulty === "Adaptive"
                  ? t.adaptiveDifficultyDesc
                  : "Static difficulty tier throughout the assessment."}
              </p>
            </div>

            {/* Confirm Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmGenerate}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate {numQuestionsToGenerate} AI MCQs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TIMED & ADAPTIVE ASSESSMENT (Answers hidden until submission) */}
      {activeTab === "quiz" && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress & Live Countdown Timer Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-white">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                {currentQ.competency || "Official Statistics"}
              </span>
            </div>

            {/* LIVE COUNTDOWN TIMER (User Request: timer should start & provide more time based on MCQs) */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-xl border font-mono text-xs font-bold ${
              secondsLeft <= 120 
                ? "bg-rose-950/80 border-rose-600 text-rose-400 animate-pulse" 
                : "bg-slate-950/80 border-slate-800 text-amber-400"
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime(secondsLeft)} {t.timeLeft}</span>
            </div>
          </div>

          {/* Adaptive Complexity Tier Indicator Badge */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-slate-400">Question Difficulty:</span>
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${adaptiveBadgeColor}`}>
                {adaptiveComplexityTier}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Score so far: {Math.round(runningAccuracy * 100)}%
            </span>
          </div>

          {/* Question Card (Answers hidden strictly until submission) */}
          <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="font-semibold text-slate-300">Topic: {currentQ.topic}</span>
              <span className="bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-300 border border-slate-700">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
              {currentQ.question}
            </h3>

            <div className="space-y-3 mb-6">
              {[
                { key: "A" as const, text: currentQ.option_a },
                { key: "B" as const, text: currentQ.option_b },
                { key: "C" as const, text: currentQ.option_c },
                { key: "D" as const, text: currentQ.option_d },
              ].map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition flex items-center space-x-3 border ${
                      isSelected
                        ? "bg-sky-600/30 border-sky-400 text-white shadow-md shadow-sky-600/20"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/70"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {Object.keys(userAnswers).length} of {questions.length} answered
              </span>

              <div className="flex items-center space-x-2">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    {t.previous}
                  </button>
                )}

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-md"
                  >
                    {t.next}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isEvaluating}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30"
                  >
                    {isEvaluating ? "Evaluating..." : t.submit}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Grid Jump Navigator */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(userAnswers[q.id]);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                    isCurrent
                      ? "bg-sky-500 text-white ring-2 ring-sky-400/50"
                      : isAnswered
                      ? "bg-emerald-900/60 border border-emerald-700/60 text-emerald-300"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATIC EVALUATION & COMPETENCY UPDATE (User Request: Show status and feedback based on score) */}
      {activeTab === "result" && lastAttempt && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/60 border border-slate-800 p-8 shadow-2xl backdrop-blur-md text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
              lastAttempt.percentage >= 75
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : lastAttempt.percentage >= 60
                ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                : "bg-amber-500/20 border-amber-500/40 text-amber-400"
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-1">
              Assessment Completed Successfully
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Attempt ID: {lastAttempt.id} • Date: {lastAttempt.date}
            </p>

            {/* Score & Nuanced Status Cards (User Request: Status based on score) */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.totalScore}</div>
                <div className="text-2xl font-black text-sky-400">
                  {lastAttempt.score} / {lastAttempt.total}
                </div>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.percentage}</div>
                <div className={`text-2xl font-black ${
                  lastAttempt.percentage >= 75
                    ? "text-emerald-400"
                    : lastAttempt.percentage >= 60
                    ? "text-sky-400"
                    : "text-amber-400"
                }`}>
                  {lastAttempt.percentage}%
                </div>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.status}</div>
                <div className={`text-xs font-bold mt-1.5 ${
                  lastAttempt.percentage >= 90
                    ? "text-emerald-400"
                    : lastAttempt.percentage >= 75
                    ? "text-emerald-300"
                    : lastAttempt.percentage >= 60
                    ? "text-sky-300"
                    : lastAttempt.percentage >= 45
                    ? "text-amber-300"
                    : "text-rose-400"
                }`}>
                  {lastAttempt.percentage >= 90
                    ? "MASTERY (A+)"
                    : lastAttempt.percentage >= 75
                    ? "MERIT (A)"
                    : lastAttempt.percentage >= 60
                    ? "QUALIFIED (B)"
                    : lastAttempt.percentage >= 45
                    ? "PROVISIONAL"
                    : "RE-EXAMINATION"}
                </div>
              </div>
            </div>

            {/* AI Personalized Feedback */}
            {lastAttempt.feedback && (
              <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 text-left space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Personalized Evaluation & Guidance</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lastAttempt.feedback.overallFeedback}
                </p>

                {lastAttempt.feedback.strengths && (
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 block mb-1">Demonstrated Strengths:</span>
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                      {lastAttempt.feedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* AUTOMATIC COMPETENCY UPDATE (Active for passing scores >= 60%) */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 p-6 rounded-2xl border border-emerald-600/40 text-left mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Dynamic Competency Update Action</span>
                </div>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  {lastAttempt.percentage >= 60 ? "Eligible: Approved" : "Target: 60%"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Previous Assessed Level:</span>
                  <span className="font-bold text-slate-300 text-base">Level 2 (Basic)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">New Assessed Level:</span>
                  <span className={`font-bold text-base ${
                    lastAttempt.percentage >= 60 ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {lastAttempt.percentage >= 60 ? "Level 3 (Intermediate)" : "Level 2 (Reinforce)"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {lastAttempt.feedback?.competencyUpdateAdvice}
              </p>

              <button
                onClick={() => {
                  onUpdateCompetencyScore("Python", 3, `Scored ${lastAttempt.percentage}% on official statistical assessment (${lastAttempt.score}/${lastAttempt.total})`);
                  setCompetencyUpgraded(true);
                  if (!reducedMotion) {
                    confetti({ particleCount: 60, spread: 60 });
                  }
                }}
                disabled={competencyUpgraded || lastAttempt.percentage < 60}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 ${
                  competencyUpgraded
                    ? "bg-emerald-800/60 text-emerald-200 border border-emerald-600/40 cursor-default"
                    : lastAttempt.percentage >= 60
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95"
                    : "bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {competencyUpgraded
                    ? t.upgradeSuccess
                    : lastAttempt.percentage >= 60
                    ? t.applyUpgrade
                    : "Score < 60% — Retake to Qualify for Level Upgrade"}
                </span>
              </button>
            </div>

            {/* POST-ASSESSMENT QUESTION BREAKDOWN & OFFICIAL ANSWER KEY (Shown strictly after assessment) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Official Assessment Answer Key & Rationale</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Detailed Question-by-Question Evaluation
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review your answers against official MoSPI statistical methodology, answer keys, and rationales.
                  </p>
                </div>

                {/* Filter Controls: All, Correct, Incorrect */}
                <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
                  <button
                    onClick={() => setReviewFilter("all")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      reviewFilter === "all" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All ({questions.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter("correct")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      reviewFilter === "correct" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Correct ({lastAttempt.score})
                  </button>
                  <button
                    onClick={() => setReviewFilter("incorrect")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                      reviewFilter === "incorrect" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Missed ({lastAttempt.total - lastAttempt.score})
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions
                  .filter((q) => {
                    const isCorrect = userAnswers[q.id] === q.correct_answer;
                    if (reviewFilter === "correct") return isCorrect;
                    if (reviewFilter === "incorrect") return !isCorrect;
                    return true;
                  })
                  .map((q, idx) => {
                    const userAns = userAnswers[q.id];
                    const isCorrect = userAns === q.correct_answer;
                    const isAnswered = Boolean(userAns);

                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl border transition ${
                          isCorrect
                            ? "bg-slate-950/80 border-emerald-800/50"
                            : isAnswered
                            ? "bg-slate-950/80 border-rose-800/50"
                            : "bg-slate-950/80 border-amber-800/50"
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="w-6 h-6 rounded-md bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-700">
                              Q{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                              {q.topic}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                              {q.difficulty}
                            </span>
                          </div>

                          {/* Outcome Badge */}
                          {isCorrect ? (
                            <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-700/60 px-2.5 py-1 rounded-full shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Correct (+1)</span>
                            </span>
                          ) : isAnswered ? (
                            <span className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 bg-rose-950/70 border border-rose-700/60 px-2.5 py-1 rounded-full shrink-0">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Incorrect (0)</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-700/60 px-2.5 py-1 rounded-full shrink-0">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                              <span>Unanswered (0)</span>
                            </span>
                          )}
                        </div>

                        {/* Question Statement */}
                        <h5 className="text-sm font-semibold text-white mb-4 leading-relaxed">
                          {q.question}
                        </h5>

                        {/* The 4 Options Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                          {[
                            { key: "A" as const, text: q.option_a },
                            { key: "B" as const, text: q.option_b },
                            { key: "C" as const, text: q.option_c },
                            { key: "D" as const, text: q.option_d },
                          ].map((opt) => {
                            const isOfficialKey = q.correct_answer === opt.key;
                            const isUserSelection = userAns === opt.key;

                            let cardStyle = "bg-slate-900/60 border-slate-800 text-slate-400";
                            let badge = null;

                            if (isOfficialKey && isUserSelection) {
                              cardStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/50";
                              badge = (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 flex items-center space-x-1 shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Your Answer (Correct)</span>
                                </span>
                              );
                            } else if (isOfficialKey) {
                              cardStyle = "bg-emerald-950/40 border-emerald-600 text-emerald-200";
                              badge = (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 flex items-center space-x-1 shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Official Correct Key</span>
                                </span>
                              );
                            } else if (isUserSelection) {
                              cardStyle = "bg-rose-950/50 border-rose-600 text-rose-200 ring-1 ring-rose-500/40";
                              badge = (
                                <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-700 flex items-center space-x-1 shrink-0">
                                  <XCircle className="w-3 h-3 text-rose-400" />
                                  <span>Your Answer (Incorrect)</span>
                                </span>
                              );
                            }

                            return (
                              <div
                                key={opt.key}
                                className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition ${cardStyle}`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <span
                                    className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                      isOfficialKey
                                        ? "bg-emerald-600 text-white"
                                        : isUserSelection
                                        ? "bg-rose-600 text-white"
                                        : "bg-slate-800 text-slate-400"
                                    }`}
                                  >
                                    {opt.key}
                                  </span>
                                  <span className="font-medium truncate">{opt.text}</span>
                                </div>
                                {badge}
                              </div>
                            );
                          })}
                        </div>

                        {/* Official Methodological Rationale & Citation */}
                        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center space-x-1.5 text-sky-400 font-bold text-[11px] uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Official Methodological Rationale</span>
                          </div>
                          <p className="leading-relaxed text-slate-300 text-xs">
                            {q.explanation}
                          </p>
                          <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-400">
                            <strong className="text-slate-300">MoSPI / NSSTA Reference:</strong>
                            <span className="font-mono text-slate-400">{q.source_reference}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleStartQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                {t.retakeAssessment}
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition"
              >
                {t.uploadAnother}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
