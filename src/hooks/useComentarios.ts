import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { COMENTARIOS_POR_ENVIO, AGREGAR_COMENTARIO } from '@/lib/graphql/mutations';
import { toast } from 'sonner';

export interface Comentario {
  autor: string;
  texto: string;
  fecha: string;
}

export function useComentarios(envioId: string | null) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  // Query para obtener comentarios
  const { data, loading, refetch } = useQuery(COMENTARIOS_POR_ENVIO, {
    variables: { id_envio: envioId },
    skip: !envioId,
    fetchPolicy: 'cache-and-network'
  });

  // Mutation para agregar comentario
  const [agregarComentario, { loading: agregandoComentario }] = useMutation(AGREGAR_COMENTARIO, {
    onCompleted: (data) => {
      console.log('✅ Comentario agregado exitosamente (respuesta simplificada):', data);
      toast.success("Comentario agregado exitosamente");
      refetch(); // Recargar comentarios
    },
    onError: (error) => {
      console.error('❌ Error completo:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        extraInfo: error.extraInfo
      });
      toast.error(`Error al agregar comentario: ${error.message}`);
    }
  });

  // Convertir datos del backend al formato del componente
  useEffect(() => {
    if (data?.comentariosporEnvio) {
      const comentariosFormateados = data.comentariosporEnvio.map((comentario: any, index: number) => ({
        autor: "Administrador", // Por ahora, hardcodeado
        texto: comentario.contenido,
        fecha: `Comentario #${index + 1}` // Ya que no tenemos fechaCreacion, usamos un identificador
      }));
      setComentarios(comentariosFormateados);
    } else {
      setComentarios([]);
    }
  }, [data]);

  // Función para formatear fecha
  // (Eliminada porque no se utiliza)

  // Función para agregar nuevo comentario
  const handleAgregarComentario = async (texto: string) => {
    if (!envioId || !texto.trim()) return;

    console.log('🚀 Enviando comentario:', {
      id_envio: parseInt(envioId),
      contenido: texto.trim(),
      envioId: envioId,
      envioIdType: typeof envioId
    });

    try {
      await agregarComentario({
        variables: {
          id_envio: parseInt(envioId),
          contenido: texto.trim()
        }
      });
    } catch (error) {
      console.error('❌ Error detallado al agregar comentario:', error);
    }
  };

  return {
    comentarios,
    loading: loading || agregandoComentario,
    agregarComentario: handleAgregarComentario
  };
} 