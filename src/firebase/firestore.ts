import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { auth } from './config';
import type { Project, UserProfile } from '@/types';

// ─── User Profile ─────────────────────────────────────────────────────────────
export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const subscribeToProjects = (
  uid: string,
  callback: (projects: Project[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, 'projects'),
    where('user_id', '==', uid),
    orderBy('created_at', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    callback(projects);
  });
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  const snap = await getDoc(doc(db, 'projects', projectId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
};

export const saveOptimizationRun = async (
  projectId: string,
  runId: string,
  data: Record<string, unknown>
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(
    doc(db, 'projects', projectId, 'optimizationRuns', runId),
    { ...data, userId: uid, createdAt: serverTimestamp() }
  );
};

// ─── Dashboard Stats (aggregation from projects) ─────────────────────────────
export const getDashboardStats = async (uid: string) => {
  const q = query(
    collection(db, 'projects'),
    where('user_id', '==', uid),
    limit(100)
  );
  const snap = await getDocs(q);
  const projects = snap.docs.map((d) => d.data());

  const totalProjects = projects.length;
  // Pull optimization run data from Firestore for analytics
  // For now return project-level aggregates
  return { totalProjects, projects };
};
