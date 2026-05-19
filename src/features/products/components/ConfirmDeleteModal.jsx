export default function ConfirmDeleteModal({ producto, onConfirmar, onCancelar, loading }) {
  const tieneMovimientos = producto?.tieneMovimientos === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--color-surface-dark)] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

        <div className={`h-1.5 w-full bg-gradient-to-r ${tieneMovimientos ? 'from-orange-500 to-yellow-400' : 'from-red-600 to-red-400'}`} />

        <div className="p-8">
          <div className="flex justify-center mb-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center
              ${tieneMovimientos ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={tieneMovimientos ? 'text-orange-400' : 'text-red-400'}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-2">
            ¿Inactivar producto?
          </h2>
          <p className="text-slate-400 text-sm text-center mb-1">
            Estás a punto de inactivar:
          </p>
          <p className="text-white font-semibold text-center mb-3">
            "{producto.nombreProducto}"
          </p>

          {tieneMovimientos && (
            <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-orange-400 mt-0.5 shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-orange-300 text-xs leading-relaxed">
                Este producto tiene <span className="font-bold">movimientos registrados</span>.
                Al inactivarlo, el historial de movimientos se conservará íntegro.
              </p>
            </div>
          )}

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 mb-6">
            <p className="text-slate-300 text-xs leading-relaxed">
              El producto dejará de aparecer en el inventario y los reportes, pero su historial quedará intacto.
              Esta acción <span className="font-bold text-white">no elimina</span> ningún dato permanentemente.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={onCancelar} disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={onConfirmar} disabled={loading}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg
                ${tieneMovimientos ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}`}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Inactivando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                  </svg>
                  Sí, inactivar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}