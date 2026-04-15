import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, GraduationCap } from 'lucide-react';

function CollegeAdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            // TODO: Integrate with Firebase authentication
            // For now, simulate a login delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Placeholder: Replace with actual auth logic
            console.log('Login attempt:', { email, rememberMe });

            // On successful login, navigate to dashboard
            // navigate('/college-admin/dashboard');
            setError('Authentication not yet configured. Please connect Firebase.');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ec-root relative overflow-hidden font-inter transition-colors duration-300">
            {/* Animated background orbs — tinted with accent & muted */}
            <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-30 bg-ec-accent/40 -top-24 -right-24 animate-float-orb" />
            <div className="absolute w-[350px] h-[350px] rounded-full blur-[80px] opacity-30 bg-ec-muted/50 -bottom-20 -left-20 animate-float-orb-delayed" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[440px] m-5 p-10 sm:p-12 bg-ec-surface/80 backdrop-blur-3xl border border-ec-border rounded-3xl shadow-2xl shadow-ec-root/20 animate-card-slide-up opacity-0 translate-y-8 transition-colors duration-300">
                {/* Logo & Branding */}
                <div className="flex flex-col items-center gap-2 mb-9">
                    <div className="w-14 h-14 bg-ec-accent rounded-2xl flex items-center justify-center shadow-lg shadow-ec-accent/35 animate-logo-pulse">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-[22px] font-bold text-ec-highlight m-0 tracking-tight">Connect Karo</h1>
                    <span className="text-[13px] text-ec-text-sub font-normal tracking-widest uppercase">College Admin Portal</span>
                </div>

                {/* Login Form */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake" role="alert">
                            <AlertCircle className="w-[18px] h-[18px] text-red-400 flex-shrink-0" />
                            <span className="text-[13px] text-red-400">{error}</span>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="login-email" className="text-[13px] font-medium text-ec-text-sub tracking-wide">
                            Email Address
                        </label>
                        <div className="relative flex items-center group">
                            <Mail className="absolute left-4 w-[18px] h-[18px] text-ec-text-sub/50 pointer-events-none transition-colors duration-300 group-focus-within:text-ec-accent" />
                            <input
                                id="login-email"
                                type="email"
                                placeholder="admin@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                autoFocus
                                className="w-full py-3.5 pr-4 pl-12 bg-ec-muted/30 border border-ec-border rounded-xl text-ec-text text-[15px] font-inter outline-none transition-all duration-300 placeholder:text-ec-text-sub/40 focus:border-ec-accent/60 focus:bg-ec-surface focus:ring-[3px] focus:ring-ec-accent/15"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="login-password" className="text-[13px] font-medium text-ec-text-sub tracking-wide">
                            Password
                        </label>
                        <div className="relative flex items-center group">
                            <Lock className="absolute left-4 w-[18px] h-[18px] text-ec-text-sub/50 pointer-events-none transition-colors duration-300 group-focus-within:text-ec-accent" />
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full py-3.5 pr-12 pl-12 bg-ec-muted/30 border border-ec-border rounded-xl text-ec-text text-[15px] font-inter outline-none transition-all duration-300 placeholder:text-ec-text-sub/40 focus:border-ec-accent/60 focus:bg-ec-surface focus:ring-[3px] focus:ring-ec-accent/15"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3.5 bg-transparent border-none text-ec-text-sub/50 cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-ec-text"
                            >
                                {showPassword
                                    ? <EyeOff className="w-[18px] h-[18px]" />
                                    : <Eye className="w-[18px] h-[18px]" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="ck-checkbox"
                            />
                            <span className="text-[13px] text-ec-text-sub">Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="text-[13px] text-ec-accent bg-transparent border-none cursor-pointer font-inter transition-colors duration-200 p-0 hover:text-ec-accent-hover"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full py-4 px-6 border-none rounded-xl bg-ec-accent text-white text-[15px] font-semibold font-inter cursor-pointer transition-all duration-300 overflow-hidden mt-1 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ec-accent/40 hover:bg-ec-accent-hover active:translate-y-0 ${loading ? 'pointer-events-none opacity-80' : ''}`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-7 text-center">
                    <p className="text-[13px] text-ec-text-sub/60">
                        Need access?{' '}
                        <a
                            href="mailto:support@connectkaro.com"
                            className="text-ec-accent no-underline font-medium transition-colors duration-200 hover:text-ec-accent-hover"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CollegeAdminLogin;
