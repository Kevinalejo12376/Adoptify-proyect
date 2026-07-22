import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, ShoppingCart, Package, Star, Store, MessageSquare, CheckCheck,
  Filter, Trash2, ArrowUpRight,
} from "lucide-react";
import { mockStoreNotifications } from "../../data/store/mockStoreData";

function getTipoConfig(tipo) {
  switch (tipo) {
    case "pedido":
      return { icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10", label: "Pedido" };
    case "producto":
      return { icon: Package, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", label: "Producto" };
    case "valoracion":
      return { icon: Star, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-500/10", label: "Valoración" };
    case "admin":
      return { icon: Store, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10", label: "Admin" };
    case "sistema":
      return { icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Sistema" };
    default:
      return { icon: Bell, color: "text-gray-600", bg: "bg-gray-50", label: "General" };
  }
}

export default function StoreNotifications() {
  const [notifications, setNotifications] = useState(mockStoreNotifications);
  const [filtroTipo, setFiltroTipo] = useState("");

  const filtered = filtroTipo
    ? notifications.filter((n) => n.tipo === filtroTipo)
    : notifications;

  const sorted = [...filtered].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, leida: true })));
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  const tipos = ["pedido", "producto", "valoracion", "admin", "sistema"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">Notificaciones</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Centro de notificaciones de tu tienda.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-all"
          >
            <CheckCheck size={16} />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFiltroTipo("")}
          className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            !filtroTipo
              ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
              : "bg-white dark:bg-dark-card text-gray-600 dark:text-dark-text-secondary border border-gray-200 dark:border-dark-border hover:bg-gray-50"
          }`}
        >
          Todas ({notifications.length})
        </button>
        {tipos.map((tipo) => {
          const count = notifications.filter((n) => n.tipo === tipo).length;
          const config = getTipoConfig(tipo);
          return (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filtroTipo === tipo
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                  : "bg-white dark:bg-dark-card text-gray-600 dark:text-dark-text-secondary border border-gray-200 dark:border-dark-border hover:bg-gray-50"
              }`}
            >
              <config.icon size={12} />
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {sorted.length > 0 ? sorted.map((notif) => {
          const config = getTipoConfig(notif.tipo);
          return (
            <Link
              key={notif.id}
              to={notif.link}
              className={`block bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 hover:shadow-md transition-all ${
                !notif.leida ? "border-l-4 border-l-rose-500" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <config.icon size={18} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.leida ? "font-bold" : "font-semibold"} text-gray-900 dark:text-dark-text`}>
                        {notif.titulo}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">
                        {notif.mensaje}
                      </p>
                    </div>
                    {!notif.leida && (
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(notif.fecha).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </Link>
          );
        }) : (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">No hay notificaciones</h3>
            <p className="text-sm text-gray-500 mt-1">No se encontraron notificaciones con este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}
