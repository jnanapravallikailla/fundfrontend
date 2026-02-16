import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { Plus, RefreshCw, TrendingUp, Info, Activity, IndianRupee, Loader2, Minus, X, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

const Progress = () => {
    const { isCEO, user } = useAuth();

    // INITIAL DATA STRUCTURE
    const [fundState, setFundState] = useState({
        totalFundValue: 0,
        totalStocks: 1000,
        previousStockPrice: 0,
        currentStockPrice: 0,
        priceSurge: 0,
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
    const [submitting, setSubmitting] = useState(false);

    const EXPENSE_CATEGORIES = [
        "Land Purchase", "Infrastructure", "Plantation",
        "Maintenance", "Travel", "Management", "Consultant"
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const resMetrics = await fetch(`${API_URL}/dashboard/metrics`);
            const metrics = await resMetrics.json();

            const resActivities = await fetch(`${API_URL}/admin/activities`);
            const activityData = await resActivities.json();

            setFundState({
                totalFundValue: metrics.total_fund_value || 0,
                totalStocks: metrics.total_stocks || 1000,
                previousStockPrice: metrics.stock_price || 0,
                currentStockPrice: metrics.stock_price || 0,
                priceSurge: 0,
                phaseProgress: {
                    phase1: metrics.phase1_progress || 0,
                    phase2: metrics.phase2_progress || 0,
                    phase3: metrics.phase3_progress || 0
                }
            });
            setActivities(activityData);
        } catch (err) {
            console.error("Error fetching progress data:", err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, title, endpoint) => {
        const today = new Date().toISOString().split('T')[0];
        if (type === 'phase') {
            setPhaseInputs({
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
        }
        setModalConfig({ type, title, endpoint, value: '', date: today });
        setShowModal(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let body = {};
            if (modalConfig.type === 'phase') {
                body = { phase1: phaseInputs.p1, phase2: phaseInputs.p2, phase3: phaseInputs.p3, date: phaseInputs.date };
            } else if (modalConfig.type === 'expense') {
                body = {
                    ...expenseForm,
                    amount: parseFloat(expenseForm.amount),
                    phase: parseInt(expenseForm.phase)
                };
                if (!body.title || !body.amount) throw new Error("Title and Amount are required");
            } else {
                body = { amount: parseFloat(modalConfig.value), date: modalConfig.date };
                if (isNaN(body.amount)) throw new Error("Please enter a valid amount");
            }

            const res = await fetch(`${API_URL}/admin/${modalConfig.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...body, email: user.email })
            });

            if (!res.ok) throw new Error("Update failed");

            await fetchData();
            setShowModal(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium animate-pulse text-slate-500">Syncing with Live Ledger...</p>
        </div>
    );

    return (
        <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header and Progress Bars - Maintaining Layout */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Farm Development</h2>
                    <p className="text-slate-500 mt-1">Real-time tracking of our infrastructure and agricultural milestones.</p>
                </div>
                {isCEO && (
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stock Price</p>
                        <p className="text-xl font-black text-emerald-600">{formatCurrency(fundState.currentStockPrice)}</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 space-y-12">
                    <ProgressBar
                        label="Phase 1: Land Acquisition & Setup"
                        progress={fundState.phaseProgress.phase1}
                        status={`${fundState.phaseProgress.phase1}% milestones reached`}
                    />
                    <ProgressBar
                        label="Phase 2: Plantation"
                        progress={fundState.phaseProgress.phase2}
                        status={`${fundState.phaseProgress.phase2}% of plantation completed`}
                    />
                    <ProgressBar
                        label="Phase 3: Maintenance"
                        progress={fundState.phaseProgress.phase3}
                        status={`Irrigation and upkeep at ${fundState.phaseProgress.phase3}%`}
                    />
                </div>

                <div className="bg-emerald-50 p-6 border-t border-emerald-100 flex items-start gap-4">
                    <Info className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-emerald-800">
                        <strong>Note:</strong> Progress updates are validated weekly by our ground team. The percentages reflect actual resource allocation and physical completion.
                    </p>
                </div>
            </div>

            {isCEO && (
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-emerald-200 border-dashed animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-600 rounded-lg text-white">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Financial Control Center</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">Metric Recalculation Active</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Value</p>
                                    <p className="text-sm font-bold text-slate-800">{formatCurrency(fundState.totalFundValue)}</p>
                                </div>
                                <div className="text-right border-l pl-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Price Surge</p>
                                    <p className={`text-sm font-bold ${fundState.priceSurge >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {fundState.priceSurge >= 0 ? '+' : ''}{formatCurrency(fundState.priceSurge)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <PrimaryButton onClick={() => openModal('phase', 'Update Phase Progress', 'update-phase')} className="flex items-center justify-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Update Phase
                            </PrimaryButton>
                            <PrimaryButton onClick={() => openModal('expense', 'Log New Expense', 'add-expense')} className="bg-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Expense
                            </PrimaryButton>
                            <PrimaryButton onClick={() => openModal('growth', 'Update Land Growth', 'update-growth')} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 flex items-center justify-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Land Growth
                            </PrimaryButton>
                            <PrimaryButton onClick={() => openModal('profit', 'Add Fund Profit', 'add-profit')} className="bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                Add Profit
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* ACTIVITY LOG */}
                    {activities.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                                <Activity className="w-4 h-4 text-slate-500" />
                                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Management Activity Log</h4>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {activities.map((act, i) => (
                                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${act.type === 'expense_added' ? 'bg-rose-50 text-rose-600' :
                                                act.type === 'land_value_updated' ? 'bg-emerald-50 text-emerald-600' :
                                                    act.type === 'profit_added' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {act.type === 'expense_added' ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 capitalize">{act.type.replace(/_/g, ' ')}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                    {new Date(act.created_at || act.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        {act.amount > 0 && (
                                            <p className={`text-sm font-black ${act.type === 'expense_added' ? 'text-rose-600' : 'text-emerald-600'
                                                }`}>
                                                {act.type === 'expense_added' ? '-' : '+'}{formatCurrency(act.amount)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* CEO ACTION MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !submitting && setShowModal(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{modalConfig.title}</h3>
                                    <p className="text-sm text-slate-500">Authorized Management Action</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleModalSubmit} className="space-y-6">
                                {modalConfig.type === 'phase' ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {['p1', 'p2', 'p3'].map((p, idx) => (
                                                <div key={p} className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phase {idx + 1} (%)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={phaseInputs[p]}
                                                            onChange={(e) => setPhaseInputs(prev => ({ ...prev, [p]: e.target.value }))}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800"
                                                            min="0" max="100"
                                                        />
                                                        <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                                                <input
                                                    type="date"
                                                    value={phaseInputs.date}
                                                    onChange={(e) => setPhaseInputs(prev => ({ ...prev, date: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-800"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : modalConfig.type === 'expense' ? (
                                    <div className="space-y-4">
                                        {/* Title */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expense Title</label>
                                            <input
                                                type="text"
                                                value={expenseForm.title}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                                                placeholder="e.g. Fencing Material"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
                                            />
                                        </div>

                                        {/* Amount & Date */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={expenseForm.amount}
                                                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-800"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                                                <input
                                                    type="date"
                                                    value={expenseForm.date}
                                                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
                                                />
                                            </div>
                                        </div>

                                        {/* Category & Phase */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                                <select
                                                    value={expenseForm.category}
                                                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
                                                >
                                                    {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phase</label>
                                                <select
                                                    value={expenseForm.phase}
                                                    onChange={(e) => setExpenseForm({ ...expenseForm, phase: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
                                                >
                                                    <option value={1}>Phase 1</option>
                                                    <option value={2}>Phase 2</option>
                                                    <option value={3}>Phase 3</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notes (Optional)</label>
                                            <textarea
                                                rows="2"
                                                value={expenseForm.notes}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800 resize-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Amount (INR)</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</div>
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    value={modalConfig.value}
                                                    onChange={(e) => setModalConfig(prev => ({ ...prev, value: e.target.value }))}
                                                    placeholder="0.00"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-xl text-slate-800"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Date</label>
                                            <input
                                                type="date"
                                                value={modalConfig.date}
                                                onChange={(e) => setModalConfig(prev => ({ ...prev, date: e.target.value }))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
                                            />
                                        </div>
                                    </div>
                                )}

                                <PrimaryButton
                                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 group"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Update Live Ledger
                                        </>
                                    )}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Progress;
