import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Wallet, LogOut, ChevronRight, Settings, Bell, Phone, CreditCard, Building, Landmark, Save, X, Loader2 } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

const Profile = () => {
    const { user, logout, isCEO, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        pan_number: user?.pan_number || '',
        aadhaar_number: user?.aadhaar_number || '',
        bank_name: user?.bank_name || '',
        account_number: user?.account_number || '',
        ifsc_code: user?.ifsc_code || '',
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/auth/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, email: user.email })
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const updatedProfile = await res.json();
            updateUser(updatedProfile);
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const profileSections = [
        { title: 'Personal Information', icon: User, value: user?.full_name || 'Profile Incomplete' },
        { title: 'Phone Number', icon: Phone, value: user?.phone || 'Not Linked' },
        { title: 'Identity (PAN/Aadhaar)', icon: Shield, value: user?.pan_number ? 'Verified' : 'Pending' },
        { title: 'Bank Account Settings', icon: Wallet, value: user?.bank_name ? `${user.bank_name} Linked` : 'Not Linked' },
    ];

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-in mt-4 pb-20">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 italic">Complete Your Profile</h2>
                            <p className="text-sm text-slate-500 mt-1">This information is required for legal and tax compliance.</p>
                        </div>
                        <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-10">
                        {/* PERSONAL SECTION */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <User className="w-4 h-4" /> Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                        placeholder="Enter Legal Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* KYC SECTION */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Identity Verification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">PAN Number</label>
                                    <input
                                        type="text"
                                        value={formData.pan_number}
                                        onChange={(e) => setFormData({ ...formData, pan_number: e.target.value?.toUpperCase() || '' })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium uppercase"
                                        placeholder="ABCDE1234F"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Aadhaar Number</label>
                                    <input
                                        type="text"
                                        value={formData.aadhaar_number}
                                        onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                        placeholder="XXXX XXXX XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BANKING SECTION */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Landmark className="w-4 h-4" /> Bank Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Bank Name</label>
                                    <input
                                        type="text"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                        placeholder="e.g. HDFC Bank"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Account Number</label>
                                        <input
                                            type="text"
                                            value={formData.account_number}
                                            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                            placeholder="XXXX XXXX XXXX"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">IFSC Code</label>
                                        <input
                                            type="text"
                                            value={formData.ifsc_code}
                                            onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value?.toUpperCase() || '' })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                            placeholder="HDFC0001234"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <PrimaryButton
                            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl h-14"
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Profile Information
                                </>
                            )}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in mt-4 pb-20">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="h-32 bg-emerald-600 relative">
                    <div className="absolute -bottom-12 left-10 p-1 bg-white rounded-2xl shadow-lg">
                        <div className="w-24 h-24 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black text-2xl border-2 border-emerald-50">
                            {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-10 pb-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 italic">
                                {user?.full_name || (isCEO ? 'Administrator' : 'Explorer')}
                            </h2>
                            <div className="flex items-center gap-2 text-slate-400 mt-1">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">{user?.email || 'user@example.com'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Account Status</p>
                            <p className="font-bold text-slate-900 text-sm italic">Active Account</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Investment</p>
                            <p className="font-bold text-emerald-600 text-sm italic">{user?.isInvestor ? 'Verified Investor' : 'Not Verified'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-50">
                {profileSections.map((section, i) => (
                    <div key={i} className="w-full flex items-center justify-between p-6 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 transition-all">
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 italic text-sm">{section.title}</p>
                                <p className="text-xs text-slate-400 font-medium">{section.value}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-100" />
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <PrimaryButton
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-slate-900 hover:bg-black py-4 font-bold flex items-center justify-center gap-2 shadow-lg h-14"
                >
                    <Settings className="w-5 h-5" />
                    Edit Profile
                </PrimaryButton>
                <button
                    onClick={logout}
                    className="flex-1 border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all h-14"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
