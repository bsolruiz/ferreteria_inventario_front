import { useState, useEffect } from 'react';
import { actualizarProducto, listarCategorias } from '../pages/productoService';
import { toast } from 'react-hot-toast';

export default function EditarProductoModal({ producto, onClose, onGuardado }) {

  const [form, setForm] = useState({
    nombreProducto: producto.nombreProducto,
    descripcion: producto.descripcion,
    precio: producto.precio,
    codigoBarras: producto.codigoBarras,
    categoriaId: producto.categoriaId,
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  listarCategorias()
    .then(data => setCategorias(Array.isArray(data) ? data : []))
    .catch(() => setCategorias([]));
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
      const actualizado = await actualizarProducto(producto.idProducto, {
        ...form,
        precio: parseFloat(form.precio),
        categoriaId: parseInt(form.categoriaId),
      });
      toast.success('Producto actualizado correctamente');
      onGuardado(actualizado);
    } catch (err) {
      const errorMsg = err.response?.data?.mensaje || 'Error al actualizar';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--color-surface-dark)] border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Editar Producto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
            <input name="nombreProducto" value={form.nombreProducto} onChange={handleChange}
              className="w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
              className="w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Precio</label>
              <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange}
                className="w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Código de Barras</label>
              <input name="codigoBarras" value={form.codigoBarras} onChange={handleChange}
                className="w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
            <select name="categoriaId" value={form.categoriaId} onChange={handleChange}
              className="w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)] outline-none"
              required>
              {categorias.map(c => (
                <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
              ))}
            </select>
          </div>

          {/* Cantidad — solo lectura */}
          <div className="rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">Cantidad en stock</span>
            <span className="text-sm font-bold text-white">{producto.cantidad} unidades</span>
          </div>
          <p className="text-xs text-slate-500 -mt-2">La cantidad solo puede modificarse mediante movimientos de inventario.</p>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}