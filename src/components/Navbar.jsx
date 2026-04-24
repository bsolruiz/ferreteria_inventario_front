import React from "react";

export default function Navbar({ active, onNavigate, currentUser }) {

  const role = currentUser?.rolNombre;

  const canAccess = (allowedRoles) =>
    allowedRoles.includes(role);

  return (
    <nav className="bg-slate-800 shadow-sm border-b border-slate-700">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between h-16">

          {/* IZQUIERDA */}
          <div className="flex">

            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">
                FerreteríaApp
              </span>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">

              {/* INVENTARIO → Admin + Encargado */}
              {canAccess(["Admin", "Encargado"]) && (
                <button
                  onClick={() => onNavigate("inventario")}
                  className={`${active === "inventario"
                    ? "border-primary text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Inventario
                </button>
              )}

              {/* REPORTES → Admin + Encargado */}
              {canAccess(["Admin", "Encargado"]) && (
                <button
                  onClick={() => onNavigate("reports")}
                  className={`${active === "reports"
                    ? "border-primary text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Reportes
                </button>
              )}

              {/* USUARIOS → SOLO Admin */}
              {canAccess(["Admin"]) && (
                <button
                  onClick={() => onNavigate("users")}  
                  className={`${active === "users" 
                    ? "border-primary text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Usuarios
                </button>
              )}

            </div>
          </div>

          {/* DERECHA */}
          <div className="flex items-center gap-4">

            {currentUser && (
              <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-600">

                <div className="text-right">
                  <p className="text-xs font-semibold text-white">
                    {currentUser.nombres}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {currentUser.rolNombre}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  {currentUser.nombres?.[0]?.toUpperCase()}
                </div>

              </div>
            )}

            {/* LOGOUT */}
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
}