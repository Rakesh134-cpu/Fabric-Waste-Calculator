import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowUpRight, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Fabric Processed', value: '1,248 m', delta: '+8.4%' },
  { label: 'Material Utilization', value: '94.6%', delta: '+2.1%' },
  { label: 'Waste Reduced', value: '18.4%', delta: '-3.2%' },
  { label: 'Reusable Leftovers', value: '42.7 m²', delta: '+5.6%' },
  { label: 'Estimated Savings', value: '₹48,250', delta: '+13.2%' },
];

const recentJobs = [
  { id: '#1842', job: "Men's Shirt", qty: 50, fabric: '16.8 m', utilization: '95.4%', waste: '4.6%', status: 'Optimized' },
  { id: '#1841', job: 'Kids Shorts', qty: 120, fabric: '22.4 m', utilization: '93.1%', waste: '6.9%', status: 'Optimized' },
  { id: '#1848', job: "Women's Dress", qty: 30, fabric: '14.2 m', utilization: '91.8%', waste: '8.2%', status: 'Optimized' },
  { id: '#1839', job: "Men's Pants", qty: 40, fabric: '19.5 m', utilization: '88.6%', waste: '11.4%', status: 'Standard' },
  { id: '#1838', job: 'Kids Shirt', qty: 80, fabric: '12.6 m', utilization: '96.2%', waste: '3.8%', status: 'Optimized' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const chartPoints = useMemo(
    () => [
      '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%',
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#f3f5f3] text-slate-800">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/60 px-8 py-4 backdrop-blur-sm">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value="Search jobs, patterns..."
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
            PM
          </div>
          <div className="text-sm text-slate-600">Production Manager</div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Good afternoon, Production Manager</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/project/demo')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" />
              New Optimization
            </button>
            <button
              onClick={() => navigate('/remnant/demo')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Analyze Leftover
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="text-3xl font-semibold tracking-tight text-slate-900">{item.value}</div>
                <div className="mb-1 text-xs font-medium text-emerald-600">{item.delta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-semibold text-slate-900">Fabric Utilization Over Time</div>
            <div className="mb-3 text-sm text-slate-500">Previous vs optimized cutting method</div>
            <div className="relative h-48 overflow-hidden rounded-xl bg-slate-50">
              <div className="absolute inset-0 flex flex-col justify-between px-4 py-3 text-xs text-slate-400">
                {chartPoints.map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span>{item}</span>
                    <span className="h-px flex-1 bg-slate-200 ml-3" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-6 bottom-8 top-4">
                <svg viewBox="0 0 500 140" className="h-full w-full" preserveAspectRatio="none">
                  <path d="M0,110 C40,95 80,94 120,88 S200,70 260,72 S340,56 380,60 S450,50 500,52" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0,120 C60,112 110,116 170,118 S280,120 340,124 S420,122 500,126" fill="none" stroke="#dbe4ec" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Optimized</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Previous</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-semibold text-slate-900">Waste Composition</div>
            <div className="mb-6 text-sm text-slate-500">Material breakdown by category</div>
            <div className="flex items-center justify-center">
              <div className="relative h-44 w-44 rounded-full border-[12px] border-emerald-500 border-l-transparent border-b-transparent border-r-emerald-500/80" />
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Used Material</div><span className="font-semibold">94.6%</span></div>
              <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />Reusable Leftover</div><span className="font-semibold">3.2%</span></div>
              <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-300" />True Waste</div><span className="font-semibold">12%</span></div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Production Jobs</h2>
              <button className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                View all <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Garment</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Fabric</th>
                    <th className="px-4 py-3 font-medium">Utilization</th>
                    <th className="px-4 py-3 font-medium">Waste</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{job.id}</td>
                      <td className="px-4 py-3">{job.job}</td>
                      <td className="px-4 py-3">{job.qty}</td>
                      <td className="px-4 py-3">{job.fabric}</td>
                      <td className="px-4 py-3">{job.utilization}</td>
                      <td className="px-4 py-3">{job.waste}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${job.status === 'Optimized' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#f7f9f7] p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">AI Recommendation</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your recent shirt batches have 8.2% avoidable waste. Rotating sleeve patterns and changing the marker arrangement could improve utilization by approximately 4–6%.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Potential saving</span><span className="font-semibold text-slate-900">₹3,20,000/batch</span></div>
              <div className="flex items-center justify-between"><span>Confidence</span><span className="font-semibold text-slate-900">High (94%)</span></div>
              <div className="flex items-center justify-between"><span>Affects</span><span className="font-semibold text-slate-900">Shirt Batch #1042</span></div>
            </div>

            <button
              onClick={() => navigate('/project/demo/results')}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f4d8f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#183f72]"
            >
              View Recommendation
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
