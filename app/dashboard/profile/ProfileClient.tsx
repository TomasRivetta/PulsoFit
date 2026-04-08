'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ProfileClientProps {
  user: any;
  displayName: string;
  avatarUrl?: string;
}

export function ProfileClient({ user, displayName, avatarUrl }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const [newAvatarUrl, setNewAvatarUrl] = useState(avatarUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    let finalAvatarUrl = newAvatarUrl;

    try {
      // 1. Handle File Upload if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        finalAvatarUrl = publicUrl;
      }

      // 2. Update User Metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: finalAvatarUrl
        }
      });

      if (error) throw error;
      
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      router.refresh();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(`Error al actualizar el perfil: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
        <div className="w-32 h-32 rounded-full bg-surface-container-highest border-4 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl relative group">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-6xl text-primary/40">person</span>
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
            <h2 className="text-3xl font-headline font-black text-on-surface capitalize">
              {displayName}
            </h2>
            <span className="bg-primary-container text-on-primary-fixed text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
              Nivel {user.user_metadata?.role || 'Elite'}
            </span>
          </div>
          <p className="text-on-surface-variant font-medium mb-6">{user.email}</p>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="py-3 px-8 rounded-2xl bg-surface-bright text-on-surface font-bold text-sm uppercase tracking-widest border border-outline-variant/15 hover:bg-surface-container-highest hover:border-primary/30 transition-all flex items-center justify-center gap-2 group w-full sm:w-fit"
          >
            <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">edit</span>
            Editar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <label className="relative cursor-pointer group">
          <div className="w-32 h-32 rounded-full bg-surface-container-highest border-4 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl relative">
            {(previewUrl || avatarUrl) ? (
              <img src={previewUrl || avatarUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
            ) : (
              <span className="material-symbols-outlined text-6xl text-primary/40 group-hover:opacity-20">person</span>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-3xl text-primary">add_a_photo</span>
            </div>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant ml-1">Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Tu nombre..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant ml-1">O usar URL externa</label>
            <input 
              type="text" 
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              className="w-full bg-surface-container-highest border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={handleUpdate}
          disabled={isSaving}
          className="flex-1 py-4 rounded-2xl bg-primary text-on-primary-fixed font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button 
          onClick={() => {
            setIsEditing(false);
            setPreviewUrl(null);
            setSelectedFile(null);
          }}
          disabled={isSaving}
          className="flex-1 py-4 rounded-2xl bg-surface-container-highest text-on-surface font-bold text-sm uppercase tracking-widest border border-outline-variant/10 hover:bg-surface-bright transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

