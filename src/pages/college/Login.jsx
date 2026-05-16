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
        <div className="min-h-screen flex items-center justify-center bg-ec-root relative overflow-hidden transition-colors duration-300">
            {/* Subtle ambient glow */}
            <div className="ambient-glow" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[420px] m-5 p-8 sm:p-10 bg-ec-surface border border-ec-border rounded-xl shadow-lg animate-card-slide-up opacity-0 translate-y-8 transition-colors duration-300">
                {/* Logo & Branding */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-ec-accent rounded-xl flex items-center justify-center shadow-md">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-ec-highlight m-0 tracking-tight">Connect Karo</h1>
                    <span className="text-[12px] text-ec-text-sub font-normal tracking-widest uppercase">College Admin Portal</span>
                </div>

                {/* Login Form */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-shake" role="alert">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <span className="text-[13px] text-red-400">{error}</span>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="login-email" className="text-[13px] font-medium text-ec-text-sub tracking-wide">
                            Email Address
                        </label>
                        <div className="relative flex items-center group">
                            <Mail className="absolute left-3.5 w-4 h-4 text-ec-icon pointer-events-none transition-colors duration-200 group-focus-within:text-ec-accent" />
                            <input
                                id="login-email"
                                type="email"
                                placeholder="admin@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                autoFocus
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="login-password" className="text-[13px] font-medium text-ec-text-sub tracking-wide">
                            Password
                        </label>
                        <div className="relative flex items-center group">
                            <Lock className="absolute left-3.5 w-4 h-4 text-ec-icon pointer-events-none transition-colors duration-200 group-focus-within:text-ec-accent" />
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="input pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 bg-transparent border-none text-ec-icon cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-ec-text"
                            >
                                {showPassword
                                    ? <EyeOff className="w-4 h-4" />
                                    : <Eye className="w-4 h-4" />
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
                            className="text-[13px] text-ec-accent bg-transparent border-none cursor-pointer transition-colors duration-200 p-0 hover:text-ec-accent-hover"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full py-3.5 mt-1 ${loading ? 'pointer-events-none opacity-70' : ''}`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
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
