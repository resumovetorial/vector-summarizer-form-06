
/**
 * Helper functions for authentication
 */

// Helper to determine the access level with base on the email or role
export const determineAccessLevel = (email: string, role: string): 'supervisor' | 'administrador' => {
  // Administradores
  if (role === 'admin' || email.includes('admin')) {
    return 'administrador';
  }
  
  // Todos os outros usuários serão supervisores
  return 'supervisor';
};

/**
 * Creates a token session for demo mode
 */
export const createDemoSession = (email: string, role: string) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expiryTime = currentTime + 3600; // 1 hora de validade
  
  // Criando um payload para o token JWT
  const payload = {
    aud: "authenticated",
    exp: expiryTime,
    sub: "1",
    role: role,
    email: email
  };
  
  // Converte o payload para base64
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // Cria o token JWT com o formato correto (header, payload, signature)
  return {
    access_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.demo_signature`,
    refresh_token: `demo_refresh_token_${Date.now()}`,
    expires_at: expiryTime,
    expires_in: 3600
  };
};
