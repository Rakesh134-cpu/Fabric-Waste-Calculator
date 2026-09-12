// ─── User & Auth ──────────────────────────────────────────────────────────────
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  displayName: string;
  email: string;
  companyName?: string;
  role?: string;
  createdAt: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────
export type UnitSystem = 'cm' | 'inch';
export type FabricGrain = 'lengthwise' | 'crosswise' | 'bias';
export type ProjectStatus = 'draft' | 'optimized' | 'completed';
export type PatternCategory = 'shirt' | 'pants' | 'shorts' | 'dress' | 'kids' | 'accessories' | 'other';

export interface PatternPiece {
  id?: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  allow_rotation: boolean;
  category: PatternCategory;
  priority?: number;
}

export interface Project {
  id: string;
  user_id: string;
  project_name: string;
  garment_name: string;
  description?: string;
  fabric_type: string;
  fabric_width: number;
  available_length: number;
  cost_per_meter: number;
  unit_system: UnitSystem;
  grain_direction?: FabricGrain;
  min_remnant_width: number;
  min_remnant_height: number;
  cutting_gap: number;
  pattern_pieces: PatternPiece[];
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// ─── Optimization ─────────────────────────────────────────────────────────────
export type AlgorithmType = 'shelf' | 'maxrects' | 'hybrid';
export type OptimizationMode = 'fast' | 'balanced' | 'maximum';

export interface OptimizationRequest {
  project_id: string;
  fabric_width: number;
  available_length: number;
  cost_per_meter: number;
  cutting_gap: number;
  min_remnant_width: number;
  min_remnant_height: number;
  pattern_pieces: PatternPiece[];
  algorithms: AlgorithmType[];
  mode: OptimizationMode;
}

export interface Placement {
  id: string;
  pattern_piece_id: string;
  piece_name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
}

export interface RemnantRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  classification: 'REUSABLE' | 'POTENTIALLY_REUSABLE' | 'TRUE_WASTE';
}

export interface LayoutResult {
  algorithm: AlgorithmType;
  algorithm_label: string;
  valid: boolean;
  placements: Placement[];
  fabric_width: number;
  fabric_length_used: number;
  pattern_area: number;
  fabric_area: number;
  utilization: number;
  gross_waste: number;
  waste_percentage: number;
  cost: number;
  remnants: RemnantRect[];
  reusable_area: number;
  true_waste_area: number;
  score: number;
  processing_time_ms: number;
  unplaced_pieces?: string[];
}

export interface BaselineResult {
  fabric_length_used: number;
  fabric_area: number;
  pattern_area: number;
  utilization: number;
  gross_waste: number;
  waste_percentage: number;
  cost: number;
}

export interface Recommendation {
  type: string;
  message: string;
  impact: string;
  value?: number;
}

export interface OptimizationResponse {
  run_id: string;
  project_id: string;
  baseline: BaselineResult;
  layouts: LayoutResult[];
  best_layout_index: number;
  fabric_saved_vs_baseline: number;
  cost_saved_vs_baseline: number;
  waste_reduction_percentage: number;
  recommendations: Recommendation[];
  processing_time_ms: number;
}

// ─── Remnants ─────────────────────────────────────────────────────────────────
export interface ProductMatch {
  pattern_id: string;
  pattern_name: string;
  category: string;
  quantity_possible: number;
  required_area: number;
  remnant_area: number;
  utilization_percentage: number;
  remaining_area: number;
  confidence: 'High' | 'Medium' | 'Low';
  feasible: boolean;
  infeasibility_reason?: string;
  placements: Placement[];
}

export interface RemnantAnalysisResponse {
  remnant_id: string;
  width: number;
  height: number;
  area_cm2: number;
  area_m2: number;
  material_type: string;
  classification: 'REUSABLE' | 'POTENTIALLY_REUSABLE' | 'TRUE_WASTE';
  product_matches: ProductMatch[];
  best_match: ProductMatch | null;
  total_recoverable_value: number;
  recommendations: string[];
}

// ─── Wizard Form State ────────────────────────────────────────────────────────
export interface WizardFormData {
  // Step 1: Project Details
  project_name: string;
  garment_name: string;
  description: string;
  fabric_type: string;
  unit_system: UnitSystem;
  // Step 2: Fabric
  fabric_width: number;
  available_length: number;
  cost_per_meter: number;
  cutting_gap: number;
  min_remnant_width: number;
  min_remnant_height: number;
  // Step 3: Patterns
  pattern_pieces: PatternPiece[];
  // Step 4: Settings
  algorithms: AlgorithmType[];
  mode: OptimizationMode;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalProjects: number;
  avgUtilization: number;
  totalFabricSaved: number;
  reusableRemnants: number;
  wasteReduced: number;
  estimatedSavings: number;
}

export interface ChartDataPoint {
  date: string;
  utilization?: number;
  waste?: number;
  savings?: number;
  baseline?: number;
  optimized?: number;
}
