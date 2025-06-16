import { useQuery } from '@apollo/client';
import { LISTA_SATISFACCIONES, SATISFACCIONES_POR_FECHA } from '@/lib/graphql/mutations';

// Tipos para los datos de satisfacción
export interface SatisfaccionData {
  id_satisfaccion: number;
  fechaEncuesta: string;
  calificacion: number;
  comentario_satisfaccion: string;
  id_cliente: {
    id_cliente: number;
    nombre: string;
    apellido: string;
  };
  id_envio: {
    id_envio: number;
    numeroGuia: string;
  };
}

// Hook para obtener todas las satisfacciones
export function useSatisfacciones() {
  const { data, loading, error, refetch } = useQuery(LISTA_SATISFACCIONES, {
    errorPolicy: 'all',
  });

  return {
    satisfacciones: data?.listaSatisfacciones ?? [],
    loading,
    error,
    refetch,
  };
}

// Hook para obtener satisfacciones por rango de fechas
export function useSatisfaccionesPorFecha(fechaInicio: string, fechaFin: string) {
  const { data, loading, error, refetch } = useQuery(SATISFACCIONES_POR_FECHA, {
    variables: { fechaInicio, fechaFin },
    errorPolicy: 'all',
    skip: !fechaInicio || !fechaFin, // No ejecutar si no hay fechas
  });

  return {
    satisfacciones: data?.satisfaccionesPorFecha ?? [],
    loading,
    error,
    refetch,
  };
}

// Funciones auxiliares para procesar datos
export function procesarDatosPorDia(satisfacciones: SatisfaccionData[]) {
  const datosPorDia = satisfacciones.reduce((acc, item) => {
    const fecha = item.fechaEncuesta;
    if (!acc[fecha]) {
      acc[fecha] = { fecha, total: 0, suma: 0, count: 0 };
    }
    acc[fecha].suma += item.calificacion;
    acc[fecha].count += 1;
    acc[fecha].total = acc[fecha].suma / acc[fecha].count;
    return acc;
  }, {} as Record<string, { fecha: string; total: number; suma: number; count: number }>);

  return Object.values(datosPorDia)
    .map((item) => ({
      fecha: item.fecha,
      promedio: Math.round(item.total * 100) / 100,
      cantidad: item.count,
    }))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export function procesarDistribucionCalificaciones(satisfacciones: SatisfaccionData[]) {
  const distribucion = satisfacciones.reduce((acc, item) => {
    const calificacion = `${item.calificacion} ⭐`;
    acc[calificacion] = (acc[calificacion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(distribucion).map(([name, value]) => ({ name, value }));
}

export function calcularEstadisticas(satisfacciones: SatisfaccionData[]) {
  if (satisfacciones.length === 0) return {
    promedio: 0,
    total: 0,
    comentarios: 0,
    satisfaccionAlta: 0,
    tendencia: 0
  };

  const promedio = satisfacciones.reduce((sum, item) => sum + item.calificacion, 0) / satisfacciones.length;
  const comentarios = satisfacciones.filter(item => item.comentario_satisfaccion?.trim().length > 0).length;
  const satisfaccionAlta = satisfacciones.filter(s => s.calificacion >= 4).length;
  
  let tendencia: number;
  if (promedio >= 4) {
    tendencia = 12;
  } else if (promedio >= 3) {
    tendencia = 5;
  } else {
    tendencia = -8;
  }

  return {
    promedio: Math.round(promedio * 100) / 100,
    total: satisfacciones.length,
    comentarios,
    satisfaccionAlta,
    tendencia
  };
} 