import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Scissors, Leaf, Layers, Sparkles, CheckCircle2, ArrowRight, 
  Tag, Download, Box, RefreshCw, ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductMatch {
  id: string;
  name: string;
  category: string;
  required_width: number;
  required_height: number;
  market_value: number;
  fit_score: number;
  description: string;
}

const RemnantAnalysis: React.FC = () => {
  const { remnantId } = useParams<{ remnantId: string }>();

  const [remnant, setRemnant] = useState({
    id: remnantId || 'remnant-101',
    fabric_type: 'Cotton Denim 12oz',
    bounding_width: 480,
    bounding_height: 410,
    usable_area_m2: 0.196,
    quality_score: 95,
    defect_count: 0,
  });

  const matches: ProductMatch[] = [
    {
      id: 'm1',
      name: 'Denim Tote Bag Pocket & Strap Set',
      category: 'Bags & Accessories',
      required_width: 400,
      required_height: 350,
      market_value: 18.50,
      fit_score: 98,
      description: 'Fits perfectly inside bounding box. Requires zero additional cutting scrap.',
    },
    {
      id: 'm2',
      name: 'Structured Fabric Organizer Pouch',
      category: 'Home & Lifestyle',
      required_width: 320,
      required_height: 280,
      market_value: 12.00,
      fit_score: 94,
      description: 'Excellent yield. Produces 1 primary pouch body plus 2 accent patches.',
    },
    {
      id: 'm3',
      name: 'Triple-Layer Protective Face Mask (Pack of 3)',
      category: 'Apparel Essentials',
      required_width: 200,
      required_height: 150,
      market_value: 15.00,
      fit_score: 90,
      description: 'Yields 4 mask panels with zero overlap.',
    },
  ];

  const handleSendToProduction = (productName: string) => {
    toast.success(`Sent remnant #${remnant.id} to upcycling job for '${productName}'!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">Fabric Remnant Analysis Engine</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Upcycle Grade A
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            TAGLINE: Don't call it waste until we know what it can become.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
        >
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Remnant Technical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Box className="h-5 w-5 text-amber-400" />
            Remnant Metrics
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Remnant ID</span>
              <span className="font-mono text-white">{remnant.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Fabric Material</span>
              <span className="font-semibold text-white">{remnant.fabric_type}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Max Bounding Rectangle</span>
              <span className="font-mono text-emerald-400 font-bold">{remnant.bounding_width}mm × {remnant.bounding_height}mm</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Usable Area</span>
              <span className="font-bold text-white">{remnant.usable_area_m2} m²</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-400">Quality Rating</span>
              <span className="font-bold text-emerald-400">{remnant.quality_score}% (Flawless)</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Max Potential Salvage Value</span>
              <span className="text-2xl font-extrabold text-amber-400">$18.50 USD</span>
            </div>
          </div>
        </div>

        {/* AI Product Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            AI Upcycling Recommendations
          </h2>

          <div className="space-y-4">
            {matches.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl hover:border-emerald-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {m.fit_score}% Fit Match
                    </span>
                    <span className="text-xs text-slate-400 uppercase font-semibold">{m.category}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <p className="text-xs text-slate-400 max-w-md">{m.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                    <span>Required: <strong>{m.required_width}×{m.required_height}mm</strong></span>
                    <span>Est. Retail Value: <strong className="text-emerald-400">${m.market_value}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleSendToProduction(m.name)}
                  className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Assign to Upcycle</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemnantAnalysis;
