import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, ComposedChart, Bar
} from 'recharts';
import {
    IndianRupee,
    PieChart,
    Users,
    ArrowUpRight,
    Loader2,
    ChevronRight,
    MapPin,
    TreePine,
    Calendar,
    Target,
    Home,
    Waves,
    TrendingUp,
    Briefcase,
    Activity,
    ShieldCheck,
    BarChart3,
    X,
    Plus,
    FileText,
    CheckCircle2,
    Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartCard } from '../components/ChartCard';
import FarmMap from '../components/FarmMap';
import { supabase } from '../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value || 0);

const formatRoadmapDate = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const date = new Date(dateStr);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} '${date.getFullYear().toString().slice(-2)}`;
    }
    return dateStr;
};

const AdminActionCard = ({ icon: Icon, title, color, onClick }) => {
    const colors = {
        emerald: 'hover:border-emerald-500 hover:bg-emerald-50/30 text-emerald-600',
        amber: 'hover:border-amber-500 hover:bg-amber-50/30 text-amber-600',
        blue: 'hover:border-blue-500 hover:bg-blue-50/30 text-blue-600',
        indigo: 'hover:border-indigo-500 hover:bg-indigo-50/30 text-indigo-600'
    };
    return (
        <button onClick={onClick} className={`p-8 bg-white border rounded-[32px] text-left transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 ${colors[color]}`}>
            <Icon className="mb-4 transition-transform group-hover:scale-110" size={32} />
            <h5 className="font-black text-xs uppercase tracking-widest">{title}</h5>
        </button>
    );
};

const FundDashboard = () => {
    const navigate = useNavigate();
    const { fundId } = useParams();
    const { user, isCEO, isManager, assignedFund } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [expenseData, setExpenseData] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);
    const [capitalGrowth, setCapitalGrowth] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [activeModal, setActiveModal] = useState(null); // 'invest', 'expense', 'growth', 'profit', 'phase'
    const [processing, setProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [showActionBar, setShowActionBar] = useState(false);

    // Mock data fallback for the institutional 5-year graph
    const institutionalGraphData = [
        { year: 'Jan', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Feb', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Mar', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Apr', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'May', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Jun', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Jul', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Aug', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Sep', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Oct', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Nov', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
        { year: 'Dec', landAppreciation: 0, profits: 0, fundValue: 0, progress: 0 },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const t = Date.now();
            const [mRes, eRes, pRes, hRes] = await Promise.all([
                fetch(`${API_URL}/dashboard/metrics?fundId=${fundId}&t=${t}`),
                fetch(`${API_URL}/dashboard/expenses/analytics?fundId=${fundId}&t=${t}`),
                fetch(`${API_URL}/dashboard/performance?fundId=${fundId}&t=${t}`),
                fetch(`${API_URL}/admin/growth-history?fundId=${fundId}&t=${t}`)
            ]);

            if (mRes.ok) setMetrics(await mRes.json());
            if (eRes.ok) setExpenseData(await eRes.json());
            if (pRes.ok) setPerformanceData(await pRes.json());
            if (hRes.ok) setCapitalGrowth(await hRes.json());
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fundId]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            // Show only when user has scrolled significantly (past 70% of page)
            setShowActionBar(scrollPercent > 70);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAction = async (endpoint, payload) => {
        setProcessing(true);
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, email: user?.email, fund_id: fundId })
            });

            if (res.ok) {
                setSuccessMsg('Transaction successfully synchronized and ledger updated.');
                setTimeout(() => {
                    setSuccessMsg('');
                    setActiveModal(null);
                    fetchData();
                }, 3000);
            } else {
                const err = await res.json();
                alert(`Error: ${err.detail || 'Action failed'}`);
            }
        } catch (err) {
            alert('Server error occurred during sync.');
        } finally {
            setProcessing(false);
        }
    };

    const cumulativePerformanceData = useMemo(() => {
        if (!performanceData?.breakdown || performanceData.breakdown.length === 0) return [];
        let runningTotals = { 'Initial Fund': 0, 'Profit': 0, 'Land Growth': 0 };
        return performanceData.breakdown.map(item => {
            runningTotals['Initial Fund'] += (item['Initial Fund'] || 0);
            runningTotals['Profit'] += (item['Profit'] || 0);
            runningTotals['Land Growth'] += (item['Land Growth'] || 0);
            return { month: item.month, ...runningTotals };
        });
    }, [performanceData]);

    const currentPhaseLabel = useMemo(() => {
        if (!metrics) return 'Loading...';
        const p1 = metrics.phase1_progress || 0;
        const p2 = metrics.phase2_progress || 0;
        const p3 = metrics.phase3_progress || 0;

        if (p1 < 100) return 'Phase 1: Acquisition';
        if (p2 < 100) return 'Phase 2: Development';
        return 'Phase 3: Operations';
    }, [metrics]);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <Briefcase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-slate-900 font-black uppercase tracking-widest text-xs">Accessing Private Equity Data</p>
                    <p className="text-slate-400 text-[10px] font-bold">Synchronizing with institutional ledger...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1700px] mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* HERO HEADER */}
            <header className="bg-white rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-6">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Portfolio</Link>
                            <ChevronRight size={14} />
                            <span className="text-slate-900">{metrics?.fund_name || 'Asset Fund'}</span>
                        </nav>

                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                                    {metrics?.fund_name || 'Golden Mango Grove'}
                                </h1>
                                <div className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                    {metrics?.status || 'Active Operations'}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-emerald-500" />
                                    <span>{metrics?.location || 'Chittoor, AP'}</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-blue-500" />
                                    <span>Institution Verified Asset</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex items-center gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Growth</p>
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-black text-emerald-600">+{metrics?.growth_percentage || '12.5'}%</span>
                                <TrendingUp className="text-emerald-500" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {(isCEO || (isManager && fundId === assignedFund)) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                    <AdminActionCard icon={TrendingUp} title="Update Land Value" color="emerald" onClick={() => setActiveModal('growth')} />
                    <AdminActionCard icon={Briefcase} title="Declare Profit" color="amber" onClick={() => setActiveModal('profit')} />
                    <AdminActionCard icon={Target} title="ARR Growth Rate" color="blue" onClick={() => setActiveModal('arr')} />
                    <AdminActionCard icon={Activity} title="Phase Progress" color="indigo" onClick={() => setActiveModal('phase')} />
                </div>
            )}

            {/* PREMIUM METRICS BOARD */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-2">
                {/* MODULE 1: INVESTMENT TIMELINE */}
                <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/20 flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><Timer size={20} /></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Investment Timeline</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Entry</p>
                            <p className="text-sm font-black text-slate-900">{metrics?.entry_date || 'Mar 2024'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Exit</p>
                            <p className="text-sm font-black text-slate-900">{metrics?.exit_date || 'Mar 2029'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Phase</p>
                            <p className="text-sm font-black text-emerald-600 italic uppercase tracking-tighter">{currentPhaseLabel}</p>
                        </div>
                    </div>
                </div>

                {/* MODULE 2: ASSET FINANCIALS */}
                <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/20 flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-100/50 transition-colors" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><IndianRupee size={20} /></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Standing</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Fund Target</p>
                            <p className="text-sm font-black text-slate-900">{formatCurrency(metrics?.total_capital || 26500000)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Raised</p>
                            <p className="text-sm font-black text-emerald-600">{formatCurrency(metrics?.total_raised_capital || 0)}</p>
                        </div>
                        <div className="space-y-1 border-l border-slate-100 pl-4">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase">Asset Value</p>
                            <p className="text-sm font-black text-slate-900">{formatCurrency(metrics?.total_fund_value || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* MODULE 3: ESTATE INVENTORY */}
                <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/20 flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-100/50 transition-colors" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100"><PieChart size={20} /></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estate Inventory</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Inventory</p>
                            <p className="text-sm font-black text-slate-900">{metrics?.total_stocks || 0} Stocks</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Stock Price</p>
                            <p className="text-sm font-black text-slate-900">{formatCurrency(metrics?.stock_price)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-blue-500 uppercase">Total Area</p>
                            <p className="text-sm font-black text-slate-900">{metrics?.total_area || '12.5 Acres'}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
                {/* ESTATE TOPOGRAPHY SECTION */}
                <div className="lg:col-span-2 space-y-6">
                    <ChartCard title="Estate Topography & Interactive Blueprint" className="h-[650px] overflow-hidden p-0 relative">
                        <FarmMap
                            showTooltip={true}
                            backgroundImage={
                                metrics?.fund_name?.includes('Avocado') || metrics?.fund_name?.includes('Green Agro')
                                    ? "/2.png"
                                    : metrics?.fund_name?.includes('Coastal')
                                        ? "/3.png"
                                        : "/image.png"
                            }
                        />

                        <div className="absolute bottom-6 left-6 right-6 z-10 grid grid-cols-3 md:grid-cols-6 gap-2">
                            {[
                                { name: 'Mango Block', color: 'bg-amber-500', acres: '2.5', yield: '12T', rev: '24L' },
                                { name: 'Coconut Block', color: 'bg-emerald-500', acres: '3.0', yield: '45k', rev: '18L' },
                                { name: 'Avocado Block', color: 'bg-lime-500', acres: '3.5', yield: '8T', rev: '32L' },
                                { name: 'Natural Pond', color: 'bg-blue-500', acres: '1.5', yield: 'N/A', rev: 'N/A' },
                                { name: 'Admin Hub', color: 'bg-slate-700', acres: '1.0', yield: 'N/A', rev: 'N/A' },
                                { name: 'Access Roads', color: 'bg-slate-300', acres: '1.0', yield: 'N/A', rev: 'N/A' },
                            ].map((zone, i) => (
                                <div key={i} className="bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-white/40 shadow-xl group cursor-help transition-all hover:-translate-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${zone.color}`} />
                                        <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-900">{zone.name}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1">
                                        <div className="flex justify-between text-[9px] font-bold">
                                            <span className="text-slate-400 uppercase">Acres:</span>
                                            <span className="text-slate-900">{zone.acres}</span>
                                        </div>
                                        <div className="flex justify-between text-[9px] font-bold">
                                            <span className="text-slate-400 uppercase">Yield:</span>
                                            <span className="text-emerald-600">{zone.yield}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    {/* PERFORMANCE ANALYTICS GRID */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ChartCard title="Capital Growth & Performance" className="h-[500px]">
                            <div className="flex items-center gap-6 mb-8 mt-2 overflow-x-auto pb-2 no-scrollbar">
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployment</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Land Growth</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profits</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Funding Progress</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="75%" style={{ marginLeft: '-15px' }}>
                                <ComposedChart data={capitalGrowth} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                        tickFormatter={(val) => val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                                    />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6366f1', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
                                        formatter={(value, name) => {
                                            const labels = {
                                                deployment: 'Institutional Deployment',
                                                capital: 'Raised Capital',
                                                landAppreciation: 'Land Growth',
                                                profits: 'Realized Profits',
                                                progress: 'Funding Progress'
                                            };
                                            return [name === 'progress' ? `${value}%` : formatCurrency(value), labels[name] || name];
                                        }}
                                    />
                                    <Line yAxisId="left" type="monotone" dataKey="deployment" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="deployment" />
                                    <Line yAxisId="left" type="monotone" dataKey="landAppreciation" stroke="#f59e0b" strokeWidth={2} dot={false} name="landAppreciation" />
                                    <Line yAxisId="left" type="monotone" dataKey="profits" stroke="#10b981" strokeWidth={2} dot={false} name="profits" />
                                    <Line yAxisId="right" type="monotone" dataKey="progress" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} name="progress" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="ARR Strategic Growth Trend" className="h-[500px]">
                            <div className="flex items-center gap-2 mb-8 mt-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projected Growth (Y0-Y5)</span>
                            </div>
                            <ResponsiveContainer width="100%" height="75%">
                                <AreaChart data={metrics?.arr_timeline || [
                                    { year: 'Y0', growth: 0 },
                                    { year: 'Y1', growth: 10 },
                                    { year: 'Y2', growth: 15 },
                                    { year: 'Y3', growth: 22 },
                                    { year: 'Y4', growth: 28 },
                                    { year: 'Y5', growth: 35 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(val) => `${val}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="growth"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fill="url(#colorARR)"
                                        name="ARR Growth %"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </div>

                {/* ASIDE PANEL */}
                <div className="space-y-8">
                    <ChartCard title="Institutional Expense Tracking">
                        <div className="space-y-8">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cumulative Deployment</p>
                                    <h4 className="text-3xl font-black text-slate-900">{formatCurrency(metrics?.total_expenses || 0)}</h4>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Category Allocation</p>
                                {[
                                    { label: 'Infrastructure', color: 'bg-blue-500', key: 'Infrastructure' },
                                    { label: 'Plantation', color: 'bg-emerald-500', key: 'Plantation' },
                                    { label: 'Maintenance', color: 'bg-amber-500', key: 'Maintenance' },
                                    { label: 'Admin & Hub', color: 'bg-indigo-500', key: 'Management' },
                                ].map((item, i) => {
                                    const totalExp = metrics?.total_expenses || 1;
                                    let catAmount = expenseData?.category_wise?.[item.key] || 0;

                                    // Grouping for Admin & Hub if it's the management key
                                    if (item.key === 'Management') {
                                        catAmount += (expenseData?.category_wise?.['Consultant'] || 0);
                                        catAmount += (expenseData?.category_wise?.['Travel'] || 0);
                                    }

                                    const percentage = metrics?.total_expenses > 0 ? (catAmount / totalExp) * 100 : 0;

                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-slate-700 uppercase">{item.label}</span>
                                                <span className="text-slate-900 underline underline-offset-4 decoration-slate-200">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.4 }} className={`h-full ${item.color} rounded-full`} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </ChartCard>


                    <ChartCard title="Strategic Roadmap & Exit Strategy">
                        <div className="space-y-8 relative py-4">
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100" />
                            {(metrics?.roadmap && metrics.roadmap.length > 0 ? metrics.roadmap : [
                                { phase: 'Entry', date: "Jan '26", status: 'Completed', icon: Target },
                                { phase: 'Development', date: "Mar '26", status: 'Active Stage', icon: Activity },
                                { phase: 'Growth', date: "Jun '26", status: 'Planned', icon: TrendingUp },
                                { phase: 'Maturity', date: "Sep '26", status: 'Planned', icon: TreePine },
                                { phase: 'Strategic Exit', date: "Dec '26", status: 'Planned', icon: ArrowUpRight },
                            ]).map((step, i) => {
                                const isCompleted = step.status?.toLowerCase().includes('completed');
                                const isActive = step.status?.toLowerCase().includes('active');
                                const icons = {
                                    'Entry': Target,
                                    'Development': Activity,
                                    'Growth': TrendingUp,
                                    'Maturity': TreePine,
                                    'Strategic Exit': ArrowUpRight
                                };
                                const Icon = icons[step.phase] || Activity;

                                return (
                                    <div key={i} className={`relative z-10 pl-14 flex flex-col gap-1 ${isCompleted || isActive ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`absolute left-[13px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-emerald-50 border-emerald-500 text-emerald-500' : isActive ? 'bg-emerald-500 border-white shadow-lg text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                                            {isCompleted ? <CheckCircle2 size={12} /> : <Icon size={12} />}
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-900">{step.phase}</span>
                                            <span className="text-slate-400 font-bold">{formatRoadmapDate(step.date)}</span>
                                        </div>
                                        <p className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>{step.status}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </ChartCard>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !processing && setActiveModal(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
                        >
                            {activeModal === 'invest' && (
                                <InvestModal
                                    fund={metrics}
                                    processing={processing}
                                    onClose={() => setActiveModal(null)}
                                    onSubmit={(data) => handleAction('/invest/purchase', data)}
                                    successMsg={successMsg}
                                />
                            )}
                            {activeModal === 'expense' && (
                                <ExpenseModal
                                    processing={processing}
                                    onClose={() => setActiveModal(null)}
                                    onSubmit={(data) => handleAction('/admin/add-expense', data)}
                                    successMsg={successMsg}
                                />
                            )}
                            {activeModal === 'growth' && (
                                <AmountModal
                                    title="Update Land Appreciation"
                                    icon={TrendingUp}
                                    color="blue"
                                    processing={processing}
                                    onClose={() => setActiveModal(null)}
                                    onSubmit={(data) => handleAction('/admin/update-growth', data)}
                                    successMsg={successMsg}
                                />
                            )}
                            {activeModal === 'profit' && (
                                <AmountModal
                                    title="Declare Realized Profit"
                                    icon={Briefcase}
                                    color="amber"
                                    processing={processing}
                                    onClose={() => setActiveModal(null)}
                                    onSubmit={(data) => handleAction('/admin/add-profit', data)}
                                    successMsg={successMsg}
                                />
                            )}
                            {activeModal === 'arr' && (
                                <ARRModal
                                    currentData={metrics?.arr_timeline}
                                    processing={processing}
                                    onClose={() => setActiveModal(null)}
                                    onSubmit={(data) => handleAction('/admin/update-arr', data)}
                                    successMsg={successMsg}
                                />
                            )}
                            {activeModal === 'phase' && (
                                <PhaseModal
                                    current={metrics}
                                    processing={processing}
                                    onClose={() => setActiveModal(null)}
                                    onSubmit={(data) => handleAction('/admin/update-phase', data)}
                                    successMsg={successMsg}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* INVESTOR QUICK ACTION BAR */}
            <AnimatePresence>
                {!isCEO && showActionBar && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (user?.verification_status !== 'verified') {
                                    navigate('/verification', { state: { fundId } });
                                } else {
                                    // Instead of navigating to /invest, open the purchase modal directly for seamless UX
                                    setActiveModal('invest');
                                }
                            }}
                            className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 border border-white/10 flex items-center justify-center gap-4 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex items-center gap-4">
                                <Activity className="text-emerald-400 group-hover:text-white" size={20} />
                                <span>Initialize Asset Acquisition</span>
                                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                            </div>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// MODAL COMPONENTS
const InvestModal = ({ fund, processing, onClose, onSubmit, successMsg }) => {
    const [stocks, setStocks] = useState(1);
    if (successMsg) return <SuccessState msg={successMsg} />;

    return (
        <div className="p-10 space-y-8">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Purchase Stocks</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Asset Order</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Stock Price</span>
                    <span className="text-lg font-black text-slate-900">{formatCurrency(fund?.stock_price || 0)}</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase block">Purchase Stocks</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            min="1"
                            max={fund?.total_stocks || 100}
                            value={stocks}
                            onChange={(e) => setStocks(parseInt(e.target.value) || 0)}
                            className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xl font-black w-full focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Available</p>
                            <p className="text-xs font-black text-slate-900">{fund?.total_stocks || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-black text-slate-900 font-serif">Total Consideration</span>
                    <span className="text-2xl font-black text-emerald-600">{formatCurrency(stocks * (fund?.stock_price || 0))}</span>
                </div>
                <button
                    disabled={processing || stocks < 1}
                    onClick={() => onSubmit({ stock_count: stocks, total_amount: stocks * fund.stock_price })}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {processing ? <Loader2 className="animate-spin" size={18} /> : 'Complete Purchase'}
                </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">Transactions are irreversible after ledger synchronization.</p>
        </div>
    );
};

const ExpenseModal = ({ processing, onClose, onSubmit, successMsg }) => {
    const [data, setData] = useState({ title: '', amount: '', category: 'Infrastructure', phase: 1, notes: '' });
    if (successMsg) return <SuccessState msg={successMsg} />;

    return (
        <div className="p-10 space-y-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sync Expense</h3>
            <div className="space-y-4">
                <input placeholder="Expense Title" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-black text-sm" onChange={e => setData({ ...data, title: e.target.value })} />
                <input type="number" placeholder="Amount (INR)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-black text-sm" onChange={e => setData({ ...data, amount: e.target.value })} />
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-sm" onChange={e => setData({ ...data, category: e.target.value })}>
                    <option>Infrastructure</option>
                    <option>Plantation</option>
                    <option>Maintenance</option>
                    <option>Ops & Admin</option>
                </select>
                <button
                    disabled={processing}
                    onClick={() => onSubmit(data)}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                    {processing ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Post to General Ledger'}
                </button>
            </div>
        </div>
    );
};

const AmountModal = ({ title, icon: Icon, color, processing, onClose, onSubmit, successMsg }) => {
    const [amount, setAmount] = useState('');
    if (successMsg) return <SuccessState msg={successMsg} />;

    const colors = {
        blue: 'focus:ring-blue-500 bg-blue-50 text-blue-600',
        amber: 'focus:ring-amber-500 bg-amber-50 text-amber-600'
    };

    return (
        <div className="p-10 space-y-6">
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${colors[color].split(' ')[1]} ${colors[color].split(' ')[2]}`}><Icon size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incremental Amount (INR)</label>
                    <input
                        type="number"
                        value={amount}
                        className={`w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 font-black text-2xl ${colors[color].split(' ')[0]}`}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <button
                    disabled={processing}
                    onClick={() => onSubmit({ amount: parseFloat(amount) })}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                    {processing ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Authorize Value Update'}
                </button>
            </div>
        </div>
    );
};

const ARRModal = ({ currentData, processing, onClose, onSubmit, successMsg }) => {
    const [rates, setRates] = useState({
        Y1: '', Y2: '', Y3: '', Y4: '', Y5: ''
    });

    useEffect(() => {
        if (currentData && currentData.length > 0) {
            const newRates = { ...rates };
            currentData.forEach(item => {
                if (newRates.hasOwnProperty(item.year)) {
                    newRates[item.year] = item.growth;
                }
            });
            setRates(newRates);
        }
    }, [currentData]);

    if (successMsg) return <SuccessState msg={successMsg} />;

    const handleSubmit = () => {
        const updates = Object.entries(rates)
            .filter(([year, rate]) => rate !== '')
            .map(([year, rate]) => ({
                year,
                growth_rate: parseFloat(rate)
            }));

        if (updates.length > 0) {
            onSubmit({ updates });
        }
    };

    return (
        <div className="p-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600"><TrendingUp size={24} /></div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Strategic ARR Update</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold -mt-2">Configure projected Annualized Rate of Return for all timeline years.</p>

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {['Y1', 'Y2', 'Y3', 'Y4', 'Y5'].map(year => (
                        <div key={year} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-900 shadow-sm">
                                {year}
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Growth Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full bg-transparent outline-none font-black text-xl text-blue-600"
                                    value={rates[year]}
                                    onChange={e => setRates({ ...rates, [year]: e.target.value })}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    disabled={processing}
                    onClick={handleSubmit}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                    {processing ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Sync All Years ARR'}
                </button>
            </div>
        </div>
    );
};

const PhaseModal = ({ current, processing, onClose, onSubmit, successMsg }) => {
    const [phases, setPhases] = useState({
        phase1: current?.phase1_progress || 0,
        phase2: current?.phase2_progress || 0,
        phase3: current?.phase3_progress || 0
    });
    if (successMsg) return <SuccessState msg={successMsg} />;

    return (
        <div className="p-10 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Update Development Phases</h3>
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-center font-black uppercase tracking-widest text-[10px]">
                            <span className="text-slate-500">Phase {i} Deployment</span>
                            <span className="text-slate-900 text-sm">{phases[`phase${i}`]}%</span>
                        </div>
                        <input
                            type="range"
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            value={phases[`phase${i}`]}
                            onChange={e => setPhases({ ...phases, [`phase${i}`]: parseInt(e.target.value) })}
                        />
                    </div>
                ))}
                <button
                    disabled={processing}
                    onClick={() => onSubmit(phases)}
                    className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all font-serif"
                >
                    {processing ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Sync Phase Progress'}
                </button>
            </div>
        </div>
    );
};

const SuccessState = ({ msg }) => (
    <div className="p-12 flex flex-col items-center text-center space-y-6 bg-white animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle2 size={40} />
            </motion.div>
        </div>
        <div className="space-y-2">
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ledger Synchronized</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{msg}</p>
        </div>
    </div>
);

export default FundDashboard;
