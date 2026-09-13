import React from 'react';
import { Eye, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ProductCategoryBar from '@/components/ProductCategoryBar';
import type { FabricProductMatch } from '@/types';
import type { FabricSource } from '@/store/fabricStore';

export interface BagProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  feasible: boolean;
  required_area_m2: number;
  available_area_m2: number;
  utilization_percentage: number;
  used_area_m2: number;
  waste_percentage: number;
  quantity_possible: number;
}

export const BAG_PRODUCTS: BagProductItem[] = [
  {
    id: 'tote-bag',
    name: 'Tote Bag',
    category: 'Accessories',
    description: 'A stylish and reusable tote bag perfect for daily use.',
    image: '/assets/products/tote-bag.jpg',
    feasible: true,
    required_area_m2: 0.45,
    available_area_m2: 0.96,
    utilization_percentage: 86.4,
    used_area_m2: 0.42,
    waste_percentage: 13.6,
    quantity_possible: 2,
  },
  {
    id: 'handbag',
    name: 'Handbag',
    category: 'Accessories',
    description: 'Compact and fashionable handbag for casual outings.',
    image: '/assets/products/handbag.jpg',
    feasible: true,
    required_area_m2: 0.38,
    available_area_m2: 0.96,
    utilization_percentage: 84.1,
    used_area_m2: 0.35,
    waste_percentage: 15.9,
    quantity_possible: 2,
  },
  {
    id: 'drawstring-bag',
    name: 'Drawstring Bag',
    category: 'Accessories',
    description: 'A simple and useful bag for storage or gifting.',
    image: '/assets/products/drawstring-bag.jpg',
    feasible: true,
    required_area_m2: 0.28,
    available_area_m2: 0.96,
    utilization_percentage: 91.2,
    used_area_m2: 0.26,
    waste_percentage: 8.8,
    quantity_possible: 3,
  },
  {
    id: 'backpack',
    name: 'Backpack',
    category: 'Accessories',
    description: 'A trendy and eco-friendly backpack for everyday use.',
    image: '/assets/products/backpack.jpg',
    feasible: true,
    required_area_m2: 0.72,
    available_area_m2: 0.96,
    utilization_percentage: 88.5,
    used_area_m2: 0.68,
    waste_percentage: 11.5,
    quantity_possible: 1,
  },
  {
    id: 'laptop-sleeve',
    name: 'Laptop Sleeve',
    category: 'Accessories',
    description: 'Protect your laptop with a sustainable sleeve.',
    image: '/assets/products/laptop-sleeve.jpg',
    feasible: true,
    required_area_m2: 0.35,
    available_area_m2: 0.96,
    utilization_percentage: 89.0,
    used_area_m2: 0.32,
    waste_percentage: 11.0,
    quantity_possible: 2,
  },
  {
    id: 'clutch-bag',
    name: 'Clutch Bag',
    category: 'Accessories',
    description: 'A compact clutch for your essentials.',
    image: '/assets/products/clutch-bag.jpg',
    feasible: true,
    required_area_m2: 0.22,
    available_area_m2: 0.96,
    utilization_percentage: 93.4,
    used_area_m2: 0.21,
    waste_percentage: 6.6,
    quantity_possible: 4,
  },
  {
    id: 'duffle-bag',
    name: 'Duffle Bag',
    category: 'Accessories',
    description: 'Spacious and durable for travel or gym.',
    image: '/assets/products/duffle-bag.jpg',
    feasible: true,
    required_area_m2: 0.85,
    available_area_m2: 0.96,
    utilization_percentage: 82.3,
    used_area_m2: 0.79,
    waste_percentage: 17.7,
    quantity_possible: 1,
  },
  {
    id: 'crossbody-bag',
    name: 'Crossbody Bag',
    category: 'Accessories',
    description: 'A lightweight and stylish crossbody bag.',
    image: '/assets/products/crossbody-bag.jpg',
    feasible: true,
    required_area_m2: 0.32,
    available_area_m2: 0.96,
    utilization_percentage: 87.8,
    used_area_m2: 0.29,
    waste_percentage: 12.2,
    quantity_possible: 3,
  },
];

interface BagCategoryViewProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onSelectProduct: (product: FabricProductMatch) => void;
  fabricSource: FabricSource;
  width: number;
  length: number;
}

export const BagCategoryView: React.FC<BagCategoryViewProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  fabricSource,
  width,
  length,
}) => {
  const fabricArea = ((width * length) / 10000).toFixed(2);

  const handleCardClick = (item: BagProductItem) => {
    const match: FabricProductMatch = {
      pattern_id: item.id,
      pattern_name: item.name,
      category: 'Bags & Accessories',
      quantity_possible: item.quantity_possible,
      required_area: item.required_area_m2,
      remnant_area: Number(fabricArea),
      remaining_area: Number(fabricArea) - item.used_area_m2,
      confidence: 'High',
      feasible: item.feasible,
      placements: [],
      required_area_m2: item.required_area_m2,
      available_area_m2: Number(fabricArea),
      used_area_m2: item.used_area_m2,
      waste_percentage: item.waste_percentage,
      utilization_percentage: item.utilization_percentage,
      ai_recommended: true,
      ai_reason: 'Optimal yield with colorful patchwork leftover textile.',
      pattern_pieces: [
        { name: 'Front Panel', width: 35, height: 40, quantity: 1, allow_rotation: true, category: 'accessories' },
        { name: 'Back Panel', width: 35, height: 40, quantity: 1, allow_rotation: true, category: 'accessories' },
        { name: 'Bottom Gusset', width: 12, height: 35, quantity: 1, allow_rotation: true, category: 'accessories' },
        { name: 'Straps / Handles', width: 8, height: 55, quantity: 2, allow_rotation: false, category: 'accessories' },
      ],
    };
    onSelectProduct(match);
  };

  return (
    <div className="mx-auto max-w-[1600px] animate-in fade-in duration-300">
      {/* Top Header with Title and Selected Fabric Card */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7f4e7] text-[#1ea76b]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-[2.05rem] font-bold tracking-tight text-slate-900">Leftover Fabric Analyzer</h1>
          </div>
          <p className="mt-1 text-[1.05rem] text-slate-600">Find out what your leftover fabric can become.</p>
        </div>

        {/* Selected Fabric Top Right Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm">
          <div className="h-14 w-14 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 flex-shrink-0">
            <img
              src="/assets/products/patchwork-fabric.jpg"
              alt="Selected Fabric"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Selected Fabric</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Cotton</div>
            <div className="text-xs text-slate-600 font-medium">{width} cm × {length} cm ({fabricArea} m²)</div>
          </div>
        </div>
      </div>

      {/* Horizontal Product Category Selector */}
      <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <ProductCategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Sustainability Banner */}
      <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-200/80 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-900">Reduce Waste</span>
              <span className="text-xs text-emerald-600">●</span>
              <span className="text-sm font-bold text-emerald-800">Create More</span>
            </div>
            <p className="text-xs text-emerald-700 mt-0.5">Same fabric. New possibilities.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white/80 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          8 AI Tested Bag Templates
        </div>
      </div>

      {/* Bag Category Content Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bag Ideas</h2>
        <p className="text-sm text-slate-600 mt-1">
          Stylish, functional and sustainable bags made from your leftover fabric.
        </p>
      </div>

      {/* 4-Column Product Grid with 8 Bag Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {BAG_PRODUCTS.map((bag) => (
          <div
            key={bag.id}
            onClick={() => handleCardClick(bag)}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer overflow-hidden"
          >
            <div>
              {/* Product Photograph with Same Leftover Fabric */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-50 mb-4 border border-slate-100 shadow-inner">
                <img
                  src={bag.image}
                  alt={bag.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 rounded-full bg-emerald-500/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  {bag.utilization_percentage}% Yield
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {bag.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Suitable
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {bag.description}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Est. {bag.quantity_possible} unit{bag.quantity_possible > 1 ? 's' : ''}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(bag);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-95 group-hover:shadow-md group-hover:shadow-emerald-500/25"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BagCategoryView;
