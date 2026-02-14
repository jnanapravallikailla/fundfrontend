import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { IndianRupee, PieChart, TrendingUp, History, Download } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const portfolioGrowthData = [
    { month: 'Sep', value: 265000 },
    { month: 'Oct', value: 265000 },
    { month: 'Nov', value: 278000 },
    { month: 'Dec', value: 282000 },
    { month: 'Jan', value: 295000 },
    { month: 'Feb', value: 312000 },
];

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

const Portfolio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user?.isInvestor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                    <PieChart className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight italic">Portfolio Restricted</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Become an investor to view your portfolio and track your farm shares.
                </p>
                <PrimaryButton onClick={() => navigate('/invest')} className="px-8 py-3">
                    Start Investing Now
                </PrimaryButton>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Portfolio</h2>
                    <p className="text-slate-500 mt-1">Review your holdings and growth trajectory.</p>
                </div>
                <PrimaryButton className="flex items-center gap-2 bg-slate-900 border-none">
                    <Download className="w-4 h-4" />
                    Download Certificate
                </PrimaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Stocks Owned"
                    value="12"
                    icon={PieChart}
                />
                <StatCard
                    title="Ownership %"
                    value="1.2%"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Current Value"
                    value="₹3,18,000"
                    icon={IndianRupee}
                    trend={{ value: "+₹53K", positive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Total Growth Track" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={portfolioGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `₹${value / 1000}K`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#16a34a"
                                strokeWidth={4}
                                dot={{ fill: '#16a34a', strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <History className="w-5 h-5 text-slate-400" />
                        <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Recent Activity</h3>
                    </div>
                    <div className="flex-1 space-y-6">
                        {[
                            { type: 'Purchase', date: 'Feb 10, 2026', amount: '₹2,65,000', units: '10 Units', positive: true },
                            { type: 'Price Surge', date: 'Jan 15, 2026', amount: '+₹12,400', units: 'Valuation', positive: true },
                            { type: 'Initial', date: 'Dec 01, 2025', amount: '₹53,000', units: '2 Units', positive: true },
                        ].map((activity, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900 italic">{activity.type}</p>
                                    <p className="text-xs text-slate-400 font-medium">{activity.date}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className={`text-sm font-bold ${activity.positive ? 'text-emerald-600' : 'text-slate-900'}`}>{activity.amount}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{activity.units}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-slate-500 hover:text-primary transition-colors border-t border-slate-50">
                        View All Transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
