import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, CEO_EMAIL } from '../context/AuthContext';
import { Sprout, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
                alert('Account created! Please check your email for verification if enabled, or sign in now.');
                setIsSignUp(false);
            } else {
                await signIn(email, password);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAF8] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#10B981]/10 blur-[150px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#10B981]/5 blur-[150px] pointer-events-none z-0" />

            <div className="max-w-md w-full animate-in fade-in zoom-in duration-700 relative z-10">
                
                {/* Logo Area */}
                <div className="flex justify-center mb-8 w-full">
                    <img onClick={() => navigate('/')} src="/logo.png" alt="Greenhaven" className="h-24 md:h-28 w-auto object-contain cursor-pointer transition-transform hover:scale-105" />
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white shadow-[0_20px_60px_-15px_rgba(26,48,43,0.1)] relative overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-80"></div>

                    <div className="flex flex-col text-center space-y-8 relative">
                        
                        <div>
                            <h1 className="text-3xl font-black text-[#1A302B] leading-tight uppercase tracking-tight">
                                {isSignUp ? 'Join Greenhaven' : 'Welcome Back'}
                                <span className="text-[#10B981]">.</span>
                            </h1>
                            <p className="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">
                                {isSignUp ? 'Create your platform account' : 'Access your dashboard'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full space-y-6">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10B981] transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none text-[#1A302B] placeholder:text-slate-400 focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10B981] transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none text-[#1A302B] placeholder:text-slate-400 focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-bold flex items-center justify-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#10B981] hover:bg-[#1A302B] text-white disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl text-sm uppercase tracking-widest font-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:shadow-xl"
                                style={{ transform: "scale(1)", transition: "all 0.3s ease" }}
                                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                disabled={loading}
                                className="text-xs font-bold text-slate-500 hover:text-[#1A302B] uppercase tracking-wider transition-colors disabled:opacity-50"
                            >
                                {isSignUp ? (
                                    <span>Already have an account? <span className="text-[#10B981]">Sign In</span></span>
                                ) : (
                                    <span>Don't have an account? <span className="text-[#10B981]">Sign Up</span></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
