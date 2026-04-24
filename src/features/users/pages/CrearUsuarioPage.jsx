import { useState, useEffect } from "react";
import { crearUsuario, listarRoles } from "../../../api/usuarioService";
import { toast } from "react-hot-toast";
import Navbar from "../../../components/Navbar";

export default function CrearUsuarioPage({ onNavigate, currentUser }) {
  const [form, setForm] = useState({
    nombres: "",
    correo: "",
    contrasena: "",
    rolId: "",
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setLoadingRoles(true);
        const data = await listarRoles();

        if (data && Array.isArray(data) && data.length > 0) {
          setRoles(data);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error("Error al cargar roles:", err);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    cargarRoles();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await crearUsuario({
        nombres: form.nombres,
        correo: form.correo,
        contrasena: form.contrasena,
        rolId: parseInt(form.rolId),
      });

      toast.success("Usuario creado correctamente");
      onNavigate("users");
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al crear usuario";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all";

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)]">
      <Navbar
        active="users"
        onNavigate={onNavigate}
        currentUser={currentUser}
      />

      <main className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Crear nuevo usuario
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Completa los datos para registrar un nuevo usuario en el sistema.
            </p>
          </div>

          <div className="bg-[var(--color-surface-dark)] border border-slate-800 rounded-xl p-8 shadow-sm">
            {loadingRoles ? (
              <div className="text-center py-8 text-slate-400">
                Cargando roles...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nombres completos
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Ej. Juan Pérez"
                    value={form.nombres}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      placeholder="usuario@empresa.com"
                      value={form.correo}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="contrasena"
                      placeholder="••••••••"
                      value={form.contrasena}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Rol
                  </label>
                  <select
                    name="rolId"
                    value={form.rolId}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((rol) => (
                      <option key={rol.idRol} value={rol.idRol}>
                        {rol.nombreRol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 flex items-center gap-3">
                  <span className="text-slate-400 text-lg">🟢</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Estado inicial: Activo
                    </p>
                    <p className="text-xs text-slate-500">
                      El usuario se creará con estado activo por defecto
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => onNavigate("users")}
                    className="px-6 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-60"
                  >
                    {loading ? (
                      "Guardando..."
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="8.5" cy="7" r="4" />
                          <line x1="20" y1="8" x2="20" y2="14" />
                          <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        Crear Usuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

