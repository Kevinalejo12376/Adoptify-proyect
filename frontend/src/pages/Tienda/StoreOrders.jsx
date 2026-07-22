import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Search, SlidersHorizontal, ArrowUpRight, ChevronDown,
} from "lucide-react";
import { mockStoreOrders } from "../../data/store/mockStoreData";

function StatusBadge({ estado }) {
  const config = {
    recibido: { label: "Recibido", color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    confirmado: { label: "Confirmado", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
    preparando: { label: "Preparando", color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
    empacado: { label: "Empacado", color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
    enviado: { label: "Enviado", color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
    en_camino: { label: "En camino", color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
    entregado: { label: "Entregado", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    cancelado: { label: "Cancelado", color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  };
  const c = config[estado] || { label: estado, color: "bg-gray-50 text-gray-600" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}

export default function StoreOrders() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const filteredOrders = mockStoreOrders.filter((o) => {
    if (busqueda && !o.numero.toLowerCase().includes(busqueda.toLowerCase()) && !o.cliente.toLowerCase().includes(busqueda.toLowerCase())) return false;
    if (estadoFiltro && o.estado !== estadoFiltro) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">Pedidos</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Administra todos los pedidos realizados por los clientes.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de pedido o cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          >
            <option value="">Todos los estados</option>
            <option value="recibido">Recibido</option>
            <option value="confirmado">Confirmado</option>
            <option value="preparando">Preparando</option>
            <option value="empacado">Empacado</option>
            <option value="enviado">Enviado</option>
            <option value="en_camino">En camino</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Pedido</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Productos</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Método de pago</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-dark-text">{order.numero}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{order.cliente}</p>
                      <p className="text-[10px] text-gray-400">{order.clienteEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500">
                      {order.productos.map((p, i) => (
                        <span key={i}>
                          {p.nombre} x{p.cantidad}{i < order.productos.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-dark-text">
                      ${order.total.toLocaleString("es-CO")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.fecha).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{order.metodoPago}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge estado={order.estado} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/tienda/pedidos/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      Ver detalle <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">No se encontraron pedidos</h3>
          <p className="text-sm text-gray-500 mt-1">Intenta con otros filtros.</p>
        </div>
      )}
    </div>
  );
}
