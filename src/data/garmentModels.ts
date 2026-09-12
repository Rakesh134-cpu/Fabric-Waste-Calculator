export const GARMENT_MODELS = {
  shirt: '/models/shirt.glb',
  pants: '/models/pants.glb',
  shorts: '/models/shorts.glb',
  dress: '/models/dress.glb',
  bag: '/models/bag.glb',
} as const;

export type GarmentType = keyof typeof GARMENT_MODELS;

export const normalizeGarmentType = (value?: string): GarmentType => {
  const normalized = (value || '').toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.includes('pant') || normalized.includes('trouser')) return 'pants';
  if (normalized.includes('short')) return 'shorts';
  if (normalized.includes('dress')) return 'dress';
  if (normalized.includes('bag')) return 'bag';
  return 'shirt';
};