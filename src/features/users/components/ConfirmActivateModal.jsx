export default function ConfirmActivateModal({
  usuario,
  onConfirmar,
  onCancelar,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-white text-lg font-bold text-center mb-2">
          ¿Activar usuario?
        </h2>

        <p className="text-slate-400 text-center mb-1">
          Estás a punto de activar a:
        </p>

        <p className="text-white text-center font-semibold mb-6">
          {usuario.nombres}
        </p>

        <p className="text-slate-500 text-xs text-center mb-6">
          El usuario podrá acceder nuevamente al sistema.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="flex-1 bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            {loading ? "Activando..." : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}
