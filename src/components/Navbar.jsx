import React from "react";

export default function Navbar({ active, onNavigate }) {
  return (
    <nav className="bg-slate-800 shadow-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">
                FerreteríaApp
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onNavigate("dashboard")}
                className={`${active === "dashboard" ? "border-primary text-white" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate("reports")}
                className={`${active === "reports" ? "border-primary text-white" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Reportes
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
