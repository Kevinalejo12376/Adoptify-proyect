import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, PawPrint, Store, ShoppingCart,
  MessageSquare, Flag, HelpCircle, Shield, BarChart3, ClipboardList,
  Settings, ChevronLeft, ChevronRight, LogOut, PawPrint as LogoIcon,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Usuarios", path: "/admin/usuarios" },
  { icon: Building2, label: "Refugios", path: "/admin/refugios" },
  { icon: PawPrint, label: "Mascotas", path: "/admin/mascotas" },
  { icon: Store, label: "Marketplace", path: "/admin/marketplace" },
  { icon: ShoppingCart, label: "Pedidos", path: "/admin/pedidos" },
  { icon: MessageSquare, label: "Foro", path: "/admin/foro" },
  { icon: Flag, label: "Reportes", path: "/admin/reportes" },
  { icon: HelpCircle, label: "PQRS", path: "/admin/pqrs" },
  { icon: Shield, label: "Administradores", path: "/admin/administradores" },
  { icon: BarChart3, label: "Estadísticas", path: "/admin/estadisticas" },
  { icon: ClipboardList, label: "Auditoría", path: "/admin/auditoria" },
  { icon: Settings, label: "Configuración", path: "/admin/configuracion" },
];

export default function AdminSidebar({ collapsed, onToggle, adminNombre, onLogout }) {
  const location = useLocation();

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-50
          bg-white dark:bg-dark-card
          border-r border-gray-100 dark:border-dark-border
          transition-all duration-300 ease-in-out
          hidden lg:flex flex-col
          ${collapsed ? "w-[72px]" : "w-[260px]"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 h-16 border-b border-gray-100 dark:border-dark-border`}>
          <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center flex-shrink-0">
              <LogoIcon size={16} className="text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-dark-text truncate">
                  Adoptify
                </p>
                <p className="text-[10px] font-medium text-gray-400 dark:text-dark-text-secondary truncate leading-tight">
                  Panel Admin
                </p>
              </div>
            )}
          </NavLink>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm shadow-rose-500/20"
                      : "text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border hover:text-gray-700 dark:hover:text-dark-text"
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`flex-shrink-0 transition-all ${isActive ? "text-white" : ""}`}
                />
                {!collapsed && (
                  <span className={`text-sm font-medium transition-all ${isActive ? "text-white" : ""}`}>
                    {item.label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-white/70" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Info Admin + Cerrar sesión */}
        <div className="border-t border-gray-100 dark:border-dark-border p-3">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center text-xs font-bold text-rose-600 dark:text-rose-400 flex-shrink-0">
                  {adminNombre?.[0] || "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-dark-text truncate">
                    {adminNombre || "Admin"}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary truncate">
                    Administrador
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors"
              title="Expandir"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border safe-area-bottom">
        <div className="flex overflow-x-auto scrollbar-hide px-1 py-1">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[60px] transition-colors
                  ${isActive ? "text-rose-500" : "text-gray-400 dark:text-dark-text-secondary"}
                `}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
