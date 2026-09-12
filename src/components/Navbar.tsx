import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import { logOut } from '@/firebase/auth';
import { Scissors, LayoutDashboard, Plus, Leaf, LogOut, Layers, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      setUser(null);
      navigate('/login');
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      {/* Brand Logo & Tagline */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Scissors className="h-5 w-5 text-emerald-400 transform -rotate-45" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight text-white">EcoCut</span>
            <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
          </div>
          <span className="text-[10px] text-slate-400 block -mt-1 hidden sm:block">Reduce Fabric Waste. Optimize Every Cut.</span>
        </div>
      </Link>

      {/* Center Nav Links (When logged in) */}
      {user && (
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              isActive('/dashboard')
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/project/new"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              isActive('/project')
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Optimizer Wizard</span>
          </Link>

          <Link
            to="/remnant/remnant-1"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              isActive('/remnant')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Remnants</span>
          </Link>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">{user.displayName || user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
