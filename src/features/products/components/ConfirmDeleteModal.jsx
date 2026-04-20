export default function ConfirmDeleteModal({ producto, onConfirmar, onCancelar, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--color-surface-dark)] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

        {/* Franja roja superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-red-400" />

        <div className="p-8">
          {/* Ícono */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-red-400">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
          </div>

          {/* Texto */}
          <h2 className="text-xl font-bold text-white text-center mb-2">
            ¿Eliminar producto?
          </h2>
          <p className="text-slate-400 text-sm text-center mb-1">
            Estás a punto de eliminar:
          </p>
          <p className="text-white font-semibold text-center mb-2">
            "{producto.nombreProducto}"
          </p>
          <p className="text-slate-500 text-xs text-center mb-8">
            Esta acción no se puede deshacer.
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onCancelar}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Sí, eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}