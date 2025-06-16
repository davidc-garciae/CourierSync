'use client';

import { useQuery } from '@apollo/client';
import { ENVIOS_POR_CLIENTE } from '@/lib/graphql/mutations';
import { useUserProfile } from './useUserProfile';

export type EnvioCliente = {
  id_envio: string;
  numeroGuia: string;
  direccionEnvio: string;
  fechaCompra: string;
  precio: number;
  estado: string;
  nombreCliente: string;
};

export function useEnviosCliente() {
  const { userProfile, loading: profileLoading } = useUserProfile();

  const { 
    data, 
    loading: enviosLoading, 
    error, 
    refetch 
  } = useQuery(ENVIOS_POR_CLIENTE, {
    variables: { 
      id_cliente: userProfile?.id ? parseInt(userProfile.id) : 0 
    },
    skip: !userProfile?.id || userProfile.userType !== 'cliente',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  // Mapear datos del backend a la estructura que usa el frontend
  const envios: EnvioCliente[] = data?.enviosPorCliente?.map((envio: any) => ({
    id_envio: envio.id_envio.toString(),
    numeroGuia: envio.numeroGuia,
    direccionEnvio: envio.direccionEnvio,
    fechaCompra: formatFecha(envio.fechaCompra),
    precio: envio.precio,
    estado: envio.id_estado?.nombre ?? 'Sin estado',
    nombreCliente: `${envio.id_cliente?.nombre ?? ''} ${envio.id_cliente?.apellido ?? ''}`.trim()
  })) ?? [];

  const loading = profileLoading || enviosLoading;

  return {
    envios,
    loading,
    error: error?.message ?? null,
    refetch,
    hasEnvios: envios.length > 0
  };
}

// Función auxiliar para formatear fechas
function formatFecha(fechaISO: string): string {
  try {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return fechaISO; // Fallback si no se puede parsear
  }
} 