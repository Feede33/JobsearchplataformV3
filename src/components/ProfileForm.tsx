import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabase } from '../lib/SupabaseContext';
import { useProfiles } from '../lib/useSupabaseData';
import { FileUpload } from './FileUpload';

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
}

export const ProfileForm = () => {
  const { user } = useSupabase();
  const { getProfileByUserId, updateProfile, createProfile, loading, error } = useProfiles();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>();
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getProfileByUserId(user.id);
        
        if (profile) {
          setValue('name', profile.name || '');
          setValue('email', profile.email || '');
          setValue('bio', profile.bio || '');
          setAvatarUrl(profile.avatar_url);
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      }
    };
    
    loadProfile();
  }, [user, getProfileByUserId, setValue]);
  
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    try {
      setSuccessMessage(null);
      
      const profileData = {
        ...data,
        avatar_url: avatarUrl,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      // Verificar si el perfil existe
      const existingProfile = await getProfileByUserId(user.id);
      
      if (existingProfile) {
        await updateProfile(user.id, profileData);
      } else {
        await createProfile({
          id: user.id,
          ...profileData
        });
      }
      
      setSuccessMessage('Perfil actualizado correctamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };
  
  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };
  
  if (!user) {
    return <p className="text-center py-4">Inicia sesión para ver tu perfil</p>;
  }
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Perfil</h2>
      
      <div className="mb-6 flex flex-col items-center">
        {avatarUrl ? (
          <div className="mb-4">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-2xl">
              {user.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        )}
        
        <FileUpload
          bucket="avatars"
          onUploadComplete={handleAvatarUpload}
          acceptedFileTypes="image/*"
          className="mb-2"
        />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            {...register('name', { required: 'El nombre es requerido' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="bio" className="block font-medium mb-1">
            Biografía
          </label>
          <textarea
            id="bio"
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            {...register('bio')}
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Guardando...' : 'Guardar perfil'}
        </button>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">
            Error: {error.message}
          </p>
        )}
        
        {successMessage && (
          <p className="text-green-500 text-sm mt-2 text-center">
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};