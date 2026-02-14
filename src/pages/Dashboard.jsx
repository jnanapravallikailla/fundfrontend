import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';
import { IndianRupee, PieChart, Users, ArrowUpRight, Loader2 } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const growthData = [
    { year: 'Year 0', price: 1700000 },
    { year: 'Year 1', price: 2100000 },
    { year: 'Year 2', price: 2600000 },
    { year: 'Year 3', price: 3100000 },
    { year: 'Year 4', price: 3600000 },
    { year: 'Year 5', price: 4000000 },
];

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [allocationData, setAllocationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            // Add a timeout safeguard (5 seconds)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Sync request timed out')), 5000)
            );

            try {
                const fetchData = async () => {
                    // Fetch Fund Metrics
                    const metricsRes = await fetch(`${API_URL}/dashboard/metrics`);
                    const metricsData = await metricsRes.json();
                    if (!metricsRes.ok) throw new Error(metricsData.detail || 'Metrics fetch failed');
                    setMetrics(metricsData);

                    // Fetch Allocation Data
                    const allocRes = await fetch(`${API_URL}/dashboard/allocation`);
                    const allocData = await allocRes.json();
                    if (!allocRes.ok) throw new Error(allocData.detail || 'Allocation fetch failed');
                    setAllocationData(allocData);
                };

                // Race the fetch against the timeout
                await Promise.race([fetchData(), timeoutPromise]);

            } catch (err) {
                console.error("Dashboard Sync Error:", err);
                // Fallback to defaults on error
                if (allocationData.length === 0) {
                    setAllocationData([
                        { name: 'Phase 1', value: 22000000 },
                        { name: 'Phase 2', value: 3575000 },
                        { name: 'Phase 3', value: 1410000 }
                    ]);
                }
                // Optional: Don't show hard error screen, just log it
                // setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                <p className="font-medium animate-pulse text-slate-500">Syncing with FarmFund Ledger...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-3xl border-2 border-rose-100 shadow-xl text-center space-y-6">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Database Connection Error</h3>
                    <p className="text-slate-500 mt-2 text-sm">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Investment Overview</h2>
                    <p className="text-slate-500 mt-1">Track your farm fund performance and growth.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" />
                    +{metrics?.growth_percentage || '0'}% this month
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Fund Value"
                    value={`₹${(metrics?.total_fund_value || 26500000).toLocaleString('en-IN')}`}
                    icon={IndianRupee}
                    trend={{ value: "+₹24L", positive: true }}
                />
                <StatCard
                    title="Total Stocks"
                    value={(metrics?.total_stocks || 1000).toLocaleString('en-IN')}
                    icon={PieChart}
                />
                <StatCard
                    title="Stock Price"
                    value={`₹${(metrics?.stock_price || 26500).toLocaleString('en-IN')}`}
                    icon={Users}
                    trend={{ value: "+₹1.2K", positive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Fund Allocation by Phase">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={allocationData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `₹${value / 1000000}M`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Development Progress (%)">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={[
                                { name: 'Phase 1', progress: metrics?.phase1_progress || 0 },
                                { name: 'Phase 2', progress: metrics?.phase2_progress || 0 },
                                { name: 'Phase 3', progress: metrics?.phase3_progress || 0 },
                            ]}
                            margin={{ left: 20, right: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`${value}%`, 'Completion']}
                            />
                            <Bar dataKey="progress" fill="#059669" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: '#f1f5f9', radius: 4 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="lg:col-span-2">
                    <ChartCard title="Projected Growth (ARR)">
                        <p className="text-xs text-slate-400 mb-4 -mt-4">Expected land appreciation: ₹17L to ₹40L per acre in 5 years.</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value / 100000}L`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
