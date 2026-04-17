import React from "react";
import { Icons } from "../../../components/Icons";

export default function ReportCard({
  title,
  desc,
  icon,
  bgColor = "bg-slate-100 dark:bg-slate-800",
  onDownload,
  loading,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0`}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={onDownload}
        disabled={loading}
        className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0"
      >
        <Icons.Download size={16} /> Descargar
      </button>
    </div>
  );
}
