import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Coins, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User, startingWealth?: number) => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120", // Female 1
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120", // Male 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120", // Female 2
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"  // Male 2
];

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [startingWealth, setStartingWealth] = useState<number>(15000);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [userRole, setUserRole] = useState("Premium Account");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Interaction/feedback states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing users or seed the default one
  const getRegisteredUsers = (): any[] => {
    const raw = localStorage.getItem('finsight_registered_users');
    if (!raw) {
      const defaultUsers = [
        {
          id: 'user-alex',
          email: 'alex@finsight.com',
          password: 'password123',
          name: 'Alex Jensen',
          role: 'Premium Account',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
          startingWealth: 55000
        }
      ];
      localStorage.setItem('finsight_registered_users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // General Validation
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();

      if (isSignUp) {
        // Sign Up Mode
        if (!fullName.trim()) {
          setError("Please tell us your name.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        // Check duplicate
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          setError("An account with this email already exists.");
          setLoading(false);
          return;
        }

        // Save new user
        const newUser = {
          id: `u-${Date.now()}`,
          email: email.toLowerCase(),
          password,
          name: fullName,
          role: userRole,
          avatarUrl: PRESET_AVATARS[selectedAvatar],
          startingWealth
        };

        const updated = [...users, newUser];
        localStorage.setItem('finsight_registered_users', JSON.stringify(updated));

        // Log in
        setLoading(false);
        onLogin({
          id: newUser.id,
          email: newUser.email,
          username: newUser.name,
        }, startingWealth);

      } else {
        // Log In Mode
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) {
          setError("Invalid email or password combination. Try alex@finsight.com / password123");
          setLoading(false);
          return;
        }

        setLoading(false);
        onLogin({
          id: user.id,
          email: user.email,
          username: user.name,
        }, user.startingWealth);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f7f1de] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Absolute Decorative Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#804e22]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#804e22]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-[#d6c3b6] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] transition-all">
        
        {/* Left Info/Hero Panel: Visible on desktop */}
        <div className="lg:col-span-5 bg-[#804e22] text-[#fff9e8] p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Background subtle radial shadow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,transparent_100%)] pointer-events-none" />
          
          <div className="z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#fff9e8] rounded-xl flex items-center justify-center text-[#804e22] font-black text-xl shadow-md">
                FS
              </div>
              <div>
                <h2 className="font-display text-xl font-black tracking-tight leading-none mb-0.5">FinSight</h2>
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-80">Wealth Management</p>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="font-display text-2xl md:text-3xl font-black leading-tight tracking-tight">
                Sophisticated AI wealth intelligence.
              </h1>
              <p className="text-[#eee8d5] text-sm leading-relaxed font-light">
                Securely map, track, and optimize your assets, recurring expenses, and budgets under a single unified dashboard powered by FinSight AI.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4 z-10 border-t border-[#fff9e8]/15 pt-6">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[#fff9e8]/10 rounded-lg text-[#fff9e8]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Dynamic Net Worth Mapping</h4>
                <p className="text-[11px] text-[#eee8d5] font-light">Real-time asset appreciation and debt indicators.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[#fff9e8]/10 rounded-lg text-[#fff9e8]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">FinSight AI Co-Pilot</h4>
                <p className="text-[11px] text-[#eee8d5] font-light">Subscription audit and custom-tailored savings suggestions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-[#fff9e8]/10 rounded-lg text-[#fff9e8]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Zero-Trust Local Scoping</h4>
                <p className="text-[11px] text-[#eee8d5] font-light">Complete data isolation & strict state preservation.</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#eee8d5]/60 mt-6 z-10">
            © 2026 FinSight Wealth Intelligence Inc. All rights reserved.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* Form Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-black font-display text-[#1e1c10] tracking-tight">
                {isSignUp ? "Begin your journey" : "Welcome back"}
              </h2>
              <p className="text-[#847469] text-xs mt-1.5">
                {isSignUp 
                  ? "Create a premium account to start optimizing your financial trajectory." 
                  : "Access your personalized asset intelligence ledger."}
              </p>
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0 animate-ping" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Core Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase">Full Name</label>
                  <div className="relative flex items-center">
                    <UserIcon className="absolute left-3 w-4 h-4 text-[#847469]" />
                    <input 
                      type="text"
                      placeholder="Alex Jensen"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#faf3e0]/30 border border-[#d6c3b6] rounded-xl text-xs text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] focus:border-[#804e22] outline-hidden placeholder-[#847469] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-[#847469]" />
                  <input 
                    type="email"
                    placeholder="alex@finsight.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#faf3e0]/30 border border-[#d6c3b6] rounded-xl text-xs text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] focus:border-[#804e22] outline-hidden placeholder-[#847469] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-[#847469]" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-[#faf3e0]/30 border border-[#d6c3b6] rounded-xl text-xs text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] focus:border-[#804e22] outline-hidden placeholder-[#847469] transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#847469] hover:text-[#1e1c10] focus:outline-hidden"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-[#847469]" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 bg-[#faf3e0]/30 border border-[#d6c3b6] rounded-xl text-xs text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] focus:border-[#804e22] outline-hidden placeholder-[#847469] transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-[#847469] hover:text-[#1e1c10] focus:outline-hidden"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end pt-5">
                    <button 
                      type="button" 
                      onClick={() => setError("Password reset link will be sent to registered addresses.")}
                      className="text-[11px] font-bold text-[#804e22] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* Extra Custom Signup Fields (Avatar & starting balance) */}
              {isSignUp && (
                <div className="space-y-4 border-t border-[#eee8d5] pt-4 mt-2">
                  {/* Choose Profile Picture */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase block">Select Profile Avatar</label>
                    <div className="flex gap-3 justify-start items-center">
                      {PRESET_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedAvatar(i)}
                          className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            selectedAvatar === i ? 'border-[#804e22] scale-110 shadow-md ring-2 ring-[#804e22]/20' : 'border-[#d6c3b6] opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Starting wealth estimate */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase">Starting Liquidity</label>
                      <span className="text-xs font-bold text-[#804e22] font-mono">${startingWealth.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Coins className="w-4.5 h-4.5 text-[#804e22]" />
                      <input 
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={startingWealth}
                        onChange={(e) => setStartingWealth(Number(e.target.value))}
                        className="w-full accent-[#804e22] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Tier details */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#51443b] tracking-wider uppercase block">Account Tier</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserRole("Standard Member")}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          userRole === 'Standard Member'
                            ? 'border-[#804e22] bg-[#f4eedb]/30'
                            : 'border-[#d6c3b6] bg-white hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-[11px] font-bold block text-[#1e1c10]">Standard</span>
                        <span className="text-[9px] text-[#847469]">Core personal ledger</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUserRole("Premium Account")}
                        className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                          userRole === 'Premium Account'
                            ? 'border-[#804e22] bg-[#f4eedb]/30'
                            : 'border-[#d6c3b6] bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-[#804e22] text-[#fff9e8] rounded-full text-[7px] font-extrabold flex items-center gap-0.5 shadow-xs">
                          <Award className="w-2 h-2" />
                          BEST
                        </div>
                        <span className="text-[11px] font-bold block text-[#1e1c10] flex items-center gap-1">
                          Premium Tier
                        </span>
                        <span className="text-[9px] text-[#847469]">Full AI co-pilot insights</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#804e22] text-[#fff9e8] hover:bg-[#6c401b] disabled:bg-[#804e22]/50 disabled:cursor-not-allowed py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing authentications...
                  </span>
                ) : (
                  <>
                    <span>{isSignUp ? "Activate My FinSight Intelligence Account" : "Access Personal Secure Console"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Selector/toggle for Switch */}
            <div className="mt-6 text-center border-t border-[#eee8d5] pt-5">
              <p className="text-xs text-[#51443b]">
                {isSignUp ? "Already have an account?" : "New to FinSight Wealth Management?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-xs font-bold text-[#804e22] hover:underline hover:text-[#6c401b]"
                >
                  {isSignUp ? "Sign In instead" : "Sign Up for Premium now"}
                </button>
              </p>
            </div>

            {/* Seed demo credentials helper */}
            {!isSignUp && (
              <div className="mt-5 p-3 bg-[#faf3e0]/50 border border-[#d6c3b6] rounded-xl text-center">
                <p className="text-[10px] text-[#847469] font-medium">
                  💡 Demo Access: <strong className="text-[#804e22]">alex@finsight.com</strong> / <strong className="text-[#804e22]">password123</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
