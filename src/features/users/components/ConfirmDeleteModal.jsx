export default function ConfirmDeleteUsuarioModal({
  usuario,
  onConfirmar,
  onCancelar,
  loading
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">

        <h2 className="text-white text-lg font-bold text-center mb-2">
          ¿Eliminar usuario?
        </h2>

        <p className="text-slate-400 text-center mb-1">
          Estás a punto de eliminar:
        </p>

        <p className="text-white text-center font-semibold mb-6">
          {usuario.nombre}
        </p>

        <p className="text-slate-500 text-xs text-center mb-6">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">

          <button
            onClick={onCancelar}
            disabled={loading}
            className="flex-1 bg-slate-800 text-white py-2 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-2 rounded"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>

        </div>

      </div>

    </div>
  );
}