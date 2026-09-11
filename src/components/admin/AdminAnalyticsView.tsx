import React, { useState } from "react";
import { DepartmentAnalytics } from "../../types";
import { AnalyticsScene3D } from "../3d/AnalyticsScene3D";
import { 
  BarChart3, 
  Download, 
  AlertTriangle, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Layers, 
  FileSpreadsheet,
  Building2,
  CheckCircle2
} from "lucide-react";

interface AdminAnalyticsViewProps {
  departments: DepartmentAnalytics[];
  reducedMotion?: boolean;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  departments,
  reducedMotion = false,
}) => {
  const [activeTab, setActiveTab] = useState<"3d" | "table">("3d");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Export CSV mock handler
  const handleExportCSV = () => {
    const headers = "Department,Total Officers,Active Learners,Avg Competency %,Top Skill Gap,Gap Severity\n";
    const rows = departments
      .map(
        (d) =>
          `"${d.department}",${d.totalEmployees},${d.activeLearners},${d.avgCompetency},"${d.skillGaps[0]?.skill || "None"}","${d.skillGaps[0]?.gapPercent}%"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MoSPI_Training_Needs_Analysis_2026.csv";
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Admin Title & Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs mb-1">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>MoSPI Department & Staff Progress Reports</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              National Statistical Team Skills & Training Reports
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Staff skills overview across National Accounts, Labour Statistics, Price Statistics, Agricultural Statistics, and Field Operations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Downloaded Training Report</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Export Report (CSV)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Institutional KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Officers Mapped</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">1,420</div>
          <div className="text-[11px] text-emerald-400 mt-1">Across 14 MoSPI Divisions</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Average Competency</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">68.4%</div>
          <div className="text-[11px] text-emerald-400 mt-1">+4.2% since Q3 (iGOT adoption)</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Critical Skill Shortages</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">3 Domains</div>
          <div className="text-[11px] text-rose-300 mt-1">Python Microdata, Cloud, GIS</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">iGOT / NSSTA Completion</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">74.2%</div>
          <div className="text-[11px] text-indigo-300 mt-1">14,820 training hours logged</div>
        </div>
      </div>

      {/* 3D Department Competency Landscape Section (Section 70) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-lg font-bold text-white">
              3D Cross-Departmental Skill Landscape & Gap Topology
            </h3>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("3d")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === "3d" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              3D Bar Landscape
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === "table" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Tabular Matrix
            </button>
          </div>
        </div>

        {activeTab === "3d" ? (
          <AnalyticsScene3D departments={departments} reducedMotion={reducedMotion} />
        ) : (
          <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-slate-800 p-4">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Strength</th>
                  <th className="py-2.5 px-3">Average Competency</th>
                  <th className="py-2.5 px-3">Course Completion</th>
                  <th className="py-2.5 px-3">Primary Skill Shortage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {departments.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-semibold text-white">{d.department}</td>
                    <td className="py-3 px-3">{d.totalEmployees} Officers</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-sky-400">{d.avgCompetency}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-400">
                        {Math.round((d.activeLearners / d.totalEmployees) * 100)}% ({d.activeLearners} active)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{d.skillGaps[0]?.skill}</span>
                        <span className="text-rose-400 font-bold">
                          ({d.skillGaps[0]?.gapPercent}% gap)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical Skill Shortage Action Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/40">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Priority Institutional Skill Deficit Identified</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mb-4">
          The <strong className="text-white">Labour Statistics Division</strong> and <strong className="text-white">Price Statistics Division</strong> exhibit a 58% gap in automated Python and R reproducible pipeline methodologies. In accordance with MoSPI modernization directives, NSSTA is scheduled to launch a 3-day targeted residential training batch next month.
        </p>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert("Scheduled 24 officers from Labour Statistics for NSSTA Advanced Python Residential Cohort.")}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition"
          >
            Assign Targeted NSSTA Cohort
          </button>
        </div>
      </div>
    </div>
  );
};
