import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type StorageError,
} from 'firebase/storage';
import { storage } from './config';
import { auth } from './config';

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: StorageError;
}

export const uploadFile = (
  file: File,
  path: string,
  onProgress: (progress: UploadProgress) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      reject(new Error('Not authenticated'));
      return;
    }

    const storageRef = ref(storage, `users/${uid}/${path}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress({ progress });
      },
      (error) => {
        onProgress({ progress: 0, error });
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress({ progress: 100, downloadURL });
        resolve(downloadURL);
      }
    );
  });
};

export const deleteFile = async (path: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const storageRef = ref(storage, `users/${uid}/${path}`);
  await deleteObject(storageRef);
};
