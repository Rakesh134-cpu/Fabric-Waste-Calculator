import axios from 'axios';
import { getIdToken } from '@/firebase/auth';
import type { FabricAnalysisResponse, OptimizationRequest, OptimizationResponse, RemnantAnalysisResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 min for optimization
});

// Inject Firebase ID token into every request
api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Network error';
    return Promise.reject(new Error(message));
  }
);

// ─── Health ───────────────────────────────────────────────────────────────────
export const checkHealth = () => api.get('/health');

// ─── Projects ────────────────────────────────────────────────────────────────
export const createProject = (data: Record<string, unknown>) =>
  api.post<Record<string, unknown>>('/api/projects', data).then((r) => r.data);

export const listProjects = () =>
  api.get<Record<string, unknown>[]>('/api/projects').then((r) => r.data);

export const getProjects = () =>
  api.get<any[]>('/api/projects').then((r) => r.data);

export const getProject = (id: string) =>
  api.get<Record<string, unknown>>(`/api/projects/${id}`).then((r) => r.data);

export const updateProject = (id: string, data: Record<string, unknown>) =>
  api.put<Record<string, unknown>>(`/api/projects/${id}`, data).then((r) => r.data);

export const deleteProject = (id: string) =>
  api.delete(`/api/projects/${id}`);

// ─── Optimization ─────────────────────────────────────────────────────────────
export const runOptimization = (req: OptimizationRequest): Promise<OptimizationResponse> =>
  api.post<OptimizationResponse>('/api/optimize', req).then((r) => r.data);

// ─── Remnants ────────────────────────────────────────────────────────────────
export const analyzeRemnant = (data: {
  width: number;
  height: number;
  material_type: string;
  project_id?: string;
}): Promise<RemnantAnalysisResponse> =>
  api.post<RemnantAnalysisResponse>('/api/remnants/analyze', data).then((r) => r.data);

export const analyzeFabric = (data: {
  image: File;
  width: number;
  length: number;
  shape: string;
  material: string;
}): Promise<FabricAnalysisResponse> => {
  const form = new FormData();
  form.append('fabric_image', data.image);
  form.append('width_cm', String(data.width));
  form.append('length_cm', String(data.length));
  form.append('shape', data.shape);
  form.append('material_type', data.material);
  return api.post<FabricAnalysisResponse>('/api/analyze-fabric', form).then((r) => r.data);
};

// ─── Analytics ───────────────────────────────────────────────────────────────
export const getProjectAnalytics = (projectId: string) =>
  api.get(`/api/projects/${projectId}/analytics`).then((r) => r.data);

export const getRecommendations = (projectId: string) =>
  api.get(`/api/projects/${projectId}/recommendations`).then((r) => r.data);

export const apiService = {
  checkHealth,
  createProject,
  listProjects,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  runOptimization,
  analyzeRemnant,
  analyzeFabric,
  getProjectAnalytics,
  getRecommendations,
};

export default api;
