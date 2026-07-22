import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  Star, Package, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  mockStoreSalesByMonth,
  mockStoreTopProducts,
  mockStoreProducts,
  mockStoreOrders,
  mockStoreFrequentClients,
  mockStoreReviews,
} from "../../data/store/mockStoreData";

// --- Simple Bar Chart ---
function BarChart({ data, labels, color = "from-rose-500 to-amber-500", height = 200 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
          <span className="text-[10px] font-medium text-gray-400">{value}</span>
          <div
            className="w-full rounded-lg bg-gradient-to-t ${color} transition-all duration-500 min-h-[4px]"
            style={{ height: `${(value / max) * 100}%` }}
          />
          <span className="text-[10px] font-medium text-gray-400">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

export default function StoreStatistics() {
  const salesData = mockStoreSalesByMonth;
  const topProducts = mockStoreTopProducts;
  const allProducts = mockStoreProducts;
  const orders = mockStoreOrders;
  const clients = mockStoreFrequentClients;
  const reviews = mockStoreReviews;

  // Productos menos vendidos (orden inverso)
  const leastSold = [...allProducts]
    .sort((a, b) => a.vendidos - b.vendidos)
    .slice(0, 5);

  const totalIngresos = salesData.ingresos.reduce((a, b) => a + b, 0);
  const totalVentas = salesData.ventas.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">Estadísticas</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Analiza el rendimiento de tu tienda con datos detallados.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={18} className="text-emerald-500" />
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} /> +16.7%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-dark-text">${totalIngresos.toLocaleString("es-CO")}</p>
          <p className="text-[10px] text-gray-400">Ingresos totales</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart size={18} className="text-blue-500" />
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} /> +14.3%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{totalVentas}</p>
          <p className="text-[10px] text-gray-400">Total ventas</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart size={18} className="text-purple-500" />
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} /> +18.2%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{orders.length}</p>
          <p className="text-[10px] text-gray-400">Pedidos totales</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <Users size={18} className="text-amber-500" />
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{clients.length}</p>
          <p className="text-[10px] text-gray-400">Clientes frecuentes</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <Star size={18} className="text-yellow-500" />
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} /> +2.3%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{reviews.length}</p>
          <p className="text-[10px] text-gray-400">Calificaciones</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por mes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Ventas por Mes</h3>
          <BarChart data={salesData.ventas} labels={salesData.labels} />
        </div>

        {/* Ingresos por mes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Ingresos por Mes</h3>
          <BarChart data={salesData.ingresos.map((v) => Math.round(v / 10000))} labels={salesData.labels} color="from-emerald-500 to-teal-500" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Valores en decenas de miles</span>
          </div>
        </div>

        {/* Pedidos por mes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Pedidos por Mes</h3>
          <BarChart data={salesData.pedidos} labels={salesData.labels} color="from-blue-500 to-indigo-500" />
        </div>

        {/* Clientes por mes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Clientes por Mes</h3>
          <BarChart data={salesData.clientes} labels={salesData.labels} color="from-purple-500 to-pink-500" />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Productos más vendidos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">#</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Producto</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Vendidos</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Ingresos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-border">
                    <td className="px-4 py-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        index === 0 ? "bg-amber-100 text-amber-600" :
                        index === 1 ? "bg-gray-100 text-gray-500" :
                        index === 2 ? "bg-orange-100 text-orange-600" :
                        "bg-gray-50 text-gray-400"
                      }`}>{index + 1}</div>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-dark-text">{product.nombre}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-600">{product.vendidos}</td>
                    <td className="px-4 py-2.5 text-right text-sm font-semibold text-gray-900 dark:text-dark-text">
                      ${product.ingresos.toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Productos menos vendidos */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Productos menos vendidos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Producto</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Vendidos</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {leastSold.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-border">
                    <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-dark-text">{product.nombre}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-600">{product.vendidos}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : product.stock <= product.stockMinimo ? "text-amber-500" : "text-gray-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clientes frecuentes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Clientes Frecuentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Cliente</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Compras</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Total gastado</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Última compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {clients.map((client, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-border">
                    <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-dark-text">{client.nombre}</td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-600">{client.compras}</td>
                    <td className="px-4 py-2.5 text-right text-sm font-semibold text-gray-900 dark:text-dark-text">
                      ${client.totalGastado.toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-500">
                      {new Date(client.ultimaCompra).toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calificaciones */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Calificaciones Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Usuario</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Producto</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Calificación</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {reviews.slice(0, 5).map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-dark-border">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-dark-text">{review.usuario}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{review.productoNombre}</td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={10} className={star <= review.calificacion ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm text-gray-500">
                      {new Date(review.fecha).toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
