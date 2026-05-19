import { useInventario } from '../hooks/useInventario';
import ProductosTable from '../components/ProductosTable';
import Navbar from '../../../components/Navbar';

function StatCard({ icono, label, valor, colorBadge, badge, activo, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left bg-[var(--color-surface-dark)] rounded-xl p-5 border shadow-sm transition-all
        ${activo ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/40' : 'border-slate-800 hover:border-slate-600'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-800 rounded-lg text-xl">{icono}</div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${colorBadge}`}>{badge}</span>
      </div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{valor}</p>
    </button>
  );
}

export default function InventarioPage({ onNavegar, currentUser }) {
  const {
    loading, error, filtro, setFiltro,
    totalProductos, stockBajoCount, sinStockCount,
    productosFiltrados, valorTotal,
    cargarProductos, handleActualizado, handleEliminado,
    FILTROS,
  } = useInventario();

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <Navbar active="inventario" onNavigate={onNavegar} currentUser={currentUser} />

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Inventario</h1>
              <p className="text-slate-400 mt-1 text-sm">Consulta en tiempo real el estado de tus productos.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={cargarProductos}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Actualizar
              </button>
              <button onClick={() => onNavegar('movimiento')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
                Movimientos
              </button>
              <button onClick={() => onNavegar('crear-producto')}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Crear Producto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icono="📦" label="Total Productos" valor={totalProductos}
              badge="En sistema" colorBadge="bg-slate-700 text-slate-300"
              activo={filtro === FILTROS.TODOS} onClick={() => setFiltro(FILTROS.TODOS)} />
            <StatCard icono="⚠️" label="Stock Bajo" valor={stockBajoCount}
              badge="≤ 10 uds." colorBadge="bg-orange-500/10 text-orange-400"
              activo={filtro === FILTROS.BAJO} onClick={() => setFiltro(FILTROS.BAJO)} />
            <StatCard icono="🚫" label="Sin Stock" valor={sinStockCount}
              badge="Agotados" colorBadge="bg-red-500/10 text-red-400"
              activo={filtro === FILTROS.SIN_STOCK} onClick={() => setFiltro(FILTROS.SIN_STOCK)} />
            <StatCard icono="💰" label="Valor Total" valor={`$${valorTotal.toLocaleString('es-CO')}`}
              badge={filtro === FILTROS.TODOS ? 'Inventario' : filtro === FILTROS.BAJO ? 'Stock bajo' : 'Sin stock'}
              colorBadge="bg-green-500/10 text-green-400"
              activo={false} onClick={() => {}} />
          </div>

          {filtro !== FILTROS.TODOS && (
            <div className="flex items-center gap-3 -mt-4">
              <span className="text-xs text-slate-400">
                Mostrando: <span className="text-white font-medium">
                  {filtro === FILTROS.BAJO ? 'productos con stock bajo (≤ 10 uds.)' : 'productos sin stock'}
                </span>
              </span>
              <button onClick={() => setFiltro(FILTROS.TODOS)}
                className="text-xs text-[var(--color-primary)] hover:underline">
                Ver todos
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-slate-400">Cargando productos...</div>
          ) : error ? (
            <div className="text-center py-16 text-red-400">{error}</div>
          ) : (
            <ProductosTable
              productos={productosFiltrados}
              onActualizado={handleActualizado}
              onEliminado={handleEliminado}
            />
          )}

        </div>
      </main>
    </div>
  );
}