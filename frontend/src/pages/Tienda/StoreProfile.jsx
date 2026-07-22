import React, { useState } from "react";
import {
  Store, MapPin, Phone, Mail, Globe, Clock, CreditCard, Truck, Star,
  Edit3, Save, Upload, ChevronDown,
  MessageSquare, ShoppingCart, Package,
} from "lucide-react";
import { mockStoreData, mockStoreReviews } from "../../data/store/mockStoreData";

export default function StoreProfile() {
  const store = mockStoreData;
  const reviews = mockStoreReviews;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...store });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, value) => {
    setForm((prev) => ({
      ...prev,
      redesSociales: { ...prev.redesSociales, [network]: value },
    }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en BD
    setEditing(false);
  };

  const statsCards = [
    { icon: Star, label: "Calificación", value: store.calificacion, color: "text-amber-500", bg: "bg-amber-50" },
    { icon: ShoppingCart, label: "Ventas totales", value: store.totalVentas, color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Package, label: "Productos", value: store.totalProductos, color: "text-rose-500", bg: "bg-rose-50" },
    { icon: MessageSquare, label: "Opiniones", value: reviews.length, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">Perfil de la Tienda</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Administra la información pública de tu tienda.
          </p>
        </div>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
        >
          {editing ? <Save size={16} /> : <Edit3 size={16} />}
          {editing ? "Guardar Cambios" : "Editar Perfil"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} dark:opacity-80 flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Store Info Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Información de la Tienda</h3>

            {/* Logo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Store size={36} className="text-rose-500" />
              </div>
              {editing && (
                <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600">
                  <Upload size={16} />
                  Cambiar logo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Nombre comercial</label>
                {editing ? (
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{store.nombre}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Descripción</label>
                {editing ? (
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => handleChange("descripcion", e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{store.descripcion}</p>
                )}
              </div>

              {[
                { field: "direccion", label: "Dirección", icon: MapPin },
                { field: "ciudad", label: "Ciudad", icon: MapPin },
                { field: "telefono", label: "Teléfono", icon: Phone },
                { field: "email", label: "Correo electrónico", icon: Mail },
                { field: "sitioWeb", label: "Sitio web", icon: Globe },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">{item.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={form[item.field]}
                      onChange={(e) => handleChange(item.field, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text flex items-center gap-2">
                      <item.icon size={14} className="text-gray-400" />
                      {store[item.field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Redes Sociales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "facebook", label: "Facebook", icon: Globe, color: "text-blue-600" },
                { key: "instagram", label: "Instagram", icon: Globe, color: "text-pink-600" },
                { key: "twitter", label: "Twitter", icon: Globe, color: "text-sky-500" },
                { key: "tiktok", label: "TikTok", icon: Globe, color: "text-gray-900" },
              ].map((social) => (
                <div key={social.key}>
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">{social.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.redesSociales[social.key]}
                      onChange={(e) => handleSocialChange(social.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text flex items-center gap-2">
                      <social.icon size={14} className={social.color} />
                      {store.redesSociales[social.key] || "—"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Horarios de atención */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
              <Clock size={16} className="text-rose-500" />
              Horarios de Atención
            </h3>
            <div className="space-y-2">
              {Object.entries(store.horarios).map(([dia, horario]) => (
                <div key={dia} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-dark-border last:border-0">
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-text capitalize">
                    {dia}
                  </span>
                  <span className="text-sm text-gray-500">{horario}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-rose-500" />
              Métodos de Pago
            </h3>
            <div className="flex flex-wrap gap-2">
              {store.metodosPago.map((metodo) => (
                <span key={metodo} className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-dark-bg text-xs font-medium text-gray-700 dark:text-dark-text">
                  {metodo}
                </span>
              ))}
            </div>
          </div>

          {/* Información de envíos */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
              <Truck size={16} className="text-rose-500" />
              Información de Envíos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <p className="text-[10px] text-gray-400 uppercase">Costo envío</p>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">${store.informacionEnvio.costo.toLocaleString("es-CO")}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <p className="text-[10px] text-gray-400 uppercase">Gratis desde</p>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">${store.informacionEnvio.gratisDesde.toLocaleString("es-CO")}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <p className="text-[10px] text-gray-400 uppercase">Tiempo estimado</p>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">{store.informacionEnvio.tiempoEstimado}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <p className="text-[10px] text-gray-400 uppercase">Cobertura</p>
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text">{store.informacionEnvio.cobertura}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Opiniones */}
        <div className="space-y-6">
          {/* Calificación promedio */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3">Calificación Promedio</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-dark-text">{store.calificacion}</span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={star <= Math.round(store.calificacion) ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{reviews.length} opiniones</p>
              </div>
            </div>

            {/* Barras de calificación */}
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.calificacion === star).length;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-gray-500 w-3">{star}</span>
                  <Star size={10} className="text-amber-400" />
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 w-5 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Opiniones recientes */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Opiniones de Usuarios</h3>
            <div className="space-y-4">
              {reviews.slice(0, 4).map((review) => (
                <div key={review.id} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center text-[10px] font-bold text-rose-600">
                      {review.usuario[0]}
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-dark-text">{review.usuario}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className={star <= review.calificacion ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-dark-text-secondary">{review.comentario}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(review.fecha).toLocaleDateString("es-CO")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
