export interface PatternGeometry {
  id: string;
  name: string;
  widthCm: number;
  heightCm: number;
  quantity: number;
  rotationAllowed: boolean;
  grainDirection: 'lengthwise' | 'crosswise';
  areaCm2: number;
  path: string;
  category: 'body' | 'sleeve' | 'trim' | 'pocket';
}

export interface PatternPlacement extends PatternGeometry {
  x: number;
  y: number;
  rotation: number;
}

const scalePath = (path: string, width: number, height: number, baseWidth: number, baseHeight: number) => {
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  return path.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${Number(x) * scaleX},${Number(y) * scaleY}`);
};

export const generateShirtPattern = ({
  chest = 50,
  shirtLength = 79,
  sleeveLength = 69,
  sleeveWidth = 30,
  neckWidth = 16,
  neckDepth = 8,
}: {
  chest?: number;
  shirtLength?: number;
  sleeveLength?: number;
  sleeveWidth?: number;
  neckWidth?: number;
  neckDepth?: number;
} = {}): PatternGeometry[] => {
  const frontPath = `M0,${shirtLength} L0,18 Q2,10 12,8 L17,0 Q25,${-neckDepth} 33,0 L${chest},12 L${chest},${shirtLength} Z`;
  const backPath = `M0,${shirtLength} L0,18 Q2,10 12,8 Q${chest / 2},${-neckDepth / 2} ${chest - 12},8 Q${chest - 2},10 ${chest},18 L${chest},${shirtLength} Z`;
  const sleevePath = `M0,${sleeveLength} L4,24 Q${sleeveWidth / 2},0 ${sleeveWidth - 4},24 L${sleeveWidth},${sleeveLength} Q${sleeveWidth / 2},${sleeveLength + 4} 0,${sleeveLength} Z`;
  const collarPath = `M0,6 Q${chest / 2},${-2} ${chest},6 L${chest - 2},${neckDepth + 8} Q${chest / 2},${neckDepth + 4} 2,${neckDepth + 8} Z`;
  const pocketPath = `M0,0 L12,0 L12,15 Q6,21 0,15 Z`;
  const cuffPath = 'M0,0 L12,0 Q14,10 12,20 L0,20 Q-2,10 0,0 Z';

  return [
    { id: 'front-left', name: 'Front Left Panel', widthCm: chest, heightCm: shirtLength, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: chest * shirtLength * 0.86, path: frontPath, category: 'body' },
    { id: 'front-right', name: 'Front Right Panel', widthCm: chest, heightCm: shirtLength, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: chest * shirtLength * 0.86, path: frontPath, category: 'body' },
    { id: 'back', name: 'Back Panel', widthCm: chest, heightCm: shirtLength, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: chest * shirtLength * 0.9, path: backPath, category: 'body' },
    { id: 'sleeve-left', name: 'Sleeve Left', widthCm: sleeveWidth, heightCm: sleeveLength, quantity: 1, rotationAllowed: true, grainDirection: 'lengthwise', areaCm2: sleeveWidth * sleeveLength * 0.72, path: sleevePath, category: 'sleeve' },
    { id: 'sleeve-right', name: 'Sleeve Right', widthCm: sleeveWidth, heightCm: sleeveLength, quantity: 1, rotationAllowed: true, grainDirection: 'lengthwise', areaCm2: sleeveWidth * sleeveLength * 0.72, path: sleevePath, category: 'sleeve' },
    { id: 'collar-outer', name: 'Collar Outer', widthCm: 49, heightCm: 20, quantity: 1, rotationAllowed: false, grainDirection: 'crosswise', areaCm2: 49 * 20 * 0.58, path: scalePath(collarPath, 49, 20, chest, 20), category: 'trim' },
    { id: 'collar-inner', name: 'Collar Inner', widthCm: 49, heightCm: 20, quantity: 1, rotationAllowed: false, grainDirection: 'crosswise', areaCm2: 49 * 20 * 0.5, path: scalePath(collarPath, 49, 20, chest, 20), category: 'trim' },
    { id: 'pocket', name: 'Pocket', widthCm: 12, heightCm: 20, quantity: 1, rotationAllowed: true, grainDirection: 'lengthwise', areaCm2: 12 * 20 * 0.82, path: scalePath(pocketPath, 12, 20, 12, 21), category: 'pocket' },
    { id: 'cuff-left', name: 'Cuff Left', widthCm: 12, heightCm: 20, quantity: 1, rotationAllowed: false, grainDirection: 'crosswise', areaCm2: 12 * 20 * 0.86, path: cuffPath, category: 'trim' },
    { id: 'cuff-right', name: 'Cuff Right', widthCm: 12, heightCm: 20, quantity: 1, rotationAllowed: false, grainDirection: 'crosswise', areaCm2: 12 * 20 * 0.86, path: cuffPath, category: 'trim' },
  ];
};

const rectangularPath = (width: number, height: number, topCurve = 0) => `M0,${height} L0,${topCurve + 5} Q${width / 2},${topCurve - 4} ${width},${topCurve + 5} L${width},${height} Z`;

export const generatePantsPattern = (): PatternGeometry[] => [
  { id: 'pants-front-left', name: 'Front Left', widthCm: 34, heightCm: 96, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 34 * 96 * 0.82, path: rectangularPath(34, 96, 8), category: 'body' },
  { id: 'pants-front-right', name: 'Front Right', widthCm: 34, heightCm: 96, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 34 * 96 * 0.82, path: rectangularPath(34, 96, 8), category: 'body' },
  { id: 'pants-back-left', name: 'Back Left', widthCm: 38, heightCm: 99, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 38 * 99 * 0.84, path: rectangularPath(38, 99, 10), category: 'body' },
  { id: 'pants-back-right', name: 'Back Right', widthCm: 38, heightCm: 99, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 38 * 99 * 0.84, path: rectangularPath(38, 99, 10), category: 'body' },
  { id: 'pants-waistband', name: 'Waistband', widthCm: 78, heightCm: 12, quantity: 1, rotationAllowed: false, grainDirection: 'crosswise', areaCm2: 78 * 12, path: rectangularPath(78, 12), category: 'trim' },
  { id: 'pants-pocket', name: 'Pocket', widthCm: 20, heightCm: 24, quantity: 2, rotationAllowed: true, grainDirection: 'lengthwise', areaCm2: 20 * 24 * 0.8, path: scalePath('M0,0 L20,0 L18,18 Q10,25 2,18 Z', 20, 24, 20, 25), category: 'pocket' },
];

export const generateShortsPattern = (): PatternGeometry[] => generatePantsPattern().map((piece) => ({
  ...piece,
  id: `shorts-${piece.id.replace('pants-', '')}`,
  name: piece.name,
  heightCm: piece.name.includes('Front') || piece.name.includes('Back') ? 52 : piece.heightCm,
  areaCm2: piece.name.includes('Front') || piece.name.includes('Back') ? piece.areaCm2 * 0.58 : piece.areaCm2,
  path: piece.name.includes('Front') || piece.name.includes('Back') ? rectangularPath(piece.widthCm, 52, 8) : piece.path,
}));

export const generateDressPattern = (): PatternGeometry[] => [
  { id: 'dress-front', name: 'Dress Front', widthCm: 58, heightCm: 125, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 58 * 125 * 0.88, path: rectangularPath(58, 125, 10), category: 'body' },
  { id: 'dress-back', name: 'Dress Back', widthCm: 58, heightCm: 125, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 58 * 125 * 0.88, path: rectangularPath(58, 125, 12), category: 'body' },
  { id: 'dress-sleeve', name: 'Sleeve', widthCm: 28, heightCm: 62, quantity: 2, rotationAllowed: true, grainDirection: 'lengthwise', areaCm2: 28 * 62 * 0.72, path: scalePath('M0,62 L4,22 Q14,0 24,22 L28,62 Z', 28, 62, 28, 62), category: 'sleeve' },
  { id: 'dress-collar', name: 'Neck Facing', widthCm: 42, heightCm: 12, quantity: 1, rotationAllowed: false, grainDirection: 'crosswise', areaCm2: 42 * 12 * 0.75, path: rectangularPath(42, 12, 4), category: 'trim' },
];

export const generateBagPattern = (): PatternGeometry[] => [
  { id: 'bag-front', name: 'Bag Front', widthCm: 42, heightCm: 48, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 42 * 48 * 0.9, path: scalePath('M0,48 L0,6 Q21,-4 42,6 L42,48 Z', 42, 48, 42, 48), category: 'body' },
  { id: 'bag-back', name: 'Bag Back', widthCm: 42, heightCm: 48, quantity: 1, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 42 * 48 * 0.9, path: scalePath('M0,48 L0,6 Q21,-4 42,6 L42,48 Z', 42, 48, 42, 48), category: 'body' },
  { id: 'bag-side', name: 'Bag Side', widthCm: 12, heightCm: 40, quantity: 2, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 12 * 40 * 0.8, path: rectangularPath(12, 40, 3), category: 'trim' },
  { id: 'bag-handle', name: 'Handle', widthCm: 8, heightCm: 58, quantity: 2, rotationAllowed: false, grainDirection: 'lengthwise', areaCm2: 8 * 58, path: rectangularPath(8, 58), category: 'trim' },
];

export const generatePatternForGarment = (garment: string): PatternGeometry[] => {
  if (garment === 'pants') return generatePantsPattern();
  if (garment === 'shorts') return generateShortsPattern();
  if (garment === 'dress') return generateDressPattern();
  if (garment === 'bag') return generateBagPattern();
  return generateShirtPattern();
};

export const generateMarkerPlacements = (pieces = generateShirtPattern()): PatternPlacement[] => {
  const placements: PatternPlacement[] = [];
  let x = 4;
  let y = 4;
  let rowHeight = 0;

  pieces.forEach((piece) => {
    const width = piece.widthCm;
    if (x + width > 146) {
      x = 4;
      y += rowHeight + 4;
      rowHeight = 0;
    }
    placements.push({ ...piece, x, y, rotation: 0 });
    x += width + 4;
    rowHeight = Math.max(rowHeight, piece.heightCm);
  });

  return placements;
};

export const totalPatternAreaCm2 = (pieces: PatternGeometry[]) => pieces.reduce((sum, piece) => sum + piece.areaCm2 * piece.quantity, 0);
