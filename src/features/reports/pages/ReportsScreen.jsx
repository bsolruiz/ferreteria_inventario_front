import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { Icons } from "../../../components/Icons";
import ReportCard from "../components/ReportCard";
import {
  fetchMovimientos,
  fetchProductosExistentes,
  fetchProductosBajoStock,
  fetchProductosSinStock,
  fetchInventarioTotal,
} from "../../../api/reportesAPI";
import { exportToExcel } from "../../../utils/excelUtils";

export default function ReportsScreen({ onNavigate }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (fetchFunction, fileName, columns) => {
    try {
      setLoading(true);
      const data = await fetchFunction();
      exportToExcel(data, fileName, columns);
    } catch (error) {
      console.error(`Error downloading ${fileName}:`, error);
      alert(`Error al descargar el reporte ${fileName}`);
    } finally {
      setLoading(false);
    }
  };

  const columnasProducto = [
    { key: "idProducto", header: "ID" },
    { key: "codigoBarras", header: "Código de Barras" },
    { key: "nombreProducto", header: "Producto" },
    { key: "descripcion", header: "Descripción" },
    { key: "categoriaNombre", header: "Categoría" },
    { key: "precio", header: "Precio" },
    { key: "cantidad", header: "Stock" },
  ];

  const columnasInventario = [
    { key: "idProducto", header: "ID" },
    { key: "codigoBarras", header: "Código de Barras" },
    { key: "nombreProducto", header: "Producto" },
    { key: "descripcion", header: "Descripción" },
    { key: "categoriaNombre", header: "Categoría" },
    { key: "cantidad", header: "Cantidad" },
    { key: "precio", header: "Precio Unitario" },
    { key: "valorTotal", header: "Valor Total" },
  ];

  const columnasMovimientos = [
    { key: "idMovimiento", header: "ID Movimiento" },
    { key: "fechaRegistro", header: "Fecha" },
    { key: "tipoMovimiento", header: "Tipo" },
    { key: "productoNombre", header: "Producto" },
    { key: "motivo", header: "Motivo" },
    { key: "usuarioNombre", header: "Usuario" },
  ];

  return (
    <div className="min-h-screen bg-slate-900/50">
      <Navbar active="reports" onNavigate={onNavigate} />

      <main className="p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Centro de Reportes
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Selecciona y descarga los informes detallados de tu inventario y
              movimientos.
            </p>
          </header>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Icons.Package className="text-primary" size={24} />
              <h3 className="text-xl font-bold">Reportes - Mercancía</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard
                title="Mercancía Existente"
                desc="Listado completo de productos en stock"
                icon={<Icons.FileText />}
                onDownload={() =>
                  handleDownload(
                    fetchProductosExistentes,
                    "Mercancia_Existente",
                    columnasProducto,
                  )
                }
                loading={loading}
              />
              <ReportCard
                title="A punto de agotarse"
                desc="Productos con stock bajo el mínimo"
                icon={<Icons.AlertTriangle className="text-amber-500" />}
                bgColor="bg-amber-900/30"
                onDownload={() =>
                  handleDownload(
                    fetchProductosBajoStock,
                    "Productos_Bajo_Stock",
                    columnasInventario,
                  )
                }
                loading={loading}
              />
              <ReportCard
                title="Fuera de stock"
                desc="Items agotados que requieren reposición"
                icon={<Icons.Ban className="text-red-500" />}
                bgColor="bg-red-900/30"
                onDownload={() =>
                  handleDownload(
                    fetchProductosSinStock,
                    "Productos_Sin_Stock",
                    columnasInventario,
                  )
                }
                loading={loading}
              />
              <ReportCard
                title="Inventario Total"
                desc="Valuación completa de activos"
                icon={<Icons.Database />}
                onDownload={() =>
                  handleDownload(
                    fetchInventarioTotal,
                    "Inventario_Total",
                    columnasInventario,
                  )
                }
                loading={loading}
              />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Icons.History className="text-primary" size={24} />
              <h3 className="text-xl font-bold">Reportes - Movimientos</h3>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Icons.TrendingUp size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    Reporte Entrada y Salida
                  </h4>
                  <p className="text-sm text-slate-500">
                    Analiza el flujo detallado de mercancía, proveedores y
                    ventas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('movimientos')}
                className="bg-slate-800 text-primary border border-primary/30 hover:bg-primary hover:text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 group whitespace-nowrap shrink-0"
              >
                Ver movimientos
                <span className="group-hover:translate-x-1 transition-transform text-lg leading-none">→</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
