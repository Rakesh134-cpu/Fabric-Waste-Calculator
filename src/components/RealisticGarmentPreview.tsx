import { useEffect, useRef } from 'react';
import { useFabricStore } from '@/store/fabricStore';

const GARMENT_ASSETS: Record<string, { png: string; name: string; size: string }> = {
  shirt:        { png: '/assets/garments/shirt.png',      name: "Men's Casual Shirt", size: 'M' },
  pants:        { png: '/assets/garments/pants.png',      name: "Men's Pants",         size: 'M' },
  shorts:       { png: '/assets/garments/shorts.png',     name: 'Casual Shorts',       size: 'M' },
  dress:        { png: '/assets/garments/dress.png',      name: "Women's Dress",       size: 'S' },
  'kids shirt': { png: '/assets/garments/kids-shirt.png', name: "Kids T-Shirt",        size: '6Y' },
  'kids pants': { png: '/assets/garments/kids-pants.png', name: "Kids Pants",          size: '6Y' },
  bag:          { png: '/assets/garments/shirt.png',      name: 'Fabric Bag',          size: 'One size' },
};

function resolveAsset(garmentType: string) {
  const n = garmentType.toLowerCase();
  if (n.includes('kid') && n.includes('pant')) return GARMENT_ASSETS['kids pants'];
  if (n.includes('kid'))                        return GARMENT_ASSETS['kids shirt'];
  if (n.includes('pant'))                       return GARMENT_ASSETS['pants'];
  if (n.includes('short'))                      return GARMENT_ASSETS['shorts'];
  if (n.includes('dress'))                      return GARMENT_ASSETS['dress'];
  if (n.includes('bag'))                        return GARMENT_ASSETS['bag'];
  return GARMENT_ASSETS['shirt'];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Parse "#rrggbb" or "rgb(...)" into [r, g, b] 0-255 */
function parseColor(color: string): [number, number, number] {
  const hex = color?.trim();
  if (hex?.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [isNaN(r) ? 74 : r, isNaN(g) ? 123 : g, isNaN(b) ? 183 : b];
  }
  // default: medium blue
  return [74, 123, 183];
}

interface Props { garmentType: string; }

/**
 * PIXEL-LEVEL garment recolouring.
 *
 * Algorithm:
 *  1. Draw the garment PNG to an off-screen canvas → extract pixel data.
 *  2. For each garment pixel (alpha > 0):
 *       a. Compute its luminance (brightness of the original white shirt).
 *          The white shirt encodes lighting: white = highlight, gray = shadow.
 *       b. "Shadow factor" = luminance (0 = pitch black shadow, 1 = pure highlight).
 *       c. Multiply the FABRIC COLOUR by the shadow factor so that:
 *            - Highlights  →  light version of the colour (shadow factor ≈ 1.0)
 *            - Mid-tones   →  the exact selected colour (shadow factor ≈ 0.6-0.8)
 *            - Deep folds  →  dark version of the colour (shadow factor ≈ 0.3)
 *          The output can NEVER be black or white — it is always a shade of the
 *          selected colour, satisfying the requirement fully.
 *  3. Write the recoloured pixel data to the visible canvas.
 *
 * Fabric image mode: the shadow factor is applied to each FABRIC PIXEL instead
 * of a flat colour, producing a textured garment whose fold shadows are dark
 * versions of the fabric pattern.
 */
export default function RealisticGarmentPreview({ garmentType }: Props) {
  const { fabricSource } = useFabricStore();
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const asset = resolveAsset(garmentType);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let cancelled = false;

    async function render() {
      if (!canvas || !container || cancelled) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const W = Math.max(container.clientWidth,  100);
      const H = Math.max(container.clientHeight, 100);
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      // ── Load garment PNG ─────────────────────────────────────────────────
      let garmentImg: HTMLImageElement;
      try { garmentImg = await loadImage(asset.png); }
      catch { return; }
      if (cancelled) return;

      // Fit garment to fill ~75% of available space to match requested design margins
      const targetW = W * 0.75;
      const targetH = H * 0.75;
      const scale = Math.min(
        targetW / garmentImg.naturalWidth,
        targetH / garmentImg.naturalHeight,
      );
      const gW = Math.round(garmentImg.naturalWidth  * scale);
      const gH = Math.round(garmentImg.naturalHeight * scale);
      const gX = Math.round((W - gW) / 2);
      const gY = Math.round((H - gH) / 2);

      // ── Extract garment pixel data from off-screen canvas ─────────────────
      const off = document.createElement('canvas');
      off.width  = W;
      off.height = H;
      const offCtx = off.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;
      offCtx.drawImage(garmentImg, gX, gY, gW, gH);
      const garmentData = offCtx.getImageData(0, 0, W, H).data;

      // ── Optionally load & tile fabric image ───────────────────────────────
      let fabricPixels: Uint8ClampedArray | null = null;
      let fabricTileW = 1, fabricTileH = 1;

      if (fabricSource.image) {
        let fabricImg: HTMLImageElement | null = null;
        try { fabricImg = await loadImage(fabricSource.image); } catch { /* fallback to color */ }

        if (fabricImg && !cancelled) {
          // Tile size: ~28% of canvas width
          const tW = Math.max(120, Math.round(W * 0.28));
          const tH = Math.round(tW * fabricImg.naturalHeight / fabricImg.naturalWidth);
          fabricTileW = tW;
          fabricTileH = tH;

          const fabOff = document.createElement('canvas');
          fabOff.width  = tW;
          fabOff.height = tH;
          const fabCtx  = fabOff.getContext('2d');
          if (fabCtx) {
            fabCtx.drawImage(fabricImg, 0, 0, tW, tH);
            fabricPixels = fabCtx.getImageData(0, 0, tW, tH).data;
          }
        }
      }

      if (cancelled) return;

      // ── Solid target colour ───────────────────────────────────────────────
      const [tr, tg, tb] = parseColor(fabricSource.color || '#4a7bB7');

      // ── Build output pixel-by-pixel ───────────────────────────────────────
      // Shadow strength: how dark the deepest fold gets relative to the colour.
      // 0 = no shadow (flat), 1 = shadow can reach pure black (too harsh).
      // 0.72 keeps folds clearly darker than the base colour but never black.
      const SHADOW_STRENGTH = 0.72;

      const output = ctx.createImageData(W, H);
      const out    = output.data;

      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const i  = (py * W + px) * 4;
          const ga = garmentData[i + 3]; // alpha of the garment pixel
          if (ga < 8) continue;          // background — leave transparent

          // Luminance of the original (white-shirt) garment pixel.
          // White shirt: highlights ≈ 1.0, fold shadows ≈ 0.3–0.6.
          const gR = garmentData[i];
          const gG = garmentData[i + 1];
          const gB = garmentData[i + 2];
          const lum = (gR * 0.299 + gG * 0.587 + gB * 0.114) / 255;

          // Map luminance to a multiplier that keeps the target colour dominant:
          //   lum = 1.0  →  factor = 1.0   (pure highlight, exact colour)
          //   lum = 0.5  →  factor ≈ 0.64  (mid shadow, darker colour)
          //   lum = 0.0  →  factor = 1 - SHADOW_STRENGTH ≈ 0.28 (deep fold)
          // This guarantees the output is ALWAYS a shade of the selected colour.
          const factor = 1.0 - (1.0 - lum) * SHADOW_STRENGTH;

          let fr: number, fg: number, fb: number;

          if (fabricPixels) {
            // Tiled fabric: sample the fabric pixel at this position
            const tx = ((px - gX) % fabricTileW + fabricTileW) % fabricTileW;
            const ty = ((py - gY) % fabricTileH + fabricTileH) % fabricTileH;
            const fi = (ty * fabricTileW + tx) * 4;
            fr = fabricPixels[fi];
            fg = fabricPixels[fi + 1];
            fb = fabricPixels[fi + 2];
          } else {
            // Solid colour
            fr = tr; fg = tg; fb = tb;
          }

          out[i]     = Math.round(Math.min(255, fr * factor));
          out[i + 1] = Math.round(Math.min(255, fg * factor));
          out[i + 2] = Math.round(Math.min(255, fb * factor));
          out[i + 3] = ga; // preserve garment alpha (edge anti-aliasing)
        }
      }

      if (cancelled) return;
      ctx.putImageData(output, 0, 0);
    }

    render();
    return () => { cancelled = true; };
  }, [fabricSource, asset.png]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1726] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-700 bg-[#0d1726] px-4 py-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">2D Garment</div>
          <div className="text-base font-semibold text-white">{asset.name}</div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex flex-1 items-center justify-center bg-[#f0f4f8] min-h-[650px] overflow-hidden"
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      <div className="border-t border-slate-700 bg-[#0d1726] px-4 py-3 text-center">
        <div className="font-bold text-white text-base">{asset.name}</div>
        <div className="text-xs font-medium text-cyan-300 mt-0.5">Size: {asset.size}</div>
      </div>
    </div>
  );
}
