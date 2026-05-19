import { useState, useEffect, useMemo } from 'react';
import { listarProductos } from '../pages/productoService';

const FILTROS = { TODOS: 'todos', BAJO: 'bajo', SIN_STOCK: 'sinStock' };

export function useInventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filtro, setFiltro]       = useState(FILTROS.TODOS);

  const cargarProductos = () => {
    setLoading(true);
    listarProductos()
      .then(setProductos)
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarProductos(); }, []);

  const totalProductos = productos.length;
  const stockBajoCount = productos.filter(p => p.cantidad > 0 && p.cantidad <= 10).length;
  const sinStockCount  = productos.filter(p => p.cantidad === 0).length;

  const productosFiltrados = useMemo(() => {
    if (filtro === FILTROS.BAJO)      return productos.filter(p => p.cantidad > 0 && p.cantidad <= 10);
    if (filtro === FILTROS.SIN_STOCK) return productos.filter(p => p.cantidad === 0);
    return productos;
  }, [productos, filtro]);

  const valorTotal = productosFiltrados.reduce(
    (acc, p) => acc + (Number(p.precio) * (p.cantidad ?? 0)), 0
  );

  const handleActualizado = (actualizado) =>
    setProductos(prev => prev.map(p =>
      p.idProducto === actualizado.idProducto ? actualizado : p
    ));

  const handleEliminado = (id) =>
    setProductos(prev => prev.filter(p => p.idProducto !== id));

  return {
    loading, error, filtro, setFiltro,
    totalProductos, stockBajoCount, sinStockCount,
    productosFiltrados, valorTotal,
    cargarProductos, handleActualizado, handleEliminado,
    FILTROS,
  };
}