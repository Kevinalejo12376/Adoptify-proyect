import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Heart, MessageSquare, PawPrint, ShoppingBag, AlertCircle,
  CheckCircle2, Clock, ChevronRight, Info, X, ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Sample notification data - in production this would come from an API/context
const getInitialNotifications = () => [
  {
    id: 1,
    type: "request",
    title: "Nueva solicitud de adopción",
    description: "Ana López ha solicitado adoptar a Max",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    icon: Heart,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    link: "/refugio/solicitudes",
  },
  {
    id: 2,
    type: "comment",
    title: "Nuevo comentario en tu publicación",
    description: "Carlos Ruiz comentó en tu publicación del foro",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    link: "/refugio/foro",
  },
  {
    id: 3,
    type: "reaction",
    title: "Reacción a tu publicación",
    description: "A María Fernández le gustó tu publicación",
    time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    icon: Heart,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    link: "/refugio/foro",
  },
  {
    id: 4,
    type: "pet",
    title: "Mascota actualizada",
    description: "Luna ha sido marcada como adoptada",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    icon: PawPrint,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    link: "/refugio/mascotas",
  },
  {
    id: 5,
    type: "system",
    title: "Actualización del sistema",
    description: "Nueva versión de Adoptify disponible con mejoras",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    icon: Info,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    link: "#",
  },
  {
    id: 6,
    type: "product",
    title: "Producto vendido",
    description: "Collar para perro ha sido comprado en tu tienda",
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    icon: ShoppingBag,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    link: "/refugio/tienda",
  },
];

const getRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Hace un momento";
  if (diffMin < 60) return `Hace ${diffMin} ${diffMin === 1 ? "minuto" : "minutos"}`;
  if (diffHour < 24) return `Hace ${diffHour} ${diffHour === 1 ? "hora" : "horas"}`;
  if (diffDay < 7) return `Hace ${diffDay} ${diffDay === 1 ? "día" : "días"}`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

export default function NotificationPanel() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(getInitialNotifications);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isDark
            ? "text-gray-300 hover:text-rose-400 hover:bg-white/5"
            : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
        } ${isOpen ? (isDark ? "bg-white/5 text-rose-400" : "bg-rose-50 text-rose-600") : ""}`}
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold rounded-full px-1 shadow-lg shadow-rose-500/30 animate-scale-in">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-modal-overlay"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={panelRef}
            className={`
              fixed md:absolute top-0 md:top-full right-0 md:right-0 z-50
              w-full md:w-[400px] h-full md:h-auto md:mt-2
              flex flex-col
              ${isDark
                ? "bg-[#16181D] border border-white/5 shadow-2xl shadow-black/40"
                : "bg-white border border-gray-100 shadow-2xl shadow-black/10"
              }
              md:rounded-2xl md:animate-scale-in
              animate-slide-in-right
            `}
            style={{
              transformOrigin: "top right",
            }}
          >
            {/* Header */}
            <div className={`
              flex items-center justify-between px-5 py-4 border-b shrink-0
              ${isDark ? "border-white/5" : "border-gray-100"}
            `}>
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${isDark ? "bg-rose-500/10" : "bg-rose-50"}
                `}>
                  <Bell className={`w-5 h-5 ${isDark ? "text-rose-400" : "text-rose-600"}`} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"} font-display`}>
                    Notificaciones
                  </h3>
                  {unreadCount > 0 && (
                    <p className={`text-xs ${isDark ? "text-rose-400" : "text-rose-600"} font-medium`}>
                      {unreadCount} {unreadCount === 1 ? "sin leer" : "sin leer"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={`
                      text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200
                      ${isDark
                        ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                        : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                      }
                    `}
                  >
                    Marcar leídas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}
                  `}
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List - max 2 visible */}
            <div className="overflow-y-auto overscroll-contain max-h-[220px]" style={{ scrollbarWidth: "thin", scrollbarColor: isDark ? "#2a2a3a transparent" : "#e5e7eb transparent" }}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                    ${isDark ? "bg-gray-800/50" : "bg-gray-50"}
                  `}>
                    <Bell className={`w-7 h-7 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                  </div>
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    No hay notificaciones
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Las notificaciones aparecerán aquí cuando tengas actividad
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((notification, index) => {
                    const Icon = notification.icon;
                    const isUnread = !notification.read;
                    return (
                      <Link
                        key={notification.id}
                        to={notification.link}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`
                          flex items-start gap-3.5 px-5 py-4 transition-all duration-200 group
                          ${isUnread
                            ? isDark
                              ? "bg-rose-500/[0.03] hover:bg-rose-500/[0.07]"
                              : "bg-rose-50/40 hover:bg-rose-50"
                            : isDark
                              ? "hover:bg-white/[0.02]"
                              : "hover:bg-gray-50"
                          }
                          ${index !== notifications.length - 1
                            ? isDark ? "border-b border-white/[0.03]" : "border-b border-gray-50"
                            : ""
                          }
                          animate-fade-in-up
                        `}
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        {/* Unread indicator dot */}
                        {isUnread && (
                          <div className="absolute left-[14px] top-[22px] w-2 h-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 shadow-sm shadow-rose-500/30" />
                        )}

                        {/* Icon */}
                        <div className={`
                          w-10 h-10 rounded-xl ${notification.iconBg} flex items-center justify-center shrink-0
                          transition-transform group-hover:scale-110
                          ${isUnread ? "ring-2 ring-rose-500/20" : ""}
                        `}>
                          <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`
                            text-sm leading-snug line-clamp-1
                            ${isUnread
                              ? isDark ? "text-white font-semibold" : "text-gray-900 font-semibold"
                              : isDark ? "text-gray-300" : "text-gray-700"
                            }
                          `}>
                            {notification.title}
                          </p>
                          <p className={`
                            text-xs mt-0.5 line-clamp-1 leading-relaxed
                            ${isDark ? "text-gray-500" : "text-gray-500"}
                          `}>
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Clock className={`w-3 h-3 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                            <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"} font-medium`}>
                              {getRelativeTime(notification.time)}
                            </span>
                          </div>
                        </div>

                        {/* Action icon */}
                        <div className={`
                          w-6 h-6 rounded-lg flex items-center justify-center shrink-0
                          opacity-0 group-hover:opacity-100 transition-all
                          ${isDark ? "text-gray-600 group-hover:text-gray-400" : "text-gray-300 group-hover:text-gray-500"}
                        `}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`
                px-5 py-3 border-t shrink-0
                ${isDark ? "border-white/5" : "border-gray-100"}
              `}>
                <Link
                  to="/refugio/solicitudes"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group
                    ${isDark
                      ? "text-rose-400 bg-rose-500/5 hover:bg-rose-500/10"
                      : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                    }
                  `}
                >
                  <span>Ver todas las notificaciones</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
