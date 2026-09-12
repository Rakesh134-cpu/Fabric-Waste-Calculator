import React, { useEffect, useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Garment3DViewer from '@/components/Garment3DViewer';
import { analyzeFabric } from '@/services/api';
import type { FabricAnalysisResponse, FabricProductMatch } from '@/types';

const RemnantAnalysis: React.FC = () => {
  const [width, setWidth] = useState(80);
  const [length, setLength] = useState(120);
  const [shape, setShape] = useState('Rectangle');
  const [material, setMaterial] = useState('Cotton');
  const [fileName, setFileName] = useState('');
  const [fabricImage, setFabricImage] = useState<File | null>(null);
  const [fabricUrl, setFabricUrl] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState('shirt');
  const [analysis, setAnalysis] = useState<FabricAnalysisResponse | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<FabricProductMatch | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  useEffect(() => {
    return () => {
      if (fabricUrl) {
        URL.revokeObjectURL(fabricUrl);
      }
    };
  }, [fabricUrl]);

  const area = ((width * length) / 10000).toFixed(2);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFabricImage(null);
      setFileName('');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (fabricUrl) {
      URL.revokeObjectURL(fabricUrl);
    }

    const nextUrl = URL.createObjectURL(file);
    setFabricImage(file);
    setFabricUrl(nextUrl);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => window.localStorage.setItem('ecocut:fabric-image', String(reader.result));
    reader.readAsDataURL(file);
    toast.success('Fabric image uploaded successfully.');
  };

  const handleAnalyze = async () => {
    if (!fabricImage) {
      toast.error('Please upload a fabric image first.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeFabric({ image: fabricImage, width, length, shape, material });
      const initialProduct = result.recommended_products.find((product) => product.feasible) || result.recommended_products[0] || null;
      setAnalysis(result);
      setSelectedProduct(initialProduct);
      setSelectedGarment(toViewerGarment(initialProduct?.pattern_name));
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      toast.success('Fabric analysis complete.');
    } catch (error) {
      setIsAnalyzing(false);
      toast.error(error instanceof Error ? error.message : 'Fabric analysis failed.');
    }
  };

  const selectProduct = (product: FabricProductMatch) => {
    setSelectedProduct(product);
    setSelectedGarment(toViewerGarment(product.pattern_name));
  };

  const previewTitle = isAnalyzed ? '3D Garment Preview' : 'Fabric Preview';

  return (
    <div className="min-h-screen bg-[#f3f5f3] px-6 py-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3 text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7f4e7] text-[#1ea76b]">
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="text-[2.05rem] font-bold tracking-tight">Leftover Fabric Analyzer</h1>
        </div>

        <p className="mb-8 text-[1.05rem] text-slate-600">Find out what your leftover fabric can become.</p>

        <div className="grid gap-8 lg:grid-cols-[1.02fr_1.2fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-[1.05rem] font-semibold text-slate-800">Available Fabric</h2>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-600">Width (cm)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-600">Length (cm)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Rectangle', 'L-Shape', 'Irregular'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setShape(option)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        shape === option
                          ? 'border-[#7dc69a] bg-[#dff6eb] text-[#1a6d4d]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">Material Type</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none"
                >
                  <option>Cotton</option>
                  <option>Denim</option>
                  <option>Wool</option>
                  <option>Polyester</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">Upload leftover fabric image</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-slate-500 hover:bg-slate-100">
                  <Upload className="mb-2 h-5 w-5 text-slate-500" />
                  <span className="text-base">{fileName || 'Upload left over fabric image'}</span>
                  <span className="mt-1 text-xs text-slate-400">PNG, JPG up to 10MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1ea76b] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#199e62] disabled:cursor-not-allowed disabled:opacity-80"
              >
                <Sparkles className="h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Fabric'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-[1.05rem] font-semibold text-slate-800">{previewTitle}</h2>

            {!isAnalyzed ? (
              <>
                {fabricUrl ? (
                  <Garment3DViewer garmentType={selectedGarment} fabricUrl={fabricUrl} />
                ) : (
                  <div className="flex min-h-[250px] items-center justify-center">
                    <div className="relative flex h-52 w-52 items-center justify-center border-[3px] border-[#7dc69a] bg-[#e8f7ee] bg-[linear-gradient(90deg,rgba(125,198,154,0.15)_1px,transparent_1px),linear-gradient(rgba(125,198,154,0.15)_1px,transparent_1px)] bg-[size:18px_18px]">
                      <div className="text-center text-slate-800">
                        <div className="text-[1.15rem] font-bold">{width} × {length} cm</div>
                        <div className="mt-1 text-sm text-slate-600">{area} m²</div>
                        <div className="mt-2 text-sm text-slate-500">{material}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-100 p-3 text-center">
                    <div className="text-[0.8rem] text-slate-500">Area</div>
                    <div className="mt-1 text-base font-semibold text-slate-800">{area} m²</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 text-center">
                    <div className="text-[0.8rem] text-slate-500">Shape</div>
                    <div className="mt-1 text-base font-semibold text-slate-800">{shape}</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 text-center">
                    <div className="text-[0.8rem] text-slate-500">Material</div>
                    <div className="mt-1 text-base font-semibold text-slate-800">{material}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                {analysis?.ai_message && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{analysis.ai_message}. Deterministic geometry results are still shown.</div>}

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">AI Fabric Analysis</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {Object.entries(analysis?.fabric_visual_analysis || {}).map(([key, value]) => (
                      <div key={key} className="rounded-xl bg-slate-100 p-3">
                        <div className="text-xs capitalize text-slate-500">{key}</div>
                        <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Recommended Reuse Options</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(analysis?.recommended_products || []).slice(0, 6).map((product) => (
                      <button key={product.pattern_id} type="button" onClick={() => selectProduct(product)} className={`rounded-xl border p-4 text-left ${selectedProduct?.pattern_id === product.pattern_id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">{product.pattern_name}</span>
                          <span className={`text-xs font-semibold ${product.feasible ? 'text-emerald-700' : 'text-rose-600'}`}>{product.feasible ? 'Feasible' : 'Not feasible'}</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-600">Required {product.required_area_m2.toFixed(3)} m² · Available {product.available_area_m2.toFixed(3)} m²</div>
                        <div className="mt-1 text-xs text-slate-500">{product.ai_reason || product.infeasibility_reason || 'Validated against the pattern library.'}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {fabricUrl ? (
                  <Garment3DViewer garmentType={selectedGarment} fabricUrl={fabricUrl} />
                ) : (
                  <div className="flex h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
                    Fabric texture could not be applied.
                  </div>
                )}

                {selectedProduct && (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-4">
                      <Metric label="Used" value={`${selectedProduct.used_area_m2.toFixed(3)} m²`} />
                      <Metric label="Utilization" value={`${selectedProduct.utilization_percentage.toFixed(1)}%`} />
                      <Metric label="Waste" value={`${selectedProduct.waste_percentage.toFixed(1)}%`} />
                      <Metric label="Remaining" value={`${selectedProduct.remaining_area.toFixed(0)} cm²`} />
                    </div>
                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Pattern Pieces</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedProduct.pattern_pieces.map((piece) => <div key={piece.name} className="rounded-lg border border-slate-200 p-3 text-xs text-slate-700"><div className="font-semibold">{piece.name}</div><div>{piece.width} × {piece.height} cm · Qty {piece.quantity} · {piece.allow_rotation ? 'Rotation allowed' : 'Grain locked'}</div></div>)}
                      </div>
                    </div>
                    <CuttingLayout product={selectedProduct} width={width} length={length} />
                  </>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="text-slate-500">Fabric</div>
                    <div className="mt-1 font-semibold text-slate-800">{material}</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="text-slate-500">Garment</div>
                    <div className="mt-1 font-semibold text-slate-800">{selectedProduct?.pattern_name || selectedGarment}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#d7eaf8] bg-[#eaf3ff] px-4 py-3 text-[0.98rem] leading-6 text-slate-700">
          <span className="font-medium">AI will analyze against 48 pattern templates</span> — including shirts, pants, shorts, dresses, kids clothing, bags, pockets, collars, cuffs, and accessories. Add custom patterns in the <span className="font-semibold text-slate-800">Pattern Library</span>.
        </div>
      </div>
    </div>
  );
};

const toViewerGarment = (name?: string) => {
  const value = (name || '').toLowerCase();
  if (value.includes('pant')) return 'pants';
  if (value.includes('short')) return 'shorts';
  if (value.includes('bag')) return 'bag';
  return 'shirt';
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-slate-100 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-semibold text-slate-800">{value}</div></div>
);

const CuttingLayout = ({ product, width, length }: { product: FabricProductMatch; width: number; length: number }) => {
  const scale = Math.min(360 / width, 280 / length);
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Cutting Layout</h3>
      <div className="overflow-auto rounded-xl bg-slate-100 p-4">
        <div className="relative mx-auto border-2 border-emerald-500 bg-emerald-50" style={{ width: width * scale, height: length * scale }}>
          {product.placements.map((placement) => <div key={placement.id} className="absolute flex items-center justify-center overflow-hidden border border-emerald-700 bg-emerald-200/80 text-[9px] font-semibold text-emerald-950" style={{ left: placement.x * scale, top: placement.y * scale, width: placement.width * scale, height: placement.height * scale }}>{placement.piece_name}</div>)}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500">{product.placements.length} placed pieces from the deterministic nesting engine · fabric boundary {width} × {length} cm</div>
    </div>
  );
};

export default RemnantAnalysis;
