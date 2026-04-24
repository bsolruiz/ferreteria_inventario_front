import api from './axiosConfig';

export const crearUsuario = (dto) =>
  api.post('/api/usuarios', dto).then(r => r.data);

export const actualizarUsuario = (id, dto) =>
  api.put(`/api/usuarios/${id}`, dto).then(r => r.data);

export const eliminarUsuario = (id) =>
  api.delete(`/api/usuarios/${id}`).then(r => r.data);

export const obtenerUsuario = (id) =>
  api.get(`/api/usuarios/${id}`).then(r => r.data);

export const listarUsuarios = () =>
  api.get('/api/usuarios').then(r => r.data);

export const listarRoles = async () => {
  try {
      const response = await api.get('/api/roles');
      console.log("Respuesta completa:", response);
      console.log("Datos de roles:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error en listarRoles:", error);
      console.error("Detalle:", error.response?.data);
      throw error;
  }
};
