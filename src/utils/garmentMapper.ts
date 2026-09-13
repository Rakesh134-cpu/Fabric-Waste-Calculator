export const toViewerGarment = (name?: string): string => {
  if (!name) return 'shirt';
  const lower = name.toLowerCase();
  if (lower.includes('pant')) return 'pants';
  if (lower.includes('short')) return 'shorts';
  if (lower.includes('dress')) return 'dress';
  if (lower.includes('jacket')) return 'jacket';
  if (lower.includes('kid') && lower.includes('pant')) return 'kids_pants';
  if (lower.includes('kid')) return 'kids_shirt';
  return 'shirt';
};
