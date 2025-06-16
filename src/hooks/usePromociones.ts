import { useQuery } from '@apollo/client';
import { PROMOCIONES_POR_CLIENTE } from '@/lib/graphql/mutations';

// Tipos para los datos de promociones
export interface PromocionData {
  id_promocion: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  id_cliente: {
    id_cliente: number;
    nombre: string;
    apellido: string;
  };
}

// Hook para obtener promociones de un cliente específico
export function usePromocionesPorCliente(id_cliente: number) {
  const { data, loading, error, refetch } = useQuery(PROMOCIONES_POR_CLIENTE, {
    variables: { id_cliente },
    errorPolicy: 'all',
    skip: !id_cliente, // No ejecutar si no hay id_cliente
  });

  return {
    promociones: data?.promocionesPorCliente ?? [],
    loading,
    error,
    refetch,
  };
}

// Funciones auxiliares para procesar datos de promociones
export function clasificarPromociones(promociones: PromocionData[]) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche

  const activas: PromocionData[] = [];
  const proximas: PromocionData[] = [];
  const expiradas: PromocionData[] = [];

  promociones.forEach((promocion) => {
    const fechaInicio = new Date(promocion.fechaInicio);
    const fechaFin = new Date(promocion.fechaFin);
    
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(23, 59, 59, 999);

    if (fechaInicio > hoy) {
      proximas.push(promocion);
    } else if (fechaFin < hoy) {
      expiradas.push(promocion);
    } else {
      activas.push(promocion);
    }
  });

  return { activas, proximas, expiradas };
}

export function calcularDiasRestantes(fechaFin: string): number {
  const hoy = new Date();
  const fin = new Date(fechaFin);
  
  hoy.setHours(0, 0, 0, 0);
  fin.setHours(23, 59, 59, 999);
  
  const diferencia = fin.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 