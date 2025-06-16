import { useState, useRef, ChangeEvent } from 'react';
import { uploadFile } from '../lib/supabaseStorage';
import { Button } from "@/components/ui/button";
import { useSupabase } from '../lib/SupabaseContext';
import { AlertCircle, Loader2, Upload } from 'lucide-react';

interface FileUploadProps {
  bucket: 'resumes' | 'avatars';
  onUploadComplete?: (url: string, fileName: string) => void;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Limpiar errores previos
    setErrorMessage(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    if (!user) {
      const error = new Error("Usuario no autenticado. Debes iniciar sesión para subir archivos.");
      setErrorMessage(error.message);
      if (onUploadError) onUploadError(error);
      return;
    }
    
    const file = e.target.files[0];
    
    // Validar tipo de archivo
    if (acceptedFileTypes !== '*' && !file.type.match(acceptedFileTypes)) {
      const error = new Error(`Tipo de archivo no permitido. Por favor, sube un archivo ${acceptedFileTypes}`);
      setErrorMessage(error.message);
      if (onUploadError) onUploadError(error);
      return;
    }
    
    // Verificar tamaño del archivo
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const error = new Error(`El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB`);
      setErrorMessage(error.message);
      if (onUploadError) onUploadError(error);
      return;
    }
    
    setFileName(file.name);
    
    try {
      setUploading(true);
      
      // Crear una ruta única usando userId y nombre de archivo
      const path = `${user.id}/${file.name}`;
      
      console.log('Iniciando carga de archivo:', file.name, 'tamaño:', fileSizeMB.toFixed(2) + 'MB');
      
      const { url, error } = await uploadFile(bucket, path, file);
      
      if (error) {
        setErrorMessage(error.message);
        throw error;
      }
      
      if (url && onUploadComplete) {
        console.log('Archivo subido exitosamente:', url);
        onUploadComplete(url, file.name);
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
        if (onUploadError) onUploadError(error);
      }
    } finally {
      setUploading(false);
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    if (!user) {
      const error = new Error("Debes iniciar sesión para subir archivos");
      setErrorMessage(error.message);
      if (onUploadError) onUploadError(error);
      return;
    }
    
    fileInputRef.current?.click();
  };
  
  return (
    <div className={`${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        style={{ display: 'none' }}
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={uploading || !user}
          className="flex items-center"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : fileName ? (
            'Cambiar archivo'
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Subir archivo
            </>
          )}
        </Button>
        
        {fileName && !errorMessage && (
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {fileName}
          </span>
        )}
      </div>
      
      {errorMessage && (
        <div className="flex items-center text-red-600 text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};