import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as _onAuthStateChanged,
  type User,
  type NextOrObserver,
} from 'firebase/auth';
import { auth } from './config';

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUp = async (email: string, password: string, displayName: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
};

export const logOut = () => signOut(auth);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

/**
 * Wrapper that binds the Firebase auth instance so callers
 * only need to pass a callback: `onAuthStateChanged((user) => {...})`
 */
export const onAuthStateChanged = (cb: NextOrObserver<User>) =>
  _onAuthStateChanged(auth, cb);

export type { User };
