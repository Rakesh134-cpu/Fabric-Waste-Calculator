import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logOut } from '@/firebase/auth';
import {
  Scissors,
  LayoutDashboard,
  Sparkles,
  PackageOpen,
  Layers3,
  FolderOpen,
  History,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Production Optimizer', path: '/project', icon: Sparkles },
  { label: 'Leftover Analyzer', path: '/remnant', icon: PackageOpen },
  { label: 'Cutting Layouts', path: '/layouts', icon: Layers3 },
  { label: 'Pattern Library', path: '/patterns', icon: FolderOpen },
  { label: 'Production History', path: '/history', icon: History },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

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

  if (!user) return null;

  return (
    <aside className="w-64 shrink-0 bg-[#0f2238] text-slate-200 border-r border-slate-700/70 flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/70">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#1d3b4f] text-emerald-400">
          <Scissors className="h-4 w-4 -rotate-45" />
        </div>
        <div className="text-lg font-semibold text-white">EcoCut AI</div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);

            return (
              <li key={label}>
                <Link
                  to={path}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-[#1d3a4f] text-white shadow-inner shadow-emerald-500/10'
                      : 'text-slate-300 hover:bg-[#18324c] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700/70 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#16314b] px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300 border border-emerald-500/20">
            {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">Production Manager</div>
            <div className="text-[11px] text-slate-400 truncate">{user.email || 'admin@ecocut.ai'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>

        {/* Sidebar Brand Tagline */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 text-center">
          <div className="text-[11px] font-semibold text-emerald-400/90 tracking-wide uppercase">Sustainable Fashion</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Smarter Tomorrow</div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
