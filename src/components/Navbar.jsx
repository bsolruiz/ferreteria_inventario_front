import React from "react";

export default function Navbar({ active, onNavigate, currentUser }) {
  return (
    <nav className="bg-slate-800 shadow-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Izquierda — logo + links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
              <span className="text-xl font-bold text-primary">Hardware Fix</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onNavigate("inventario")}
                className={`${active === "inventario" ? "border-primary text-white" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Inventario
              </button>
              <button
                onClick={() => onNavigate("reports")}
                className={`${active === "reports" ? "border-primary text-white" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Reportes
              </button>
              <button
                onClick={() => onNavigate("usuarios")}
                className={`${active === "usuarios" ? "border-primary text-white" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Usuarios
              </button>
            </div>
          </div>

          {/* Derecha — usuario + logout */}
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-600">
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{currentUser.nombres}</p>
                  <p className="text-[10px] text-slate-400">{currentUser.rolNombre}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  {currentUser.nombres?.[0]?.toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}