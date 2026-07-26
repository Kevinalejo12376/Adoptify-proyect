import React, { useState, useEffect } from "react";
import {
  Users, Building2, PawPrint, Heart, Store, ShoppingCart,
  MessageSquare, Flag, HelpCircle, Shield, ClipboardList, Loader2, Star,
} from "lucide-react";
import {
  getEstadisticas, listarPedidos, listarReportes, listarPqrs, listarForoAdmin,
} from "../../api/admin";

// Grafica de barras simple con etiquetas (usa datos reales).
function LabeledBarChart({ items, height = 180 }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div>
      <div className="flex items-end gap-3" style={{ height }}>
        {items.map((it, i) => {
          const altura = (it.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end">
              <span className="text-xs font-semibold text-gray-600 dark:text-dark-text-secondary">{it.value}</span>
              <div
                style={{ height: `${Math.max(altura, 4)}%` }}
                className={`w-full rounded-lg bg-gradient-to-t ${it.color} transition-all duration-500`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2">
        {items.map((it, i) => (
          <span key={i} className="flex-1 text-center text-[11px] text-gray-400 dark:text-dark-text-secondary">
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const StatWidget = ({ icon: Icono, label, total, color }) => (
  <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      color === "rose" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" :
      color === "emerald" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" :
      color === "amber" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" :
      color === "blue" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" :
      color === "violet" ? "bg-violet-50 dark:bg-violet-500/10 text-violet-500" :
      color === "orange" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-500" :
      color === "cyan" ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500" :
      "bg-gray-50 dark:bg-gray-500/10 text-gray-500"
    }`}>
      <Icono size={18} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{total}</p>
    </div>
  </div>
);

export default function AdminEstadisticas() {
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState({ pedidos: 0, reportes: 0, pqrs: 0, foro: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [est, pedidos, reportes, pqrs, foro] = await Promise.all([
          getEstadisticas().catch(() => null),
          listarPedidos().catch(() => []),
          listarReportes().catch(() => []),
          listarPqrs().catch(() => []),
          listarForoAdmin().catch(() => []),
        ]);
        if (!activo) return;
        setStats(est);
        setCounts({
          pedidos: (pedidos || []).length,
          reportes: (reportes || []).length,
          pqrs: (pqrs || []).length,
          foro: (foro || []).length,
        });
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-dark-text-secondary">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  const s = stats || {};
  const enProceso = Math.max((s.mascotas || 0) - (s.mascotas_disponibles || 0) - (s.mascotas_adoptadas || 0), 0);

  const sections = [
    { titulo: "Usuarios", icon: Users, color: "rose", total: s.usuarios ?? 0 },
    { titulo: "Refugios", icon: Building2, color: "emerald", total: s.refugios ?? 0 },
    { titulo: "Administradores", icon: Shield, color: "blue", total: s.administradores ?? 0 },
    { titulo: "Mascotas", icon: PawPrint, color: "amber", total: s.mascotas ?? 0 },
    { titulo: "Adopciones", icon: Heart, color: "rose", total: s.mascotas_adoptadas ?? 0 },
    { titulo: "Solicitudes", icon: ClipboardList, color: "violet", total: s.solicitudes ?? 0 },
    { titulo: "Marketplace", icon: Store, color: "blue", total: s.productos ?? 0 },
    { titulo: "Pedidos", icon: ShoppingCart, color: "violet", total: counts.pedidos },
    { titulo: "Publicaciones foro", icon: MessageSquare, color: "amber", total: s.foro_posts ?? 0 },
    { titulo: "Reseñas", icon: Star, color: "amber", total: s.resenas ?? 0 },
    { titulo: "Reportes", icon: Flag, color: "orange", total: counts.reportes },
    { titulo: "PQRS", icon: HelpCircle, color: "cyan", total: counts.pqrs },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Estadísticas</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Datos reales de la plataforma
        </p>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sections.map((sec, i) => (
          <StatWidget key={i} icon={sec.icon} label={sec.titulo} total={sec.total} color={sec.color} />
        ))}
      </div>

      {/* Gráficas con datos reales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Mascotas por estado</h3>
          <LabeledBarChart
            items={[
              { label: "Disponibles", value: s.mascotas_disponibles ?? 0, color: "from-emerald-400 to-emerald-300 dark:from-emerald-600 dark:to-emerald-500" },
              { label: "Adoptadas", value: s.mascotas_adoptadas ?? 0, color: "from-rose-400 to-rose-300 dark:from-rose-600 dark:to-rose-500" },
              { label: "En proceso", value: enProceso, color: "from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-500" },
            ]}
          />
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Cuentas registradas</h3>
          <LabeledBarChart
            items={[
              { label: "Usuarios", value: s.usuarios ?? 0, color: "from-rose-400 to-rose-300 dark:from-rose-600 dark:to-rose-500" },
              { label: "Refugios", value: s.refugios ?? 0, color: "from-emerald-400 to-emerald-300 dark:from-emerald-600 dark:to-emerald-500" },
              { label: "Admins", value: s.administradores ?? 0, color: "from-blue-400 to-blue-300 dark:from-blue-600 dark:to-blue-500" },
            ]}
          />
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Comunidad y soporte</h3>
          <LabeledBarChart
            items={[
              { label: "Publicaciones", value: s.foro_posts ?? 0, color: "from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-500" },
              { label: "Pedidos", value: counts.pedidos, color: "from-violet-400 to-violet-300 dark:from-violet-600 dark:to-violet-500" },
              { label: "Reportes", value: counts.reportes, color: "from-orange-400 to-orange-300 dark:from-orange-600 dark:to-orange-500" },
              { label: "PQRS", value: counts.pqrs, color: "from-cyan-400 to-cyan-300 dark:from-cyan-600 dark:to-cyan-500" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
