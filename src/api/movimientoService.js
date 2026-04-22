import api from "./axiosConfig";

export const registrarMovimiento = (dto) =>
  api.post("/api/movimientos", dto).then((r) => r.data);

export const obtenerStock = (productoId) =>
  api.get(`/api/movimientos/stock/${productoId}`).then((r) => r.data);

export const buscarProductos = (query) =>
  api.get(`/api/productos/buscar?q=${query}`).then((r) => r.data);

export const listarProductos = () =>
  api.get("/api/productos").then((r) => r.data);
