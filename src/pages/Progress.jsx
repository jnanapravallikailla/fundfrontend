import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/PrimaryButton';
import {
    Plus, RefreshCw, TrendingUp, Info, Activity, IndianRupee,
    Loader2, Minus, X, CheckCircle2, ChevronRight, BarChart3,
    ArrowUpRight, Building2, MapPin, Target, TreePine, History, LayoutPanelLeft,
    Calendar
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Progress = () => {
    const { isCEO, user } = useAuth();
    const [selectedFundId, setSelectedFundId] = useState(null);
    const [availableFunds, setAvailableFunds] = useState([]);
    const [portfolioData, setPortfolioData] = useState(null);

    // SELECTED FUND STATE
    const [fundState, setFundState] = useState({
        fundName: 'Select an Asset',
        totalFundValue: 0,
        totalStocks: 1000,
        previousStockPrice: 0,
        currentStockPrice: 0,
        priceSurge: 0,
        location: '',
        entryDate: '',
        exitDate: '',
        totalExpenses: 0,
        roadmap: [],
        p1StartDate: '',
        p1EndDate: '',
        p2StartDate: '',
        p2EndDate: '',
        p3StartDate: '',
        p3EndDate: '',
        phaseProgress: {
            phase1: 0,
            phase2: 0,
            phase3: 0
        }
    });

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // MODAL STATE
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: '', title: '', endpoint: '', value: '', date: new Date().toISOString().split('T')[0] });
    const [phaseInputs, setPhaseInputs] = useState({ p1: 0, p2: 0, p3: 0, date: new Date().toISOString().split('T')[0] });
    const [expenseForm, setExpenseForm] = useState({
        title: '',
        amount: '',
        category: 'Infrastructure',
        phase: 1,
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [roadmapForm, setRoadmapForm] = useState([]);
    const [datesForm, setDatesForm] = useState({
        entry: '',
        exit: '',
        p1Start: '',
        p1End: '',
        p2Start: '',
        p2End: '',
        p3Start: '',
        p3End: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const EXPENSE_CATEGORIES = [
        "Land Purchase", "Infrastructure", "Plantation",
        "Maintenance", "Travel", "Management", "Consultant"
    ];

    useEffect(() => {
        const initialize = async () => {
            try {
                // 1. Fetch available funds
                const fundsRes = await fetch(`${API_URL}/dashboard/funds`);
                const funds = await fundsRes.json();
                setAvailableFunds(Array.isArray(funds) ? funds : []);

                // 2. Default to first fund if none selected
                if (funds.length > 0 && !selectedFundId) {
                    setSelectedFundId(funds[0].id);
                }

                // 3. Fetch portfolio for graph data if user is an investor
                if (user?.email) {
                    const portRes = await fetch(`${API_URL}/portfolio?email=${user.email}`);
                    const portData = await portRes.json();
                    setPortfolioData(portData);
                }
            } catch (err) {
                console.error("Initialization error:", err);
            }
        };
        initialize();
    }, [user]);

    useEffect(() => {
        if (selectedFundId) {
            fetchData(selectedFundId);
        }
    }, [selectedFundId]);

    const fetchData = async (fundId) => {
        try {
            setLoading(true);
            const resMetrics = await fetch(`${API_URL}/dashboard/metrics?fundId=${fundId}`);
            const metrics = await resMetrics.json();

            const resActivities = await fetch(`${API_URL}/admin/activities?fundId=${fundId}`);
            const activityData = await resActivities.json();

            setFundState({
                fundName: metrics.fund_name || 'Managed Asset',
                location: metrics.location || 'Chittoor, AP',
                totalFundValue: metrics.total_fund_value || 0,
                totalStocks: metrics.total_stocks || 1000,
                previousStockPrice: metrics.stock_price || 0,
                currentStockPrice: metrics.stock_price || 0,
                totalExpenses: metrics.total_expenses || 0,
                entryDate: metrics.entry_date,
                exitDate: metrics.exit_date,
                roadmap: metrics.roadmap || [
                    { phase: 'Entry', date: "Jan '26", status: 'Completed' },
                    { phase: 'Development', date: "Mar '26", status: 'Active Stage' },
                    { phase: 'Growth', date: "Jun '26", status: 'Planned' },
                    { phase: 'Maturity', date: "Sep '26", status: 'Planned' },
                    { phase: 'Strategic Exit', date: "Dec '26", status: 'Planned' }
                ],
                p1StartDate: metrics.p1_start_date,
                p1EndDate: metrics.p1_end_date,
                p2StartDate: metrics.p2_start_date,
                p2EndDate: metrics.p2_end_date,
                p3StartDate: metrics.p3_start_date,
                p3EndDate: metrics.p3_end_date,
                phaseProgress: {
                    phase1: metrics.phase1_progress || 0,
                    phase2: metrics.phase2_progress || 0,
                    phase3: metrics.phase3_progress || 0
                }
            });
            setActivities(Array.isArray(activityData) ? activityData : []);
        } catch (err) {
            console.error("Error fetching progress data:", err);
        } finally {
            setLoading(false);
        }
    };

    const phaseDates = useMemo(() => {
        if (!fundState.entryDate || !fundState.exitDate) return { p1: {}, p2: {}, p3: {} };
        const entry = new Date(fundState.entryDate);
        const exit = new Date(fundState.exitDate);
        const fmt = (date) => date ? new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

        // Fallback calculations if specific dates aren't set
        const p1EndDefault = new Date(entry); p1EndDefault.setMonth(p1EndDefault.getMonth() + 4);
        const p2StartDefault = new Date(entry); p2StartDefault.setMonth(p2StartDefault.getMonth() + 5);
        const p2EndDefault = new Date(entry); p2EndDefault.setMonth(p2EndDefault.getMonth() + 9);
        const p3StartDefault = new Date(entry); p3StartDefault.setMonth(p3StartDefault.getMonth() + 10);

        return {
            p1: {
                start: fundState.p1StartDate ? fmt(fundState.p1StartDate) : fmt(entry),
                end: fundState.p1EndDate ? fmt(fundState.p1EndDate) : fmt(p1EndDefault)
            },
            p2: {
                start: fundState.p2StartDate ? fmt(fundState.p2StartDate) : fmt(p2StartDefault),
                end: fundState.p2EndDate ? fmt(fundState.p2EndDate) : fmt(p2EndDefault)
            },
            p3: {
                start: fundState.p3StartDate ? fmt(fundState.p3StartDate) : fmt(p3StartDefault),
                end: fundState.p3EndDate ? fmt(fundState.p3EndDate) : fmt(exit)
            }
        };
    }, [fundState]);

    const openModal = (type, title, endpoint, overrideData = null) => {
        const today = new Date().toISOString().split('T')[0];
        if (type === 'phase') {
            setPhaseInputs(overrideData || {
                p1: fundState.phaseProgress.phase1,
                p2: fundState.phaseProgress.phase2,
                p3: fundState.phaseProgress.phase3,
                date: today
            });
        } else if (type === 'expense') {
            setExpenseForm({
                title: '',
                amount: '',
                category: 'Infrastructure',
                phase: 1,
                date: today,
                notes: ''
            });
        } else if (type === 'roadmap') {
            setRoadmapForm(fundState.roadmap);
        } else if (type === 'dates') {
            setDatesForm({
                entry: fundState.entryDate,
                exit: fundState.exitDate,
                p1Start: fundState.p1StartDate || fundState.entryDate,
                p1End: fundState.p1EndDate || '',
                p2Start: fundState.p2StartDate || '',
                p2End: fundState.p2EndDate || '',
                p3Start: fundState.p3StartDate || '',
                p3End: fundState.p3EndDate || fundState.exitDate
            });
        } else {
            setModalConfig(prev => ({ ...prev, value: '', date: today }));
        }
        setModalConfig(prev => ({ ...prev, type, title, endpoint }));
        setShowModal(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!user?.email || !selectedFundId) {
            alert("Identification error: Please select a fund and ensure you are logged in.");
            return;
        }

        setSubmitting(true);

        try {
            let body = {};
            if (modalConfig.type === 'phase') {
                body = {
                    phase1: parseInt(phaseInputs.p1) || 0,
                    phase2: parseInt(phaseInputs.p2) || 0,
                    phase3: parseInt(phaseInputs.p3) || 0,
                    date: phaseInputs.date
                };
            } else if (modalConfig.type === 'expense') {
                // Manually construct body to avoid string pollution
                body = {
                    title: expenseForm.title.trim() || `EXPENSE_${new Date().getTime()}`,
                    amount: parseFloat(expenseForm.amount),
                    category: expenseForm.category,
                    phase: parseInt(expenseForm.phase),
                    date: expenseForm.date,
                    notes: expenseForm.notes || ""
                };
                if (isNaN(body.amount)) throw new Error("Please enter a valid amount");
            } else if (modalConfig.type === 'dates') {
                body = {
                    p1_start_date: datesForm.p1Start,
                    p1_end_date: datesForm.p1End,
                    p2_start_date: datesForm.p2Start,
                    p2_end_date: datesForm.p2End,
                    p3_start_date: datesForm.p3Start,
                    p3_end_date: datesForm.p3End,
                    entry_date: datesForm.entry,
                    exit_date: datesForm.exit
                };
            } else if (modalConfig.type === 'roadmap') {
                body = { roadmap: roadmapForm };
            } else {
                body = { amount: parseFloat(modalConfig.value), date: modalConfig.date };
                if (isNaN(body.amount)) throw new Error("Please enter a valid amount");
            }

            const res = await fetch(`${API_URL}/admin/${modalConfig.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...body, email: user.email, fund_id: selectedFundId })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ detail: "Ledger update failed" }));
                // If it's a 422, detail might be an array of objects
                let errorMsg = "Update failed";
                if (Array.isArray(errorData.detail)) {
                    errorMsg = errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n');
                } else if (typeof errorData.detail === 'string') {
                    errorMsg = errorData.detail;
                }
                throw new Error(errorMsg);
            }

            await fetchData(selectedFundId);
            setShowModal(false);
        } catch (err) {
            console.error("Submission error:", err);
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    const formatRoadmapDate = (dateStr) => {
        if (!dateStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const date = new Date(dateStr);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} '${date.getFullYear().toString().slice(-2)}`;
        }
        return dateStr;
    };

    if (loading && !availableFunds.length) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium animate-pulse text-slate-500">Syncing with Live Ledger...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-32 animate-in fade-in duration-300">

            {/* PORTFOLIO GROWTH GRAPH - OVERVIEW */}
            {portfolioData?.timeline && portfolioData.timeline.length > 1 && (
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Investment Growth</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Portfolio Performance</h3>
                        </div>
                        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Live Yield Tracking</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={portfolioData.timeline}>
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
                                    wrapperStyle={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', paddingBottom: '20px' }}
                                />
                                <Line
                                    name="Total Portfolio"
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                                    animationDuration={500}
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
            )
            }

            {/* FUND SELECTOR */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Asset to View Progress</h3>
                    <p className="text-[10px] font-bold text-slate-400">{availableFunds.length} Active Projects</p>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                    {availableFunds.map(fund => {
                        let displayImage = fund.image_url;
                        if (fund.name?.includes('Avocado')) displayImage = '/2.png';
                        else if (fund.name?.includes('Green Agro')) displayImage = '/2.png';
                        else if (fund.name?.includes('Coastal')) displayImage = '/3.png';
                        return (
                            <button
                                key={fund.id}
                                onClick={() => setSelectedFundId(fund.id)}
                                className={`flex-shrink-0 w-64 p-3 rounded-[32px] border-2 transition-all text-left space-y-4 shadow-sm group ${selectedFundId === fund.id
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 -translate-y-1'
                                    : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'
                                    }`}
                            >
                                <div className="relative h-32 w-full rounded-[24px] overflow-hidden">
                                    <img
                                        src={displayImage || '/img1.png'}
                                        alt={fund.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {selectedFundId === fund.id && (
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                            <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
                                                <Building2 size={16} className="text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="px-3 pb-3">
                                    <h4 className="font-black italic uppercase tracking-tight line-clamp-1 text-sm">{fund.name}</h4>
                                    <div className="flex items-center gap-1 mt-1 opacity-60">
                                        <MapPin size={10} />
                                        <span className="text-[10px] font-bold uppercase">{fund.location}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SELECTED FUND DETAILS */}
            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex justify-between items-end px-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{fundState.fundName}</h2>
                        <p className="text-slate-500 font-medium">Ground-level development milestones for this specific asset.</p>
                    </div>
                    {isCEO && (
                        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-right shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Valuation</p>
                            <p className="text-2xl font-black text-emerald-600 italic tracking-tighter">{formatCurrency(fundState.currentStockPrice)} <span className="text-[10px] text-slate-400 align-top">/ UNIT</span></p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-10 space-y-14">
                        <ProgressBar
                            label="Phase 1: Land Acquisition & Setup"
                            progress={fundState.phaseProgress.phase1}
                            status={`${fundState.phaseProgress.phase1}% milestones reached`}
                            startDate={phaseDates.p1.start}
                            endDate={phaseDates.p1.end}
                            isEditable={isCEO}
                            onEdit={(val) => {
                                const data = {
                                    p1: val,
                                    p2: fundState.phaseProgress.phase2,
                                    p3: fundState.phaseProgress.phase3,
                                    date: new Date().toISOString().split('T')[0]
                                };
                                openModal('phase', 'Sync Phase Progress', 'update-phase', data);
                            }}
                        />
                        <ProgressBar
                            label="Phase 2: Plantation"
                            progress={fundState.phaseProgress.phase2}
                            status={`${fundState.phaseProgress.phase2}% of plantation completed`}
                            startDate={phaseDates.p2.start}
                            endDate={phaseDates.p2.end}
                            isEditable={isCEO}
                            onEdit={(val) => {
                                const data = {
                                    p1: fundState.phaseProgress.phase1,
                                    p2: val,
                                    p3: fundState.phaseProgress.phase3,
                                    date: new Date().toISOString().split('T')[0]
                                };
                                openModal('phase', 'Sync Phase Progress', 'update-phase', data);
                            }}
                        />
                        <ProgressBar
                            label="Phase 3: Operations"
                            progress={fundState.phaseProgress.phase3}
                            status={fundState.phaseProgress.phase3 > 0 ? "Asset generating operational yield" : "Awaiting maturity"}
                            startDate={phaseDates.p3.start}
                            endDate={phaseDates.p3.end}
                            isEditable={isCEO}
                            onEdit={(val) => {
                                const data = {
                                    p1: fundState.phaseProgress.phase1,
                                    p2: fundState.phaseProgress.phase2,
                                    p3: val,
                                    date: new Date().toISOString().split('T')[0]
                                };
                                openModal('phase', 'Sync Phase Progress', 'update-phase', data);
                            }}
                        />
                    </div>

                    {/* STRATEGIC ROADMAP SECTION */}
                    <div className="bg-slate-50/50 border-t border-slate-100 p-10">
                        <div className="flex items-center gap-3 mb-10 text-slate-400 group cursor-default">
                            <History size={18} className="group-hover:text-emerald-500 transition-colors" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-emerald-500 transition-colors">Strategic Roadmap & Exit Strategy</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                            {/* Connector Line */}
                            <div className="absolute top-6 left-8 right-8 h-0.5 bg-slate-200 hidden md:block" />

                            {(fundState.roadmap && fundState.roadmap.length > 0 ? fundState.roadmap : [
                                { phase: 'Entry', date: "Mar '24", status: 'Completed' },
                                { phase: 'Development', date: "Dec '24", status: 'Active Stage' },
                                { phase: 'Growth', date: '2025-27', status: 'Planned' },
                                { phase: 'Maturity', date: '2028', status: 'Planned' },
                                { phase: 'Strategic Exit', date: "Mar '29", status: 'Planned' }
                            ]).map((step, i) => {
                                const isCompleted = step.status?.toLowerCase().includes('completed');
                                const isActive = step.status?.toLowerCase().includes('active');

                                return (
                                    <div key={i} className="relative z-10 space-y-4">
                                        <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center border-2 transition-all duration-500 ${isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : isActive
                                                ? 'bg-white border-emerald-500 text-emerald-500 shadow-xl'
                                                : 'bg-white border-slate-200 text-slate-300'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 size={20} /> : isActive ? <Activity size={20} className="animate-pulse" /> : <TrendingUp size={20} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{step.phase}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatRoadmapDate(step.date)}</p>
                                            <div className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${isCompleted ? 'bg-emerald-50 text-emerald-600' : isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {step.status}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* CEO CONTROL PANEL FOR SELECTED FUND */}
                {isCEO && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />

                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-[20px] backdrop-blur-md">
                                            <Activity className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic uppercase tracking-wider">Financial Control Center</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fundState.fundName}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Deployed capital</p>
                                        <p className="text-3xl font-black text-white italic tracking-tighter">{formatCurrency(fundState.totalExpenses)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
                                    <PrimaryButton onClick={() => openModal('expense', 'Log CapEx/OpEx', 'add-expense')} className="bg-slate-800 text-white hover:bg-slate-700 py-4 rounded-2xl flex items-center justify-center gap-2 font-black italic text-xs uppercase tracking-widest border border-white/10">
                                        <Plus className="w-4 h-4" />
                                        Deploy Capital
                                    </PrimaryButton>
                                    <PrimaryButton onClick={() => openModal('growth', 'Record Land Growth', 'update-growth')} className="bg-emerald-600 text-white hover:bg-emerald-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black italic text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                        <TrendingUp className="w-4 h-4" />
                                        Land Growth
                                    </PrimaryButton>
                                    <PrimaryButton onClick={() => openModal('profit', 'Record Fund Profit', 'add-profit')} className="bg-amber-600 text-white hover:bg-amber-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black italic text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20">
                                        <ArrowUpRight className="w-4 h-4" />
                                        Add Profit
                                    </PrimaryButton>
                                    <PrimaryButton onClick={() => openModal('phase', 'Sync Phase Progress', 'update-phase')} className="bg-rose-600 text-white hover:bg-rose-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black italic text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20">
                                        <RefreshCw className="w-4 h-4" />
                                        Sync Progress
                                    </PrimaryButton>
                                    <PrimaryButton onClick={() => openModal('roadmap', 'Modify Roadmap Plan', 'update-roadmap')} className="bg-indigo-600 text-white hover:bg-indigo-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black italic text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                        <LayoutPanelLeft className="w-4 h-4" />
                                        Update Roadmap
                                    </PrimaryButton>
                                    <PrimaryButton onClick={() => openModal('dates', 'Adjust Project Timeline', 'update-fund-dates')} className="bg-blue-600 text-white hover:bg-blue-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black italic text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                        <Calendar className="w-4 h-4" />
                                        Update Timeline
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>

                        {/* RECENT ACTIVITY FOR SELECTED FUND */}
                        {activities.length > 0 && (
                            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-slate-400" />
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Validated Ledger Activity</h4>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedFundId.slice(0, 8)}</p>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {activities.map((act, i) => (
                                        <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${act.type === 'expense_added' ? 'bg-rose-50 text-rose-600' :
                                                    act.type === 'land_value_updated' ? 'bg-emerald-50 text-emerald-600' :
                                                        act.type === 'profit_added' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {act.type === 'expense_added' ? <Minus size={20} /> : <Plus size={20} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{act.type.replace(/_/g, ' ')}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                        {new Date(act.created_at || act.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            {act.amount > 0 && (
                                                <div className="text-right">
                                                    <p className={`text-lg font-black italic ${act.type === 'expense_added' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {act.type === 'expense_added' ? '-' : '+'}{formatCurrency(act.amount)}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Synced</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CEO ACTION MODAL */}
            {
                showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !submitting && setShowModal(false)} />
                        <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100">
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">{modalConfig.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                                Target Asset: {fundState.fundName}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-50 rounded-full transition-colors border border-slate-100">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleModalSubmit} className="space-y-8">
                                    {modalConfig.type === 'phase' ? (
                                        <div className="space-y-10 py-4">
                                            {['p1', 'p2', 'p3'].map((p, idx) => (
                                                <div key={p} className="space-y-4">
                                                    <div className="flex justify-between items-end">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase {idx + 1} Completion</label>
                                                        <span className="text-xl font-black text-slate-900 italic">{phaseInputs[p]}%</span>
                                                    </div>
                                                    <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden cursor-pointer"
                                                        onClick={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const x = e.clientX - rect.left;
                                                            const val = Math.min(100, Math.max(0, Math.round((x / rect.width) * 100)));
                                                            setPhaseInputs(prev => ({ ...prev, [p]: val }));
                                                        }}>
                                                        <div
                                                            className="absolute inset-y-0 left-0 bg-slate-900 transition-all duration-300 rounded-full"
                                                            style={{ width: `${phaseInputs[p]}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="space-y-2 pt-4 border-t border-slate-50">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adjustment Effective Date</label>
                                                <input
                                                    type="date"
                                                    value={phaseInputs.date}
                                                    onChange={(e) => setPhaseInputs(prev => ({ ...prev, date: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900 uppercase text-xs tracking-widest"
                                                />
                                            </div>
                                        </div>
                                    ) : modalConfig.type === 'expense' ? (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Identification</label>
                                                <input
                                                    type="text"
                                                    value={expenseForm.title}
                                                    onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                                                    placeholder="e.g. INFRASTRUCTURE_SURVEY_01"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-slate-900 uppercase italic placeholder:text-slate-300"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantum (INR)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-6 top-5 text-slate-400 font-black italic">₹</span>
                                                        <input
                                                            type="number"
                                                            value={expenseForm.amount}
                                                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-slate-900 italic text-xl"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Date</label>
                                                    <input
                                                        type="date"
                                                        value={expenseForm.date}
                                                        onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900 uppercase text-xs tracking-widest"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Category</label>
                                                    <select
                                                        value={expenseForm.category}
                                                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-slate-900 uppercase italic text-xs tracking-wider appearance-none"
                                                    >
                                                        {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Development Phase</label>
                                                    <select
                                                        value={expenseForm.phase}
                                                        onChange={(e) => setExpenseForm({ ...expenseForm, phase: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-black text-slate-900 uppercase italic text-xs tracking-wider appearance-none"
                                                    >
                                                        <option value={1}>PHASE 01</option>
                                                        <option value={2}>PHASE 02</option>
                                                        <option value={3}>PHASE 03</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : modalConfig.type === 'roadmap' ? (
                                        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {roadmapForm.map((step, idx) => (
                                                <div key={idx} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-black">
                                                            {idx + 1}
                                                        </div>
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roadmap Point {idx + 1}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">Phase Name</label>
                                                            <input
                                                                value={step.phase}
                                                                onChange={(e) => {
                                                                    const newRoadmap = [...roadmapForm];
                                                                    newRoadmap[idx].phase = e.target.value;
                                                                    setRoadmapForm(newRoadmap);
                                                                }}
                                                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-black italic uppercase outline-none focus:ring-1 focus:ring-emerald-500"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">Schedule/Date</label>
                                                            <div className="relative group">
                                                                <Calendar size={12} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10" />
                                                                <input
                                                                    type="date"
                                                                    value={/^\d{4}-\d{2}-\d{2}$/.test(step.date) ? step.date : ''}
                                                                    onChange={(e) => {
                                                                        const newRoadmap = [...roadmapForm];
                                                                        newRoadmap[idx].date = e.target.value;
                                                                        setRoadmapForm(newRoadmap);
                                                                    }}
                                                                    className="w-full bg-white border border-slate-100 rounded-xl pl-9 pr-4 py-3 text-[11px] font-black uppercase outline-none focus:ring-1 focus:ring-emerald-500 appearance-none relative"
                                                                />
                                                                {!/^\d{4}-\d{2}-\d{2}$/.test(step.date) && (
                                                                    <div className="absolute inset-0 pl-9 pr-10 py-3 pointer-events-none flex items-center">
                                                                        <span className="text-[11px] font-black text-slate-900 uppercase italic">{step.date}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase">Current Status</label>
                                                        <select
                                                            value={step.status}
                                                            onChange={(e) => {
                                                                const newRoadmap = [...roadmapForm];
                                                                newRoadmap[idx].status = e.target.value;
                                                                setRoadmapForm(newRoadmap);
                                                            }}
                                                            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-black italic uppercase outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
                                                        >
                                                            <option value="Planned">Planned</option>
                                                            <option value="Active Stage">Active Stage</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Delayed">Delayed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : modalConfig.type === 'dates' ? (
                                        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-3xl">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Entry Date</label>
                                                    <input
                                                        type="date"
                                                        value={datesForm.entry}
                                                        onChange={(e) => setDatesForm({ ...datesForm, entry: e.target.value })}
                                                        className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900 uppercase text-xs tracking-widest"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Exit Date</label>
                                                    <input
                                                        type="date"
                                                        value={datesForm.exit}
                                                        onChange={(e) => setDatesForm({ ...datesForm, exit: e.target.value })}
                                                        className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900 uppercase text-xs tracking-widest"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                {/* Phase 1 Dates */}
                                                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-4">
                                                    <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Phase 1: Acquisition</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">Start Date</label>
                                                            <input type="date" value={datesForm.p1Start} onChange={(e) => setDatesForm({ ...datesForm, p1Start: e.target.value })} className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">End Date</label>
                                                            <input type="date" value={datesForm.p1End} onChange={(e) => setDatesForm({ ...datesForm, p1End: e.target.value })} className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Phase 2 Dates */}
                                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl space-y-4">
                                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Phase 2: Development</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">Start Date</label>
                                                            <input type="date" value={datesForm.p2Start} onChange={(e) => setDatesForm({ ...datesForm, p2Start: e.target.value })} className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">End Date</label>
                                                            <input type="date" value={datesForm.p2End} onChange={(e) => setDatesForm({ ...datesForm, p2End: e.target.value })} className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Phase 3 Dates */}
                                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-4">
                                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Phase 3: Operations</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">Start Date</label>
                                                            <input type="date" value={datesForm.p3Start} onChange={(e) => setDatesForm({ ...datesForm, p3Start: e.target.value })} className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase">End Date</label>
                                                            <input type="date" value={datesForm.p3End} onChange={(e) => setDatesForm({ ...datesForm, p3End: e.target.value })} className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantum of Adjustment (INR)</label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-6 text-slate-300 font-black italic text-2xl">₹</div>
                                                    <input
                                                        autoFocus
                                                        type="number"
                                                        value={modalConfig.value}
                                                        onChange={(e) => setModalConfig(prev => ({ ...prev, value: e.target.value }))}
                                                        placeholder="0.00"
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-12 pr-6 py-6 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-black text-3xl text-slate-900 italic"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Record Date</label>
                                                <input
                                                    type="date"
                                                    value={modalConfig.date}
                                                    onChange={(e) => setModalConfig(prev => ({ ...prev, date: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900 uppercase text-xs tracking-widest"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <PrimaryButton
                                        className="w-full py-6 rounded-[24px] flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/20 group transition-all"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform text-emerald-400" />
                                                <span className="font-black italic uppercase tracking-[0.2em] text-sm">Commit to Blockchain Ledger</span>
                                            </>
                                        )}
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Progress;
