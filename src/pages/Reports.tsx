import React from 'react';
import { Download, FileText, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const weeklyBars = [86, 90, 92, 88, 94, 96, 98];

const Reports: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f3f5f3] text-slate-800">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/60 px-8 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <FileText className="h-4 w-4" />
          <span className="text-sm text-slate-600">December 2024 · Auto-generated</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success('PDF export started.')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button
            onClick={() => toast.success('CSV export started.')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Weekly Production Efficiency</h2>
              <p className="text-sm text-slate-500">Standard vs optimized cutting utilization</p>
            </div>
            <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">+13.4% avg improvement</div>
          </div>

          <div className="flex h-52 items-end gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {weeklyBars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-t-xl bg-emerald-500" style={{ height: `${height}%` }} />
                <span className="text-[11px] text-slate-500">W{index + 44}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Production Efficiency</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Avg utilization (optimized)</span><span className="font-semibold text-emerald-600">94.6%</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Total fabric processed</span><span className="font-semibold text-slate-900">1,248 m</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Jobs completed</span><span className="font-semibold text-slate-900">42</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Waste Analysis</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Total waste generated</span><span className="font-semibold text-emerald-600">57.4 m²</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>True waste (unrecoverable)</span><span className="font-semibold text-slate-900">12.8 m²</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Avoidable waste identified</span><span className="font-semibold text-slate-900">44.6 m²</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Reusable Material</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Leftover captured</span><span className="font-semibold text-emerald-600">42.7 m²</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Products recovered</span><span className="font-semibold text-slate-900">127 units</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Leftover reuse rate</span><span className="font-semibold text-emerald-600">74.8%</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Cost Savings</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Total savings this month</span><span className="font-semibold text-emerald-600">₹48,250</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Avg saving per job</span><span className="font-semibold text-slate-900">₹1,149</span></div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2"><span>Projected annual saving</span><span className="font-semibold text-slate-900">₹5.79L</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
