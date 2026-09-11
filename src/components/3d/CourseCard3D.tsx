import React, { useRef, useState } from "react";
import { Course } from "../../types";
import { Clock, BookOpen, ExternalLink, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";

interface CourseCard3DProps {
  course: Course;
  onStartCourse: (courseId: string) => void;
  reducedMotion?: boolean;
}

export const CourseCard3D: React.FC<CourseCard3DProps> = ({
  course,
  onStartCourse,
  reducedMotion = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle enterprise-grade tilt (max 8 degrees)
    const rotX = ((y - centerY) / centerY) * -6.5;
    const rotY = ((x - centerX) / centerX) * 6.5;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      style={{ perspective: "1000px" }}
      className="w-full transition-transform duration-300"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !reducedMotion && isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out, box-shadow 0.4s ease-out",
        }}
        className={`relative flex flex-col justify-between rounded-2xl p-6 bg-slate-900/85 border border-slate-800/90 shadow-xl backdrop-blur-md overflow-hidden group ${
          isHovered ? "border-slate-600/80 shadow-2xl shadow-sky-950/40" : ""
        }`}
      >
        {/* Subtle top gradient accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${course.bannerGradient}`}
        />

        {/* Card Header: Provider badge & Match % */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center space-x-1 ${
                course.provider.includes("iGOT")
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              }`}
            >
              <span>{course.provider}</span>
              {course.isMock && (
                <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-400 font-normal">
                  Demo
                </span>
              )}
            </span>

            <div className="flex items-center space-x-1 bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">
              <span>{course.matchScore}% Match</span>
            </div>
          </div>

          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors line-clamp-2">
            {course.title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
            {course.description}
          </p>

          {/* Explainable AI Reason Box */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-4 text-xs">
            <div className="flex items-center space-x-1.5 text-sky-400 font-semibold mb-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Addresses {course.targetGapSkill} Skill Gap</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {course.matchReason}
            </p>
          </div>

          {/* Skills chips & Duration */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.skillsCovered.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Metadata & Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.durationHours} Hours</span>
            </span>
            <span>•</span>
            <span className="font-medium text-slate-300">{course.difficulty}</span>
          </div>

          <button
            onClick={() => onStartCourse(course.id)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition active:scale-95 ${
              course.status === "completed"
                ? "bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700"
                : course.status === "in-progress"
                ? "bg-amber-600 text-white hover:bg-amber-500"
                : "bg-sky-600 text-white hover:bg-sky-500 shadow-sky-600/30"
            }`}
          >
            <span>
              {course.status === "completed"
                ? "Review"
                : course.status === "in-progress"
                ? "Continue (45%)"
                : "Start Learning"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
