import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import ThemeToggle from '@/components/ThemeToggle';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import ProjectWizard from '@/pages/ProjectWizard';
import OptimizationResults from '@/pages/OptimizationResults';
import RemnantAnalysis from '@/pages/RemnantAnalysis';
import Sustainability from '@/pages/Sustainability';
import ProductionHistory from '@/pages/ProductionHistory';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from '@/firebase/auth';

const App: React.FC = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        setUser({ uid, email, displayName, photoURL });
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full border-4 border-emerald-400 border-t-transparent w-12 h-12" />
      </div>
    );
  }

  const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <PrivateRoute>
              <ProjectWizard />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId/results"
          element={
            <PrivateRoute>
              <OptimizationResults />
            </PrivateRoute>
          }
        />
        <Route
          path="/remnant/:remnantId"
          element={
            <PrivateRoute>
              <RemnantAnalysis />
            </PrivateRoute>
          }
        />
        <Route
          path="/sustainability"
          element={
            <PrivateRoute>
              <Sustainability />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <ProductionHistory />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
