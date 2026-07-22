import React, { useState } from "react";
import {
  Settings, Store, Lock, Bell, Shield, User, Eye, EyeOff, Save,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "tienda", label: "Datos de la Tienda", icon: Store, desc: "Administra la información general de tu tienda" },
  { id: "password", label: "Contraseña", icon: Lock, desc: "Cambia tu contraseña de acceso" },
  { id: "notificaciones", label: "Notificaciones", icon: Bell, desc: "Configura las notificaciones que deseas recibir" },
  { id: "preferencias", label: "Preferencias", icon: Settings, desc: "Personaliza la experiencia de tu panel" },
  { id: "seguridad", label: "Seguridad", icon: Shield, desc: "Configura opciones de seguridad de tu cuenta" },
  { id: "cuenta", label: "Cuenta", icon: User, desc: "Administra los datos de tu cuenta" },
];

export default function StoreSettings() {
  const [activeSection, setActiveSection] = useState("tienda");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "tienda":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Datos de la Tienda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nombre comercial", value: "KanuPets" },
                { label: "Correo electrónico", value: "kanupets@gmail.com" },
                { label: "Teléfono", value: "+57 301 234 5678" },
                { label: "Dirección", value: "Cra 15 # 88-32, Bogotá" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "password":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Cambiar Contraseña</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Contraseña actual</label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        );

      case "notificaciones":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Preferencias de Notificaciones</h3>
            <div className="space-y-3">
              {[
                { label: "Nuevos pedidos", desc: "Recibir notificación cuando llegue un nuevo pedido" },
                { label: "Pedidos cancelados", desc: "Notificar cuando un pedido sea cancelado" },
                { label: "Productos agotados", desc: "Alertar cuando un producto se quede sin stock" },
                { label: "Nuevas valoraciones", desc: "Notificar cuando un producto reciba una valoración" },
                { label: "Mensajes del administrador", desc: "Recibir comunicaciones del equipo de Adoptify" },
                { label: "Actualizaciones del sistema", desc: "Informar sobre nuevas versiones y mejoras" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-amber-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "preferencias":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Preferencias del Panel</h3>
            <div className="space-y-3">
              {[
                { label: "Sidebar colapsado por defecto", desc: "Iniciar con el menú lateral cerrado" },
                { label: "Confirmación al cambiar estado de pedidos", desc: "Solicitar confirmación antes de cambios" },
                { label: "Mostrar productos agotados", desc: "Visualizar productos sin stock en el listado" },
                { label: "Actualizaciones automáticas", desc: "Refrescar datos del dashboard automáticamente" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-amber-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "seguridad":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Seguridad</h3>
            <div className="space-y-3">
              {[
                { label: "Autenticación de dos factores", desc: "Añade una capa extra de seguridad a tu cuenta" },
                { label: "Notificaciones de inicio de sesión", desc: "Recibir alerta cuando se acceda desde un nuevo dispositivo" },
                { label: "Cerrar sesión automáticamente", desc: "Cerrar sesión después de 30 minutos de inactividad" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-amber-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "cuenta":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Información de la Cuenta</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                  <User size={28} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-dark-text">KanuPets</p>
                  <p className="text-xs text-gray-400">kanupets@gmail.com</p>
                  <p className="text-xs text-gray-400 mt-0.5">Miembro desde junio 2025</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Zona de peligro
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Estas acciones son irreversibles. Ten cuidado.
                </p>
                <button className="mt-3 px-4 py-2 text-sm font-semibold text-red-600 bg-white dark:bg-dark-card border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">Configuración</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Administra la configuración de tu tienda y cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de secciones */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
            <div className="p-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                        : "text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border"
                    }`}
                  >
                    <section.icon size={18} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${isActive ? "text-white" : ""}`}>
                        {section.label}
                      </p>
                    </div>
                    <ChevronRight size={14} className={`flex-shrink-0 ${isActive ? "text-white/70" : "text-gray-300"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido de la sección */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            {renderSection()}

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
              >
                <Save size={16} />
                {saved ? "¡Guardado!" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
