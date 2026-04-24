import { useState, useMemo } from "react";
import { eliminarUsuario } from "../pages/usuarioService";
import EditarUsuarioModal from "./EditarUsuarioModal";
import ConfirmDeleteUsuarioModal from "./ConfirmDeleteModal";
import ErrorModal from "./ErrorModal";
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ITEMS_POR_PAGINA = 10;

export default function UsersTable({ usuarios, onActualizado, onEliminado }) {
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioEliminando, setUsuarioEliminando] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");
  
  // Filtros y paginación
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);

  // Opciones para filtros
  const roles = ["Todos", "Admin", "Encargado"];
  const estados = ["Todos", "Activo", "Inactivo"];

  // Filtrado por nombre, rol y estado
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      // Búsqueda por nombre o correo
      const coincideBusqueda = u.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
                                u.correo?.toLowerCase().includes(busqueda.toLowerCase());
      
      // Filtro por rol
      let coincideRol = true;
      if (rolFiltro === "Admin") {
        coincideRol = u.rolId === 1;
      } else if (rolFiltro === "Encargado") {
        coincideRol = u.rolId === 2;
      }
      
      // Filtro por estado
      let coincideEstado = true;
      if (estadoFiltro === "Activo") {
        coincideEstado = u.estado === true;
      } else if (estadoFiltro === "Inactivo") {
        coincideEstado = u.estado === false;
      }
      
      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, rolFiltro, estadoFiltro]);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / ITEMS_POR_PAGINA));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  const visibleInicio = usuariosFiltrados.length === 0 ? 0 : inicio + 1;
  const visibleFin = Math.min(inicio + ITEMS_POR_PAGINA, usuariosFiltrados.length);

  const handleBusqueda = (valor) => {
    setBusqueda(valor);
    setPaginaActual(1);
  };

  const handleRolFiltro = (valor) => {
    setRolFiltro(valor);
    setPaginaActual(1);
  };

  const handleEstadoFiltro = (valor) => {
    setEstadoFiltro(valor);
    setPaginaActual(1);
  };

  // ELIMINAR USUARIO
  const handleEliminar = async () => {
    if (!usuarioEliminando) return;

    setLoadingDelete(true);
    setError("");

    try {
      await eliminarUsuario(usuarioEliminando.idUsuario);
      onEliminado(usuarioEliminando.idUsuario);
      setUsuarioEliminando(null);
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al eliminar usuario";
      setError(msg);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="bg-[var(--color-surface-dark)] border border-slate-800 rounded-xl overflow-hidden shadow-sm">

        {/* Header con búsqueda y filtros */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-300">
            {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? 's' : ''} encontrado{usuariosFiltrados.length !== 1 ? 's' : ''}
          </h3>
          <div className="flex flex-wrap items-center gap-3">

            {/* Búsqueda por nombre o correo */}
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--color-primary)] transition-colors"
              />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50 w-full sm:w-56 transition-all text-slate-200 placeholder-slate-500"
              />
            </div>

            {/* Filtro por rol */}
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                value={rolFiltro}
                onChange={(e) => handleRolFiltro(e.target.value)}
                className="appearance-none bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50 text-slate-200 transition-all cursor-pointer"
              >
                {roles.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
                <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

            {/* Filtro por estado */}
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                value={estadoFiltro}
                onChange={(e) => handleEstadoFiltro(e.target.value)}
                className="appearance-none bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50 text-slate-200 transition-all cursor-pointer"
              >
                {estados.map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
                <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-900 text-slate-400">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {usuariosPagina.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    {busqueda || rolFiltro !== "Todos" || estadoFiltro !== "Todos"
                      ? 'No se encontraron usuarios con esos filtros'
                      : 'No hay usuarios registrados'}
                  </td>
                </tr>
              ) : (
                usuariosPagina.map((u) => (
                  <tr
                    key={u.idUsuario}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {u.nombres}
                    </td>
                    <td className="px-6 py-4">{u.correo}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.rolId === 1 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {u.rolId === 1 ? "Admin" : "Encargado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.estado 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          u.estado ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {u.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* EDITAR */}
                        <button
                          onClick={() => {
                            console.log("Usuario a editar:", u);
                            console.log("ID del usuario:", u.idUsuario);
                            setUsuarioEditando(u);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-700 transition-colors"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() => setUsuarioEliminando(u)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginación */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Mostrando{' '}
            <span className="text-slate-300 font-medium">{visibleInicio}–{visibleFin}</span>
            {' '}de{' '}
            <span className="text-slate-300 font-medium">{usuariosFiltrados.length}</span>
            {' '}usuarios
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaSegura === 1}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPaginas || Math.abs(n - paginaSegura) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`dots-${idx}`} className="text-slate-500 px-1">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPaginaActual(item)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                      ${paginaSegura === item
                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20'
                        : 'border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                    {item}
                  </button>
                )
              )
            }

            <button
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura === totalPaginas}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* ---------------- MODALES ---------------- */}

      {/* EDITAR */}
      {usuarioEditando && (
        <EditarUsuarioModal
          usuario={usuarioEditando}
          onClose={() => setUsuarioEditando(null)}
          onGuardado={(usuarioActualizado) => {
            onActualizado(usuarioActualizado);
            setUsuarioEditando(null);
          }}
        />
      )}

      {/* ELIMINAR */}
      {usuarioEliminando && (
        <ConfirmDeleteUsuarioModal
          usuario={usuarioEliminando}
          onCancelar={() => setUsuarioEliminando(null)}
          onConfirmar={handleEliminar}
          loading={loadingDelete}
        />
      )}

      {/* ERROR */}
      {error && (
        <ErrorModal
          mensaje={error}
          onCerrar={() => setError("")}
        />
      )}

    </>
  );
}