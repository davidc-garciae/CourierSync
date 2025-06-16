import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_CLIENTE, LOGIN_AGENTE } from '@/lib/graphql/mutations';
import { storeSession } from '@/lib/utils/auth';

type LoginResult = {
  success: boolean;
  message?: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginCliente] = useMutation(LOGIN_CLIENTE);
  const [loginAgente] = useMutation(LOGIN_AGENTE);

  const login = async (
    email: string, 
    password: string, 
    role: 'usuario' | 'admin'
  ): Promise<LoginResult> => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (role === 'usuario') {
        // Login como cliente - enviar contraseña en texto plano, el backend la encripta
        result = await loginCliente({
          variables: {
            correoElectronico: email,
            contrasenaHash: password, // El backend hace el hash
          },
        });
        
        if (result.data?.LoginCliente) {
          // Almacenar sesión
          storeSession('cliente', { email });
          setLoading(false);
          return { success: true };
        } else {
          setLoading(false);
          return { success: false, message: 'Credenciales de usuario incorrectas' };
        }
      } else {
        // Login como agente/administrador - enviar contraseña en texto plano, el backend la encripta
        result = await loginAgente({
          variables: {
            nombreUsuario: email,
            contrasenaHash: password, // El backend hace el hash
          },
        });
        
        if (result.data?.LoginAgente) {
          // Almacenar sesión
          storeSession('agente', { nombreUsuario: email });
          setLoading(false);
          return { success: true };
        } else {
          setLoading(false);
          return { success: false, message: 'Credenciales de administrador incorrectas' };
        }
      }
    } catch (err: any) {
      setLoading(false);
      console.error('Error en login:', err);
      return { 
        success: false, 
        message: err.message ?? 'Error de conexión con el servidor' 
      };
    }
  };

  return {
    login,
    loading,
    error,
  };
} 