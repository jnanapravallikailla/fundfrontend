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
        <div className="max-w-5xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
            {/* APP STYLE HEADER SUMMARY */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Value</p>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(currentVal)}</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Invested</p>
                            <p className="text-xl font-bold text-slate-700">{formatCurrency(investedVal)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Total Returns</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-xl font-bold ${totalReturns >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)}
                                </p>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${totalReturns >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {returnsPercentage.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CHART AREA */}
                <div className="h-[300px] w-full pt-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                                tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                labelStyle={{ fontWeight: 800, color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                                formatter={(value) => [formatCurrency(value), 'Value']}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', paddingBottom: '20px' }}
                            />
                            <Line
                                name="Total Portfolio"
                                type="monotone"
                                dataKey="total"
                                stroke="#10b981"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                                animationDuration={1500}
                                zIndex={10}
                            />
                            {portfolioData.fund_names?.map((name, idx) => (
                                <Line
                                    key={name}
                                    name={name}
                                    type="monotone"
                                    dataKey={name}
                                    stroke={['#3b82f6', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'][idx % 5]}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* HOLDINGS LIST */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Your Holdings ({holdings.length})</h3>
                <div className="space-y-3">
                    {holdings.map((h, i) => {
                        const hReturns = h.current_value - h.invested_amount;
                        const hPerc = (hReturns / h.invested_amount) * 100;
                        return (
                            <div
                                key={i}
                                onClick={() => navigate(`/dashboard/funds/${h.fund_id}`)}
                                className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all cursor-pointer group"
                            >
                                <div className="space-y-1">
                                    <h4 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase italic tracking-tight">{h.name}</h4>
                                    <p className="text-xs font-bold text-slate-400">{h.units} Units • Avg. {formatCurrency(h.invested_amount / h.units)}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="font-black text-slate-900">{formatCurrency(h.current_value)}</p>
                                    <p className={`text-xs font-bold ${hReturns >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {hReturns >= 0 ? '+' : ''}{hPerc.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TRANSACTION HISTORY */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Transaction History</h3>
                <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
                    {history.length === 0 ? (
                        <p className="p-8 text-center text-slate-400 italic">No transactions found</p>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {history.slice(0, 5).map((row, i) => (
                                <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase italic tracking-tighter">{row.funds?.name || 'Vriksha Unit'}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900">+{row.stock_count} units</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{formatCurrency(row.amount_paid)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {history.length > 5 && (
                    <button className="w-full text-center py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                        View all transactions
                    </button>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
