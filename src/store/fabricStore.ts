import { create } from 'zustand';

export type FabricSourceType = 'image' | 'color';

export interface FabricSource {
  type: FabricSourceType;
  image: string | null;
  imageFile: File | null;
  fabricType: string;
  color: string;
}

interface FabricStore {
  fabricSource: FabricSource;
  setFabricSource: (source: Partial<FabricSource>) => void;
}

export const useFabricStore = create<FabricStore>((set) => ({
  fabricSource: {
    type: 'image',
    image: '/assets/products/patchwork-fabric.jpg',
    imageFile: null,
    fabricType: 'Cotton',
    color: '#d97706', // Warm patchwork amber base
  },
  setFabricSource: (source) =>
    set((state) => ({
      fabricSource: { ...state.fabricSource, ...source },
    })),
}));
