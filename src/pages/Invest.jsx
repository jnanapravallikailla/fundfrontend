import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Minus, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

const MIN_STOCKS = 10;

const Invest = () => {
    const [stockCount, setStockCount] = useState(MIN_STOCKS);
    const [fundMetrics, setFundMetrics] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetch(`${API_URL}/dashboard/metrics`)
            .then(res => res.json())
            .then(data => setFundMetrics(data))
            .catch(err => console.error("Error fetching metrics:", err));
    }, []);

    const stockPrice = fundMetrics?.stock_price || 26500;
    const totalAmount = stockCount * stockPrice;

    const ownershipPercentage = React.useMemo(() => {
        if (!fundMetrics?.total_stocks) return 0;
        return (stockCount / fundMetrics.total_stocks) * 100;
    }, [stockCount, fundMetrics]);

    const handleIncrement = () => setStockCount(prev => prev + 1);
    const handleDecrement = () => setStockCount(prev => Math.max(MIN_STOCKS, prev - 1));

    const handleContinue = () => {
        if (user?.verification_status === 'verified') {
            navigate('/payment', { state: { stockCount, totalAmount, fundId: fundMetrics?.id } });
        } else {
            navigate('/verification', { state: { stockCount, totalAmount, fundId: fundMetrics?.id } });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Investment</h2>
                <p className="text-slate-500">Grow your portfolio by investing in high-yield farmland.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                            <span className="text-slate-500 font-medium text-lg">Current Stock Price</span>
                            <span className="text-2xl font-bold text-slate-900 italic">₹{stockPrice.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Number of Stocks</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleDecrement}
                                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                                    disabled={stockCount <= MIN_STOCKS}
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <input
                                    type="number"
                                    value={stockCount}
                                    onChange={(e) => setStockCount(Math.max(MIN_STOCKS, parseInt(e.target.value) || MIN_STOCKS))}
                                    className="flex-1 text-center text-xl font-bold py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button
                                    onClick={handleIncrement}
                                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight italic">Minimum purchase: {MIN_STOCKS} stocks</p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Total Investment</span>
                            <span className="text-2xl font-black text-emerald-700 italic">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                            <span className="text-slate-500 font-medium text-sm">Ownership Stake</span>
                            <div className="text-right">
                                <span className="text-lg font-bold text-slate-900">{ownershipPercentage.toFixed(3)}%</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">of total fund equity</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-600 p-8 rounded-2xl shadow-xl flex flex-col justify-between text-white">
                    <div className="space-y-6">
                        <div className="p-3 bg-white/10 rounded-xl w-fit">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold leading-tight">Secure Your Spot in Premium Estates</h3>
                        <ul className="space-y-4 opacity-90">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0 mt-1">✓</div>
                                <p className="text-sm">Vested land ownership through fund stocks.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0 mt-1">✓</div>
                                <p className="text-sm">Projected 3.5x returns over 7-10 years.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0 mt-1">✓</div>
                                <p className="text-sm">Completely managed by farm experts.</p>
                            </li>
                        </ul>
                    </div>

                    <PrimaryButton
                        onClick={handleContinue}
                        className="w-full bg-white text-emerald-700 hover:bg-slate-100 py-4 font-bold text-lg flex items-center justify-center gap-2 mt-8"
                    >
                        {user?.isInvestor ? 'Continue to Payment' : 'Continue to Verification'}
                        <ArrowRight className="w-5 h-5" />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default Invest;
