import { useState, useEffect } from "react";
import { listarUsuarios } from "../../../api/usuarioService";
import UsersTable from "../components/UsersTable";
import Navbar from "../../../components/Navbar";

function StatCard({ icono, label, valor, colorBadge, badge }) {
  return (
    <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-800 rounded-lg text-xl">{icono}</div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${colorBadge}`}>
          {badge}
        </span>
      </div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{valor}</p>
    </div>
  );
}

export default function UsersPage({ onNavigate, currentUser }) {
  // ← Cambiado a onNavigate
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarUsuarios = () => {
    setLoading(true);
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => setError("No se pudo conectar con el servidor"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // métricas
  const totalUsuarios = usuarios.length;
  const activos = usuarios.filter(
    (u) => u.estado === 1 || u.estado === true,
  ).length;
  const inactivos = usuarios.filter(
    (u) => u.estado === 0 || u.estado === false,
  ).length;
  const admins = usuarios.filter((u) => u.rolId === 1).length;
  const encargados = usuarios.filter((u) => u.rolId === 2).length;

  const handleActualizado = (usuarioActualizado) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.idUsuario === usuarioActualizado.idUsuario ? usuarioActualizado : u,
      ),
    );
  };

  const handleEliminado = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.idUsuario === id ? { ...u, estado: 0 } : u))
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <Navbar
        active="users"
        onNavigate={onNavigate}
        currentUser={currentUser}
      />{" "}
      {/* ← active="users" */}
      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Gestión de Usuarios
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Administra usuarios, roles y accesos al sistema.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={cargarUsuarios}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700"
              >
                Actualizar
              </button>

              <button
                onClick={() => onNavigate("crear-usuario")} // ← usa onNavigate
                className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:bg-blue-600"
              >
                + Crear Usuario
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icono="👤"
              label="Total Usuarios"
              valor={totalUsuarios}
              badge="En sistema"
              colorBadge="bg-slate-700 text-slate-300"
            />

            <StatCard
              icono="🛡️"
              label="Admins"
              valor={admins}
              badge="Privilegios"
              colorBadge="bg-purple-500/10 text-purple-400"
            />

            <StatCard
              icono="👔"
              label="Encargados"
              valor={encargados}
              badge="Gestores"
              colorBadge="bg-blue-500/10 text-blue-400"
            />
            <StatCard
              icono="🟢"
              label="Activos"
              valor={activos}
              badge="Habilitados"
              colorBadge="bg-green-500/10 text-green-400"
            />

            <StatCard
              icono="🔴"
              label="Inactivos"
              valor={inactivos}
              badge="Deshabilitados"
              colorBadge="bg-red-500/10 text-red-400"
            />
          </div>

          {/* TABLA */}
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              Cargando usuarios...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-400">{error}</div>
          ) : (
            <UsersTable
              usuarios={usuarios}
              onActualizado={handleActualizado}
              onEliminado={handleEliminado}
              currentUser={currentUser}
            />
          )}
        </div>
      </main>
    </div>
  );
}
