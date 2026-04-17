import api from "./axiosConfig";

export const fetchMovimientos = async () => {
  const response = await api.get("/api/reportes/movimientos");
  return response.data;
};

export const fetchProductosExistentes = async () => {
  const response = await api.get("/api/reportes/productos");
  return response.data;
};

export const fetchProductosBajoStock = async () => {
  const response = await api.get("/api/reportes/bajo-stock");
  return response.data;
};

export const fetchProductosSinStock = async () => {
  const response = await api.get("/api/reportes/sin-stock");
  return response.data;
};

export const fetchInventarioTotal = async () => {
  const response = await api.get("/api/reportes/inventario");
  return response.data;
};
