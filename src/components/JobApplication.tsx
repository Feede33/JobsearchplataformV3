import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabase } from '../lib/SupabaseContext';
import { useApplications } from '../lib/useSupabaseData';
import { FileUpload } from './FileUpload';

interface JobApplicationProps {
  jobId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ApplicationFormData {
  coverLetter: string;
}

export const JobApplication = ({
  jobId,
  onSuccess,
  onCancel,
}: JobApplicationProps) => {
  const { user } = useSupabase();
  const { createApplication, loading, error } = useApplications();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>();
  
  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) return;
    
    try {
      await createApplication({
        job_id: jobId,
        user_id: user.id,
        cover_letter: data.coverLetter,
        resume_url: resumeUrl,
        status: 'pendiente'
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error al aplicar al trabajo:', err);
    }
  };
  
  const handleResumeUpload = (url: string) => {
    setResumeUrl(url);
  };
  
  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">
          Debes iniciar sesión para aplicar a este trabajo.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Aplicar a este trabajo</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="resumeUpload" className="block font-medium mb-1">
            Curriculum (PDF)
          </label>
          <FileUpload
            bucket="resumes"
            onUploadComplete={handleResumeUpload}
            acceptedFileTypes=".pdf,.doc,.docx"
            className="mb-1"
          />
          {resumeUrl && (
            <p className="text-sm text-green-600">
              CV subido correctamente
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="coverLetter" className="block font-medium mb-1">
            Carta de presentación
          </label>
          <textarea
            id="coverLetter"
            className="w-full px-3 py-2 border rounded-md"
            rows={6}
            placeholder="Describe por qué eres un buen candidato para este puesto..."
            {...register('coverLetter', {
              required: 'La carta de presentación es requerida',
              minLength: {
                value: 50,
                message: 'La carta debe tener al menos 50 caracteres',
              },
            })}
          ></textarea>
          {errors.coverLetter && (
            <p className="text-red-500 text-sm mt-1">
              {errors.coverLetter.message}
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !resumeUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Enviando...' : 'Enviar aplicación'}
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">
            Error: {error.message}
          </p>
        )}
        
        {!resumeUrl && (
          <p className="text-yellow-600 text-sm mt-2">
            * Debes subir tu CV para poder aplicar
          </p>
        )}
      </form>
    </div>
  );
};