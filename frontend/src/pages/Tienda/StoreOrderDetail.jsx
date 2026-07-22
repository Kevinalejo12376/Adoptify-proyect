import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ShoppingCart, Package, MapPin, CreditCard, Phone, Mail,
  CheckCircle, XCircle, ChevronRight, Clock, Truck, Box, Calendar,
  AlertCircle, User,
} from "lucide-react";
import { mockStoreOrders } from "../../data/store/mockStoreData";

const estados = [
  { key: "recibido", label: "Pedido recibido", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/20" },
  { key: "confirmado", label: "Pedido confirmado", icon: CheckCircle, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-500/20" },
  { key: "preparando", label: "Preparando pedido", icon: Box, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/20" },
  { key: "empacado", label: "Empacado", icon: Package, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-500/20" },
  { key: "enviado", label: "Enviado", icon: Truck, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/20" },
  { key: "en_camino", label: "En camino", icon: Truck, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-500/20" },
  { key: "entregado", label: "Entregado", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20" },
  { key: "cancelado", label: "Cancelado", icon: XCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-500/20" },
];

const transitionMap = {
  recibido: ["confirmado", "cancelado"],
  confirmado: ["preparando", "cancelado"],
  preparando: ["empacado", "cancelado"],
  empacado: ["enviado", "cancelado"],
  enviado: ["en_camino", "cancelado"],
  en_camino: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

export default function StoreOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockStoreOrders.find((o) => o.id === id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextEstado, setNextEstado] = useState(null);
  const [currentEstado, setCurrentEstado] = useState(order?.estado || "recibido");

  if (!order) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Pedido no encontrado</h2>
        <p className="text-gray-500 mt-2">El pedido que buscas no existe.</p>
        <Link to="/tienda/pedidos" className="inline-flex items-center gap-2 mt-4 text-rose-500 hover:text-rose-600 font-medium">
          <ArrowLeft size={16} /> Volver a pedidos
        </Link>
      </div>
    );
  }

  const currentIndex = estados.findIndex((e) => e.key === currentEstado);
  const availableTransitions = transitionMap[currentEstado] || [];

  const handleEstadoChange = (nuevoEstado) => {
    setNextEstado(nuevoEstado);
    setShowConfirmModal(true);
  };

  const confirmEstadoChange = () => {
    if (nextEstado) {
      setCurrentEstado(nextEstado);
    }
    setShowConfirmModal(false);
    setNextEstado(null);
  };

  return (
    <div className="space-y-6">
      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-modal-overlay">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-content">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text text-center mb-2">
              ¿Cambiar estado del pedido?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              ¿Estás seguro de cambiar el estado del pedido {order.numero} a{" "}
              <strong>{estados.find((e) => e.key === nextEstado)?.label}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEstadoChange}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl hover:shadow-lg transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tienda/pedidos" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <ArrowLeft size={18} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">
              Pedido {order.numero}
            </h1>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
              Realizado el {new Date(order.fecha).toLocaleDateString("es-CO", {
                year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Timeline & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline / Stepper */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-6">Estado del Pedido</h3>
            <div className="relative">
              {/* Linea conectora */}
              <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-dark-border" />

              <div className="space-y-6">
                {estados.map((estado, index) => {
                  const isCompleted = index <= currentIndex && currentEstado !== "cancelado";
                  const isCurrent = index === currentIndex;
                  const isDisabled = !availableTransitions.includes(estado.key) && estado.key !== currentEstado;
                  const isPast = index < currentIndex;

                  return (
                    <div key={estado.key} className="relative flex items-start gap-4">
                      {/* Circle indicator */}
                      <div className={`relative z-10 w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted && currentEstado !== "cancelado"
                          ? `${estado.bg} ${estado.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-card ${estado.color.replace("text-", "ring-")}/30`
                          : currentEstado === "cancelado" && index <= currentIndex
                          ? "bg-red-100 text-red-500"
                          : "bg-gray-100 dark:bg-dark-border text-gray-400"
                      }`}>
                        <estado.icon size={16} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${
                            isCompleted && currentEstado !== "cancelado"
                              ? "text-gray-900 dark:text-dark-text"
                              : currentEstado === "cancelado" && index <= currentIndex
                              ? "text-red-600"
                              : index === currentIndex
                              ? "text-gray-900 dark:text-dark-text"
                              : "text-gray-400 dark:text-dark-text-secondary"
                          }`}>
                            {estado.label}
                          </p>
                          {isCurrent && !isPast && (
                            <span className="text-[10px] font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                              Actual
                            </span>
                          )}
                        </div>

                        {/* Show date if completed */}
                        {(isCompleted || (currentEstado === "cancelado" && index <= currentIndex)) && order.historialEstados?.find((h) => h.estado === estado.key) && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(order.historialEstados.find((h) => h.estado === estado.key).fecha).toLocaleDateString("es-CO", {
                              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        )}

                        {/* Action button for next states */}
                        {availableTransitions.includes(estado.key) && (
                          <button
                            onClick={() => handleEstadoChange(estado.key)}
                            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:shadow-md transition-all"
                          >
                            Marcar como {estado.label.toLowerCase()}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Productos del pedido */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Productos</h3>
            <div className="space-y-3">
              {order.productos.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center justify-center flex-shrink-0">
                    <Package size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{product.nombre}</p>
                    <p className="text-xs text-gray-400">Cantidad: {product.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-dark-text">
                      ${(product.precio * product.cantidad).toLocaleString("es-CO")}
                    </p>
                    <p className="text-[10px] text-gray-400">${product.precio.toLocaleString("es-CO")} c/u</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-dark-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-dark-text">${order.subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className="font-medium text-gray-900 dark:text-dark-text">${order.envio.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-gray-100 dark:border-dark-border pt-2">
                <span className="text-gray-900 dark:text-dark-text">Total</span>
                <span className="text-gray-900 dark:text-dark-text">${order.total.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Client Info & Payment */}
        <div className="space-y-6">
          {/* Información del cliente */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
              <User size={16} className="text-rose-500" />
              Cliente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center text-xs font-bold text-rose-600">
                  {order.cliente[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{order.cliente}</p>
                  <p className="text-xs text-gray-400">Cliente</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={12} /> {order.clienteEmail}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone size={12} /> {order.clienteTelefono}
              </div>
            </div>
          </div>

          {/* Dirección de entrega */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-rose-500" />
              Dirección de Entrega
            </h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{order.direccionEnvio}</p>
            {order.notas && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                <p className="text-xs font-medium text-amber-600">Notas:</p>
                <p className="text-xs text-amber-700 mt-0.5">{order.notas}</p>
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-rose-500" />
              Método de Pago
            </h3>
            <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{order.metodoPago}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.fecha).toLocaleDateString("es-CO", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
