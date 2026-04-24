export default function ErrorModal({ mensaje, onCerrar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--color-surface-dark)] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-yellow-400" />

        <div className="p-8">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-orange-400">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-3">
            No se pudo eliminar
          </h2>
          <p className="text-slate-400 text-sm text-center mb-8 leading-relaxed">
            {mensaje}
          </p>

          <button
            onClick={onCerrar}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 transition-colors">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}