import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Copy, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const libraries = [
  { name: 'Men\'s Shirt', size: '6 pieces · 2.4 m²', dims: 'Min: 120×158 cm', fabric: 'Cotton / Polyester', tint: 'bg-sky-100', id: 'shirt' },
  { name: "Women's Blouse", size: '8 pieces · 1.9 m²', dims: 'Min: 100×149 cm', fabric: 'Silk / Cotton', tint: 'bg-violet-100', id: 'blouse' },
  { name: "Men's Pants", size: '7 pieces · 3.1 m²', dims: 'Min: 150×180 cm', fabric: 'Denim / Cotton', tint: 'bg-emerald-100', id: 'pants' },
  { name: 'Kids Shorts', size: '4 pieces · 0.9 m²', dims: 'Min: 60×80 cm', fabric: 'Cotton / Linen', tint: 'bg-amber-100', id: 'shorts' },
  { name: 'Summer Dress', size: '10 pieces · 3.8 m²', dims: 'Min: 140×200 cm', fabric: 'Silk / Linen', tint: 'bg-yellow-100', id: 'dress' },
  { name: 'Fabric Bag', size: '3 pieces · 0.3 m²', dims: 'Min: 40×60 cm', fabric: 'Cotton / Denim', tint: 'bg-orange-100', id: 'bag' },
  { name: 'Kids Shirt', size: '5 pieces · 0.9 m²', dims: 'Min: 70×100 cm', fabric: 'Cotton', tint: 'bg-green-100', id: 'kidshirt' },
  { name: 'Pocket Set', size: '2 pieces · 0.1 m²', dims: 'Min: 20×30 cm', fabric: 'Cotton / Denim / Linen', tint: 'bg-rose-100', id: 'pocket' },
  { name: "Women's Shorts", size: '5 pieces · 0.8 m²', dims: 'Min: 70×100 cm', fabric: 'Denim / Cotton', tint: 'bg-sky-100', id: 'womshorts' },
];

const filters = ['All', 'Shirts', 'Pants', 'Shorts', 'Dresses', 'Kids', 'Accessories'];

const PatternLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const visibleItems =
    selectedFilter === 'All' ? libraries : libraries.filter((item) => item.id.includes(selectedFilter.toLowerCase().replace(/s$/, '')) || item.name.toLowerCase().includes(selectedFilter.toLowerCase()));

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
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Pattern Library</h1>
            <p className="mt-2 text-sm text-slate-500">9 patterns across 6 categories</p>
          </div>

          <button
            onClick={() => toast.success('Pattern upload started.')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <Upload className="h-4 w-4" />
            Upload Custom Pattern
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500 shadow-sm">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search patterns...</span>
          </div>

          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                selectedFilter === filter
                  ? 'bg-emerald-500 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {visibleItems.map((pattern) => (
            <div key={pattern.name} className={`rounded-2xl border border-slate-200 bg-white p-0 shadow-sm` }>
              <div className={`flex h-28 items-center justify-center rounded-t-2xl ${pattern.tint}`}>
                <div className="h-12 w-20 rounded-md border border-slate-300 bg-slate-200/50" />
              </div>

              <div className="p-4">
                <div className="text-xl font-semibold text-slate-900">{pattern.name}</div>
                <div className="mt-1 text-sm text-slate-500">{pattern.size}</div>
                <div className="mt-2 text-sm text-slate-500">{pattern.dims}</div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  {pattern.fabric.split(' / ').map((fabric) => (
                    <span key={fabric} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                      {fabric}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500">
                  <button onClick={() => navigate('/project/new')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 hover:bg-slate-50">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button onClick={() => navigate('/project/new')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 hover:bg-slate-50">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => toast.success(`${pattern.name} duplicated.`)} className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 hover:bg-slate-50">
                    <Copy className="h-3.5 w-3.5" /> Dup
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternLibrary;
