import React, { useState, useRef, useEffect } from "react";
import { AIOrb, AIOrbState } from "../3d/AIOrb";
import { UserProfile, SkillGapItem, Language } from "../../types";
import { translations } from "../../translations";
import { Bot, Send, Sparkles, X, RefreshCw, ChevronRight, Compass, HelpCircle, BookOpen, Layers } from "lucide-react";

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  skillGaps: SkillGapItem[];
  onSelectSkill: (skill: string) => void;
  onStartCourse: (courseId: string) => void;
  reducedMotion?: boolean;
  language?: Language;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: "skill" | "course";
    target: string;
    label: string;
  };
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  skillGaps,
  onSelectSkill,
  onStartCourse,
  reducedMotion = false,
  language = "en",
}) => {
  const t = translations[language] || translations.en;
  const [orbState, setOrbState] = useState<AIOrbState>("idle");
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Namaste, Officer Sharma. I am Sankhya-AI, your official MoSPI AI Skill Intelligence Advisor and Platform Guide. 

I can answer any statistical or programming questions, explain course recommendations across our 6,778+ iGOT/NSSTA catalog, and guide you step-by-step through every feature of this platform. How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);
    setOrbState("processing");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userProfile,
          context: {
            topGaps: skillGaps.filter((g) => g.gap > 0).map((g) => `${g.name} (Gap: ${g.gap})`),
          },
        }),
      });

      const data = await response.json();
      setOrbState("responding");

      const replyText =
        data && data.reply && typeof data.reply === "string"
          ? data.reply
          : "Based on official statistical guidelines and the MoSPI Competency Matrix, focusing on Python microdata workflows and multi-stage sampling will accelerate your career pathway toward Senior Statistical Officer.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => setOrbState("idle"), 2500);
    } catch (err) {
      setOrbState("responding");
      const fallbackReply = `In Labour Statistics, the highest priority is mastering Pandas vectorized filtering for PLFS quarterly microdata files. I recommend completing the 'Python for Official Statistical Analysis' module on iGOT Karmayogi to elevate your competency from Level 2 to Level 3.`;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => setOrbState("idle"), 2500);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "🗺️ Guide me through the total application and its features",
    "🪐 How do I use the 3D Sphere to navigate to courses?",
    "📝 How do document upload, question count, and timer work?",
    "🏛️ What courses should I take as a government statistical officer?",
    "📊 Explain Probability Proportional to Size (PPS) in NSSO",
    "🐍 How to optimize Python Pandas for PLFS survey microdata",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
              <span>{t.aiAdvisorTitle}</span>
              <span className="text-[10px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-800 font-normal">
                Sankhya-AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Official MoSPI & NSSTA Advisor</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 3D Orb Visualizer Container */}
      <div className="h-32 w-full bg-gradient-to-b from-slate-900/40 to-slate-950/80 relative flex items-center justify-center border-b border-slate-800/50">
        <AIOrb state={orbState} size={110} reducedMotion={reducedMotion} />
        <div className="absolute bottom-2 text-[10px] text-slate-400 font-mono tracking-wider uppercase">
          Status: {orbState === "processing" ? "Analyzing Context..." : orbState === "responding" ? "Synthesizing Guidance..." : "Standing By"}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                msg.sender === "user"
                  ? "bg-sky-600 text-white shadow-md rounded-br-none"
                  : "bg-slate-900 text-slate-200 border border-slate-800 shadow-md rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-line text-xs">{msg.text}</div>

              {msg.suggestedAction && (
                <button
                  onClick={() => {
                    if (msg.suggestedAction?.type === "course") {
                      onStartCourse(msg.suggestedAction.target);
                    } else if (msg.suggestedAction?.type === "skill") {
                      onSelectSkill(msg.suggestedAction.target);
                    }
                  }}
                  className="mt-2.5 w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 transition text-[11px] font-semibold"
                >
                  <span>{msg.suggestedAction.label}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Consulting MoSPI Knowledge Base & Official Guidelines...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/30">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <Compass className="w-3 h-3 text-sky-400" />
          <span>Quick Assistance & Platform Guide:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 shrink-0 transition whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.aiInputPlaceholder}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white shadow-md shadow-sky-600/30 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
