import { useState, useEffect } from "react";
import { actualizarUsuario, listarRoles } from "../pages/usuarioService";
import { toast } from "react-hot-toast";

export default function EditarUsuarioModal({ usuario, onClose, onGuardado }) {
  const userId = usuario.idUsuario;
  
  console.log("Usuario en modal:", usuario);
  console.log("ID extraído:", userId);

  const [form, setForm] = useState({
    nombres: usuario.nombres || "",
    correo: usuario.correo || "",
    rolId: usuario.rolId || "",
    estado: usuario.estado, // Puede ser 1, 0, true, false
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
      // Preparar datos en el formato que espera tu backend
      const datosActualizar = {
        nombres: form.nombres,
        correo: form.correo,
        rolId: parseInt(form.rolId),
        estado: form.estado === "true" || form.estado === true || form.estado === 1 ? 1 : 0, // Convertir a número 1 o 0
      };

      console.log("📤 Datos a enviar al backend:", JSON.stringify(datosActualizar, null, 2));
      console.log("🆔 ID del usuario:", userId);

      const actualizado = await actualizarUsuario(userId, datosActualizar);

      console.log("✅ Respuesta del backend:", actualizado);

      toast.success("Usuario actualizado correctamente");
      onGuardado(actualizado);
      onClose();
    } catch (err) {


      console.error("❌ Error completo:", err);
      console.error("📦 Response data:", err.response?.data);
      console.error("📊 Status code:", err.response?.status);


      const msg = err.response?.data?.mensaje || err.response?.data || "Error al actualizar usuario";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-700 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Editar Usuario</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

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
                value={form.correo}
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

            <div>
              <label className="block text-slate-400 text-sm mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
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
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors rounded-lg"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}