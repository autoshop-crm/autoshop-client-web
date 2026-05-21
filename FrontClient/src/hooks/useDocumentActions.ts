import { useCallback, useState } from 'react';
import { documentsApi } from '../api/documentsApi';

interface UploadParams {
  file: File;
  category: 'INSPECTION_PHOTO' | 'DOCUMENT' | 'ACT' | 'ESTIMATE';
  ownerType: 'ORDER' | 'VEHICLE';
  ownerId: string;
}

export const useDocumentActions = (onUploaded?: () => Promise<void> | void) => {
  const [busyFileId, setBusyFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<UploadParams | null>(null);
  const [uploading, setUploading] = useState(false);

  const openDocument = useCallback(async (fileId: string) => {
    setBusyFileId(fileId);
    try {
      return await documentsApi.getOpenUrl(fileId);
    } finally {
      setBusyFileId(null);
    }
  }, []);

  const downloadDocument = useCallback(async (fileId: string) => {
    setBusyFileId(fileId);
    try {
      return await documentsApi.getDownloadUrl(fileId);
    } finally {
      setBusyFileId(null);
    }
  }, []);

  const uploadDocument = useCallback(async (params: UploadParams) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setLastUpload(params);

    try {
      await documentsApi.upload({ ...params, progress: setUploadProgress, uploadedBy: 'CLIENT' });
      await onUploaded?.();
    } catch (error: any) {
      if (error?.message === 'FILE_TOO_LARGE') {
        setUploadError('Файл слишком большой. Добавьте материал до 15 МБ.');
      } else if (error?.message === 'FILE_TYPE_NOT_ALLOWED') {
        setUploadError('Поддерживаются только JPG, PNG и PDF.');
      } else {
        setUploadError('Не удалось загрузить файл. Попробуйте ещё раз.');
      }
      throw error;
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const retryUpload = useCallback(async () => {
    if (!lastUpload) {
      return;
    }
    await uploadDocument(lastUpload);
  }, [lastUpload, uploadDocument]);

  return {
    busyFileId,
    uploading,
    uploadProgress,
    uploadError,
    openDocument,
    downloadDocument,
    uploadDocument,
    retryUpload,
    clearUploadError: () => setUploadError(null)
  };
};
