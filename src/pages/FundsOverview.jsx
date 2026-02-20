import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin,
    ArrowUpRight,
    TrendingUp,
    ChevronRight,
    Target,
    PieChart,
    BarChart3,
    Calendar,
    Globe
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

const FundsOverview = () => {
    const navigate = useNavigate();
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFunds = async () => {
            try {
                // For now, we use the specified data if DB isn't ready, 
                // but we attempt to fetch from 'funds' table
                const { data, error } = await supabase
                    .from('funds')
                    .select('*, fund_stocks(stocks_sold, stocks_available)');

                if (data && data.length > 0) {
                    setFunds(data);
                } else {
                    // Fallback to the requested 4 funds if DB is empty/missing
                    const fallbackFunds = [
                        {
                            id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                            name: 'Golden Mango Grove',
                            location: 'Chittoor, AP',
                            target_amount: 26500000,
                            total_stocks: 1000,
                            stock_price: 26500,
                            entry_date: '2026-01-01',
                            exit_date: '2026-12-31',
                            phase: 'Growth',
                            growth_this_month: 12.5,
                            image_url: '/image.png',
                            fund_stocks: { stocks_sold: 850, stocks_available: 150 }
                        },
                        {
                            id: 'e3612b70-4f81-432d-8b01-7c98f2445e69',
                            name: 'Coastal Coconut Estate',
                            location: 'Nellore, AP',
                            target_amount: 31000000,
                            total_stocks: 1200,
                            stock_price: 25800,
                            entry_date: '2026-01-01',
                            exit_date: '2026-12-31',
                            phase: 'Plantation',
                            growth_this_month: 8.2,
                            image_url: '/img2.png',
                            fund_stocks: { stocks_sold: 420, stocks_available: 780 }
                        },
                        {
                            id: 'f4723c81-5a92-413e-9c02-8d09e3556f70',
                            name: 'Avocado Ridge Valley',
                            location: 'Coorg, KA',
                            target_amount: 42000000,
                            total_stocks: 1500,
                            stock_price: 28000,
                            entry_date: '2026-01-01',
                            exit_date: '2026-12-31',
                            phase: 'Development',
                            growth_this_month: 5.4,
                            image_url: '/2.png',
                            fund_stocks: { stocks_sold: 120, stocks_available: 1380 }
                        },
                        {
                            id: 'a1b2c3d4-e5f6-4a5b-bc6d-7e8f9a0b1c2d',
                            name: 'Green Agro Collective',
                            location: 'Anantapur, AP',
                            target_amount: 19000000,
                            total_stocks: 800,
                            stock_price: 23750,
                            entry_date: '2026-01-01',
                            exit_date: '2026-12-31',
                            phase: 'Maintenance',
                            growth_this_month: 15.1,
                            image_url: '/view.jpg',
                            fund_stocks: { stocks_sold: 780, stocks_available: 20 }
                        }
                    ];
                    setFunds(fallbackFunds);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFunds();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Matrix</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1700px] mx-auto space-y-12 pb-20 px-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <Globe size={12} />
                        Global Assets
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Premium Asset Wealth Board</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl">
                        A premium institutional-grade secondary market platform for managed asset funds and high-yield estate holdings.
                    </p>
                </div>
                <div className="flex items-center gap-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AUM Growth</p>
                        <p className="text-2xl font-black text-emerald-600">+22.4%</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
                        <p className="text-2xl font-black text-slate-900">12.2 Cr</p>
                    </div>
                </div>
            </div>

            {/* Funds Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {funds.map((fund) => {
                    const totalCapacity = fund.total_stocks || 1000;
                    const stocksSold = fund.fund_stocks?.[0]?.stocks_sold || 0;
                    const progress = Math.round((stocksSold / totalCapacity) * 100) || 0;
                    const raised = stocksSold * (fund.stock_price || 0);
                    let displayImage = fund.image_url;
                    if (fund.name?.includes('Avocado')) displayImage = '/2.png';
                    else if (fund.name?.includes('Green Agro')) displayImage = '/2.png';
                    else if (fund.name?.includes('Coastal')) displayImage = '/3.png';

                    return (
                        <motion.div
                            key={fund.id}
                            whileHover={{ y: -12 }}
                            onClick={() => navigate(`/dashboard/funds/${fund.id}`)}
                            className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col group transition-all duration-500 relative cursor-pointer"
                        >
                            {/* Image Part */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={displayImage}
                                    alt={fund.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />

                                <div className="absolute top-6 right-6">
                                    <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                                        {fund.phase}
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-8 right-8">
                                    <div className="flex items-center gap-2 text-white/70 mb-1.5">
                                        <MapPin size={14} className="text-emerald-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest">{fund.location}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{fund.name}</h3>
                                </div>
                            </div>

                            {/* Content Part */}
                            <div className="p-8 space-y-8 flex-1 flex flex-col">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Target size={12} /> Target
                                        </p>
                                        <p className="text-base font-black text-slate-900">{formatCurrency(fund.target_amount)}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 justify-end">
                                            Growth <TrendingUp size={12} className="text-emerald-500" />
                                        </p>
                                        <p className="text-base font-black text-emerald-600">+{fund.growth_this_month}%</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Stocks Sold</span>
                                        <span className="text-slate-900">{progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 italic">
                                        {formatCurrency(raised)} raised of {formatCurrency(fund.target_amount)}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-emerald-600 transition-colors">
                                            <PieChart size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stock Price</p>
                                            <p className="text-sm font-black text-slate-900">{formatCurrency(fund.stock_price || 0)}</p>
                                        </div>
                                    </div>
                                    <div
                                        className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 shadow-xl shadow-slate-900/10 group-hover:shadow-emerald-600/20 transition-all duration-300"
                                    >
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Institutional Coming Soon */}
                <div className="bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-6 group">
                    <div className="w-20 h-20 bg-white rounded-[28px] shadow-sm flex items-center justify-center text-slate-300 group-hover:text-emerald-600 group-hover:rotate-12 transition-all duration-500">
                        <BarChart3 size={32} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-900">EVP-05 Evaluation</h4>
                        <p className="text-sm text-slate-400 font-medium max-w-[200px]">
                            Currently auditing a 400-acre sandalwood estate in Karnataka for institutional deployment.
                        </p>
                    </div>
                    <div className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Q3 2025 Release
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FundsOverview;
