import React from "react";
import { Eye } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/admin/Badge";
import { mockPedidos } from "../../data/admin/mockData";

export default function AdminPedidos() {
  const columnas = [
    { key: "numero", titulo: "N° Pedido", ordenable: true, className: "font-mono" },
    { key: "cliente", titulo: "Cliente", ordenable: true },
    { key: "refugio", titulo: "Refugio", ordenable: true },
    {
      key: "productos",
      titulo: "Productos",
      tipo: "render",
      render: (valor) => (
        <span className="text-sm text-gray-700 dark:text-dark-text">
          {valor?.length || 0} producto(s)
        </span>
      ),
    },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    { key: "total", titulo: "Total", tipo: "moneda", ordenable: true },
    { key: "fecha", titulo: "Fecha", tipo: "fecha", ordenable: true },
    {
      key: "acciones",
      titulo: "",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Ver detalle">
          <Eye size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Pedidos</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Visualiza todos los pedidos realizados en la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">Total pedidos</p>
          <p className="text-xl font-bold text-gray-900 dark:text-dark-text mt-1">{mockPedidos.length}</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">Pendientes</p>
          <p className="text-xl font-bold text-amber-500 mt-1">{mockPedidos.filter(p => p.estado === "pendiente").length}</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">En proceso</p>
          <p className="text-xl font-bold text-blue-500 mt-1">{mockPedidos.filter(p => p.estado === "en_proceso").length}</p>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">Completados</p>
          <p className="text-xl font-bold text-emerald-500 mt-1">{mockPedidos.filter(p => p.estado === "entregado").length}</p>
        </div>
      </div>

      <DataTable
        columnas={columnas}
        datos={mockPedidos}
        placeholder="Buscar pedidos..."
        emptyMessage="No se encontraron pedidos"
      />
    </div>
  );
}
