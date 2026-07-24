import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Loader2 } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { listarProductos, eliminarProducto } from "../../api/admin";

export default function AdminMarketplace() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarProductos();
      setProductos(data.map((p) => ({
        ...p,
        precioFmt: `$${Number(p.precio).toLocaleString("es-CO")}`,
        estado: p.activo ? "activo" : "inactivo",
      })));
    } catch (e) {
      setError(e?.message || "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const confirmarEliminar = async () => {
    if (!aEliminar) return;
    try {
      await eliminarProducto(aEliminar.id);
      await cargar();
    } catch (e) {
      setError(e?.message || "No se pudo eliminar el producto");
    } finally {
      setAEliminar(null);
    }
  };

  const columnas = [
    { key: "nombre", titulo: "Producto", ordenable: true },
    { key: "categoria", titulo: "Categoría", ordenable: true, render: (v) => v || "—" },
    { key: "precioFmt", titulo: "Precio", ordenable: false },
    { key: "stock", titulo: "Stock", ordenable: true },
    { key: "vendedor", titulo: "Vendedor", ordenable: true },
    { key: "tipo_vendedor", titulo: "Tipo", tipo: "badge", ordenable: true },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    {
      key: "acciones",
      titulo: "Acciones",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setAEliminar(fila); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Marketplace</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Supervisa los productos publicados por refugios y tiendas
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-2" />
          <p>Cargando productos...</p>
        </div>
      ) : (
        <DataTable
          columnas={columnas}
          datos={productos}
          placeholder="Buscar productos..."
          emptyMessage="No hay productos registrados"
        />
      )}

      <ConfirmModal
        isOpen={!!aEliminar}
        onClose={() => setAEliminar(null)}
        onConfirm={confirmarEliminar}
        titulo="Eliminar producto"
        descripcion={`¿Eliminar "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        variant="danger"
        confirmText="Eliminar"
        icon={Trash2}
      />
    </div>
  );
}
