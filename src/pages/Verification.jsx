import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Upload, CheckCircle2, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Verification = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const location = useLocation();
    const investment = location.state || { stockCount: 0, totalAmount: 0 };

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, verifying, verified, failed
    const [panNumber, setPanNumber] = useState('');
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('verifying');
        setErrorMsg('');

        try {
            // SECURE PRODUCTION CALL TO BACKEND
            const res = await fetch(`${API_URL}/verify/run-kyc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    pan: panNumber,
                    aadhaar: aadhaarNumber
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || "Verification failed");

            // Update Context with verified status
            updateUser({
                verification_status: 'verified',
                is_investor: true
            });

            setStatus('verified');
            setTimeout(() => {
                navigate('/invest', { state: investment });
            }, 1500);

        } catch (error) {
            console.error("KYC Production Error:", error);
            setStatus('failed');
            setErrorMsg(error.message || "Identity verification failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    if (status === 'verified') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">Identity Verified!</h2>
                <p className="text-slate-500 max-w-md mx-auto italic">
                    Your KYC is complete. Redirecting you to finalize your investment...
                </p>
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in mt-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors font-bold text-sm"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Investment
            </button>

            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                {status === 'verifying' && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                        <p className="font-bold text-slate-700 animate-pulse">Running AI Verification...</p>
                    </div>
                )}

                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <ShieldCheck className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 italic">Auto-KYC Engine</h2>
                        <p className="text-slate-500 text-sm mt-1">Instant verification of your Identity documents.</p>
                    </div>
                </div>

                {status === 'failed' && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in shake duration-500">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-bold italic">{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Permanent Account Number (PAN)</label>
                            <input
                                type="text"
                                value={panNumber}
                                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                placeholder="ABCDE1234F"
                                maxLength={10}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono text-lg font-bold"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Aadhaar Number</label>
                            <input
                                type="text"
                                value={aadhaarNumber}
                                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="0000 0000 0000"
                                maxLength={12}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono text-lg font-bold"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Document Upload (Selfie/ID)</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer group bg-slate-50/50">
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 italic">Upload Scanned Copy</p>
                                        <p className="text-xs text-slate-400 mt-1 italic font-medium">Auto-scanned by Vriksha-Vision API</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <PrimaryButton
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 mt-4 shadow-xl h-14"
                        type="submit"
                    >
                        {loading ? 'Processing...' : 'Run Automatic Verification'}
                    </PrimaryButton>

                    <p className="text-[10px] text-center text-slate-400 font-medium px-4">
                        By clicking verify, you authorize LARA to securely verify your credentials via authorized sandbox providers. Data is masked according to RBI guidelines.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Verification;
