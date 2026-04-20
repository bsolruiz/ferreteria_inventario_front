import { useState, useEffect } from 'react';
import { listarProductos } from '../pages/productoService';
import ProductosTable from '../components/ProductosTable';
import Navbar from '../../../components/Navbar'; // ← importar el global

function StatCard({ icono, label, valor, colorIcono, colorBadge, badge }) {
  return (
    <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-800 rounded-lg text-xl">{icono}</div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${colorBadge}`}>{badge}</span>
      </div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{valor}</p>
    </div>
  );
}

export default function InventarioPage({ onNavegar, currentUser }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarProductos = () => {
    setLoading(true);
    listarProductos()
      .then(setProductos)
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarProductos(); }, []);

  const totalProductos = productos.length;
  const stockBajo = productos.filter(p => p.cantidad > 0 && p.cantidad < 10).length;
  const sinStock = productos.filter(p => p.cantidad === 0).length;
  const valorTotal = productos.reduce((acc, p) => acc + (Number(p.precio) * (p.cantidad ?? 0)), 0);

  const handleActualizado = (productoActualizado) => {
    setProductos(prev =>
      prev.map(p => p.idProducto === productoActualizado.idProducto ? productoActualizado : p)
    );
  };

  const handleEliminado = (id) => {
    setProductos(prev => prev.filter(p => p.idProducto !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">

      {/* ← Navbar global, ya no el inline */}
      <Navbar active="inventario" onNavigate={onNavegar} currentUser={currentUser} />

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Inventario</h1>
              <p className="text-slate-400 mt-1 text-sm">Consulta en tiempo real el estado de tus productos.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cargarProductos}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Actualizar
              </button>
              <button
                onClick={() => onNavegar('movimiento')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
                Generar Movimiento
              </button>
              <button
                onClick={() => onNavegar('crear-producto')}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Crear Producto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icono="📦" label="Total Productos" valor={totalProductos} badge="En sistema" colorBadge="bg-slate-700 text-slate-300" />
            <StatCard icono="⚠️" label="Stock Bajo" valor={stockBajo} badge="< 10 uds." colorBadge="bg-orange-500/10 text-orange-400" />
            <StatCard icono="🚫" label="Sin Stock" valor={sinStock} badge="Agotados" colorBadge="bg-red-500/10 text-red-400" />
            <StatCard icono="💰" label="Valor Total" valor={`$${valorTotal.toLocaleString('es-CO')}`} badge="Inventario" colorBadge="bg-green-500/10 text-green-400" />
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400">Cargando productos...</div>
          ) : error ? (
            <div className="text-center py-16 text-red-400">{error}</div>
          ) : (
            <ProductosTable
              productos={productos}
              onActualizado={handleActualizado}
              onEliminado={handleEliminado}
            />
          )}

        </div>
      </main>
    </div>
  );
}