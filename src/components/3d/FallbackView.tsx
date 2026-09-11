import React from "react";
import { UserSkill, SkillGapItem, RoleSkillRequirement } from "../../types";
import { ShieldCheck, AlertCircle, ArrowUpRight } from "lucide-react";

interface FallbackViewProps {
  userSkills: UserSkill[];
  requirements: RoleSkillRequirement[];
  skillGaps: SkillGapItem[];
  onSelectSkill: (skill: string) => void;
}

export const FallbackView: React.FC<FallbackViewProps> = ({
  userSkills,
  requirements,
  skillGaps,
  onSelectSkill,
}) => {
  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Accessible 2D Competency Matrix</h3>
          <p className="text-xs text-slate-400">
            Standard tabular view of assessed competencies vs. Statistical Officer job requirements.
          </p>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
          Scale: Level 0 (None) to 5 (Expert)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-2.5 px-3">Competency / Skill</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Current Level</th>
              <th className="py-2.5 px-3">Required Level</th>
              <th className="py-2.5 px-3">Skill Gap</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {skillGaps.map((item) => (
              <tr key={item.skillId} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-3 font-semibold text-white flex items-center space-x-2">
                  <span>{item.name}</span>
                </td>
                <td className="py-3 px-3 text-slate-400">{item.category}</td>
                <td className="py-3 px-3">
                  <span className="font-bold text-sky-400">Level {item.currentLevel}/5</span>
                </td>
                <td className="py-3 px-3">
                  <span className="font-bold text-indigo-400">Level {item.requiredLevel}/5</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-bold ${
                        item.gap >= 2
                          ? "text-rose-400"
                          : item.gap === 1
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {item.gap > 0 ? `-${item.gap}` : "0 (On-Track)"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === "Critical" || item.priority === "High"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : item.priority === "Medium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectSkill(item.name)}
                    className="inline-flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>View Courses</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
