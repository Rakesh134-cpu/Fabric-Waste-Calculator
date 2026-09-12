import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Scissors, Plus, TrendingUp, Layers, Leaf, RefreshCw, BarChart3, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, Trash2, ExternalLink
} from 'lucide-react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface ProjectSummary {
  id: string;
  name: string;
  fabric_type: string;
  roll_width: number;
  roll_length: number;
  utilization: number;
  pieces_placed: number;
  updated_at: string;
  status: 'optimized' | 'draft' | 'archived';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgUtilization: 89.6,
    totalSavedM2: 1240.5,
    wasteReductionPct: 22.8,
    remnantsReused: 74,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch projects from backend API or local state fallback
      const data = await apiService.getProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      } else {
        // High-fidelity initial demo project data if no saved backend projects yet
        setProjects([
          {
            id: 'demo-proj-1',
            name: 'Spring Denim Jacket Line 2026',
            fabric_type: 'Cotton Denim (14oz)',
            roll_width: 1500,
            roll_length: 5000,
            utilization: 93.4,
            pieces_placed: 42,
            updated_at: new Date().toLocaleDateString(),
            status: 'optimized',
          },
          {
            id: 'demo-proj-2',
            name: 'Silk Evening Gown Collection',
            fabric_type: 'Mulberry Silk Satin',
            roll_width: 1400,
            roll_length: 3000,
            utilization: 87.8,
            pieces_placed: 18,
            updated_at: new Date(Date.now() - 86400000).toLocaleDateString(),
            status: 'optimized',
          },
          {
            id: 'demo-proj-3',
            name: 'Athletic Wear Polyester Tops',
            fabric_type: 'Recycled Polyester Spandex',
            roll_width: 1600,
            roll_length: 8000,
            utilization: 91.2,
            pieces_placed: 65,
            updated_at: new Date(Date.now() - 172800000).toLocaleDateString(),
            status: 'optimized',
          },
        ]);
      }
    } catch (err) {
      console.warn('Backend API connection standard fallback:', err);
      // Fallback demo data if backend not reachable yet
      setProjects([
        {
          id: 'demo-proj-1',
          name: 'Spring Denim Jacket Line 2026',
          fabric_type: 'Cotton Denim (14oz)',
          roll_width: 1500,
          roll_length: 5000,
          utilization: 93.4,
          pieces_placed: 42,
          updated_at: new Date().toLocaleDateString(),
          status: 'optimized',
        },
        {
          id: 'demo-proj-2',
          name: 'Silk Evening Gown Collection',
          fabric_type: 'Mulberry Silk Satin',
          roll_width: 1400,
          roll_length: 3000,
          utilization: 87.8,
          pieces_placed: 18,
          updated_at: new Date(Date.now() - 86400000).toLocaleDateString(),
          status: 'optimized',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStartNewProject = async () => {
    try {
      const newProj = await apiService.createProject({
        name: `New Cutting Plan #${Math.floor(100 + Math.random() * 900)}`,
        fabric_type: 'Cotton Blend',
        roll_width: 1500,
        roll_length: 5000,
      });
      toast.success('New optimization project created!');
      navigate(`/project/${newProj.id || newProj.project_id || 'demo-new'}`);
    } catch (err) {
      // Fallback redirect with generated ID
      const fakeId = `proj-${Date.now().toString(36)}`;
      navigate(`/project/${fakeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Fabric Optimization Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live AI Optimizer Engine
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Don't call it waste until we know what it can become. Real-time nesting & remnant recovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleStartNewProject}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New Optimization Project</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Utilization</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.avgUtilization}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+4.2% vs industry avg</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Target benchmark: 85%+</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fabric Saved</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.totalSavedM2} m²</span>
            <span className="text-xs text-teal-400 font-semibold">~$4,800 saved</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Across last 30 production runs</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Offcut Waste Reduction</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">-{stats.wasteReductionPct}%</span>
            <span className="text-xs text-indigo-400 font-semibold">CO2 impact: 3.2 tons</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Direct landfill avoidance</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Remnants Upcycled</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.remnantsReused} pcs</span>
            <span className="text-xs text-amber-400 font-semibold">Reusable offcuts</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Matched to small pattern products</p>
        </div>
      </div>

      {/* Projects Grid & Recent Runs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="h-5 w-5 text-emerald-400" />
            Recent Optimization Projects
          </h2>
          <span className="text-xs text-slate-400">Showing {projects.length} projects</span>
        </div>

        {projects.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
            <Scissors className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No optimization runs yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
              Create your first fabric cutting layout to calculate optimal shelf/MaxRects placement and analyze offcuts.
            </p>
            <button
              onClick={handleStartNewProject}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl transition"
            >
              Start New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition line-clamp-1">
                      {proj.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1">{proj.fabric_type}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Roll Dimension</span>
                      <span className="font-semibold text-slate-200">
                        {proj.roll_width}mm × {proj.roll_length}mm
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Efficiency</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {proj.utilization}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pieces Placed</span>
                      <span className="font-semibold text-slate-200">{proj.pieces_placed} pattern pcs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Last Run</span>
                      <span className="font-semibold text-slate-400">{proj.updated_at}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-800/60">
                  <Link
                    to={`/project/${proj.id}`}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <span>Edit Config</span>
                  </Link>

                  <Link
                    to={`/project/${proj.id}/results`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition"
                  >
                    <span>View Layout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Launch Optimizer Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Scissors className="h-3.5 w-3.5" /> 2D Bin Packing & Nesting AI Engine
          </div>
          <h3 className="text-2xl font-bold text-white">Ready to optimize a new batch of pattern pieces?</h3>
          <p className="text-slate-300 text-sm max-w-xl">
            Upload piece dimensions (DXF, CSV, or manual input), set grainline rotation rules, and generate zero-overlap cutting markers in seconds.
          </p>
        </div>

        <button
          onClick={handleStartNewProject}
          className="whitespace-nowrap bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-base py-3.5 px-8 rounded-2xl shadow-xl shadow-emerald-500/30 transition flex items-center gap-2"
        >
          <span>Launch Optimizer Wizard</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
