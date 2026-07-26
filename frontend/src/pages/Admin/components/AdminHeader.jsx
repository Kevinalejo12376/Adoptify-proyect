import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Sun, Moon, User, ChevronDown, LogOut, Settings,
  Shield, BarChart3, HelpCircle, Heart, Info, UserCircle,
  Sliders, ExternalLink,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { mockNotificaciones } from "../../../data/admin/mockData";

export default function AdminHeader({ adminNombre, onLogout, onMenuToggle }) {
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
      case "refugio": return "Building2";
      case "reporte": return "Flag";
      case "pqrs": return "HelpCircle";
      case "pedido": return "ShoppingCart";
      case "admin": return "Shield";
      default: return "MessageSquare";
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
      navigate("/admin/dashboard");
      setBusqueda("");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setPerfilOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Botón menú hamburguesa (móvil) + Buscador */}
        <div className="flex items-center gap-3 flex-1">
          {/* Hamburguesa móvil */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Buscador */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden sm:block">
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
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-1.5 ml-4">
          {/* Modo oscuro */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-all duration-200 hover:scale-105 active:scale-95"
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notificaciones */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificacionesOpen(!notificacionesOpen)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Bell size={18} />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-dark-card">
                  {notificacionesNoLeidas > 9 ? "9+" : notificacionesNoLeidas}
                </span>
              )}
            </button>

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
                          <Bell size={16} />
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

          {/* Perfil - Solo avatar */}
          <div className="relative" ref={perfilRef}>
            <button
              onClick={() => setPerfilOpen(!perfilOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-border transition-all duration-200 hover:scale-105 active:scale-95"
              title="Menú de administrador"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center text-xs font-bold text-rose-600 dark:text-rose-400">
                {adminNombre?.[0] || "A"}
              </div>
            </button>

            {perfilOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border animate-scale-in overflow-hidden">
                {/* Header del menú */}
                <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center text-sm font-bold text-rose-600 dark:text-rose-400">
                      {adminNombre?.[0] || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-dark-text truncate">
                        {adminNombre || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">
                        admin@adoptify.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  {/* ===== MI CUENTA ===== */}
                  <div className="px-3 pt-2 pb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary">
                      Mi cuenta
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/admin/usuarios")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <UserCircle size={16} />
                    Perfil
                  </button>
                  <button
                    onClick={() => handleNavigation("/admin/configuracion")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <Settings size={16} />
                    Configuración
                  </button>
                  <button
                    onClick={() => handleNavigation("/admin/configuracion")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <Sliders size={16} />
                    Preferencias
                  </button>

                  {/* ===== GESTIÓN ===== */}
                  <div className="border-t border-gray-100 dark:border-dark-border mt-2 pt-2 px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary">
                      Gestión
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/admin/administradores")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <Shield size={16} />
                    Administradores
                  </button>
                  <button
                    onClick={() => handleNavigation("/admin/estadisticas")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <BarChart3 size={16} />
                    Estadísticas
                  </button>
                  <button
                    onClick={() => handleNavigation("/admin/pqrs")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <HelpCircle size={16} />
                    PQRS
                  </button>

                  {/* ===== SISTEMA ===== */}
                  <div className="border-t border-gray-100 dark:border-dark-border mt-2 pt-2 px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary">
                      Sistema
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/admin/usuarios")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <Heart size={16} />
                    Centro de ayuda
                  </button>
                  <button
                    onClick={() => handleNavigation("/admin/dashboard")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-900 dark:hover:text-dark-text transition-all duration-150"
                  >
                    <Info size={16} />
                    Acerca de Adoptify
                  </button>

                  {/* ===== SESIÓN ===== */}
                  <div className="border-t border-gray-100 dark:border-dark-border mt-2 pt-2 px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary">
                      Sesión
                    </p>
                  </div>
                  <button
                    onClick={() => { onLogout(); setPerfilOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150 mt-1"
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
