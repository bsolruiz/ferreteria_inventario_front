import api from '../../../api/axiosConfig';

export const listarProductos = () =>
  api.get('/api/productos').then(r => r.data);

export const obtenerProducto = (id) =>
  api.get(`/api/productos/${id}`).then(r => r.data);

export const crearProducto = (dto) =>
  api.post('/api/productos', dto).then(r => r.data);

export const actualizarProducto = (id, dto) =>
  api.put(`/api/productos/${id}`, dto).then(r => r.data);

export const eliminarProducto = (id) =>
  api.delete(`/api/productos/${id}`).then(r => r.data);

export const listarCategorias = () =>
  api.get('/api/categorias').then(r => r.data);