import { KeyRound } from 'lucide-react';
import warehouseBg from '../../../assets/Image+Blur.png'; //

export default function LoginPage({ onLogin }) {
  return (
    // "isolate" crea un nuevo contexto para que el z-index negativo no se pierda
    <div className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-background-dark font-sans">
      
      {/* FONDO: Con z-[-1] para quedar atrás de todo */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]"></div>
        <img
    src={warehouseBg} //
    alt="warehouse background"
    className="h-full w-full object-cover"
  />
      </div>

      {/* TARJETA DE LOGIN */}
      <div className="relative w-full max-w-[440px] px-4">
        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-surface-dark/90 p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Icono de Candado (SVG) */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>

          <h2 className="mb-2 text-center text-3xl font-bold text-white">Bienvenido</h2>
          <p className="mb-8 text-center text-slate-400 text-sm">Ingresa tus credenciales para continuar.</p>

          <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Correo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Ingresa tu correo"
                  className="w-full rounded-lg border border-border-dark bg-surface-dark py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Contraseña</label>
              </div>
              <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
  <KeyRound size={20} strokeWidth={2.5} className="rotate-[-45deg]" /> 
</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border-dark bg-surface-dark py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={onLogin}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white hover:bg-blue-600 transition-all active:scale-[0.98]"
            >
              Iniciar Sesión
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs">
            <p className="text-slate-500">
              ¿No tienes una cuenta u olvidaste tu contraseña? <a href="#" className="text-primary font-semibold hover:underline">Contactar Admin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}