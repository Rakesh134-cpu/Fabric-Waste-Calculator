import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Scissors, Download, Layers, Leaf, RefreshCw, CheckCircle2, 
  ArrowRight, ShieldCheck, Eye, FileText, Sparkles, ZoomIn, ZoomOut
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PlacedPiece {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  color: string;
}

interface RemnantBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  usable_area_m2: number;
  suggested_product: string;
}

const OptimizationResults: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [zoom, setZoom] = useState<number>(0.55);
  const [selectedPiece, setSelectedPiece] = useState<PlacedPiece | null>(null);

  // High-fidelity sample optimization layout result data
  const roll = { width: 1500, length: 3200 };
  const utilization = 92.4;
  const fabricSavedM2 = 1.85;
  const costSavedDollars = 26.82;

  const pieces: PlacedPiece[] = [
    { id: '1', name: 'Front Left Panel', x: 20, y: 20, width: 450, height: 650, rotated: false, color: '#10b981' },
    { id: '2', name: 'Front Right Panel', x: 490, y: 20, width: 450, height: 650, rotated: false, color: '#059669' },
    { id: '3', name: 'Back Panel Main', x: 960, y: 20, width: 520, height: 750, rotated: false, color: '#0d9488' },
    { id: '4', name: 'Sleeve Left', x: 20, y: 690, width: 350, height: 550, rotated: false, color: '#14b8a6' },
    { id: '5', name: 'Sleeve Right', x: 390, y: 690, width: 350, height: 550, rotated: false, color: '#06b6d4' },
    { id: '6', name: 'Collar Outer', x: 760, y: 690, width: 480, height: 120, rotated: false, color: '#3b82f6' },
    { id: '7', name: 'Pocket Front A', x: 1260, y: 690, width: 180, height: 200, rotated: false, color: '#6366f1' },
    { id: '8', name: 'Pocket Front B', x: 1260, y: 910, width: 180, height: 200, rotated: false, color: '#8b5cf6' },
    { id: '9', name: 'Waistband Strap', x: 20, y: 1260, width: 1420, height: 140, rotated: false, color: '#ec4899' },
  ];

  const remnants: RemnantBox[] = [
    {
      id: 'remnant-1',
      x: 760,
      y: 830,
      width: 480,
      height: 410,
      usable_area_m2: 0.196,
      suggested_product: 'Face Masks / Small Pouch',
    },
    {
      id: 'remnant-2',
      x: 20,
      y: 1420,
      width: 1460,
      height: 1760,
      usable_area_m2: 2.569,
      suggested_product: 'Tote Bags / Kid Apparel',
    },
  ];

  const handleExportCSV = () => {
    const csvRows = [
      ['Piece ID', 'Name', 'X (mm)', 'Y (mm)', 'Width (mm)', 'Height (mm)', 'Rotated 90°'],
      ...pieces.map((p) => [p.id, p.name, p.x, p.y, p.width, p.height, p.rotated ? 'YES' : 'NO']),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecocut_marker_${projectId || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded Marker CSV Placements!');
  };

  const handleExportSVG = () => {
    toast.success('Exporting DXF/SVG Marker vector file...');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">Optimization Marker Layout</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {utilization}% Efficiency
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Zero-overlap nested cutting plan. Interactive pan & zoom viewer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportSVG}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
          >
            <Scissors className="h-4 w-4" />
            <span>Export DXF / SVG</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs uppercase font-bold text-slate-400 block">Marker Efficiency</span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{utilization}%</span>
          <span className="text-xs text-slate-500 mt-1 block">Wasted area: {((100 - utilization)).toFixed(1)}%</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs uppercase font-bold text-slate-400 block">Fabric Saved</span>
          <span className="text-3xl font-extrabold text-teal-400 mt-1 block">{fabricSavedM2} m²</span>
          <span className="text-xs text-slate-500 mt-1 block">Vs standard grid placement</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs uppercase font-bold text-slate-400 block">Direct Cost Saved</span>
          <span className="text-3xl font-extrabold text-indigo-400 mt-1 block">${costSavedDollars}</span>
          <span className="text-xs text-slate-500 mt-1 block">Per 10-meter fabric roll</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs uppercase font-bold text-slate-400 block">Remnants Recovered</span>
          <span className="text-3xl font-extrabold text-amber-400 mt-1 block">{remnants.length} Blocks</span>
          <span className="text-xs text-slate-500 mt-1 block">Upcycle potential: High</span>
        </div>
      </div>

      {/* Interactive Visualizer Controls & Canvas */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-400" />
              Visual Fabric Roll Marker (1500mm × 3200mm)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* SVG Marker Layout Render */}
        <div className="overflow-auto bg-slate-950 rounded-2xl p-8 border border-slate-800 flex justify-center">
          <div
            style={{
              width: `${roll.width * zoom}px`,
              height: `${roll.length * zoom}px`,
              position: 'relative',
            }}
            className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl shadow-2xl transition-all"
          >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

            {/* Render Nested Pattern Pieces */}
            {pieces.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPiece(p)}
                style={{
                  left: `${p.x * zoom}px`,
                  top: `${p.y * zoom}px`,
                  width: `${p.width * zoom}px`,
                  height: `${p.height * zoom}px`,
                  backgroundColor: p.color,
                }}
                className={`absolute rounded-lg border-2 border-white/30 p-2 text-slate-950 font-extrabold flex flex-col justify-between cursor-pointer hover:scale-[1.02] hover:z-20 transition shadow-lg ${
                  selectedPiece?.id === p.id ? 'ring-4 ring-emerald-400 z-30' : ''
                }`}
              >
                <div className="text-[10px] uppercase font-mono truncate bg-black/30 text-white px-1.5 py-0.5 rounded w-fit">
                  {p.name}
                </div>
                <div className="text-[9px] font-mono text-white/90">
                  {p.width}×{p.height}mm
                </div>
              </div>
            ))}

            {/* Render Reusable Remnant Highlight Boxes */}
            {remnants.map((r) => (
              <div
                key={r.id}
                style={{
                  left: `${r.x * zoom}px`,
                  top: `${r.y * zoom}px`,
                  width: `${r.width * zoom}px`,
                  height: `${r.height * zoom}px`,
                }}
                className="absolute border-2 border-dashed border-emerald-400 bg-emerald-500/10 rounded-lg p-2 flex flex-col justify-center items-center text-center pointer-events-auto hover:bg-emerald-500/20 transition"
              >
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Reusable Remnant ({r.usable_area_m2}m²)
                </span>
                <span className="text-[9px] text-emerald-200 mt-1">Ideal for: {r.suggested_product}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remnant Upcycle Recommendations Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-400" />
            2 Reusable Fabric Remnants Detected
          </h3>
          <p className="text-slate-300 text-sm">
            Don't throw away offcuts. Our AI product-matcher identified high-value accessory patterns for these remnants.
          </p>
        </div>

        <Link
          to="/remnant/remnant-1"
          className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl transition flex items-center gap-2"
        >
          <span>Analyze Remnants & Match Products</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default OptimizationResults;
