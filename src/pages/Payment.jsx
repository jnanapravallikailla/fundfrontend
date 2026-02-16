import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const investment = location.state || { stockCount: 10, totalAmount: 265000 };

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';
            const res = await fetch(`${API_URL}/invest/purchase?email=${user?.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stock_count: investment.stockCount,
                    total_amount: investment.totalAmount
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Purchase failed');
            }

            setSuccess(true);
        } catch (err) {
            console.error("Payment Error:", err);
            alert(`Payment Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-inner">
                    <CheckCircle2 className="w-14 h-14" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">Investment Successful!</h2>
                <p className="text-slate-500 max-w-md mx-auto text-lg italic">
                    Welcome to the FarmFund family. Your {investment.stockCount} stocks have been allocated to your profile.
                </p>
                <PrimaryButton onClick={() => navigate('/portfolio')} className="px-10 py-4 text-lg">
                    Go to My Portfolio
                </PrimaryButton>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Finalize Investment</h2>
                        <p className="text-slate-500 mt-2">Secure payment via 256-bit encrypted gateway.</p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest">Investment Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                <span className="text-slate-600">Selected Stocks</span>
                                <span className="font-bold">{investment.stockCount} Units</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                <span className="text-slate-600">Price per Unit</span>
                                <span className="font-bold">₹26,500</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-slate-900 font-bold text-lg">Total Amount</span>
                                <span className="text-3xl font-black text-emerald-700">₹{investment.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 italic">
                        <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-xs text-emerald-800">Your transaction is protected by industry-standard encryption protocols. We do not store your credit card details.</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-emerald-600 text-white rounded-bl-3xl text-xs font-bold uppercase tracking-tighter">
                        Secure Gateway
                    </div>

                    <div className="space-y-8 pt-6">
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-emerald-500 bg-emerald-50 p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all scale-[1.02]">
                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                    <span className="font-bold text-emerald-700 text-sm italic">Direct Bank Transfer</span>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-xl flex items-center justify-center gap-2 opacity-50 grayscale cursor-not-allowed">
                                    <span className="font-bold text-slate-400 text-sm">UPI / Card</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4 shadow-xl">
                            <p className="text-xs italic opacity-60">Bank Account for Transfer:</p>
                            <div className="space-y-1">
                                <p className="text-sm font-bold tracking-widest uppercase italic">HDFC BANK - FARMFUND LTD</p>
                                <p className="text-lg font-mono">50200012345678</p>
                                <div className="flex justify-between text-xs opacity-70">
                                    <p>IFSC: HDFC0001234</p>
                                    <p>Branch: Emerald City</p>
                                </div>
                            </div>
                        </div>

                        <PrimaryButton
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full py-5 text-xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-200"
                        >
                            {loading ? 'Processing Transaction...' : 'Confirm & Buy Stocks'}
                            <ArrowRight className="w-6 h-6" />
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
