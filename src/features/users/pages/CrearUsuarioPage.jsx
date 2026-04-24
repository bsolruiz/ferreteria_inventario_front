import { useState, useEffect } from "react";
import { crearUsuario, listarRoles } from "../pages/usuarioService";
import { toast } from "react-hot-toast";

export default function CrearUsuarioPage({ onNavigate }) {
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

  const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => onNavigate("users")}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← Volver
        </button>
      </div>

      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Crear usuario</h1>
        <p className="text-slate-400 text-sm mt-1 mb-6">
          Completa los datos del nuevo usuario
        </p>

        {loadingRoles ? (
          <div className="text-center py-8 text-slate-400">
            Cargando roles...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Nombres completos
              </label>
              <input
                type="text"
                name="nombres"
                placeholder="Ej: Juan Pérez"
                value={form.nombres}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">
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
              <label className="block text-slate-400 text-sm mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                placeholder="********"
                value={form.contrasena}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">
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

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => onNavigate("users")}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors rounded-lg"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}