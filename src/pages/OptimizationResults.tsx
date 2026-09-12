import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Download, Eye, Leaf, Scissors, ZoomIn, ZoomOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Garment3DViewer from '@/components/Garment3DViewer';
import { normalizeGarmentType, type GarmentType } from '@/data/garmentModels';
import { generateMarkerPlacements, generatePatternForGarment, totalPatternAreaCm2, type PatternGeometry, type PatternPlacement } from '@/services/patternGeometry';

const ROLL_WIDTH_CM = 150;
const textureId = 'fabricTexture';

const PatternShape = ({ piece, textureUrl, className = '' }: { piece: PatternGeometry; textureUrl: string | null; className?: string }) => (
  <svg viewBox={`-3 -3 ${piece.widthCm + 6} ${piece.heightCm + 6}`} className={className} role="img" aria-label={piece.name} preserveAspectRatio="none">
    <defs><pattern id={`${textureId}-${piece.id}`} width="18" height="18" patternUnits="userSpaceOnUse">
      {textureUrl ? <image href={textureUrl} width="18" height="18" preserveAspectRatio="xMidYMid slice" /> : <><rect width="18" height="18" fill="#3b82a0" /><path d="M0 4L18 0M0 12L18 8M0 18L18 14" stroke="#8cc5d2" strokeWidth="1" opacity=".4" /></>}
    </pattern></defs>
    <path d={piece.path} fill={`url(#${textureId}-${piece.id})`} stroke="#b7e5e4" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
  </svg>
);

const MarkerPiece = ({ placement, textureUrl, selected, onSelect, zoom }: { placement: PatternPlacement; textureUrl: string | null; selected: boolean; onSelect: () => void; zoom: number }) => (
  <g transform={`translate(${placement.x} ${placement.y}) rotate(${placement.rotation} ${placement.widthCm / 2} ${placement.heightCm / 2})`} onClick={onSelect} className="cursor-pointer">
    <defs><pattern id={`marker-${placement.id}`} width="18" height="18" patternUnits="userSpaceOnUse">{textureUrl ? <image href={textureUrl} width="18" height="18" preserveAspectRatio="xMidYMid slice" /> : <><rect width="18" height="18" fill="#3b82a0" /><path d="M0 4L18 0M0 12L18 8M0 18L18 14" stroke="#8cc5d2" strokeWidth="1" opacity=".4" /></>}</pattern></defs>
    <path d={placement.path} fill={`url(#marker-${placement.id})`} stroke="#b7e5e4" strokeWidth="0.8" />
    {selected && <rect x="-1" y="-1" width={placement.widthCm + 2} height={placement.heightCm + 2} fill="none" stroke="#49f2c4" strokeWidth={1.2 / zoom} strokeDasharray={`${2 / zoom} ${1 / zoom}`} />}
    <text x="2" y="6" fontSize={Math.max(2.2, 3 / zoom)} fill="#eaffff" fontWeight="700">{placement.name.toUpperCase()}</text>
    <text x="2" y={placement.heightCm - 2} fontSize={Math.max(2, 2.6 / zoom)} fill="#d2f8f2">{placement.widthCm} x {placement.heightCm} cm</text>
  </g>
);

const PieceCard = ({ piece, textureUrl }: { piece: PatternGeometry; textureUrl: string | null }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3 shadow-lg">
    <div className="mb-2 flex items-start justify-between gap-2"><div><div className="text-xs font-bold uppercase tracking-wide text-slate-100">{piece.name}</div><div className="text-[11px] text-slate-400">{piece.quantity} piece · {piece.rotationAllowed ? 'Rotation allowed' : 'Grain locked'}</div></div><span className="rounded bg-slate-800 px-1.5 py-1 text-[10px] text-cyan-200">{piece.grainDirection}</span></div>
    <div className="flex h-40 items-center justify-center rounded-lg bg-slate-950/70 p-3"><PatternShape piece={piece} textureUrl={textureUrl} className="h-full w-full" /></div>
    <div className="mt-2 flex justify-between text-xs text-slate-300"><span>{piece.heightCm} cm</span><span>{piece.widthCm} x {piece.heightCm} cm</span></div>
  </div>
);

const OptimizationResults: React.FC = () => {
  const [zoom, setZoom] = useState(3.2);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<GarmentType>(() => normalizeGarmentType(window.localStorage.getItem('ecocut:selected-garment') || 'shirt'));
  const pieces = useMemo(() => generatePatternForGarment(selectedGarment), [selectedGarment]);
  const placements = useMemo(() => generateMarkerPlacements(pieces), [pieces]);
  const requiredLength = Math.max(...placements.map((piece) => piece.y + piece.heightCm)) + 1;
  const patternAreaM2 = totalPatternAreaCm2(pieces) / 10000;
  const fabricUsedM2 = (ROLL_WIDTH_CM * requiredLength) / 10000;
  const wasteAreaM2 = Math.max(0, fabricUsedM2 - patternAreaM2);
  const utilization = fabricUsedM2 ? (patternAreaM2 / fabricUsedM2) * 100 : 0;

  useEffect(() => { setTextureUrl(window.localStorage.getItem('ecocut:fabric-image')); }, []);

  const handleExportCSV = () => {
    const rows = [['Piece ID', 'Name', 'X (cm)', 'Y (cm)', 'Width (cm)', 'Height (cm)', 'Rotation']];
    placements.forEach((piece) => rows.push([piece.id, piece.name, String(piece.x), String(piece.y), String(piece.widthCm), String(piece.heightCm), String(piece.rotation)]));
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows.map((row) => row.join(',')).join('\n'))}`;
    link.download = 'ecocut-parametric-marker.csv'; link.click(); toast.success('Marker placements exported.');
  };

  return <div className="min-h-screen bg-[#07111f] px-4 py-5 text-slate-100 md:px-8"><div className="mx-auto max-w-[1500px] space-y-5">
    <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-end"><div><div className="mb-2 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">Deterministic SVG marker</div><h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Optimization Marker Layout</h1><p className="mt-1 text-sm text-slate-400">Parametric shirt pattern geometry with collision-free placement.</p></div><div className="flex gap-2"><button onClick={handleExportCSV} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200"><Download className="h-4 w-4" /> Export CSV</button><button onClick={() => toast.success('SVG marker is ready for export.')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950"><Scissors className="h-4 w-4" /> Export SVG</button></div></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Pattern area" value={`${patternAreaM2.toFixed(3)} m²`} note="10 generated silhouettes" /><Stat label="Required fabric" value={`${requiredLength.toFixed(1)} cm`} note={`${ROLL_WIDTH_CM} cm marker width`} /><Stat label="Utilization" value={`${utilization.toFixed(1)}%`} note={`Waste ${wasteAreaM2.toFixed(3)} m²`} /><Stat label="Rotation policy" value="Grain aware" note="Collar and cuffs locked" /></div>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_480px]"><div className="min-w-0 space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-4 shadow-2xl"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Eye className="h-4 w-4 text-emerald-300" /><h2 className="font-bold text-white">Cutting Layout (Optimized)</h2></div><div className="flex items-center gap-2"><button onClick={() => setZoom((value) => Math.max(2, value - 0.4))} className="rounded-lg border border-slate-700 p-2 text-slate-300"><ZoomOut className="h-4 w-4" /></button><span className="w-12 text-center text-xs text-slate-400">{Math.round(zoom * 100 / 3.2)}%</span><button onClick={() => setZoom((value) => Math.min(5, value + 0.4))} className="rounded-lg border border-slate-700 p-2 text-slate-300"><ZoomIn className="h-4 w-4" /></button></div></div><div className="overflow-auto rounded-xl border border-dashed border-cyan-400/30 bg-[#050c18] p-5"><div className="mb-2 text-center text-[10px] font-bold uppercase tracking-[.3em] text-slate-500">Fabric roll · {ROLL_WIDTH_CM} × {requiredLength.toFixed(0)} cm</div><svg viewBox={`0 0 ${ROLL_WIDTH_CM} ${requiredLength}`} style={{ width: `${ROLL_WIDTH_CM * zoom}px`, height: `${requiredLength * zoom}px` }} className="mx-auto block min-w-[620px] rounded border border-cyan-300/40 bg-[#122b38] shadow-[0_0_30px_rgba(34,211,238,.08)]"><defs><pattern id="markerGrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#2d6871" strokeWidth=".22" opacity=".6" /></pattern></defs><rect width={ROLL_WIDTH_CM} height={requiredLength} fill="url(#markerGrid)" />{placements.map((piece) => <MarkerPiece key={piece.id} placement={piece} textureUrl={textureUrl} zoom={zoom} selected={selectedPiece === piece.id} onSelect={() => setSelectedPiece(piece.id)} />)}</svg></div><div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-300" />Actual SVG pattern boundary</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />Fabric texture</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full border border-dashed border-emerald-300" />Selected piece</span></div></div>
      <div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-4"><h2 className="mb-4 text-lg font-bold text-white">Pattern Pieces</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pieces.map((piece) => <PieceCard key={piece.id} piece={piece} textureUrl={textureUrl} />)}</div></div>
    </div><aside className="space-y-5"><div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-4"><h2 className="mb-3 text-lg font-bold text-white">3D Preview</h2><div className="mb-3 grid grid-cols-5 gap-1">{(['shirt', 'pants', 'shorts', 'dress', 'bag'] as GarmentType[]).map((garment) => <button key={garment} type="button" onClick={() => setSelectedGarment(normalizeGarmentType(garment))} className={`rounded-md px-1 py-2 text-[10px] font-semibold capitalize ${selectedGarment === garment ? 'bg-emerald-400 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>{garment}</button>)}</div><Garment3DViewer garmentType={selectedGarment} fabricUrl={textureUrl} /></div><div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-5"><h2 className="mb-4 text-lg font-bold text-white">Fabric Usage</h2><div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border-[13px] border-emerald-400 border-r-cyan-300/20 border-b-cyan-300/20 text-2xl font-bold text-emerald-300">{utilization.toFixed(0)}%</div><Usage label="Fabric required" value={`${requiredLength.toFixed(1)} cm`} /><Usage label="Fabric used" value={`${fabricUsedM2.toFixed(3)} m²`} /><Usage label="Pattern area" value={`${patternAreaM2.toFixed(3)} m²`} /><Usage label="Waste" value={`${wasteAreaM2.toFixed(3)} m²`} /></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5"><div className="flex items-center gap-2 text-emerald-300"><Leaf className="h-4 w-4" /><h2 className="font-bold">Geometry integrity</h2></div><p className="mt-3 text-sm leading-6 text-slate-300">Every piece uses a generated SVG silhouette. Placement coordinates are fixed from the same geometry dimensions shown on the cards.</p></div><Link to="/remnant" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950">Analyze leftover fabric <ArrowRight className="h-4 w-4" /></Link></aside></section>
  </div></div>;
};

const Stat = ({ label, value, note }: { label: string; value: string; note: string }) => <div className="rounded-xl border border-slate-800 bg-[#0b1728] p-4"><div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div><div className="mt-2 text-2xl font-extrabold text-emerald-300">{value}</div><div className="mt-1 text-xs text-slate-500">{note}</div></div>;
const Usage = ({ label, value }: { label: string; value: string }) => <div className="flex items-center justify-between border-b border-slate-800 py-2 text-sm"><span className="text-slate-400">{label}</span><span className="font-semibold text-slate-100">{value}</span></div>;

export default OptimizationResults;
