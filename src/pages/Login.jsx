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
            navigate('/', { replace: true });
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
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

                    <div className="flex flex-col items-center text-center space-y-6 relative">
                        <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-200">
                            <Sprout className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight">
                                {isSignUp ? 'Join FarmFund' : 'Welcome Back'}
                            </h1>
                            <p className="text-slate-500 mt-2 text-sm italic">
                                {isSignUp ? 'Create your account to start investing' : 'Access your agricultural investment dashboard'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full space-y-6 pt-4">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-bold">
                                    {error}
                                </div>
                            )}

                            <PrimaryButton
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 text-lg font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 mt-2"
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In to Dashboard')}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </PrimaryButton>
                        </form>

                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            disabled={loading}
                            className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>

                        <div className="pt-6 w-full border-t border-slate-100 flex flex-col items-center gap-4">
                            <p className="text-sm text-slate-400 font-medium italic">Testing Admin access? Use:</p>
                            <div className="bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-100">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <code className="text-emerald-700 font-bold text-xs">vijay@vriksha.ai</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
