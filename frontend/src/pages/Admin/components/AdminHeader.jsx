import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Sun, Moon, User, ChevronDown, LogOut, Settings,
  Building2, Flag, HelpCircle, ShoppingCart, MessageSquare, Shield,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { mockNotificaciones } from "../../../data/admin/mockData";

export default function AdminHeader({ adminNombre, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [notificacionesOpen, setNotificacionesOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const notifRef = useRef(null);
  const perfilRef = useRef(null);

  const notificacionesNoLeidas = mockNotificaciones.filter((n) => !n.leida).length;

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "refugio": return Building2;
      case "reporte": return Flag;
      case "pqrs": return HelpCircle;
      case "pedido": return ShoppingCart;
      case "admin": return Shield;
      default: return MessageSquare;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "refugio": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "reporte": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      case "pqrs": return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
      case "pedido": return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case "admin": return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
      default: return "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotificacionesOpen(false);
      if (perfilRef.current && !perfilRef.current.contains(e.target)) setPerfilOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      // Navegar a búsqueda global (por ahora redirige al dashboard)
      navigate("/admin/dashboard");
      setBusqueda("");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Buscador */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en el panel..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
        </form>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2 ml-4">
          {/* Modo oscuro */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors"
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notificaciones */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificacionesOpen(!notificacionesOpen)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors"
            >
              <Bell size={18} />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {notificacionesNoLeidas > 9 ? "9+" : notificacionesNoLeidas}
                </span>
              )}
            </button>

            {/* Dropdown notificaciones */}
            {notificacionesOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border animate-scale-in overflow-hidden">
                <div className="p-3 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Notificaciones</h3>
                  {notificacionesNoLeidas > 0 && (
                    <span className="text-xs text-rose-500 font-medium">{notificacionesNoLeidas} sin leer</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-hide">
                  {mockNotificaciones.slice(0, 5).map((notif) => {
                    const Icono = getTipoIcon(notif.tipo);
                    return (
                      <button
                        key={notif.id}
                        onClick={() => {
                          navigate(notif.link);
                          setNotificacionesOpen(false);
                        }}
                        className={`w-full text-left p-3 flex items-start gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-dark-border ${
                          !notif.leida ? "bg-rose-50/30 dark:bg-rose-500/5" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${getTipoColor(notif.tipo)}`}>
                          <Icono size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.leida ? "font-semibold" : "font-medium"} text-gray-900 dark:text-dark-text truncate`}>
                            {notif.titulo}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5 line-clamp-2">
                            {notif.mensaje}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary mt-1">
                            {new Date(notif.fecha).toLocaleDateString("es-CO", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!notif.leida && (
                          <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-dark-border">
                  <button
                    onClick={() => { navigate("/admin/dashboard"); setNotificacionesOpen(false); }}
                    className="w-full py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Perfil */}
          <div className="relative" ref={perfilRef}>
            <button
              onClick={() => setPerfilOpen(!perfilOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center text-xs font-bold text-rose-600 dark:text-rose-400">
                {adminNombre?.[0] || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-dark-text leading-tight">
                  {adminNombre || "Admin"}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary leading-tight">
                  Administrador
                </p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </button>

            {perfilOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border animate-scale-in overflow-hidden">
                <div className="p-3 border-b border-gray-100 dark:border-dark-border">
                  <p className="text-sm font-bold text-gray-900 dark:text-dark-text">{adminNombre || "Admin"}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Administrador</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { navigate("/admin/configuracion"); setPerfilOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-colors"
                  >
                    <Settings size={16} />
                    Configuración
                  </button>
                  <button
                    onClick={() => { onLogout(); setPerfilOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
