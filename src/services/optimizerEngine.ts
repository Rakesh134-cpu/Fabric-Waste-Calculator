export type OptimizerPiece = { id: number; name: string; width: number; height: number; quantity: number; rotation: boolean };
export type OptimizerInput = { width: number; length: number; cost: number; gap: number; garment: string; quantity: number; size?: string; fabric?: string; grainDirection?: string; pieces: OptimizerPiece[] };
export type Placement = { id: string; name: string; garmentNumber: number; x: number; y: number; width: number; height: number; rotated: boolean; color: string };
export type StrategyResult = { key: 'standard' | 'rotated' | 'optimized'; placements: Placement[]; garmentsPlaced: number; fabricUsed: number; patternArea: number; wasteArea: number; wastePercent: number; utilization: number; cost: number; fits: boolean };

const colors = ['#53a7f5', '#47b39d', '#d7ec72', '#f779a6', '#a77bea', '#f7a840', '#ffd84c', '#61c2da'];
export const getPieceColor = (name: string) => colors[Math.abs([...name].reduce((n, c) => n + c.charCodeAt(0), 0)) % colors.length];
export const getPieceCode = (name: string) => name.includes('Front Left') ? 'FL' : name.includes('Front Right') ? 'FR' : name.includes('Back Left') ? 'BL' : name.includes('Back Right') ? 'BR' : name === 'Back' ? 'B' : name.includes('Sleeve Left') ? 'SL' : name.includes('Sleeve Right') ? 'SR' : name.includes('Sleeve') ? 'SL' : name.includes('Waistband') ? 'WB' : name.includes('Collar') ? 'CO' : name.includes('Cuff') ? 'CU' : name.includes('Pocket') ? 'P' : name.includes('Fly') ? 'FP' : name.slice(0, 2).toUpperCase();

type Instance = OptimizerPiece & { garmentNumber: number; key: string };
type FreeRect = { x: number; y: number; width: number; height: number };
const gapOf = (input: OptimizerInput) => Math.max(0, input.gap);
const makeInstances = (input: OptimizerInput, sort?: (a: OptimizerPiece, b: OptimizerPiece) => number) => Array.from({ length: input.quantity }, (_, garmentIndex) => [...input.pieces].sort(sort).flatMap((piece) => Array.from({ length: piece.quantity }, (_, index) => ({ ...piece, garmentNumber: garmentIndex + 1, key: `${piece.id}-${garmentIndex + 1}-${index + 1}` })))).flat();
const makePlacement = (piece: Instance, x: number, y: number, width: number, height: number, rotated: boolean): Placement => ({ id: piece.key, name: piece.name, garmentNumber: piece.garmentNumber, x, y, width, height, rotated, color: getPieceColor(piece.name) });

function finish(input: OptimizerInput, key: StrategyResult['key'], placements: Placement[]): StrategyResult {
  const required = new Map(input.pieces.map((piece) => [piece.name, piece.quantity]));
  const completeNumbers = Array.from({ length: input.quantity }, (_, i) => i + 1).filter((garmentNumber) => {
    const counts = new Map<string, number>(); placements.filter((p) => p.garmentNumber === garmentNumber).forEach((p) => counts.set(p.name, (counts.get(p.name) || 0) + 1));
    return [...required].every(([name, quantity]) => (counts.get(name) || 0) >= quantity);
  });
  const complete = placements.filter((p) => completeNumbers.includes(p.garmentNumber)); const usedCm = complete.length ? Math.max(...complete.map((p) => p.y + p.height)) + gapOf(input) : 0;
  const fabricUsed = usedCm / 100, patternArea = complete.reduce((sum, p) => sum + p.width * p.height, 0) / 10000, usedArea = input.width / 100 * fabricUsed, wasteArea = Math.max(0, usedArea - patternArea), wastePercent = usedArea ? wasteArea / usedArea * 100 : 0;
  return { key, placements: complete, garmentsPlaced: completeNumbers.length, fabricUsed, patternArea, wasteArea, wastePercent, utilization: 100 - wastePercent, cost: fabricUsed * input.cost, fits: completeNumbers.length >= input.quantity };
}

/** Conventional marker: unrotated garment sets, regular shelves, clear group separation. */
export function generateStandardLayout(input: OptimizerInput): StrategyResult {
  const gap = gapOf(input), groupGap = Math.max(gap * 4, 2), limit = input.length * 100; let x = gap, y = gap, rowHeight = 0; const result: Placement[] = [];
  if (input.width <= 0 || input.length <= 0) return finish(input, 'standard', result);
  for (let garmentNumber = 1; garmentNumber <= input.quantity; garmentNumber++) {
    if (result.length) { x = gap; y += rowHeight + groupGap; rowHeight = 0; }
    for (const piece of makeInstances({ ...input, quantity: 1 })) {
      if (x + piece.width + gap > input.width) { x = gap; y += rowHeight + gap; rowHeight = 0; }
      if (y + piece.height + gap > limit) return finish(input, 'standard', result);
      result.push(makePlacement({ ...piece, garmentNumber, key: `${piece.id}-${garmentNumber}-${piece.key.split('-').at(-1)}` }, x, y, piece.width, piece.height, false));
      x += piece.width + gap; rowHeight = Math.max(rowHeight, piece.height);
    }
  }
  return finish(input, 'standard', result);
}

const orientations = (piece: Instance) => [{ width: piece.width, height: piece.height, rotated: false }, ...(piece.rotation ? [{ width: piece.height, height: piece.width, rotated: true }] : [])];
const prune = (rects: FreeRect[]) => rects.filter((rect, i) => !rects.some((other, j) => i !== j && rect.x >= other.x && rect.y >= other.y && rect.x + rect.width <= other.x + other.width && rect.y + rect.height <= other.y + other.height));
function splitFreeRects(rects: FreeRect[], used: FreeRect, gap: number) {
  const next: FreeRect[] = [];
  for (const rect of rects) {
    const intersects = used.x < rect.x + rect.width && used.x + used.width + gap > rect.x && used.y < rect.y + rect.height && used.y + used.height + gap > rect.y;
    if (!intersects) { next.push(rect); continue; }
    if (used.x > rect.x) next.push({ x: rect.x, y: rect.y, width: used.x - rect.x - gap, height: rect.height });
    if (used.x + used.width + gap < rect.x + rect.width) next.push({ x: used.x + used.width + gap, y: rect.y, width: rect.x + rect.width - used.x - used.width - gap, height: rect.height });
    if (used.y > rect.y) next.push({ x: rect.x, y: rect.y, width: rect.width, height: used.y - rect.y - gap });
    if (used.y + used.height + gap < rect.y + rect.height) next.push({ x: rect.x, y: used.y + used.height + gap, width: rect.width, height: rect.y + rect.height - used.y - used.height - gap });
  }
  return prune(next.filter((rect) => rect.width > 0 && rect.height > 0));
}
function nest(input: OptimizerInput, key: StrategyResult['key'], order: Instance[], tight: boolean): StrategyResult {
  const gap = gapOf(input), limit = input.length * 100; let free: FreeRect[] = [{ x: gap, y: gap, width: input.width - 2 * gap, height: limit - 2 * gap }]; const placed: Placement[] = [];
  if (input.width <= 0 || input.length <= 0) return finish(input, key, placed);
  for (const piece of order) {
    const choices = free.flatMap((rect) => orientations(piece).filter((shape) => shape.width <= rect.width && shape.height <= rect.height).map((shape) => ({ rect, shape, short: Math.min(rect.width - shape.width, rect.height - shape.height), area: (rect.width - shape.width) * (rect.height - shape.height) })));
    if (!choices.length) continue;
    choices.sort((a, b) => a.rect.y - b.rect.y || (tight ? a.short - b.short || a.area - b.area : a.area - b.area || a.short - b.short) || (a.shape.rotated === b.shape.rotated ? 0 : a.shape.rotated ? -1 : 1));
    const choice = choices[0], used = { x: choice.rect.x, y: choice.rect.y, width: choice.shape.width, height: choice.shape.height };
    placed.push(makePlacement(piece, used.x, used.y, used.width, used.height, choice.shape.rotated)); free = splitFreeRects(free, used, gap);
  }
  return finish(input, key, placed);
}
/** Rotation-aware marker: turns only explicitly rotation-allowed pieces into usable gaps. */
export function generateRotatedLayout(input: OptimizerInput): StrategyResult { return nest(input, 'rotated', makeInstances(input, (a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height)), false); }
/** Dense marker: area-first free-rectangle nesting and best short-side fit. */
export function generateOptimizedLayout(input: OptimizerInput): StrategyResult { return nest(input, 'optimized', makeInstances(input, (a, b) => b.width * b.height - a.width * a.height || Math.max(b.width, b.height) - Math.max(a.width, a.height)), true); }
export function createStrategy(input: OptimizerInput, key: StrategyResult['key']): StrategyResult { return key === 'standard' ? generateStandardLayout(input) : key === 'rotated' ? generateRotatedLayout(input) : generateOptimizedLayout(input); }
