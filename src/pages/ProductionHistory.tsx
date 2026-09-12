import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, CheckCircle2, ArrowRight, Download, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductionHistory: React.FC = () => {
  const historyItems = [
    {
      id: 'run-109',
      projectName: 'Spring Denim Jacket Line 2026',
      date: '2026-09-12 14:30',
      fabric: 'Cotton Denim 14oz',
      utilization: 93.4,
      piecesPlaced: 42,
      savedM2: 2.15,
      status: 'Completed',
    },
    {
      id: 'run-108',
      projectName: 'Silk Evening Gown Collection',
      date: '2026-09-11 10:15',
      fabric: 'Mulberry Silk Satin',
      utilization: 87.8,
      piecesPlaced: 18,
      savedM2: 1.40,
      status: 'Completed',
    },
    {
      id: 'run-107',
      projectName: 'Athletic Wear Tops Batch #4',
      date: '2026-09-10 16:45',
      fabric: 'Recycled Poly Spandex',
      utilization: 91.2,
      piecesPlaced: 65,
      savedM2: 3.80,
      status: 'Completed',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Clock className="h-8 w-8 text-emerald-400" />
            Production History & Cutting Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete audit trail of all executed marker optimization runs and remnant allocations.
          </p>
        </div>

        <Link
          to="/project/new"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
        >
          <Scissors className="h-4 w-4" />
          <span>New Optimization Run</span>
        </Link>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3.5 rounded-l-xl">Run ID</th>
                <th className="p-3.5">Project Name</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Fabric</th>
                <th className="p-3.5">Efficiency</th>
                <th className="p-3.5">Fabric Saved</th>
                <th className="p-3.5 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">{item.id}</td>
                  <td className="p-3.5 font-semibold text-white">{item.projectName}</td>
                  <td className="p-3.5 text-slate-400">{item.date}</td>
                  <td className="p-3.5 text-slate-300">{item.fabric}</td>
                  <td className="p-3.5 font-extrabold text-emerald-400 text-sm">{item.utilization}%</td>
                  <td className="p-3.5 text-teal-400 font-bold">{item.savedM2} m²</td>
                  <td className="p-3.5 text-right">
                    <Link
                      to={`/project/${item.id}/results`}
                      className="inline-flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition"
                    >
                      <span>View Layout</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionHistory;
