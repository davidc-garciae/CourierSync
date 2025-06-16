import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { LISTA_CLIENTES, LISTA_AGENTES } from '@/lib/graphql/mutations';
import { useAuthSession } from './useAuthSession';

export type UserProfile = {
  id: string;
  name: string;
  apellido?: string;
  direccion: string;
  phone: string;
  email: string;
  tipoId?: string;
  numeroId?: string;
  avatar?: string;
  userType: 'cliente' | 'agente';
};

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Usar el hook de sesión más estable
  const { session, isLoading: sessionLoading } = useAuthSession();
  
  const { 
    data: clientesData, 
    loading: clientesLoading, 
    error: clientesError,
    refetch: refetchClientes
  } = useQuery(LISTA_CLIENTES, {
    skip: !session || session.userType !== 'cliente',
    fetchPolicy: 'cache-and-network', // Obtener datos frescos siempre
    notifyOnNetworkStatusChange: true
  });
  
  const { 
    data: agentesData, 
    loading: agentesLoading, 
    error: agentesError,
    refetch: refetchAgentes
  } = useQuery(LISTA_AGENTES, {
    skip: !session || session.userType !== 'agente',
    fetchPolicy: 'cache-and-network', // Obtener datos frescos siempre
    notifyOnNetworkStatusChange: true
  });

  // Consolidar el estado de loading
  const loading = useMemo(() => {
    if (sessionLoading) return true;
    if (!session) return false;
    return (session.userType === 'cliente' && clientesLoading) || 
           (session.userType === 'agente' && agentesLoading);
  }, [sessionLoading, session, clientesLoading, agentesLoading]);

  // Efecto principal para procesar los datos
  useEffect(() => {
    if (sessionLoading) return; // Esperar a que se cargue la sesión
    
    if (!session) {
      console.log('🔍 useUserProfile: No hay sesión activa');
      setError('No hay sesión activa');
      setUserProfile(null);
      return;
    }

    // Procesar datos de cliente
    if (session.userType === 'cliente' && clientesData && !clientesLoading) {
      console.log('🔍 useUserProfile: Buscando cliente...', {
        sessionEmail: session.userData.email,
        clientesCount: clientesData.listaClientes?.length,
        clientesEmails: clientesData.listaClientes?.map((c: any) => c.correoElectronico)
      });

      // Primero intentar buscar por email de sesión
      let cliente = clientesData.listaClientes?.find((c: any) => 
        c.correoElectronico === session.userData.email
      );

      // Si no lo encuentra, buscar por ID si está disponible
      if (!cliente && userProfile?.id) {
        console.log('🔍 useUserProfile: Buscando por ID como fallback...', userProfile.id);
        cliente = clientesData.listaClientes?.find((c: any) => 
          c.id_cliente.toString() === userProfile.id
        );
      }
      
      if (cliente) {
        console.log('✅ useUserProfile: Cliente encontrado', cliente);
        setUserProfile({
          id: cliente.id_cliente.toString(),
          name: cliente.nombre,
          apellido: cliente.apellido,
          direccion: cliente.direccion,
          phone: cliente.telefono,
          email: cliente.correoElectronico,
          tipoId: cliente.idTipoDocumento?.nombre ?? 'No especificado',
          numeroId: cliente.numeroDocumento,
          userType: 'cliente'
        });
        setError(null);
      } else {
        console.log('❌ useUserProfile: Cliente no encontrado');
        setError('Cliente no encontrado');
        setUserProfile(null);
      }
    }

    // Procesar datos de agente
    if (session.userType === 'agente' && agentesData && !agentesLoading) {
      const agente = agentesData.listaAgentes?.find((a: any) => 
        a.nombreUsuario === session.userData.nombreUsuario
      );
      
      if (agente) {
        setUserProfile({
          id: agente.id_agente.toString(),
          name: agente.nombreUsuario,
          direccion: agente.direccion,
          phone: agente.telefono,
          email: agente.correoElectronico,
          userType: 'agente'
        });
        setError(null);
      } else {
        setError('Agente no encontrado');
        setUserProfile(null);
      }
    }
  }, [sessionLoading, session, clientesData, agentesData, clientesLoading, agentesLoading, userProfile?.id]);

  // Manejar errores de las queries
  useEffect(() => {
    if (clientesError || agentesError) {
      console.error('❌ useUserProfile: Error en queries', { clientesError, agentesError });
      setError('Error al cargar datos del usuario');
      setUserProfile(null);
    }
  }, [clientesError, agentesError]);

  const refetch = () => {
    console.log('🔄 useUserProfile: Refetching data...');
    setError(null);
    if (session?.userType === 'cliente') {
      refetchClientes();
    } else if (session?.userType === 'agente') {
      refetchAgentes();
    }
  };

  return {
    userProfile,
    loading,
    error,
    refetch,
    isAuthenticated: !!session,
    isLoadingAuth: sessionLoading
  };
} 