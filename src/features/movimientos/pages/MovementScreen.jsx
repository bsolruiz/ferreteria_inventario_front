import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { toast } from "react-hot-toast";
import { Icons } from "../../../components/Icons";
import {
  listarProductos,
  registrarMovimiento,
} from "../../../api/movimientoService";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  tipo,
  productos,
  totalUnidades,
}) {
  const [motivo, setMotivo] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface-dark)] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Icons.Save size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Confirmar Movimiento
            </h3>
            <p className="text-sm text-slate-400">Validación de operación</p>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Tipo:</span>
            <span className="font-bold text-white">
              {tipo === "ENTRADA" ? "Entrada" : "Salida"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total unidades:</span>
            <span className="font-bold text-white">{totalUnidades}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Productos únicos:</span>
            <span className="font-bold text-white">{productos.length}</span>
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 pt-1">
            Motivo del movimiento <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
            placeholder="Escriba el motivo del movimiento..."
            rows="3"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
        <p className="text-sm text-slate-300 mb-6 bg-slate-800/50 p-3 rounded-lg">
          ¿Está seguro de realizar este movimiento? Esta acción modificará el
          stock del inventario.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(motivo)}
            disabled={!motivo.trim()}
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function MovementRow({ producto, onUpdateQty, onRemove, tipo }) {
  const [qty, setQty] = useState(producto.cantidad);

  const handleIncrement = () => {
    const nuevaCantidad = qty + 1;
    if (tipo === "SALIDA" && nuevaCantidad > producto.stockActual) return;
    setQty(nuevaCantidad);
    onUpdateQty(producto.idProducto, nuevaCantidad);
  };

  const handleDecrement = () => {
    if (qty <= 1) return;
    const nuevaCantidad = qty - 1;
    setQty(nuevaCantidad);
    onUpdateQty(producto.idProducto, nuevaCantidad);
  };

  const handleChange = (value) => {
    const val = parseInt(value) || 0;
    if (val < 1) {
      setQty(1);
      onUpdateQty(producto.idProducto, 1);
      return;
    }
    if (tipo === "SALIDA" && val > producto.stockActual) {
      setQty(producto.stockActual);
      onUpdateQty(producto.idProducto, producto.stockActual);
      return;
    }
    setQty(val);
    onUpdateQty(producto.idProducto, val);
  };

  return (
    <tr className="hover:bg-slate-800/30 transition-colors text-sm">
      <td className="px-4 py-2.5">
        <div className="flex flex-col">
          <span className="font-bold text-white">
            {producto.nombreProducto}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            SKU: {producto.codigoBarras}
          </span>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={qty <= 1}
          >
            <Icons.Minus size={14} />
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => handleChange(e.target.value)}
            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-center font-bold text-white focus:ring-2 focus:ring-primary outline-none"
            min="1"
            max={tipo === "SALIDA" ? producto.stockActual : undefined}
          />
          <button
            onClick={handleIncrement}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tipo === "SALIDA" && qty >= producto.stockActual}
          >
            <Icons.Plus size={14} />
          </button>
        </div>
        <div className="text-center mt-1">
          <span
            className={`text-xs ${tipo === "SALIDA" ? "text-amber-400" : "text-green-400"}`}
          >
            Stock: {producto.stockActual} und.
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onRemove(producto.idProducto)}
          className="text-slate-500 hover:text-red-500 transition-colors p-2"
        >
          <Icons.Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}

export default function MovementScreen({ onNavigate, currentUser }) {
  const [tipoMovimiento, setTipoMovimiento] = useState("ENTRADA");
  const [fechaRegistro] = useState(new Date().toLocaleDateString("es-CO"));
  const [searchQuery, setSearchQuery] = useState("");
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await listarProductos();
      setProductosDisponibles(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const agregarProducto = (producto) => {
    if (
      productosSeleccionados.some((p) => p.idProducto === producto.idProducto)
    ) {
      return;
    }
    const nuevoProducto = {
      ...producto,
      cantidad: 1,
      stockActual: producto.cantidad || 0,
    };
    setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    setProductosSeleccionados((prev) =>
      prev.map((p) =>
        p.idProducto === idProducto ? { ...p, cantidad: nuevaCantidad } : p,
      ),
    );
  };

  const removerProducto = (idProducto) => {
    setProductosSeleccionados((prev) =>
      prev.filter((p) => p.idProducto !== idProducto),
    );
  };

  const validarMovimiento = () => {
    if (productosSeleccionados.length === 0) {
      setError("Debe agregar al menos un producto");
      return false;
    }
    for (const producto of productosSeleccionados) {
      if (producto.cantidad <= 0) {
        setError("Las cantidades deben ser mayores a 0");
        return false;
      }
      if (
        tipoMovimiento === "SALIDA" &&
        producto.cantidad > producto.stockActual
      ) {
        setError(
          `La cantidad de ${producto.nombreProducto} supera el stock disponible`,
        );
        return false;
      }
    }
    setError("");
    return true;
  };

  const totalUnidades = productosSeleccionados.reduce(
    (acc, p) => acc + p.cantidad,
    0,
  );

  const handleGuardar = () => {
    if (!validarMovimiento()) return;
    setShowConfirmModal(true);
  };

  const confirmarMovimiento = async (motivoPersonalizado) => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      for (const producto of productosSeleccionados) {
        const dto = {
          tipoMovimiento: tipoMovimiento,
          usuarioId: currentUser?.idUsuario,
          productoId: producto.idProducto,
          motivo: motivoPersonalizado,

          cantidad: producto.cantidad,
        };
        await registrarMovimiento(dto);
      }
      toast.success("Movimiento registrado correctamente");
      setProductosSeleccionados([]);
      onNavigate("inventario");
    } catch (err) {
      console.error("Error guardando movimiento:", err);
      toast.error("Error al registrar el movimiento");
      setError("Error al registrar el movimiento");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults =
    searchQuery.length >= 2
      ? productosDisponibles
          .filter(
            (p) =>
              p.nombreProducto
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              p.codigoBarras?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <Navbar
        active="inventario"
        onNavigate={onNavigate}
        currentUser={currentUser}
      />
      <main className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Registro de Movimiento
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Gestione la entrada y salida de mercancía del depósito.
              </p>
            </div>
            <button
              onClick={() => onNavigate("inventario")}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
            >
              <Icons.ArrowRight
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
                size={18}
              />
              Volver al Inventario
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="bg-[var(--color-surface-dark)] border border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Tipo de Operación
                </label>
                <div className="flex p-1 bg-slate-800 rounded-lg">
                  <button
                    onClick={() => setTipoMovimiento("ENTRADA")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition-all ${
                      tipoMovimiento === "ENTRADA"
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icons.PlusCircle size={18} /> Entrada
                  </button>
                  <button
                    onClick={() => setTipoMovimiento("SALIDA")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition-all ${
                      tipoMovimiento === "SALIDA"
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icons.MinusCircle size={18} /> Salida
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Fecha de Registro
                </label>
                <div className="relative">
                  <Icons.Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-medium text-white text-sm"
                    readOnly
                    value={fechaRegistro}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                Búsqueda de Productos
              </label>
              <div className="relative">
                <Icons.Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={20}
                />
                <input
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-white placeholder-slate-500 text-sm"
                  placeholder="Buscar por nombre, código de barras o SKU..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() =>
                    searchQuery.length >= 2 && setShowSearchResults(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSearchResults(false), 200)
                  }
                />
                {showSearchResults && filteredResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl max-h-60 overflow-auto">
                    {filteredResults.map((producto) => (
                      <button
                        key={producto.idProducto}
                        onClick={() => agregarProducto(producto)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex justify-between items-center"
                      >
                        <div>
                          <span className="font-medium text-white block">
                            {producto.nombreProducto}
                          </span>
                          <span className="text-xs text-slate-400">
                            SKU: {producto.codigoBarras}
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">
                          Stock: {producto.cantidad || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 overflow-hidden border border-slate-700 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-32 text-center">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-20 text-center">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {productosSeleccionados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No hay productos agregados. Busque y agregue productos
                        para registrar el movimiento.
                      </td>
                    </tr>
                  ) : (
                    productosSeleccionados.map((producto) => (
                      <MovementRow
                        key={producto.idProducto}
                        producto={producto}
                        onUpdateQty={actualizarCantidad}
                        onRemove={removerProducto}
                        tipo={tipoMovimiento}
                      />
                    ))
                  )}
                </tbody>
              </table>
              {productosSeleccionados.length > 0 && (
                <div className="p-4 bg-slate-800/30 border-t border-slate-700 flex justify-between items-center">
                  <div className="flex gap-6 text-sm">
                    <span className="text-slate-400">
                      Total unidades:{" "}
                      <span className="font-bold text-white">
                        {totalUnidades}
                      </span>
                    </span>
                    <span className="text-slate-400">
                      Productos únicos:{" "}
                      <span className="font-bold text-white">
                        {productosSeleccionados.length}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                onClick={() => setProductosSeleccionados([])}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all"
              >
                Descartar Cambios
              </button>
              <button
                onClick={handleGuardar}
                disabled={loading || productosSeleccionados.length === 0}
                className="w-full sm:w-auto px-10 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.Save size={20} /> Guardar Movimiento
              </button>
            </div>
          </div>
        </div>
      </main>

      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmarMovimiento}
          tipo={tipoMovimiento}
          productos={productosSeleccionados}
          totalUnidades={totalUnidades}
        />
      )}
    </div>
  );
}
