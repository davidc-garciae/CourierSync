import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { INSERTAR_CLIENTE } from '@/lib/graphql/mutations';

type RegisterFormType = {
  tipoId: string;
  numeroId: string;
  nombre: string;
  apellido: string;
  direccion: string;
  celular: string;
  correo: string;
  password: string;
};

type RegisterResult = {
  success: boolean;
  message?: string;
  clienteId?: number;
};

// Mapeo de tipos de documento del frontend al backend
const TIPO_DOCUMENTO_MAP: { [key: string]: number } = {
  'Cédula de ciudadanía': 1,
  'Cédula de extranjería': 2,
  'Pasaporte': 3,
  'Otro': 4,
};

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [insertarCliente] = useMutation(INSERTAR_CLIENTE);

  const register = async (form: RegisterFormType): Promise<RegisterResult> => {
    setLoading(true);
    setError('');

    try {
      const idTipoDocumento = TIPO_DOCUMENTO_MAP[form.tipoId] || 1;

      const result = await insertarCliente({
        variables: {
          clientesInput: {
            idTipoDocumento: idTipoDocumento,
            nombre: form.nombre,
            apellido: form.apellido,
            numeroDocumento: form.numeroId,
            correoElectronico: form.correo,
            contrasenaHash: form.password, // El backend hace el hash
            direccion: form.direccion,
            telefono: form.celular,
          },
        },
      });

      if (result.data?.insertarCliente) {
        setLoading(false);
        return {
          success: true,
          clienteId: result.data.insertarCliente.id_cliente,
        };
      } else {
        setLoading(false);
        return {
          success: false,
          message: 'Error al crear la cuenta',
        };
      }
    } catch (err: any) {
      setLoading(false);
      console.error('Error en registro:', err);
      
      // Verificar errores específicos del backend
      if (err.message?.includes('ConstraintViolation') || 
          err.message?.includes('duplicate') || 
          err.message?.includes('unique')) {
        return {
          success: false,
          message: 'Ya existe un usuario registrado con ese correo electrónico',
        };
      }
      
      return {
        success: false,
        message: err.message || 'Error de conexión con el servidor',
      };
    }
  };

  return {
    register,
    loading,
    error,
  };
} 