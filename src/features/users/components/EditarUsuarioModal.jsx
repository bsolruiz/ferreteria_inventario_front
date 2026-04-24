import { useState, useEffect } from "react";
import { actualizarUsuario, listarRoles } from "../pages/usuarioService";
import { toast } from "react-hot-toast";

export default function EditarUsuarioModal({
  usuario,
  onClose,
  onGuardado,
  currentUser,
}) {
  const userId = usuario.idUsuario;

  const [form, setForm] = useState({
    nombres: usuario.nombres || "",
    correo: usuario.correo || "",
    rolId: usuario.rolId || "",
    estado: usuario.estado,
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
        setRoles(data);
      } catch (err) {
        console.error("Error al cargar roles:", err);
        toast.error("Error al cargar los roles");
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    cargarRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const datosActualizar = {
        nombres: form.nombres,
        correo: form.correo,
        rolId: parseInt(form.rolId),
        estado:
          form.estado === "true" || form.estado === true || form.estado === 1
            ? 1
            : 0,
      };

      const actualizado = await actualizarUsuario(userId, datosActualizar);

      toast.success("Usuario actualizado correctamente");
      onGuardado(actualizado);
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data ||
        "Error al actualizar usuario";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-background-dark)] px-4 py-2.5 text-sm text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--color-surface-dark)] border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {loadingRoles ? (
          <div className="text-center py-8 text-slate-400">
            Cargando roles...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nombres completos
              </label>
              <input
                type="text"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Rol
                </label>
                <select
                  name="rolId"
                  value={form.rolId}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={
                    currentUser?.idUsuario === usuario.idUsuario &&
                    usuario.rolId === 1
                  }
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((rol) => (
                    <option
                      key={rol.idRol}
                      value={rol.idRol}
                      disabled={
                        currentUser?.idUsuario === usuario.idUsuario &&
                        usuario.rolId === 1 &&
                        rol.idRol !== 1
                      }
                    >
                      {rol.nombreRol}{" "}
                      {currentUser?.idUsuario === usuario.idUsuario &&
                      usuario.rolId === 1 &&
                      rol.idRol !== 1
                        ? "(Restringido)"
                        : ""}
                    </option>
                  ))}
                </select>
                {currentUser?.idUsuario === usuario.idUsuario &&
                  usuario.rolId === 1 && (
                    <p className="text-[10px] text-amber-500 mt-1">
                      No puedes cambiar tu propio rol de administrador.
                    </p>
                  )}
              </div>
            </div>

            {/* Estado — solo lectura */}
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">Estado actual</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  usuario.estado
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    usuario.estado ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {usuario.estado ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p className="text-xs text-slate-500 -mt-2">
              El estado se gestiona mediante los botones de la tabla.
            </p>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

