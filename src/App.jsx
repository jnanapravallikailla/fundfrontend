import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/FundsOverview'));
const FundDashboard = lazy(() => import('./pages/FundDashboard'));
const Progress = lazy(() => import('./pages/Progress'));
const Invest = lazy(() => import('./pages/Invest'));
const Verification = lazy(() => import('./pages/Verification'));
const Payment = lazy(() => import('./pages/Payment'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const FarmLanding = lazy(() => import('./pages/FarmLanding'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Landing = lazy(() => import('./pages/Landing'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingFallback />;
    if (!user) return <Navigate to="/login" replace />;

    return <AppLayout>{children}</AppLayout>;
};

function App() {
    return (
        <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/topography-view" element={<FarmLanding />} />
                    <Route path="/old-landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/dashboard/funds/:fundId" element={
                        <ProtectedRoute>
                            <FundDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/progress" element={
                        <ProtectedRoute>
                            <Progress />
                        </ProtectedRoute>
                    } />

                    <Route path="/invest" element={
                        <ProtectedRoute>
                            <Invest />
                        </ProtectedRoute>
                    } />

                    <Route path="/verification" element={
                        <ProtectedRoute>
                            <Verification />
                        </ProtectedRoute>
                    } />

                    <Route path="/payment" element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    } />

                    <Route path="/portfolio" element={
                        <ProtectedRoute>
                            <Portfolio />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </AuthProvider>
    );
}

export default App;
