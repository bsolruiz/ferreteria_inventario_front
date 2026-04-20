import { useState, useMemo } from 'react';
import { eliminarProducto } from '../pages/productoService';
import EditarProductoModal from './EditarProductoModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ErrorModal from './ErrorModal';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ITEMS_POR_PAGINA = 10;

function StockBar({ cantidad }) {
  const nivel = cantidad === 0 ? 'sin-stock' : cantidad < 10 ? 'bajo' : 'ok';
  const color = nivel === 'ok' ? 'bg-green-500' : nivel === 'bajo' ? 'bg-orange-500' : 'bg-red-500';
  const colorTexto = nivel === 'ok' ? 'text-slate-300' : nivel === 'bajo' ? 'text-orange-400' : 'text-red-400';
  const ancho = Math.min(Math.max((cantidad / 100) * 100, 0), 100);

  return (
    <div className="flex flex-col gap-1 w-28">
      <span className={`text-xs font-medium ${colorTexto}`}>{cantidad} uds.</span>
      <div className="w-full bg-slate-700 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${ancho}%` }} />
      </div>
    </div>
  );
}

export default function ProductosTable({ productos, onActualizado, onEliminado }) {
  const [productoEditando, setProductoEditando]   = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [eliminando, setEliminando]               = useState(false);
  const [errorEliminar, setErrorEliminar]         = useState('');
  const [busqueda, setBusqueda]                   = useState('');
  const [categoriaFiltro, setCategoriaFiltro]     = useState('Todas');
  const [paginaActual, setPaginaActual]           = useState(1);

  // Categorías únicas extraídas de los productos
  const categorias = useMemo(() => {
    const unicas = [...new Set(productos.map(p => p.categoriaNombre))].filter(Boolean);
    return ['Todas', ...unicas];
  }, [productos]);

  // Filtrado por nombre y categoría
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const coincideNombre = p.nombreProducto
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideCategoria =
        categoriaFiltro === 'Todas' || p.categoriaNombre === categoriaFiltro;
      return coincideNombre && coincideCategoria;
    });
  }, [productos, busqueda, categoriaFiltro]);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const productosPagina = productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  const visibleInicio = productosFiltrados.length === 0 ? 0 : inicio + 1;
  const visibleFin = Math.min(inicio + ITEMS_POR_PAGINA, productosFiltrados.length);

  const handleBusqueda = (valor) => {
    setBusqueda(valor);
    setPaginaActual(1);
  };

  const handleCategoria = (valor) => {
    setCategoriaFiltro(valor);
    setPaginaActual(1);
  };

  const handleEliminar = async () => {
    if (!productoAEliminar) return;
    setEliminando(true);
    try {
      await eliminarProducto(productoAEliminar.idProducto);
      onEliminado(productoAEliminar.idProducto);
      setProductoAEliminar(null);
    } catch (err) {
      setProductoAEliminar(null);
      setErrorEliminar(
        err.response?.data?.mensaje || 'Error al eliminar el producto'
      );
    } finally {
      setEliminando(false);
    }
  };

  const handleGuardado = (productoActualizado) => {
    onActualizado(productoActualizado);
    setProductoEditando(null);
  };

  return (
    <>
      {productoEditando && (
        <EditarProductoModal
          producto={productoEditando}
          onClose={() => setProductoEditando(null)}
          onGuardado={handleGuardado}
        />
      )}

      {productoAEliminar && (
        <ConfirmDeleteModal
          producto={productoAEliminar}
          onConfirmar={handleEliminar}
          onCancelar={() => setProductoAEliminar(null)}
          loading={eliminando}
        />
      )}

      {errorEliminar && (
        <ErrorModal
          mensaje={errorEliminar}
          onCerrar={() => setErrorEliminar('')}
        />
      )}

      <div className="bg-[var(--color-surface-dark)] border border-slate-800 rounded-xl overflow-hidden shadow-sm">

        {/* Header con búsqueda y filtro */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-300">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
          </h3>
          <div className="flex flex-wrap items-center gap-3">

            {/* Búsqueda por nombre */}
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--color-primary)] transition-colors"
              />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50 w-full sm:w-56 transition-all text-slate-200 placeholder-slate-500"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                value={categoriaFiltro}
                onChange={(e) => handleCategoria(e.target.value)}
                className="appearance-none bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50 text-slate-200 transition-all cursor-pointer"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
                <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-background-dark)] border-b border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 text-center">Disponibilidad</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {productosPagina.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    {busqueda || categoriaFiltro !== 'Todas'
                      ? 'No se encontraron productos con esos filtros'
                      : 'No hay productos registrados'}
                  </td>
                </tr>
              ) : (
                productosPagina.map((p) => {
                  const estado = p.cantidad === 0 ? 'sin-stock' : p.cantidad < 10 ? 'bajo' : 'activo';
                  return (
                    <tr key={p.idProducto} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{p.nombreProducto}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.descripcion}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{p.idProducto}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {p.categoriaNombre}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StockBar cantidad={p.cantidad ?? 0} />
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        ${Number(p.precio).toLocaleString('es-CO')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                          ${estado === 'activo' ? 'bg-green-500/10 text-green-400' :
                            estado === 'bajo'   ? 'bg-orange-500/10 text-orange-400' :
                                                  'bg-red-500/10 text-red-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full
                            ${estado === 'activo' ? 'bg-green-500' :
                              estado === 'bajo'   ? 'bg-orange-500' : 'bg-red-500'}`} />
                          {estado === 'activo' ? 'En stock' : estado === 'bajo' ? 'Stock bajo' : 'Sin stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Editar */}
                          <button
                            onClick={() => setProductoEditando(p)}
                            className="p-2 rounded-lg text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-700 transition-colors"
                            title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          {/* Eliminar */}
                          <button
                            onClick={() => setProductoAEliminar(p)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                            title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginación */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Mostrando{' '}
            <span className="text-slate-300 font-medium">{visibleInicio}–{visibleFin}</span>
            {' '}de{' '}
            <span className="text-slate-300 font-medium">{productosFiltrados.length}</span>
            {' '}productos
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaSegura === 1}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPaginas || Math.abs(n - paginaSegura) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`dots-${idx}`} className="text-slate-500 px-1">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPaginaActual(item)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                      ${paginaSegura === item
                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20'
                        : 'border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                    {item}
                  </button>
                )
              )
            }

            <button
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura === totalPaginas}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}