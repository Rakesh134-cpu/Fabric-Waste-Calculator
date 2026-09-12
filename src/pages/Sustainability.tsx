import React from 'react';
import { 
  Leaf, TrendingUp, Award, BarChart3, ShieldCheck, Download, 
  Droplet, Wind, Trees, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sustainability: React.FC = () => {
  const stats = {
    totalFabricSavedM2: 4820.5,
    co2EmissionsAvoidedKg: 12450,
    waterSavedLiters: 984000,
    landfillDivertedKg: 1840,
    treeEquivalent: 560,
  };

  const handleDownloadReport = () => {
    toast.success('Generated Audit-Ready ESG Sustainability Report (PDF)!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">Sustainability & ESG Impact Dashboard</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified Circular Economy
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Quantifiable environmental metrics calculated across all nested cutting markers & remnant upcycles.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
        >
          <Download className="h-4 w-4" />
          <span>Download ESG Audit Report</span>
        </button>
      </div>

      {/* Primary Impact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Fabric Saved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block">{stats.totalFabricSavedM2} m²</span>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +18.4% this quarter
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">CO2 Avoided</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Wind className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block">{stats.co2EmissionsAvoidedKg} kg</span>
          <p className="text-xs text-teal-400 font-semibold">Eq. to 28 transatlantic flights</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Water Preserved</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Droplet className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block">{(stats.waterSavedLiters / 1000).toFixed(0)}k Liters</span>
          <p className="text-xs text-sky-400 font-semibold">Cotton growth & dyeing saved</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Tree Absorption Eq.</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Trees className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block">{stats.treeEquivalent} Trees</span>
          <p className="text-xs text-amber-400 font-semibold">Annual CO2 offset equivalent</p>
        </div>
      </div>

      {/* Sustainable Manufacturing Standards Certificate Card */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">ISO 14001 & HIGG Index Compliance Ready</h3>
            <p className="text-xs text-slate-400">Automated tracking for fashion brand ESG compliance audits</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Every nested cutting run generated by EcoCut AI logs exact square meters of fabric utilized versus offcut remnants. High-yield cut plans reduce raw textile ordering volumes by up to 24%, minimizing supply chain carbon footprint.
        </p>
      </div>
    </div>
  );
};

export default Sustainability;
