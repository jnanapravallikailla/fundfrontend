import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { IndianRupee, PieChart, TrendingUp, History, Download, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [portfolioData, setPortfolioData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (user?.email) {
            setLoading(true);
            fetch(`${API_URL}/portfolio?email=${user.email}`)
                .then(res => res.json())
                .then(data => {
                    setPortfolioData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Portfolio Error:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!portfolioData?.is_investor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <PieChart className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Portfolio is empty</h2>
                <p className="text-slate-500 max-w-sm mt-2">Start your investment journey to track your wealth here.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-8 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                    Explore Funds
                </button>
            </div>
        );
    }

    const holdings = portfolioData?.holdings || [];
    const timeline = portfolioData?.timeline || [];
    const history = portfolioData?.history || [];

    const currentVal = portfolioData?.total_portfolio_value || 0;
    const investedVal = holdings.reduce((sum, h) => sum + h.invested_amount, 0);
    const totalReturns = currentVal - investedVal;
    const returnsPercentage = investedVal > 0 ? (totalReturns / investedVal) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
            {/* PERFORMANCE BILLBOARD */}
            <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Portfolio Valuation</h4>
                        </div>
                        <div className="space-y-0">
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-sm">
                                {formatCurrency(currentVal)}
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className={`flex items-center gap-1 font-black text-sm ${totalReturns >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <TrendingUp size={16} />
                                    {totalReturns >= 0 ? '+' : ''}{returnsPercentage.toFixed(2)}%
                                </div>
                                <div className="h-4 w-px bg-white/10" />
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                    Lifetime Growth
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-l border-white/5 pl-8 hidden lg:block">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Initial Capital</p>
                            <p className="text-xl font-bold text-white">{formatCurrency(investedVal)}</p>
                        </div>
                        <div className="space-y-1 pt-4 border-t border-white/5">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Unrealized P&L</p>
                            <p className={`text-xl font-bold ${totalReturns >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-widest transition-all backdrop-blur-md">
                            <Download size={14} />
                            Statement
                        </button>
                    </div>
                </div>

                {/* CHART AREA - Compact & High-End */}
                <div className="h-[250px] w-full mt-12 relative z-10 border-t border-white/5 pt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                                dy={15}
                                tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.5)', padding: '12px' }}
                                labelStyle={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}
                                formatter={(value) => [formatCurrency(value), 'Valuation']}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#10b981"
                                strokeWidth={4}
                                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                                activeDot={{ r: 8, fill: '#10b981', strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* HOLDINGS LIST */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Your Active Holdings</h3>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">{holdings.length} Funds</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {holdings.map((h, i) => {
                        const hReturns = h.current_value - h.invested_amount;
                        const hPerc = (hReturns / h.invested_amount) * 100;
                        return (
                            <div
                                key={i}
                                onClick={() => navigate(`/dashboard/funds/${h.fund_id}`)}
                                className="bg-white p-8 rounded-[40px] border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Fund Identity */}
                                <div className="lg:col-span-4 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all border border-slate-100 group-hover:border-emerald-100 shrink-0">
                                        <PieChart size={28} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase italic tracking-tight leading-none">{h.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border shadow-sm ${h.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                                {h.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                {h.units} Units Owned
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Stack - Grid for better spacing */}
                                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price / Stock</p>
                                        <p className="text-sm font-black text-slate-900">{formatCurrency(h.current_price)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Invested</p>
                                        <p className="text-sm font-black text-slate-900 underline underline-offset-4 decoration-slate-200">{formatCurrency(h.invested_amount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Growth</p>
                                        <div className="flex items-center gap-1.5 font-black text-emerald-500 text-sm">
                                            <TrendingUp size={14} />
                                            +{h.annual_growth || '12.5'}%
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-right md:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Valuation</p>
                                        <div className="space-y-0.5">
                                            <p className="text-lg font-black text-slate-900 leading-none">{formatCurrency(h.current_value)}</p>
                                            <p className={`text-[10px] font-black uppercase tracking-tighter ${hReturns >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {hReturns >= 0 ? '+' : ''}{formatCurrency(hReturns)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-1 flex justify-end">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TRANSACTION HISTORY */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Recent Activity</h3>
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                    {history.length === 0 ? (
                        <div className="p-16 text-center space-y-4">
                            <History className="w-12 h-12 text-slate-100 mx-auto" />
                            <p className="text-slate-400 italic text-sm font-bold uppercase tracking-widest">Secure Ledger Empty</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {history.slice(0, 5).map((row, i) => (
                                <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-emerald-600 transition-colors">{row.funds?.name || 'Vriksha Unit'}</p>
                                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">{new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Equity</span>
                                            <p className="text-sm font-black text-slate-900">+{row.stock_count} units</p>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{formatCurrency(row.amount_paid)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
