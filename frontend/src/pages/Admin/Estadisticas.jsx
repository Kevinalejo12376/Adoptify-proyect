import React from "react";
import {
  Users, Building2, PawPrint, Heart, Store, ShoppingCart,
  MessageSquare, Flag, HelpCircle,
} from "lucide-react";
import { mockDashboardStats, mockGraficas, mockRefugios, mockMascotasAdmin, mockProductosAdmin, mockPedidos, mockForoAdmin, mockReportes, mockPQRS } from "../../data/admin/mockData";

function BarChart({ data, label, color = "rose", height = 48 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((valor, i) => {
        const altura = ((valor - min) / range) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium text-gray-500 dark:text-dark-text-secondary">{valor}</span>
            <div
              style={{ height: `${Math.max(altura, 8)}%` }}
              className={`w-full rounded-md transition-all duration-300 ${
                color === "rose" ? "bg-rose-400 dark:bg-rose-500" :
                color === "emerald" ? "bg-emerald-400 dark:bg-emerald-500" :
                color === "amber" ? "bg-amber-400 dark:bg-amber-500" :
                color === "blue" ? "bg-blue-400 dark:bg-blue-500" :
                color === "violet" ? "bg-violet-400 dark:bg-violet-500" :
                "bg-gray-400 dark:bg-gray-500"
              }`}
            />
          </div>
        );
      })}
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
  const sections = [
    {
      titulo: "Usuarios",
      icon: Users,
      color: "rose",
      data: mockGraficas.usuariosRegistrados,
      total: mockDashboardStats.usuariosRegistrados.total,
    },
    {
      titulo: "Refugios",
      icon: Building2,
      color: "emerald",
      total: mockDashboardStats.refugiosRegistrados.total,
    },
    {
      titulo: "Mascotas",
      icon: PawPrint,
      color: "amber",
      total: mockMascotasAdmin.length,
    },
    {
      titulo: "Adopciones",
      icon: Heart,
      color: "rose",
      data: mockGraficas.adopciones,
      total: mockDashboardStats.mascotasAdoptadas.total,
    },
    {
      titulo: "Marketplace",
      icon: Store,
      color: "blue",
      total: mockProductosAdmin.length,
    },
    {
      titulo: "Pedidos",
      icon: ShoppingCart,
      color: "violet",
      total: mockPedidos.length,
    },
    {
      titulo: "Foro",
      icon: MessageSquare,
      color: "amber",
      data: mockGraficas.foroActividad,
      total: mockForoAdmin.filter(p => p.estado === "visible").length,
    },
    {
      titulo: "Reportes",
      icon: Flag,
      color: "orange",
      total: mockReportes.length,
    },
    {
      titulo: "PQRS",
      icon: HelpCircle,
      color: "cyan",
      total: mockPQRS.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Estadísticas</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Visualiza las estadísticas generales de la plataforma
        </p>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sections.map((sec, i) => (
          <StatWidget key={i} icono={sec.icon} label={sec.titulo} total={sec.total} color={sec.color} />
        ))}
      </div>

      {/* Gráficas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Usuarios Registrados */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Usuarios Registrados por Mes</h3>
          </div>
          <div className="flex items-end gap-1 mb-2" style={{ height: 160 }}>
            {mockGraficas.usuariosRegistrados.data.map((valor, i) => {
              const max = Math.max(...mockGraficas.usuariosRegistrados.data);
              const altura = (valor / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end">
                  <span className="text-[10px] font-medium text-gray-500">{valor}</span>
                  <div
                    style={{ height: `${altura}%` }}
                    className="w-full rounded-md bg-gradient-to-t from-rose-400 to-rose-300 dark:from-rose-600 dark:to-rose-500 transition-all duration-300"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-dark-text-secondary">
            {mockGraficas.usuariosRegistrados.labels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        {/* Adopciones */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Adopciones por Mes</h3>
          </div>
          <div className="flex items-end gap-1 mb-2" style={{ height: 160 }}>
            {mockGraficas.adopciones.data.map((valor, i) => {
              const max = Math.max(...mockGraficas.adopciones.data);
              const altura = (valor / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end">
                  <span className="text-[10px] font-medium text-gray-500">{valor}</span>
                  <div
                    style={{ height: `${altura}%` }}
                    className="w-full rounded-md bg-gradient-to-t from-emerald-400 to-emerald-300 dark:from-emerald-600 dark:to-emerald-500 transition-all duration-300"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-dark-text-secondary">
            {mockGraficas.adopciones.labels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        {/* Actividad del Foro */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Actividad del Foro</h3>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-2">Publicaciones</p>
              <div className="flex items-end gap-1" style={{ height: 120 }}>
                {mockGraficas.foroActividad.publicaciones.map((valor, i) => {
                  const max = Math.max(...mockGraficas.foroActividad.publicaciones);
                  const altura = (valor / max) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end">
                      <span className="text-[9px] text-gray-400">{valor}</span>
                      <div style={{ height: `${altura}%` }} className="w-full rounded-sm bg-amber-400 dark:bg-amber-500" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-2">Comentarios</p>
              <div className="flex items-end gap-1" style={{ height: 120 }}>
                {mockGraficas.foroActividad.comentarios.map((valor, i) => {
                  const max = Math.max(...mockGraficas.foroActividad.comentarios);
                  const altura = (valor / max) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end">
                      <span className="text-[9px] text-gray-400">{valor}</span>
                      <div style={{ height: `${altura}%` }} className="w-full rounded-sm bg-violet-400 dark:bg-violet-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-dark-text-secondary mt-2">
            {mockGraficas.foroActividad.labels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
