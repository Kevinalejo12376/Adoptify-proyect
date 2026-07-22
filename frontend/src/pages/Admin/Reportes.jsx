import React, { useState } from "react";
import { Check, X, Eye, Search } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { mockReportes } from "../../data/admin/mockData";

export default function AdminReportes() {
  const [reportes, setReportes] = useState(mockReportes);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const handleAction = (reporte, accion) => {
    setSelectedReport(reporte);
    setModalAction(accion);
    setModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedReport) return;
    const newState = {
      resolve: "resuelto",
      dismiss: "descartado",
      review: "en_revision",
    }[modalAction];

    setReportes((prev) =>
      prev.map((r) => (r.id === selectedReport.id ? { ...r, estado: newState } : r))
    );
    setModalOpen(false);
    setSelectedReport(null);
    setModalAction(null);
  };

  const columnas = [
    { key: "entidadNombre", titulo: "Entidad Reportada", ordenable: true },
    { key: "motivo", titulo: "Motivo", ordenable: true },
    { key: "modulo", titulo: "Módulo", ordenable: true, render: (valor) => <Badge estado={valor.toLowerCase()} customLabel={valor} /> },
    { key: "reportadoPor", titulo: "Reportado por", ordenable: true },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    { key: "fecha", titulo: "Fecha", tipo: "fecha", ordenable: true },
    {
      key: "acciones",
      titulo: "Acciones",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1">
          {fila.estado === "pendiente" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleAction(fila, "review"); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                title="En revisión"
              >
                <Eye size={15} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleAction(fila, "resolve"); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                title="Resolver"
              >
                <Check size={15} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleAction(fila, "dismiss"); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Descartar"
              >
                <X size={15} />
              </button>
            </>
          )}
          {fila.estado === "en_revision" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleAction(fila, "resolve"); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                title="Resolver"
              >
                <Check size={15} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleAction(fila, "dismiss"); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Descartar"
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Centro de Moderación</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Gestiona todos los reportes de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">Pendientes</p>
          <p className="text-xl font-bold text-amber-500 mt-1">{reportes.filter(r => r.estado === "pendiente").length}</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">En revisión</p>
          <p className="text-xl font-bold text-blue-500 mt-1">{reportes.filter(r => r.estado === "en_revision").length}</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">Resueltos</p>
          <p className="text-xl font-bold text-emerald-500 mt-1">{reportes.filter(r => r.estado === "resuelto").length}</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">Descartados</p>
          <p className="text-xl font-bold text-gray-500 mt-1">{reportes.filter(r => r.estado === "descartado").length}</p>
        </div>
      </div>

      <DataTable
        columnas={columnas}
        datos={reportes}
        placeholder="Buscar reportes..."
        emptyMessage="No se encontraron reportes"
      />

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        titulo={
          modalAction === "resolve" ? "Resolver Reporte" :
          modalAction === "dismiss" ? "Descartar Reporte" :
          "Marcar en Revisión"
        }
        descripcion={
          modalAction === "resolve"
            ? `¿Confirmas que el reporte contra "${selectedReport?.entidadNombre}" ha sido resuelto?`
            : modalAction === "dismiss"
            ? `¿Estás seguro de descartar el reporte contra "${selectedReport?.entidadNombre}"?`
            : `¿Marcar como en revisión el reporte contra "${selectedReport?.entidadNombre}"?`
        }
        variant={
          modalAction === "resolve" ? "success" :
          modalAction === "dismiss" ? "danger" :
          "default"
        }
        confirmText={
          modalAction === "resolve" ? "Resolver" :
          modalAction === "dismiss" ? "Descartar" :
          "En revisión"
        }
      />
    </div>
  );
}
