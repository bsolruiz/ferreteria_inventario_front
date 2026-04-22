import { useState, useEffect } from 'react';
import { crearProducto, listarCategorias } from '../pages/productoService';
import { toast } from 'react-hot-toast';

export default function CrearProductoPage({ onNavegar }) {
  const [form, setForm] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    codigoBarras: '',
    categoriaId: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await crearProducto({
        ...form,
        precio: parseFloat(form.precio),
        categoriaId: parseInt(form.categoriaId),
      });
      toast.success('Producto creado correctamente');
      onNavegar('inventario');
    } catch (err) {
      const errorMsg = err.response?.data?.mensaje || 'Error al crear el producto';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all";

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">

      {/* Header simple */}
      <div className="border-b border-slate-800 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => onNavegar('inventario')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver al inventario
        </button>
      </div>

      <main className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Agregar nuevo producto</h1>
            <p className="text-slate-400 mt-1 text-sm">Completa los detalles para agregar un nuevo artículo en el inventario.</p>
          </div>

          <div className="bg-[var(--color-surface-dark)] border border-slate-800 rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre del producto</label>
                <input name="nombreProducto" value={form.nombreProducto} onChange={handleChange}
                  className={inputClass} placeholder="Ej. Martillo de acero 16oz" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                  className={`${inputClass} resize-none`} rows={3}
                  placeholder="Detalles del producto..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Precio</label>
                  <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange}
                    className={inputClass} placeholder="0.00" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Código de Barras</label>
                  <input name="codigoBarras" value={form.codigoBarras} onChange={handleChange}
                    className={inputClass} placeholder="7501234567890" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Categoría</label>
                <select name="categoriaId" value={form.categoriaId} onChange={handleChange}
                  className={inputClass} required>
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(c => (
                    <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 flex items-center gap-3">
                <span className="text-slate-400 text-lg">📦</span>
                <div>
                  <p className="text-sm font-medium text-white">Cantidad inicial: 0</p>
                  <p className="text-xs text-slate-500">La cantidad se gestiona mediante movimientos de inventario</p>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => onNavegar('inventario')}
                  className="px-6 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-60">
                  {loading ? 'Guardando...' : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                      </svg>
                      Guardar Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}