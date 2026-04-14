import api from '../../../api/axiosConfig';

export const loginUsuario = async (correo, contrasena) => {
  const response = await api.post('/api/auth/login', { correo, contrasena });
  return response.data; // { idUsuario, nombres, correo, rolNombre }
};