import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, ComposedChart
} from 'recharts';
import { IndianRupee, PieChart, Users, ArrowUpRight, Loader2 } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

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
    const { isCEO } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [allocationData, setAllocationData] = useState([]);
    const [expenseData, setExpenseData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Sync request timed out after 30s')), 30000)
            );

            try {
                const fetchData = async () => {
                    const t = Date.now();
                    const endpoints = [
                        { key: 'metrics', url: `${API_URL}/dashboard/metrics?t=${t}`, critical: true },
                        { key: 'allocation', url: `${API_URL}/dashboard/allocation?t=${t}`, critical: true },
                        { key: 'expenses', url: `${API_URL}/dashboard/expenses/analytics?t=${t}` },
                        { key: 'history', url: `${API_URL}/admin/growth-history?t=${t}` },
                        { key: 'performance', url: `${API_URL}/dashboard/performance?t=${t}` }
                    ];

                    const responses = await Promise.all(
                        endpoints.map(e => fetch(e.url).then(res => ({ key: e.key, res, critical: e.critical })))
                    );

                    for (const { key, res, critical } of responses) {
                        if (!res.ok) {
                            if (critical) throw new Error(`${key} fetch failed`);
                            continue;
                        }
                        const data = await res.json();
                        if (key === 'metrics') setMetrics(data);
                        if (key === 'allocation') setAllocationData(data);
                        if (key === 'expenses') setExpenseData(data);
                        if (key === 'history') setHistoryData(data);
                        if (key === 'performance') setPerformanceData(data);
                    }
                };

                await Promise.race([fetchData(), timeoutPromise]);

            } catch (err) {
                console.error("Dashboard Sync Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cumulativeData = React.useMemo(() => {
        if (!expenseData?.breakdown || expenseData.breakdown.length === 0) return [];

        const allKeys = new Set();
        expenseData.breakdown.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'month' && typeof item[key] === 'number') {
                    allKeys.add(key);
                }
            });
        });

        let runningTotals = {};
        allKeys.forEach(key => runningTotals[key] = 0);

        const processed = expenseData.breakdown.map(item => {
            const newItem = { ...item };
            allKeys.forEach(key => {
                const val = item[key] || 0;
                runningTotals[key] += val;
                newItem[key] = runningTotals[key];
            });
            return newItem;
        });

        const startPoint = { month: 'Start' };
        allKeys.forEach(key => startPoint[key] = 0);

        return [startPoint, ...processed];
    }, [expenseData]);

    const cumulativePerformanceData = React.useMemo(() => {
        if (!performanceData?.breakdown || performanceData.breakdown.length === 0) return [];

        const allKeys = new Set();
        performanceData.breakdown.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'month' && typeof item[key] === 'number') {
                    allKeys.add(key);
                }
            });
        });

        let runningTotals = {};
        allKeys.forEach(key => runningTotals[key] = 0);

        const processed = performanceData.breakdown.map(item => {
            const newItem = { ...item };
            allKeys.forEach(key => {
                const val = item[key] || 0;
                runningTotals[key] += val;
                newItem[key] = runningTotals[key];
            });
            return newItem;
        });

        const startPoint = { month: 'Start' };
        allKeys.forEach(key => startPoint[key] = 0);

        return [startPoint, ...processed];
    }, [performanceData]);

    const growthChartData = React.useMemo(() => {
        if (!historyData || historyData.length === 0) return [];

        const points = historyData.map(d => {
            const dateObj = new Date(d.date);
            const lv = Number(d.land_value || 0);
            const pr = Number(d.profits || 0);
            const cap = Number(d.capital || 0);

            return {
                fullDate: dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                month: dateObj.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
                landValue: lv,
                profits: pr,
                capital: cap,
                total: lv + pr + cap
            };
        });

        if (points.length > 0) {
            return [
                {
                    month: 'Start',
                    total: 0,
                    landValue: 0,
                    profits: 0,
                    capital: 0
                },
                ...points
            ];
        }

        return points;
    }, [historyData]);

    const phaseProgress = React.useMemo(() => {
        if (!metrics) return { p1: 0, p2: 0, p3: 0 };
        return {
            p1: metrics.phase1_progress || 0,
            p2: metrics.phase2_progress || 0,
            p3: metrics.phase3_progress || 0
        };
    }, [metrics]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-vh-60 text-slate-400">
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
        <div className="w-full max-w-[1600px] mx-auto space-y-6 md:space-y-8 pb-12 animate-in fade-in duration-500 overflow-x-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4 px-1">
                <div className="min-w-0">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 transition-all">Investment Overview</h2>
                    <p className="text-slate-400 mt-1 text-sm md:text-base font-medium font-medium">Track your farm fund performance and growth.</p>
                </div>
                <div className="bg-emerald-50/50 text-emerald-600 font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-emerald-100/50 flex items-center gap-2 self-start md:self-auto shadow-sm backdrop-blur-sm">
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                    <span className="text-xs md:text-base">+{metrics?.growth_percentage || '0'}% this month</span>
                </div>
            </div>

            {isCEO ? (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 md:gap-6 min-w-0">
                    <StatCard
                        title="Equity Valuation"
                        value={metrics ? `₹${(metrics.total_raised_capital || 0).toLocaleString('en-IN')}` : '₹0'}
                        icon={ArrowUpRight}
                        description="Market value of sold equity"
                    />
                    <StatCard
                        title="Initial Fund"
                        value={metrics ? `₹${(metrics.total_capital || 26500000).toLocaleString('en-IN')}` : '₹2,65,00,000'}
                        icon={IndianRupee}
                        description="Original capital raised/invested"
                    />
                    <StatCard
                        title="Equity Sold"
                        value={metrics ? `${metrics.total_sold_stocks || 0} / 1000` : '0 / 1000'}
                        icon={Users}
                        description={`Currently ${((metrics?.total_sold_stocks || 0) / 10).toFixed(1)}% subscribed`}
                    />
                    <StatCard
                        title="Remaining Equity"
                        value={metrics ? metrics.total_stocks.toLocaleString('en-IN') : '0'}
                        icon={PieChart}
                        description="Stocks available for purchase"
                    />
                    <StatCard
                        title="Remaining Target"
                        value={metrics ? `₹${(metrics.remaining_target_value || 0).toLocaleString('en-IN')}` : '₹0'}
                        icon={ArrowUpRight}
                        description="Potential capital to be raised"
                        className="col-span-2 lg:col-span-1"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-6 min-w-0">
                    <StatCard
                        title="Total Fund Value"
                        value={metrics ? `₹${(metrics.total_fund_value || 26500000).toLocaleString('en-IN')}` : '₹2,65,00,000'}
                        icon={IndianRupee}
                    />
                    <StatCard
                        title="Stocks Purchased"
                        value={metrics ? metrics.total_sold_stocks.toLocaleString('en-IN') : '0'}
                        icon={Users}
                        description="Shares owned by community"
                        trend={{ value: `${((metrics?.total_sold_stocks || 0) / 10).toFixed(1)}% Sold`, positive: true }}
                    />
                    <StatCard
                        title="Stocks Available"
                        value={metrics ? metrics.total_stocks.toLocaleString('en-IN') : '0'}
                        icon={PieChart}
                        description="Shares available for you"
                    />
                    <StatCard
                        title="Stock Price"
                        value={metrics ? `₹${metrics.stock_price.toLocaleString('en-IN')}` : '₹0'}
                        icon={ArrowUpRight}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ChartCard title="Fund Allocation by Phase" className="min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={allocationData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10 }}
                                tickFormatter={(value) => {
                                    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                                    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                                    if (value >= 1000) return `₹${(value / 1000)}k`;
                                    return `₹${value}`;
                                }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={35} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Asset Appreciation (ARR)" className="min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10 }}
                                tickFormatter={(value) => {
                                    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                                    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                                    return `₹${value / 1000}k`;
                                }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
                <ChartCard title="Phase Development Status">
                    <p className="text-xs text-slate-400 mb-6 -mt-4">Current completion status of modular farm infrastructure phases.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                        {[
                            { name: 'Phase 1', color: 'bg-emerald-500', value: phaseProgress.p1 },
                            { name: 'Phase 2', color: 'bg-indigo-500', value: phaseProgress.p2 },
                            { name: 'Phase 3', color: 'bg-rose-500', value: phaseProgress.p3 },
                        ].map((phase) => (
                            <div key={phase.name} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-700">{phase.name}</span>
                                    <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{phase.value}%</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full ${phase.color} transition-all duration-1000 ease-out rounded-full shadow-sm`}
                                        style={{ width: `${phase.value}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    {phase.value === 100 ? 'Fully Completed' : phase.value > 0 ? 'In Development' : 'Scheduled'}
                                </p>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {performanceData && (
                <div className="lg:col-span-3 mt-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 md:gap-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">Fund Valuation & Performance</h2>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">
                                    Cumulative valuation including initial fund, land growth, and profits.
                                </p>
                            </div>
                            <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="text-left md:text-right">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Valuation</p>
                                    <p className="text-xl md:text-2xl font-black text-slate-900">
                                        {formatCurrency((performanceData.total_capital || 0) + (performanceData.total_land_growth || 0) + (performanceData.total_profit || 0))}
                                    </p>
                                </div>
                                <div className="text-right border-l pl-4 md:pl-6 border-slate-100">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Net Growth</p>
                                    <p className="text-xl md:text-2xl font-black text-emerald-600">
                                        {formatCurrency((performanceData.total_land_growth || 0) + (performanceData.total_profit || 0))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={cumulativePerformanceData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 'auto']}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => `₹${val / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                        formatter={(value, name) => [formatCurrency(value), name]}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
                                    />

                                    <Area type="monotone" dataKey="Initial Fund" stackId="1" stroke="#6366f1" fill="url(#colorCapital)" fillOpacity={1} />
                                    <Area type="monotone" dataKey="Profit" stackId="1" stroke="#3b82f6" fill="url(#colorProfit)" fillOpacity={1} />
                                    <Area type="monotone" dataKey="Land Growth" stackId="1" stroke="#f59e0b" fill="url(#colorGrowth)" fillOpacity={1} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {expenseData && (
                <div className="lg:col-span-3 mt-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 md:gap-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">Expense Growth</h2>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">
                                    {isCEO
                                        ? "Cumulative breakdown of capital deployment over time."
                                        : "Track the total capital utilised for farm development."}
                                </p>
                            </div>
                            <div className="flex gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="text-left md:text-right">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Deployed</p>
                                    <p className="text-xl md:text-2xl font-black text-slate-900">
                                        {formatCurrency(expenseData.monthly.reduce((sum, item) => sum + item.total, 0))}
                                    </p>
                                </div>
                                <div className="text-right border-l pl-4 md:pl-6 border-slate-100">
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">This Month</p>
                                    <p className="text-xl md:text-2xl font-black text-emerald-600">
                                        {formatCurrency(expenseData.monthly[expenseData.monthly.length - 1]?.total || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={cumulativeData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLand" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPlant" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 'auto']}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => `₹${val / 1000}k`}
                                    />
                                    {isCEO ? (
                                        <Tooltip
                                            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                padding: '12px'
                                            }}
                                            formatter={(value, name) => [formatCurrency(value), name]}
                                        />
                                    ) : (
                                        <Tooltip
                                            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                padding: '12px'
                                            }}
                                            formatter={(value) => [formatCurrency(value), 'Total Expense']}
                                        />
                                    )}
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
                                    />

                                    {isCEO ? (
                                        <>
                                            <Area type="monotone" dataKey="Land Purchase" stackId="1" stroke="#3b82f6" fill="url(#colorLand)" fillOpacity={1} />
                                            <Area type="monotone" dataKey="Infrastructure" stackId="1" stroke="#8b5cf6" fill="url(#colorInfra)" fillOpacity={1} />
                                            <Area type="monotone" dataKey="Plantation" stackId="1" stroke="#10b981" fill="url(#colorPlant)" fillOpacity={1} />
                                            <Area type="monotone" dataKey="Maintenance" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                                            <Area type="monotone" dataKey="Travel" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                                            <Area type="monotone" dataKey="Management" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                            <Area type="monotone" dataKey="Consultant" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                                        </>
                                    ) : (
                                        <Area type="monotone" dataKey="total" stroke="#0f172a" fill="url(#colorTotal)" strokeWidth={3} />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
