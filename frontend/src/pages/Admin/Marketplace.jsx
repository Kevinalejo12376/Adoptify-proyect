import React, { useState } from "react";
import { Eye, EyeOff, RotateCcw, Flag, Building2 } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { mockProductosAdmin } from "../../data/admin/mockData";

export default function AdminMarketplace() {
  const [productos, setProductos] = useState(mockProductosAdmin);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const handleAction = (producto, accion) => {
    setSelectedProduct(producto);
    setModalAction(accion);
    setModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedProduct) return;
    setProductos((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, estado: modalAction === "hide" ? "oculto" : "visible" }
          : p
      )
    );
    setModalOpen(false);
    setSelectedProduct(null);
    setModalAction(null);
  };

  const columnas = [
    { key: "nombre", titulo: "Producto", tipo: "avatar", nombreAvatar: (f) => f.nombre, ordenable: true },
    { key: "categoria", titulo: "Categoría", ordenable: true },
    { key: "precio", titulo: "Precio", tipo: "moneda", ordenable: true },
    { key: "refugio", titulo: "Refugio", ordenable: true },
    { key: "stock", titulo: "Stock", ordenable: true, className: "text-center" },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    {
      key: "reportes",
      titulo: "Reportes",
      ordenable: true,
      className: "text-center",
      render: (valor) => (
        <span className={`inline-flex items-center gap-1 text-sm font-medium ${valor > 0 ? "text-red-500" : "text-gray-500"}`}>
          <Flag size={13} /> {valor}
        </span>
      ),
    },
    {
      key: "acciones",
      titulo: "Acciones",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Ver producto">
            <Eye size={15} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" title="Ver refugio">
            <Building2 size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleAction(fila, fila.estado === "oculto" ? "restore" : "hide"); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
            title={fila.estado === "oculto" ? "Restaurar" : "Ocultar"}
          >
            {fila.estado === "oculto" ? <RotateCcw size={15} /> : <EyeOff size={15} />}
          </button>
          {fila.reportes > 0 && (
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Revisar reportes">
              <Flag size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Marketplace</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Administra los productos publicados por los refugios
        </p>
      </div>

      <DataTable
        columnas={columnas}
        datos={productos}
        placeholder="Buscar productos..."
        emptyMessage="No se encontraron productos"
      />

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        titulo={modalAction === "hide" ? "Ocultar Producto" : "Restaurar Producto"}
        descripcion={
          modalAction === "hide"
            ? `¿Estás seguro de ocultar "${selectedProduct?.nombre}"? No estará disponible en la tienda.`
            : `¿Estás seguro de restaurar "${selectedProduct?.nombre}"? Volverá a estar disponible.`
        }
        variant={modalAction === "hide" ? "warning" : "success"}
        confirmText={modalAction === "hide" ? "Ocultar" : "Restaurar"}
        icon={modalAction === "hide" ? EyeOff : RotateCcw}
      />
    </div>
  );
}
