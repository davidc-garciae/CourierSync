import CryptoJS from 'crypto-js';

/**
 * Hash de contraseña usando SHA-256
 * @param password - Contraseña en texto plano
 * @returns Contraseña hasheada
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

/**
 * Verifica si la contraseña coincide con el hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash a comparar
 * @returns true si coincide, false si no
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Almacena información de sesión en localStorage y cookies
 * @param userType - Tipo de usuario ('cliente' | 'agente')
 * @param userData - Datos del usuario
 */
export function storeSession(userType: 'cliente' | 'agente', userData: any) {
  if (typeof window !== 'undefined') {
    // LocalStorage para acceso cliente
    localStorage.setItem('userType', userType);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Cookies para acceso del middleware
    document.cookie = `userType=${userType}; path=/; max-age=86400`; // 24 horas
    document.cookie = `isAuthenticated=true; path=/; max-age=86400`;
  }
}

/**
 * Obtiene información de sesión de localStorage
 * @returns Información de sesión o null si no existe
 */
export function getSession() {
  if (typeof window !== 'undefined') {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('userData');
    
    if (isAuthenticated === 'true' && userType && userData) {
      return {
        isAuthenticated: true,
        userType: userType as 'cliente' | 'agente',
        userData: JSON.parse(userData)
      };
    }
  }
  return null;
}

/**
 * Limpia la sesión del localStorage y cookies
 */
export function clearSession() {
  if (typeof window !== 'undefined') {
    // Limpiar localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    
    // Limpiar cookies
    document.cookie = 'userType=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
} 