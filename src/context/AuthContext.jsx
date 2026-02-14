import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-53688.up.railway.app/api';

export const CEO_EMAIL = "vijay@vriksha.ai";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signUp = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Sign up failed');
        return data;
    };

    const signIn = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Login failed');

        const userData = { ...data, isInvestor: data.is_investor };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return data;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const becomeInvestor = async () => {
        if (!user) return;
        const response = await fetch(`${API_URL}/invest/become-investor?email=${user.email}`, {
            method: 'POST'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to update status');

        const updatedUser = { ...user, isInvestor: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const updateUser = (data) => {
        const updatedUser = { ...user, ...data, isInvestor: data.is_investor ?? user.is_investor };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const isCEO = user?.email === CEO_EMAIL;

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, logout, isCEO, loading, becomeInvestor, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
