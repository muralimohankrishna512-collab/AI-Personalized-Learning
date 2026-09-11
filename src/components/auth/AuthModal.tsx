import React, { useState } from "react";
import { UserRole } from "../../types";
import { ShieldCheck, Lock, Sparkles, Building2, User, KeyRound, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  currentRole: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  currentRole,
}) => {
  const [email, setEmail] = useState("arun.sharma@gov.in");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onSelectRole(selectedRole);
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900/95 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Top Government Tricolor Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-amber-500" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-emerald-600" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700"
          aria-label="Close"
        >
          ✕
        </button>

        {/* 3D Shield Emblem Icon Header (Section 75) */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center border border-sky-400/40 shadow-xl shadow-sky-600/30 mb-3 group hover:scale-105 transition">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
            Government of India • MoSPI
          </span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            Sankhya-Pragya Portal Login
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sign in via Jan Parichay National Government SSO or Officer Credentials
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Government Official Email (NIC)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Security Credential / Token
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-sky-600" />
              <span>Remember official session</span>
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-sky-400 hover:underline">
              Jan Parichay SSO
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-sky-600/30 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Authenticating Officer...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Access Skill Intelligence System</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500">
            Protected by NIC e-Gov Security Protocols • Government of India
          </span>
        </div>
      </div>
    </div>
  );
};
