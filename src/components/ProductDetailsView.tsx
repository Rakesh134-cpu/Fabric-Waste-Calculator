import React from 'react';
import { ChevronRight, Scissors, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import RealisticGarmentPreview from './RealisticGarmentPreview';
import ProductCategoryBar from './ProductCategoryBar';
import type { FabricProductMatch } from '@/types';
import type { FabricSource } from '@/store/fabricStore';
import { toViewerGarment } from '@/utils/garmentMapper';

interface ProductDetailsViewProps {
  product: FabricProductMatch;
  fabricSource: FabricSource;
  onBack: () => void;
  onSwitchProduct: (productName: string) => void;
}

export default function ProductDetailsView({ product, fabricSource, onBack, onSwitchProduct }: ProductDetailsViewProps) {
  const garmentType = toViewerGarment(product.pattern_name);
  const options = ['Shirt', 'T-Shirt', 'Shorts', 'Pants', 'Bag', 'Dress', 'Pet Bandana', 'Cushion Cover'];
  const fabrics = ['Cotton', 'Linen', 'Denim', 'Canvas', 'Polyester'];

  // Map product to category
  const getActiveCategory = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('t-shirt') || lower.includes('tshirt')) return 'T-Shirts';
    if (lower.includes('shirt')) return 'Shirts';
    if (lower.includes('pant')) return 'Pants';
    if (lower.includes('short')) return 'Shorts';
    if (lower.includes('dress')) return 'Dresses';
    if (lower.includes('bag')) return 'Bags';
    if (lower.includes('cushion') || lower.includes('home')) return 'Home & Lifestyle';
    if (lower.includes('pet') || lower.includes('bandana')) return 'Pet Products';
    if (lower.includes('accessor') || lower.includes('pocket')) return 'Accessories';
    return 'All';
  };

  const selectedCategory = getActiveCategory(product.pattern_name);

  const handleCategorySelect = (catId: string) => {
    if (catId === 'All' || catId === 'Shirts') onSwitchProduct("Men's Casual Shirt");
    else if (catId === 'T-Shirts') onSwitchProduct('Kids T-Shirt');
    else if (catId === 'Pants') onSwitchProduct("Men's Pants");
    else if (catId === 'Shorts') onSwitchProduct('Casual Shorts');
    else if (catId === 'Dresses') onSwitchProduct("Women's Dress");
    else if (catId === 'Bags') onSwitchProduct('Fabric Bag');
    else if (catId === 'Accessories') onSwitchProduct('Pocket Set');
    else if (catId === 'Home & Lifestyle') onSwitchProduct('Cushion Cover');
    else if (catId === 'Pet Products') onSwitchProduct('Pet Bandana');
  };

  const handleGenerate = () => {
    toast.success('Generating Cutting Layout...');
  };

  return (
    <div className="mx-auto max-w-[1600px] animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-4">
          <button onClick={onBack} className="hover:text-emerald-600 transition-colors">Leftover Analyzer</button>
          <ChevronRight className="w-4 h-4" />
          <span>Possible Products</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800">Product Details</span>
        </div>
        
        <h1 className="text-[2.05rem] font-bold tracking-tight text-slate-900">Product Details</h1>
        <p className="mt-1 text-[1.05rem] text-slate-600">
          See how your leftover fabric can be transformed into this product.
        </p>
      </div>

      {/* Top Product Category Bar */}
      <div className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <ProductCategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Left Column - Product Preview */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden h-full flex flex-col min-h-[600px]">
            <div className="flex-1 rounded-xl overflow-hidden mb-6 relative bg-slate-50 flex items-center justify-center">
              <div className="absolute inset-0">
                <RealisticGarmentPreview garmentType={garmentType} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <div className="text-sm text-slate-500 font-medium">Product Name</div>
                <div className="text-lg font-semibold text-slate-900 mt-1">{product.pattern_name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">Recommended Size</div>
                <div className="text-lg font-semibold text-slate-900 mt-1">L</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">Category</div>
                <div className="text-lg font-semibold text-slate-900 mt-1">
                  {garmentType === 'pants' || garmentType === 'shorts' ? 'Bottom' : garmentType === 'dress' ? 'One-Piece' : garmentType === 'bag' ? 'Accessory' : 'Top'}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">Material</div>
                <div className="text-lg font-semibold text-slate-900 mt-1 capitalize">{fabricSource.fabricType || 'Cotton'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Actions */}
        <div className="space-y-6">
          {/* Fabric Requirements Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Fabric Requirements</h2>
            
            <div className="grid gap-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Required fabric</span>
                <span className="font-semibold text-slate-900">{(product.required_area_m2 * 10000).toFixed(0)} cm²</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Available fabric</span>
                <span className="font-semibold text-slate-900">{(product.available_area_m2 * 10000).toFixed(0)} cm²</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Estimated fabric utilization</span>
                <span className="font-bold text-emerald-600">{product.utilization_percentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Estimated leftover waste</span>
                <span className="font-semibold text-amber-500">{(100 - product.utilization_percentage).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Estimated pieces required</span>
                <span className="font-semibold text-slate-900">5</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-600 font-medium">Cutting feasibility</span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${product.feasible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {product.feasible ? 'Suitable' : 'Not Suitable'}
                </span>
              </div>
            </div>
          </div>

          {/* Why this product? */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Why this product?</h2>
            <ul className="space-y-3">
              {[
                'Fits the available fabric dimensions',
                'High material utilization',
                'Low expected waste',
                'Suitable for the selected fabric type'
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-slate-600">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Scissors className="w-5 h-5" />
              Generate Cutting Layout
            </button>
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Product Options */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Product Options</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSwitchProduct(opt)}
              className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-xl border transition-all min-w-[120px] ${
                opt === product.pattern_name 
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 text-slate-400">
                <Scissors className="w-5 h-5" />
              </div>
              <span className={`text-sm font-semibold ${opt === product.pattern_name ? 'text-emerald-700' : 'text-slate-600'}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Compatibility */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Fabric Compatibility</h3>
        <div className="flex flex-wrap gap-4">
          {fabrics.map((f) => (
            <div key={f} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-700 font-medium">{f}</span>
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Eco Impact Footer */}
      <div className="mt-8 mb-12 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 text-center">
        <p className="text-emerald-800 font-medium">
          🌱 By choosing this product, you can give leftover fabric a second life and reduce textile waste.
        </p>
      </div>
    </div>
  );
}
