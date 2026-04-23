import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Sparkles, ArrowLeft, ArrowRight, Brain, BarChart3, Wand2,
  ShieldCheck, Lock, CheckCircle2, GraduationCap, Briefcase,
  Loader2, Mail,
} from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { toast } from "@/hooks/use-toast";
import { setAuthenticated } from "@/components/RequireAuth";

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = "student" | "professional";

const ROLES: { id: Role; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "student",      label: "Student",      icon: GraduationCap },
  { id: "professional", label: "Professional", icon: Briefcase },
];

const TYPING_PHRASES = [
  "Analyzing your data...",
  "Generating insights...",
  "Detecting trends...",
  "Cleaning anomalies...",
];

// ── Password strength ─────────────────────────────────────────────────────────
const passwordStrength = (pw: string): { score: 0 | 1 | 2 | 3; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short",  color: "bg-muted" },
    { label: "Weak",       color: "bg-destructive" },
    { label: "Medium",     color: "bg-amber-500" },
    { label: "Strong",     color: "bg-emerald-500" },
  ] as const;
  return { score: score as 0 | 1 | 2 | 3, ...map[score] };
};

// ── API helper ────────────────────────────────────────────────────────────────
const apiFetch = async (path: string, body: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || "Something went wrong.");
  return data;
};

// ── Component ─────────────────────────────────────────────────────────────────
const Auth = () => {
  const navigate = useNavigate();

  // UI state
  const [tab,        setTab]        = useState<"login" | "signup">("login");
  const [role,       setRole]       = useState<Role>("student");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [typingIdx,  setTypingIdx]  = useState(0);
  const [typed,      setTyped]      = useState("");

  // Form fields
  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp,             setOtp]             = useState("");
  const [otpSent,         setOtpSent]         = useState(false);
  const [otpVerified,     setOtpVerified]     = useState(false);

  // Typing animation
  useEffect(() => {
    const phrase = TYPING_PHRASES[typingIdx];
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(phrase.slice(0, i));
      if (i >= phrase.length) {
        clearInterval(id);
        setTimeout(() => setTypingIdx((v) => (v + 1) % TYPING_PHRASES.length), 1400);
      }
    }, 45);
    return () => clearInterval(id);
  }, [typingIdx]);

  const strength = useMemo(() => passwordStrength(password), [password]);

  // ── Send OTP ──────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) { toast({ title: "Enter your email first", variant: "destructive" }); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast({ title: "Enter a valid email address", variant: "destructive" }); return; }
    setOtpLoading(true);
    try {
      await apiFetch("/auth/send-otp", { email });
      setOtpSent(true);
      toast({ title: "OTP sent!", description: `Code sent to ${email}. Check inbox & spam.` });
    } catch (err: unknown) {
      toast({ title: "Failed to send OTP", description: (err as Error).message, variant: "destructive" });
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) { toast({ title: "Please fill in all fields", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", { email, password });
      localStorage.setItem("dv_token", data.token);
      localStorage.setItem("dv_role", data.user.role);
      if (rememberMe) localStorage.setItem("dv_remember", "true");
      setAuthenticated(true);
      toast({ title: "Welcome back!", description: "Ready to analyze your data?" });
      navigate("/dashboard");
    } catch (err: unknown) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Sign up ───────────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) { toast({ title: "Please fill in all fields", variant: "destructive" }); return; }
    if (password !== confirmPassword) { toast({ title: "Passwords do not match", variant: "destructive" }); return; }
    if (password.length < 8) { toast({ title: "Password must be at least 8 characters", variant: "destructive" }); return; }
    if (!/[A-Z]/.test(password)) { toast({ title: "Password needs at least one uppercase letter", variant: "destructive" }); return; }
    if (!/[0-9]/.test(password)) { toast({ title: "Password needs at least one number", variant: "destructive" }); return; }
    if (!otpSent) { toast({ title: "Please send the OTP to your email first", variant: "destructive" }); return; }
    if (!otp || otp.length < 6) { toast({ title: "Enter the 6-digit OTP from your email", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const data = await apiFetch("/auth/signup", { name, email, password, confirmPassword, otp, role });
      localStorage.setItem("dv_token", data.token);
      localStorage.setItem("dv_role", data.user.role);
      setAuthenticated(true);
      toast({ title: "Account created 🎉", description: "Welcome to DataVerse AI!" });
      navigate("/dashboard");
    } catch (err: unknown) {
      toast({ title: "Signup failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") void handleLogin();
    else void handleSignup();
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setOtp(""); setOtpSent(false); setOtpVerified(false); setRememberMe(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    // h-screen + overflow-hidden = no page scroll ever
    <div className="h-screen overflow-hidden bg-background relative flex flex-col">

      {/* Gradient blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      {/* Top bar */}
      <div className="shrink-0 px-6 py-4 flex items-center justify-between z-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-card/60 backdrop-blur-md text-primary text-xs font-semibold">
          <Sparkles className="w-3 h-3" /> Powered by AI Insights Engine
        </div>
      </div>

      {/* Main grid — fills remaining height */}
      <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">

        {/* LEFT — Hero (no scroll) */}
        <div className="hidden lg:flex flex-col justify-center px-12 xl:px-16 overflow-hidden">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground">DataVerse AI</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Turn Raw Data into <span className="gradient-text">Smart Decisions</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-3">Upload → Clean → Visualize → Get AI Insights</p>

            <ul className="mt-6 space-y-2.5">
              {[
                { icon: Wand2,     text: "AI Data Cleaning" },
                { icon: BarChart3, text: "Auto Dashboard" },
                { icon: Brain,     text: "Smart Insights" },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* AI mock card — compact */}
            <div className="mt-6 rounded-2xl border border-border bg-card/70 backdrop-blur-md p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                    <Brain className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">AI Assistant</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">live</span>
              </div>
              <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm text-foreground font-medium min-h-[36px]">
                {typed}
                <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 align-middle animate-pulse" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {[60, 85, 45].map((h, i) => (
                  <div key={i} className="rounded-md bg-muted/40 p-1.5 flex flex-col justify-end h-14">
                    <div className="w-full rounded gradient-primary" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Auth card (internally scrollable if needed, but designed to fit) */}
        <div className="flex items-center justify-center px-4 sm:px-8 overflow-y-auto">
          <div className="w-full max-w-md py-4">

            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-lg font-extrabold tracking-tight text-foreground">DataVerse AI</span>
              </div>
              <p className="text-xs text-muted-foreground">Your personal data analyst</p>
            </div>

            {/* Glass card */}
            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-2xl p-6">

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted/40 rounded-xl mb-5">
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      tab === t
                        ? "gradient-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => switchTab(t)}
                  >
                    {t === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {tab === "login" ? "Access Your Dashboard" : "Start Analyzing Data"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tab === "login" ? "Welcome back — pick up where you left off." : "Join in seconds. No credit card required."}
                </p>
              </div>

              {/* Role selector */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">I am a:</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const active = role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[11px] font-medium transition-all ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-primary/40"
                        }`}
                      >
                        <r.icon className="w-3.5 h-3.5" />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {tab === "signup" && (
                  <Input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl bg-muted/30 border-border/60 h-10"
                    required
                  />
                )}

                {/* Email + Send OTP */}
                {tab === "signup" ? (
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (otpSent) { setOtpSent(false); setOtpVerified(false); setOtp(""); }
                      }}
                      className="rounded-xl bg-muted/30 border-border/60 h-10 flex-1"
                      required
                    />
                    <button
                      type="button"
                      disabled={otpLoading || !email}
                      onClick={handleSendOtp}
                      className="shrink-0 h-10 px-3 rounded-xl border border-primary bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {otpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                      {otpLoading ? "..." : otpSent ? "Resend" : "Send OTP"}
                    </button>
                  </div>
                ) : (
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl bg-muted/30 border-border/60 h-10"
                    required
                  />
                )}

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl bg-muted/30 border-border/60 h-10"
                    required
                  />
                  {tab === "signup" && password.length > 0 && (
                    <div className="mt-1.5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength.score ? strength.color : "bg-muted"}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Strength: <span className="font-semibold text-foreground">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {tab === "signup" && (
                  <>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-xl bg-muted/30 border-border/60 h-10"
                      required
                    />

                    {/* OTP box */}
                    <div className={`rounded-xl border bg-muted/20 p-2.5 transition-all ${otpSent ? "border-primary/40" : "border-border/60 opacity-60"}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          {otpSent ? (
                            <><Mail className="w-3 h-3 text-primary" /> Code sent to <span className="text-primary truncate max-w-[120px]">{email}</span></>
                          ) : "Email verification"}
                          {otpVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        </span>
                        {otpSent && (
                          <button type="button" disabled={otpLoading} onClick={handleSendOtp}
                            className="text-[11px] text-primary font-semibold hover:underline disabled:opacity-50">
                            {otpLoading ? "Sending…" : "Resend"}
                          </button>
                        )}
                      </div>
                      <Input
                        inputMode="numeric"
                        maxLength={6}
                        placeholder={otpSent ? "Enter 6-digit code" : "Send OTP first"}
                        value={otp}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setOtp(v); setOtpVerified(v.length === 6); }}
                        disabled={!otpSent}
                        className="rounded-lg bg-card border-border/60 h-9 tracking-[0.4em] text-center font-semibold disabled:cursor-not-allowed"
                      />
                      {!otpSent && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Enter your email and click <span className="font-semibold text-primary">Send OTP</span>
                        </p>
                      )}
                    </div>
                  </>
                )}

                {tab === "login" && (
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-border bg-muted/30 accent-primary" />
                      <span className="text-xs text-muted-foreground">Remember me</span>
                    </label>
                    <button type="button" className="text-xs text-primary hover:underline font-semibold">
                      Forgot password?
                    </button>
                  </div>
                )}

                <GradientButton type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</>
                  ) : (
                    <>{tab === "login" ? "Access Your Dashboard" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
                  )}
                </GradientButton>
              </form>

              {/* What you get */}
              <div className="mt-4 pt-4 border-t border-border/60">
                <ul className="grid grid-cols-2 gap-1">
                  {["Clean Data", "Auto Charts", "AI Summary", "Smart Suggestions"].map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-xs text-foreground">
                      <CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trust footer */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> No data stored permanently
              </span>
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3" /> Secure connection
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;