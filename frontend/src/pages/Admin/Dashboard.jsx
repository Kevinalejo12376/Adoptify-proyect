import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Building2, PawPrint, Heart, Store, Shield, ClipboardList, Loader2,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import Badge from "../../components/admin/Badge";
import { getEstadisticas, listarUsuarios } from "../../api/admin";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [refugios, setRefugios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [est, refs] = await Promise.all([
          getEstadisticas(),
          listarUsuarios("refugio"),
        ]);
        if (!activo) return;
        setStats(est);
        setRefugios(refs.slice(0, 5));
      } catch (e) {
        if (activo) setError(e?.message || "No se pudieron cargar las estadísticas");
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">{error}</div>
    );
  }

  const statCards = [
    { titulo: "Usuarios Registrados", valor: stats.usuarios, icono: Users, color: "rose", onClick: () => navigate("/admin/usuarios") },
    { titulo: "Refugios Registrados", valor: stats.refugios, icono: Building2, color: "emerald", onClick: () => navigate("/admin/refugios") },
    { titulo: "Administradores", valor: stats.administradores, icono: Shield, color: "teal", onClick: () => navigate("/admin/administradores") },
    { titulo: "Mascotas Publicadas", valor: stats.mascotas, icono: PawPrint, color: "amber", onClick: () => navigate("/admin/mascotas") },
    { titulo: "Mascotas Disponibles", valor: stats.mascotas_disponibles, icono: PawPrint, color: "blue" },
    { titulo: "Mascotas Adoptadas", valor: stats.mascotas_adoptadas, icono: Heart, color: "rose" },
    { titulo: "Solicitudes de Adopción", valor: stats.solicitudes, icono: ClipboardList, color: "violet" },
    { titulo: "Productos Publicados", valor: stats.productos, icono: Store, color: "blue", onClick: () => navigate("/admin/marketplace") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Panel de Administración</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Datos en tiempo real de la plataforma
        </p>
      </div>

      {/* Tarjetas con conteos REALES de la base de datos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Últimos refugios registrados (reales) */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Últimos Refugios Registrados</h3>
          <button
            onClick={() => navigate("/admin/refugios")}
            className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
          >
            Ver todos
          </button>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-dark-border">
          {refugios.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No hay refugios registrados</div>
          ) : (
            refugios.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors cursor-pointer"
                onClick={() => navigate("/admin/refugios")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {(ref.refugio_nombre || ref.nombre || "?")[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{ref.refugio_nombre || ref.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{ref.ubicacion || "Sin ciudad"}</p>
                  </div>
                </div>
                <Badge estado={ref.estado} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
