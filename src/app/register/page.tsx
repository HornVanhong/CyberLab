"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { loginGoogle, registerEmail } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-slate-800" };
    if (pass.length < 6) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (pass.length < 10) return { score: 2, label: "Medium", color: "bg-amber-500" };
    return { score: 3, label: "Strong Cyber Password", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { user, error } = await registerEmail(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error);
    } else if (user) {
      router.push("/");
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMsg("");
    setIsLoading(true);
    const { user, error } = await loginGoogle();
    setIsLoading(false);

    if (error) {
      setErrorMsg(error);
    } else if (user) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Ambient background glow */}
      <div className="fixed top-1/4 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">
        {/* Left Side: Brand Showcase (5 cols) */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">CyberLab</span>
                <span className="text-[10px] font-mono text-cyan-400 block -mt-1 uppercase tracking-widest font-bold">
                  Operator Registration
                </span>
              </div>
            </Link>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Start Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  Cybersecurity Journey
                </span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Join thousands of pentesting students and security researchers. Practice hands-on labs, complete practical VM exams, and build your portfolio.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free & Open Source Platform</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Instant Certificate Verification</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Firebase Cloud Authentication</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            🔒 Your security progress & certificates are encrypted and linked to your Firebase user profile.
          </div>
        </div>

        {/* Right Side: Form (7 cols) */}
        <div className="lg:col-span-7 p-8 lg:p-12 space-y-6 flex flex-col justify-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Create New Account</h3>
            <p className="text-xs text-slate-400">
              Sign up with Google or enter your registration details below.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {errorMsg.includes("already exists") && (
                <Link
                  href="/login"
                  className="self-start text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 pt-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Click here to Sign In instead →</span>
                </Link>
              )}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign Up with Google</span>
          </button>

          <div className="relative my-2 flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-slate-900/90 px-3 text-[10px] font-mono uppercase text-slate-500">
              Or Register With Email
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-slate-400 font-semibold">
                Username / Call-sign
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. cyber_operator_01"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-slate-400 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-slate-400 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Password Strength:</span>
                    <span className="font-bold text-slate-200">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline font-bold font-mono">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
