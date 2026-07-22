import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint, Users, Heart, ClipboardList, MessageSquare, TrendingUp,
  Calendar, Clock, ChevronRight, ArrowUp, Building2, Dog, Cat,
  AlertCircle, CheckCircle2, XCircle, Activity, FileText,
  ShoppingBag, PackageSearch, ArrowRight, BarChart3, Target, Zap, Star, Sparkles
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ShelterDashboard() {
  const { user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    { icon: PawPrint, label: "Mascotas Registradas", value: "24", color: "from-rose-500 to-pink-500", textColor: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", progress: 80 },
    { icon: Users, label: "Solicitudes Recibidas", value: "18", color: "from-amber-500 to-orange-500", textColor: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", progress: 60 },
    { icon: Heart, label: "Adopciones Exitosas", value: "12", color: "from-emerald-500 to-teal-500", textColor: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", progress: 40 },
    { icon: ClipboardList, label: "Solicitudes Pendientes", value: "6", color: "from-violet-500 to-purple-500", textColor: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", progress: 20 },
  ];

  const isStoreEnabled = user?.settings?.storeEnabled ?? false;

  const quickActions = [
    { icon: PawPrint, label: "Registrar Mascota", to: "/refugio/mascotas", color: "from-rose-500 to-pink-500" },
    { icon: ClipboardList, label: "Ver Solicitudes", to: "/refugio/solicitudes", color: "from-emerald-500 to-teal-500" },
    { icon: FileText, label: "Nueva Publicación", to: "/refugio/foro", color: "from-amber-500 to-orange-500" },
    ...(isStoreEnabled
      ? [
          { icon: ShoppingBag, label: "Agregar Producto", to: "/refugio/tienda", color: "from-blue-500 to-cyan-500" },
          { icon: ShoppingBag, label: "Ver Pedidos", to: "/refugio/pedidos", color: "from-violet-500 to-purple-500" },
        ]
      : []),
  ];

  const recentRequests = [
    { id: 1, user: "Ana López", pet: "Max", type: "Perro", status: "pendiente", date: "14 Jul 2026", time: "10:30 AM" },
    { id: 2, user: "Carlos Ruiz", pet: "Luna", type: "Gato", status: "en revisión", date: "13 Jul 2026", time: "3:45 PM" },
    { id: 3, user: "María Fernández", pet: "Rocky", type: "Perro", status: "contactado", date: "12 Jul 2026", time: "9:15 AM" },
    { id: 4, user: "Pedro Martínez", pet: "Mimi", type: "Gato", status: "finalizada", date: "10 Jul 2026", time: "2:00 PM" },
    { id: 5, user: "Laura Gómez", pet: "Thor", type: "Perro", status: "cerrada", date: "8 Jul 2026", time: "11:30 AM" },
  ];

  const getStatusBadge = (status) => {
    const config = {
      "pendiente": { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400", icon: Clock },
      "en revisión": { color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", icon: AlertCircle },
      "contactado": { color: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400", icon: CheckCircle2 },
      "cerrada": { color: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400", icon: XCircle },
      "finalizada": { color: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400", icon: Heart },
    };
    const c = config[status] || config["pendiente"];
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${c.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-20">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-rose-950/20 dark:via-dark-bg dark:to-amber-950/20 overflow-hidden">
        <div className="w-full px-6 lg:px-10 2xl:px-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-8 pb-6 animate-fade-in-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 rounded-full text-xs font-semibold mb-3 shadow-sm">
                <Building2 className="w-3.5 h-3.5" />
                <span>Panel de Administración</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-display leading-tight">
                ¡Bienvenido, {user?.name?.split(" ")[0] || "Refugio"}!
              </h1>
              <p className="text-base text-gray-500 dark:text-dark-text-secondary mt-2 max-w-xl">
                Gestiona tu refugio, revisa solicitudes y mantén todo actualizado.
              </p>
            </div>
            <Link
              to="/refugio/mascotas"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-200/50 dark:shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-300/50 dark:hover:shadow-rose-500/30 transition-all duration-300 hover:scale-105 shrink-0 group"
            >
              <PawPrint className="w-4 h-4 transition-transform group-hover:scale-110" />
              Registrar Mascota
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Stats - gap matches the main content grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 pb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.textColor}`} />
                    </div>
                    <span className={`text-2xl font-bold ${stat.textColor} font-display`}>{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary font-medium truncate">{stat.label}</p>
                  <div className="mt-2.5 w-full bg-gray-100 dark:bg-dark-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="w-full px-6 lg:px-10 2xl:px-12">
        <div className="grid lg:grid-cols-5 gap-6 pt-6 pb-16">

          {/* ===== LEFT COLUMN (3/5) ===== */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-4 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-rose-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white font-display">Acciones Rápidas</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.to}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg/50 hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 dark:hover:from-rose-500/10 dark:hover:to-amber-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 transition-all duration-200"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden animate-fade-in-up flex-1">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white font-display">Solicitudes Recientes</h2>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Últimas solicitudes de adopción</p>
                  </div>
                </div>
                <Link
                  to="/refugio/solicitudes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all group"
                >
                  Ver todas
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-dark-bg/30">
                      <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mascota</th>
                      <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="text-right px-6 py-3.5 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-border/50">
                    {recentRequests.map((req, index) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/20 transition-colors animate-fade-in-up" style={{ animationDelay: `${index * 0.04}s` }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                              {req.user.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{req.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${req.type === "Perro" ? "bg-rose-50 dark:bg-rose-500/10" : "bg-amber-50 dark:bg-amber-500/10"}`}>
                              {req.type === "Perro" ? (
                                <Dog className="w-4 h-4 text-rose-500" />
                              ) : (
                                <Cat className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{req.pet}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 dark:text-dark-text-secondary whitespace-nowrap">
                            {req.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to="/refugio/solicitudes"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                          >
                            Gestionar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN (2/5) ===== */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Pet Overview */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">Resumen de Mascotas</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Dog, label: "Perros", value: "14", barColor: "from-rose-400 to-pink-500", barWidth: "70%", textColor: "text-gray-900 dark:text-white", bg: "bg-rose-50 dark:bg-rose-500/10", iconColor: "text-rose-500" },
                  { icon: Cat, label: "Gatos", value: "10", barColor: "from-amber-400 to-orange-500", barWidth: "50%", textColor: "text-gray-900 dark:text-white", bg: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-500" },
                  { icon: Heart, label: "Adoptados", value: "12", barColor: "from-emerald-400 to-teal-500", barWidth: "60%", textColor: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-500" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${item.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-28 h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${item.barColor}`} style={{ width: item.barWidth }} />
                        </div>
                        <span className={`text-base font-bold ${item.textColor} font-display w-8 text-right`}>{item.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/refugio/mascotas"
                className="mt-5 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
              >
                Ver todas las mascotas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Upcoming Activities */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">Próximas Actividades</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: ClipboardList, title: "Revisar solicitud de Ana López", time: "Hoy - 10:30 AM", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                  { icon: Heart, title: "Seguimiento adopción de Rocky", time: "Mañana - 2:00 PM", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
                  { icon: PawPrint, title: "Registrar nueva mascota", time: "17 Jul - 9:00 AM", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-all cursor-pointer group">
                      <div className={`w-10 h-10 rounded-xl ${activity.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{activity.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className={`w-3.5 h-3.5 ${activity.color}`} />
                          <span className={`text-xs font-semibold ${activity.color}`}>{activity.time}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center animate-fade-in-up group"
        >
          <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
}
