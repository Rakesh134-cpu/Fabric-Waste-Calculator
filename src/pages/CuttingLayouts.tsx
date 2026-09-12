import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Plus, ArrowRight, Layers3 } from 'lucide-react';
import toast from 'react-hot-toast';

const CuttingLayouts: React.FC = () => {
  const navigate = useNavigate();

  const handleExport = () => toast.success('Cutting plan exported successfully.');

  return (
    <div className="min-h-screen bg-[#f3f5f3] text-slate-800">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/60 px-8 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <Search className="h-4 w-4" />
          <input
            type="text"
            value="Search jobs, patterns..."
            readOnly
            className="w-72 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none"
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
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Optimized Cutting Layout</h1>
            <p className="mt-2 text-sm text-slate-500">Strategy C — AI Optimized · Men’s Shirt · 50 units · 150 cm Cotton</p>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <Download className="h-4 w-4" />
            Export Cutting Plan
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                <Search className="h-3.5 w-3.5" />
                <span>100%</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Grid
              </div>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Dimensions
              </div>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                Waste
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#f7f9f7] p-4">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="relative h-28 rounded-lg border border-slate-200 bg-[#dfeaf5] p-2">
                    <div className="flex h-full items-center justify-center text-[10px] font-medium text-slate-500">
                      {item % 2 === 0 ? 'Back' : 'Front'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {['Sleeve', 'Collar', 'Pocket', 'Waste'].map((label, index) => (
                  <div
                    key={label}
                    className={`flex h-16 items-center justify-center rounded-lg border text-[10px] font-medium ${
                      index === 0 || index === 1
                        ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                        : index === 2
                          ? 'border-amber-200 bg-amber-100 text-amber-700'
                          : 'border-rose-200 bg-rose-100 text-rose-700'
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sky-200" /> Body pieces</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-200" /> Sleeves</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber-200" /> Collar</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-200" /> Pocket</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-dashed border-rose-300" /> Reusable leftover</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 text-lg font-semibold text-slate-900">Layout Summary</div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between"><span>Fabric dimensions</span><span className="font-semibold text-slate-900">150 × 1680 cm</span></div>
                <div className="flex items-center justify-between"><span>Pattern area</span><span className="font-semibold text-slate-900">168,800 cm²</span></div>
                <div className="flex items-center justify-between"><span>Used</span><span className="font-semibold text-emerald-600">95.4%</span></div>
                <div className="flex items-center justify-between"><span>Waste</span><span className="font-semibold text-rose-500">4.6%</span></div>
                <div className="flex items-center justify-between"><span>Reusable</span><span className="font-semibold text-amber-500">1.2 m²</span></div>
                <div className="flex items-center justify-between"><span>Est. Saving</span><span className="font-semibold text-slate-900">₹850</span></div>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-emerald-500 border-t-transparent border-r-transparent text-xl font-semibold text-emerald-600">
                  95.4%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/remnant')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Analyze Leftover
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleExport}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuttingLayouts;
