import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Sun, Moon, ChevronDown, LogOut, Settings,
  Building2, Flag, HelpCircle, ShoppingCart, MessageSquare, Shield,
  PawPrint, UserPlus,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { listarNotificaciones, marcarLeida, marcarTodasLeidas } from "../../../api/notificaciones";

// Icono y color segun el tipo de notificacion
const getTipoIcon = (tipo) => {
  const map = {
    nuevo_refugio: Building2,
    nuevo_usuario: UserPlus,
    nueva_mascota: PawPrint,
    nueva_solicitud: MessageSquare,
    reporte: Flag,
    pqrs: HelpCircle,
    pedido: ShoppingCart,
    admin: Shield,
  };
  return map[tipo] || MessageSquare;
};

const getTipoColor = (tipo) => {
  const map = {
    nuevo_refugio: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    nuevo_usuario: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    nueva_mascota: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    nueva_solicitud: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    reporte: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    pqrs: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  };
  return map[tipo] || "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400";
};

export default function AdminHeader({ adminNombre, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const notifRef = useRef(null);
  const perfilRef = useRef(null);

  // --- Notificaciones reales ---
  const [notifs, setNotifs] = useState([]);
  const noLeidas = notifs.filter((n) => !n.leida).length;

  const cargarNotifs = useCallback(async () => {
    try {
      const data = await listarNotificaciones();
      setNotifs(data);
    } catch {
      // Silencioso: no interrumpe la navegacion si el token expiro
    }
  }, []);

  // Carga inicial y refresca cada 30 segundos
  useEffect(() => {
    cargarNotifs();
    const timer = setInterval(cargarNotifs, 30000);
    return () => clearInterval(timer);
  }, [cargarNotifs]);

  const handleClickNotif = async (notif) => {
    if (!notif.leida) {
      await marcarLeida(notif.id);
      setNotifs((prev) => prev.map((n) => (n.id === notif.id ? { ...n, leida: true } : n)));
    }
    if (notif.enlace) navigate(notif.enlace);
    setNotifOpen(false);
  };

  const handleMarcarTodas = async () => {
    await marcarTodasLeidas();
    setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const h = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (perfilRef.current && !perfilRef.current.contains(e.target)) setPerfilOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Buscador */}
        <form onSubmit={(e) => { e.preventDefault(); setBusqueda(""); }} className="flex-1 max-w-md">
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

        <div className="flex items-center gap-2 ml-4">
          {/* Tema */}
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notificaciones reales */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark-border dark:hover:text-dark-text-secondary transition-colors">
              <Bell size={18} />
              {noLeidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {noLeidas > 9 ? "9+" : noLeidas}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Notificaciones</h3>
                  {noLeidas > 0 && (
                    <button onClick={handleMarcarTodas} className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                      Marcar todas leídas
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400">Sin notificaciones</div>
                  ) : (
                    notifs.slice(0, 8).map((n) => {
                      const Icono = getTipoIcon(n.tipo);
                      return (
                        <button key={n.id} onClick={() => handleClickNotif(n)}
                          className={`w-full text-left p-3 flex items-start gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-dark-border ${!n.leida ? "bg-rose-50/30 dark:bg-rose-500/5" : ""}`}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${getTipoColor(n.tipo)}`}>
                            <Icono size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!n.leida ? "font-semibold" : "font-medium"} text-gray-900 dark:text-dark-text truncate`}>
                              {n.mensaje}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {n.creado_en ? new Date(n.creado_en).toLocaleDateString("es-CO", { hour: "2-digit", minute: "2-digit" }) : ""}
                            </p>
                          </div>
                          {!n.leida && <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-2" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Perfil */}
          <div className="relative" ref={perfilRef}>
            <button onClick={() => setPerfilOpen(!perfilOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center text-xs font-bold text-rose-600 dark:text-rose-400">
                {adminNombre?.[0] || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-dark-text leading-tight">{adminNombre || "Admin"}</p>
                <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary leading-tight">Administrador</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </button>

            {perfilOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 dark:border-dark-border">
                  <p className="text-sm font-bold text-gray-900 dark:text-dark-text">{adminNombre || "Admin"}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Administrador</p>
                </div>
                <div className="p-1">
                  <button onClick={() => { navigate("/admin/configuracion"); setPerfilOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    <Settings size={16} /> Configuración
                  </button>
                  <button onClick={() => { onLogout(); setPerfilOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <LogOut size={16} /> Cerrar sesión
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
