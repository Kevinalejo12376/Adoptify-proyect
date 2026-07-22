import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, ShoppingCart, DollarSign, Star, TrendingUp, AlertTriangle,
  Clock, Eye, Edit3, PlusCircle, PackageX, Truck, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Store, BarChart3, Settings,
} from "lucide-react";
import {
  mockStoreDashboardStats,
  mockStoreProducts,
  mockStoreOrders,
  mockStoreSalesByMonth,
  mockStoreTopProducts,
  mockStoreNotifications,
  mockStoreData,
} from "../../data/store/mockStoreData";

// --- StatCard Component ---
function StatCard({ icon: Icon, label, value, increment, color, bgColor }) {
  const isPositive = increment >= 0;
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon size={20} className={color} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(increment)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-1">
        {typeof value === "number" && label === "Ingresos" ? `$${value.toLocaleString("es-CO")}` : value}
      </p>
      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{label}</p>
    </div>
  );
}

// --- Simple Bar Chart Component ---
function SimpleBarChart({ data, labels, color = "from-rose-500 to-amber-500", height = 160 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
          <span className="text-[10px] font-medium text-gray-400 dark:text-dark-text-secondary">
            {value}
          </span>
          <div
            className={`w-full rounded-lg bg-gradient-to-t ${color} transition-all duration-500 min-h-[4px]`}
            style={{ height: `${(value / max) * 100}%` }}
          />
          <span className="text-[10px] font-medium text-gray-400 dark:text-dark-text-secondary">
            {labels[index]}
          </span>
        </div>
      ))}
    </div>
  );
}

// --- Simple Line Chart Component ---
function SimpleLineChart({ data, labels, color = "stroke-rose-500", height = 180 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * (height - 20);
    return `${x},${y}`;
  });
  const polylinePoints = points.join(" ");

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg width="100%" height={height} className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <line
            key={pct}
            x1="0" y1={(height - 20) * (pct / 100) + 10}
            x2="100%" y2={(height - 20) * (pct / 100) + 10}
            stroke="currentColor"
            className="text-gray-100 dark:text-dark-border"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        {/* Area gradient */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4D7A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF4D7A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon
          points={`0,${height} ${polylinePoints} 100,${height}`}
          fill="url(#areaGradient)"
        />
        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          className={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = height - ((value - min) / range) * (height - 20);
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={y}
              r="3.5"
              className="fill-white dark:fill-dark-card stroke-rose-500"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}

// --- Status Badge ---
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
    pendiente: { label: "Pendiente", color: "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" },
  };
  const c = config[estado] || config.pendiente;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}

export default function StoreDashboard() {
  const stats = mockStoreDashboardStats;
  const products = mockStoreProducts;
  const orders = mockStoreOrders;
  const salesData = mockStoreSalesByMonth;
  const topProducts = mockStoreTopProducts;
  const notifications = mockStoreNotifications;
  const store = mockStoreData;

  const lowStockProducts = products.filter((p) => p.disponible && p.stock <= p.stockMinimo);
  const recentOrders = [...orders].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.leida);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Bienvenido de nuevo, {store.nombre}. Aquí tienes un resumen de tu tienda.
          </p>
        </div>
        <Link
          to="/tienda/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
        >
          <PlusCircle size={16} />
          Nuevo Producto
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Productos publicados" value={stats.productosPublicados.total} increment={stats.productosPublicados.incremento} color="text-rose-600" bgColor="bg-rose-50 dark:bg-rose-500/10" />
        <StatCard icon={PackageX} label="Productos agotados" value={stats.productosAgotados.total} increment={stats.productosAgotados.incremento} color="text-amber-600" bgColor="bg-amber-50 dark:bg-amber-500/10" />
        <StatCard icon={ShoppingCart} label="Pedidos recibidos" value={stats.pedidosRecibidos.total} increment={stats.pedidosRecibidos.incremento} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard icon={CheckCircle} label="Pedidos entregados" value={stats.pedidosEntregados.total} increment={stats.pedidosEntregados.incremento} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatCard icon={TrendingUp} label="Ventas del mes" value={stats.ventasDelMes.total} increment={stats.ventasDelMes.incremento} color="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-500/10" />
        <StatCard icon={DollarSign} label="Ingresos" value={stats.ingresos.total} increment={stats.ingresos.incremento} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatCard icon={Star} label="Valoraciones recibidas" value={stats.valoracionesRecibidas.total} increment={stats.valoracionesRecibidas.incremento} color="text-yellow-600" bgColor="bg-yellow-50 dark:bg-yellow-500/10" />
        <StatCard icon={Star} label="Calificación promedio" value={stats.calificacionPromedio.total} increment={stats.calificacionPromedio.incremento} color="text-orange-600" bgColor="bg-orange-50 dark:bg-orange-500/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Mes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Ventas por Mes</h3>
            <Link to="/tienda/estadisticas" className="text-xs text-rose-500 hover:text-rose-600 font-medium">Ver más</Link>
          </div>
          <SimpleBarChart data={salesData.ventas} labels={salesData.labels} />
        </div>

        {/* Ingresos por Mes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Ingresos por Mes</h3>
            <span className="text-xs text-gray-400">Últimos 7 meses</span>
          </div>
          <SimpleLineChart data={salesData.ingresos.map((v) => Math.round(v / 1000000))} labels={salesData.labels} />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Valores en millones</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-dark-text">
              ${salesData.ingresos.reduce((a, b) => a + b, 0).toLocaleString("es-CO")}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Productos más vendidos</h3>
            <Link to="/tienda/estadisticas" className="text-xs text-rose-500 hover:text-rose-600 font-medium">Ver todos</Link>
          </div>
          <div className="p-2">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  index === 0 ? "bg-amber-100 text-amber-600" :
                  index === 1 ? "bg-gray-100 text-gray-500" :
                  index === 2 ? "bg-orange-100 text-orange-600" :
                  "bg-gray-50 text-gray-400"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-dark-text truncate">{product.nombre}</p>
                  <p className="text-[10px] text-gray-400">{product.vendidos} vendidos</p>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-dark-text-secondary">
                  ${product.ingresos.toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos pedidos */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Últimos pedidos</h3>
            <Link to="/tienda/pedidos" className="text-xs text-rose-500 hover:text-rose-600 font-medium">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-dark-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/tienda/pedidos/${order.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-dark-text">{order.numero}</p>
                  <p className="text-[10px] text-gray-400 truncate">{order.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900 dark:text-dark-text">
                    ${order.total.toLocaleString("es-CO")}
                  </p>
                  <StatusBadge estado={order.estado} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Notificaciones importantes & Productos bajo inventario */}
        <div className="space-y-6">
          {/* Notificaciones importantes */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Notificaciones</h3>
              <Link to="/tienda/notificaciones" className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                {unreadNotifications.length > 0 && `(${unreadNotifications.length} nuevas)`}
              </Link>
            </div>
            <div className="p-2">
              {unreadNotifications.slice(0, 3).map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.link}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    notif.tipo === "pedido" ? "bg-blue-50 text-blue-600" :
                    notif.tipo === "producto" ? "bg-amber-50 text-amber-600" :
                    "bg-gray-50 text-gray-600"
                  }`}>
                    {notif.tipo === "pedido" ? <ShoppingCart size={14} /> :
                     notif.tipo === "producto" ? <Package size={14} /> :
                     <Bell size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-dark-text">{notif.titulo}</p>
                    <p className="text-[10px] text-gray-400 truncate">{notif.mensaje}</p>
                  </div>
                </Link>
              ))}
              {unreadNotifications.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No hay notificaciones nuevas</p>
              )}
            </div>
          </div>

          {/* Productos con bajo inventario */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Bajo inventario</h3>
              <Link to="/tienda/productos" className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                {lowStockProducts.length > 0 && `(${lowStockProducts.length})`}
              </Link>
            </div>
            <div className="p-2">
              {lowStockProducts.length > 0 ? lowStockProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/tienda/productos/${product.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-dark-text truncate">{product.nombre}</p>
                    <p className="text-[10px] text-gray-400">Stock: {product.stock} / Mín: {product.stockMinimo}</p>
                  </div>
                  <Link
                    to={`/tienda/productos/editar/${product.id}`}
                    className="text-[10px] text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Reabastecer
                  </Link>
                </Link>
              )) : (
                <p className="text-xs text-gray-400 text-center py-4">Todo en stock suficiente</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
        <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { icon: PlusCircle, label: "Nuevo Producto", path: "/tienda/productos/nuevo", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
            { icon: Package, label: "Productos", path: "/tienda/productos", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
            { icon: ShoppingCart, label: "Pedidos", path: "/tienda/pedidos", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            { icon: Store, label: "Perfil", path: "/tienda/perfil", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
            { icon: BarChart3, label: "Estadísticas", path: "/tienda/estadisticas", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
            { icon: Settings, label: "Configuración", path: "/tienda/configuracion", color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-500/10" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-dark-border hover:shadow-md hover:border-rose-100 dark:hover:border-rose-500/20 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon size={18} className={item.color} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-dark-text-secondary">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
