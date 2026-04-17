import React, { useState, memo, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import { useMovimientos } from "./useMovimientos";
import {
  Search,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "motion/react";
import { exportToExcel } from "../../../utils/excelUtils";

// --- Constantes fuera del componente para evitar recreación en cada render ---
const EXPORT_COLUMNS = [
  { key: "idMovimiento", header: "ID Movimiento" },
  { key: "fechaRegistro", header: "Fecha" },
  { key: "tipoMovimiento", header: "Tipo" },
  { key: "productoNombre", header: "Producto" },
  { key: "motivo", header: "Motivo" },
  { key: "usuarioNombre", header: "Usuario" },
];

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

const formatTime = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleTimeString() : "N/A";

const ExpandableText = memo(({ text, limit = 60 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text)
    return (
      <span className="text-[10px] text-slate-500 tracking-wide italic">
        Sin motivo especificado
      </span>
    );

  const shouldTruncate = text.length > limit;
  const toggle = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded((v) => !v);
  }, []);

  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-500 tracking-wide break-words">
        {isExpanded || !shouldTruncate
          ? text
          : `${text.substring(0, limit)}...`}
      </span>
      {shouldTruncate && (
        <button
          onClick={toggle}
          className="text-[10px] text-primary hover:text-primary/80 font-bold mt-1 text-left w-fit transition-colors"
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
});
ExpandableText.displayName = "ExpandableText";

const MovementBadge = memo(({ tipo }) => {
  const isEntrada = tipo === "Entrada" || tipo === "ENTRADA";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isEntrada
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
      }`}
    >
      {tipo}
    </span>
  );
});
MovementBadge.displayName = "MovementBadge";

const MovementRow = memo(({ movement, idx }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.05 }}
    className="hover:bg-slate-700/20 transition-colors group"
  >
    <td className="px-6 py-5">
      <span className="font-mono text-xs text-slate-400">#</span>
      <span className="font-semibold text-slate-200 group-hover:text-primary transition-colors">
        {movement.idMovimiento}
      </span>
    </td>
    <td className="px-6 py-5">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-300">
          {formatDate(movement.fechaRegistro)}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
          {formatTime(movement.fechaRegistro)}
        </span>
      </div>
    </td>
    <td className="px-6 py-5 max-w-xs">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-300 mb-1">
          {movement.productoNombre}
        </span>
        <ExpandableText text={movement.motivo} />
      </div>
    </td>
    <td className="px-6 py-5">
      <span className="text-sm text-slate-300">
        {movement.usuarioNombre ?? "Sistema"}
      </span>
    </td>
    <td className="px-6 py-5 text-center">
      <MovementBadge tipo={movement.tipoMovimiento} />
    </td>
  </motion.tr>
));
MovementRow.displayName = "MovementRow";

// --- Componente principal ---
export default function MovimientosReportScreen({ onNavigate }) {
  const {
    loading,
    searchTerm,
    tipoFilter,
    startDate,
    endDate,
    currentPage,
    sortOrder,
    totalItems,
    totalPages,
    startIndex,
    currentItems,
    sortedMovements,
    handleSearchChange,
    handleTipoChange,
    handleStartDateChange,
    handleEndDateChange,
    toggleSort,
    handlePrevPage,
    handleNextPage,
  } = useMovimientos();

  const handleExportCSV = useCallback(() => {
    exportToExcel(sortedMovements, "Historial_Movimientos", EXPORT_COLUMNS);
  }, [sortedMovements]);

  const visibleStart = totalItems === 0 ? 0 : startIndex + 1;
  const visibleEnd = Math.min(startIndex + 5, totalItems);

  return (
    <div className="min-h-screen bg-slate-900/50">
      <Navbar active="reports" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Reporte de Movimientos
            </h1>
            <p className="text-slate-500 text-sm max-w-md">
              Ver y gestionar movimientos anteriores, filtrar por fecha y
              exportar datos.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-100 px-6 py-2.5 rounded-lg text-sm font-medium transition-all border border-slate-700/50 group"
          >
            <Download
              size={18}
              className="text-slate-400 group-hover:text-primary transition-colors"
            />
            Exportar CSV
          </button>
        </div>

        {/* Movements History Card */}
        <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <ArrowRightLeft size={18} className="text-primary" />
              Historial de Movimientos
            </h2>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Buscador */}
              <div className="relative group flex-grow sm:flex-grow-0">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                />
                <input
                  type="text"
                  placeholder="Buscar ID, producto..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 w-full sm:w-64 transition-all text-slate-200"
                />
              </div>

              {/* Fecha Inicio */}
              <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                <span className="text-slate-500 text-xs">Desde</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-slate-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.8] cursor-pointer"
                />
              </div>

              {/* Fecha Fin */}
              <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                <span className="text-slate-500 text-xs">Hasta</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-slate-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.8] cursor-pointer"
                />
              </div>

              {/* Filtro Tipo */}
              <div className="relative">
                <select
                  value={tipoFilter}
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="appearance-none bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 text-slate-200 transition-all cursor-pointer"
                >
                  <option value="Todos">Todos los tipos</option>
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/30 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-700/50">
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-primary transition-colors"
                    onClick={toggleSort}
                  >
                    <div className="flex items-center gap-2">
                      Movimiento
                      {sortOrder === "asc" ? (
                        <ArrowUp size={12} className="text-primary" />
                      ) : (
                        <ArrowDown size={12} className="text-primary" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Fecha & Hora</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4 text-center">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Cargando movimientos...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No se encontraron movimientos.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((movement, idx) => (
                    <MovementRow
                      key={movement.idMovimiento ?? idx}
                      movement={movement}
                      idx={idx}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-5 border-t border-slate-700 bg-slate-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Se muestra{" "}
              <span className="text-slate-300 font-medium">
                {visibleStart}-{visibleEnd}
              </span>{" "}
              de{" "}
              <span className="text-slate-300 font-medium">{totalItems}</span>{" "}
              movimientos
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalItems === 0}
                className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => onNavigate("reports")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Volver a Reportes
          </button>
        </div>
      </main>
    </div>
  );
}
