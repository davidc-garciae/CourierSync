'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_CLIENTE_PROFILE, LISTA_CLIENTES } from '@/lib/graphql/mutations';
import { useAuthSession } from './useAuthSession';
import { storeSession } from '@/lib/utils/auth';

export type UpdateProfileForm = {
  name: string;
  apellido: string;
  direccion: string;
  phone: string;
  email: string;
  tipoId?: string;
  numeroId?: string;
  // Ya no necesitamos currentPassword
};

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthSession();
  
  const [updateClienteProfile] = useMutation(UPDATE_CLIENTE_PROFILE, {
    refetchQueries: [{ query: LISTA_CLIENTES }],
    onCompleted: (data) => {
      console.log('✅ UPDATE_CLIENTE_PROFILE completado:', data);
      setLoading(false);
      setError(null);
    },
    onError: (error) => {
      console.error('❌ ERROR en UPDATE_CLIENTE_PROFILE:', error);
      setLoading(false);
      setError(error.message);
    }
  });

  const updateProfile = async (userId: string, form: UpdateProfileForm, targetUserType?: 'cliente' | 'agente') => {
    console.log('🔄 Iniciando updateProfile (SIN contraseña)...', { userId, form, session, targetUserType });
    
    if (!session) {
      setError('No hay sesión activa');
      return false;
    }

    // Determinar qué tipo de usuario estamos editando
    const isEditingClient = targetUserType === 'cliente' || 
                           (session.userType === 'cliente' && userId === session.userData.id);
    
    // Determinar si es edición propia o por admin
    const isOwnProfile = userId === session.userData.id;
    const isAdminEditingClient = session.userType === 'agente' && targetUserType === 'cliente';

    console.log('📊 Análisis de edición:', {
      isEditingClient,
      isOwnProfile,
      isAdminEditingClient,
      sessionUserType: session.userType,
      targetUserType,
      userId,
      sessionUserId: session.userData.id
    });

    // Solo permitir:
    // 1. Cliente editando su propio perfil
    // 2. Agente editando el perfil de un cliente
    if (!isEditingClient && !isAdminEditingClient) {
      setError('Tipo de actualización no soportada. Solo se puede editar perfiles de clientes.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Validar email antes de enviar
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        setError('El email no tiene un formato válido');
        return false;
      }

      // Preparar datos para enviar al backend (todos los campos son opcionales)
      const clientesUpdateInput = {
        // Solo enviamos los campos que han cambiado
        nombre: form.name.trim(),
        apellido: form.apellido.trim(),
        direccion: form.direccion.trim(),
        telefono: form.phone.trim(),
        correoElectronico: form.email.trim(), // Trim para evitar espacios
        numeroDocumento: form.numeroId?.trim(),
        // idTipoDocumento: podríamos manejarlo después si es necesario
      };

      console.log('📤 Enviando al backend (UPDATE_CLIENTE_PROFILE):', {
        id_cliente: userId,
        clientesUpdateInput
      });

      const result = await updateClienteProfile({
        variables: {
          id_cliente: userId,
          clientesUpdateInput
        }
      });

      console.log('✅ Perfil de cliente actualizado exitosamente:', result);

      // 🔧 IMPORTANTE: Solo actualizar la sesión si es su propio perfil y el email cambió
      if (isOwnProfile && session.userType === 'cliente' && form.email.trim() !== session.userData.email) {
        console.log('📧 Email propio cambió, actualizando sesión...', {
          oldEmail: session.userData.email,
          newEmail: form.email.trim()
        });
        
        // Actualizar la sesión con el nuevo email
        storeSession(session.userType, {
          ...session.userData,
          email: form.email.trim()
        });
      }

      return true;

    } catch (err: any) {
      console.error('❌ Error en updateProfile:', err);
      
      // Manejar errores específicos
      if (err.message?.includes('Cliente no encontrado')) {
        setError('Usuario no encontrado');
      } else if (err.message?.includes('Tipo de documento no encontrado')) {
        setError('Error en tipo de documento');
      } else {
        setError(err.message ?? 'Error al actualizar perfil');
      }
      
      return false;
    }
  };

  return {
    updateProfile,
    loading,
    error
  };
} 