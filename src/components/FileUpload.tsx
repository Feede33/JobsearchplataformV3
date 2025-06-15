import { useState, useRef, ChangeEvent } from 'react';
import { uploadFile } from '../lib/supabaseStorage';
import { useSupabase } from '../lib/SupabaseContext';

interface FileUploadProps {
  bucket: 'resumes' | 'avatars';
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  className?: string;
}

export const FileUpload = ({
  bucket,
  onUploadComplete,
  onUploadError,
  acceptedFileTypes = '*',
  maxSizeMB = 5,
  className = '',
}: FileUploadProps) => {
  const { user } = useSupabase();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }
    
    const file = e.target.files[0];
    setFileName(file.name);
    
    // Verificar tamaño del archivo
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const error = new Error(`El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB`);
      onUploadError?.(error);
      return;
    }
    
    try {
      setUploading(true);
      
      // Crear una ruta única usando userId y nombre de archivo
      const path = `${user.id}/${file.name}`;
      const { url, error } = await uploadFile(bucket, path, file);
      
      if (error) throw error;
      
      if (url && onUploadComplete) {
        onUploadComplete(url);
      }
    } catch (error) {
      if (error instanceof Error && onUploadError) {
        onUploadError(error);
      }
      console.error('Error al subir archivo:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={uploading || !user}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400"
      >
        {uploading ? 'Subiendo...' : fileName ? 'Cambiar archivo' : 'Subir archivo'}
      </button>
      {fileName && (
        <span className="ml-2 text-sm text-gray-600">
          {fileName}
        </span>
      )}
    </div>
  );
};