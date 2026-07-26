import React from "react";
import {
  Users, Building2, PawPrint, Heart, Store, ShoppingCart,
  MessageSquare, Flag, HelpCircle, TrendingUp, Calendar,
  Download,
} from "lucide-react";
import { mockDashboardStats, mockGraficas, mockRefugios, mockMascotasAdmin, mockProductosAdmin, mockPedidos, mockForoAdmin, mockReportes, mockPQRS } from "../../data/admin/mockData";

// ========================================================
// Mini Sparkline SVG Component
// ========================================================
function SparklineChart({ data, color = "rose", height = 48, width = "100%" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  const gradientId = `sparkline-bg-${Math.random().toString(36).substr(2, 9)}`;

  const colorMap = {
    rose: { stroke: "#f43f5e", from: "#f43f5e" },
    emerald: { stroke: "#10b981", from: "#10b981" },
    amber: { stroke: "#f59e0b", from: "#f59e0b" },
    blue: { stroke: "#3b82f6", from: "#3b82f6" },
    violet: { stroke: "#8b5cf6", from: "#8b5cf6" },
    orange: { stroke: "#f97316", from: "#f97316" },
    cyan: { stroke: "#06b6d4", from: "#06b6d4" },
  };

  const colors = colorMap[color] || colorMap.rose;

  return (
    <svg width={width} height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.2" />
          <stop offset="100%" stopColor={colors.from} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={colors.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-line"
        style={{ strokeDasharray: "1000", strokeDashoffset: "0" }}
      />
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

// ========================================================
// Modern Bar Chart Component
// ========================================================
function ModernBarChart({ data, labels, color = "rose", height = 180, title, icon: Icono, total }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);

  const colorMap = {
    rose: { bar: "bg-rose-400 dark:bg-rose-500", hover: "hover:bg-rose-500", gradient: "from-rose-400 to-rose-300 dark:from-rose-600 dark:to-rose-500" },
    emerald: { bar: "bg-emerald-400 dark:bg-emerald-500", hover: "hover:bg-emerald-500", gradient: "from-emerald-400 to-emerald-300 dark:from-emerald-600 dark:to-emerald-500" },
    amber: { bar: "bg-amber-400 dark:bg-amber-500", hover: "hover:bg-amber-500", gradient: "from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-500" },
    blue: { bar: "bg-blue-400 dark:bg-blue-500", hover: "hover:bg-blue-500", gradient: "from-blue-400 to-blue-300 dark:from-blue-600 dark:to-blue-500" },
    violet: { bar: "bg-violet-400 dark:bg-violet-500", hover: "hover:bg-violet-500", gradient: "from-violet-400 to-violet-300 dark:from-violet-600 dark:to-violet-500" },
    orange: { bar: "bg-orange-400 dark:bg-orange-500", hover: "hover:bg-orange-500", gradient: "from-orange-400 to-orange-300 dark:from-orange-600 dark:to-orange-500" },
    cyan: { bar: "bg-cyan-400 dark:bg-cyan-500", hover: "hover:bg-cyan-500", gradient: "from-cyan-400 to-cyan-300 dark:from-cyan-600 dark:to-cyan-500" },
  };

  const colors = colorMap[color] || colorMap.rose;

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${color}-50 dark:bg-${color}-500/10`}
            style={{
              backgroundColor: color === "rose" ? "#fff1f2" : 
                              color === "emerald" ? "#ecfdf5" : 
                              color === "amber" ? "#fffbeb" : 
                              color === "blue" ? "#eff6ff" : 
                              color === "violet" ? "#f5f3ff" :
                              color === "orange" ? "#fff7ed" : "#ecfeff"
            }}
          >
            {Icono && <Icono size={16} className={`text-${color}-500`}
              style={{
                color: color === "rose" ? "#f43f5e" : 
                       color === "emerald" ? "#10b981" : 
                       color === "amber" ? "#f59e0b" : 
                       color === "blue" ? "#3b82f6" : 
                       color === "violet" ? "#8b5cf6" :
                       color === "orange" ? "#f97316" : "#06b6d4"
              }}
            />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">{title}</h3>
            <p className="text-[11px] text-gray-400 dark:text-dark-text-secondary">
              Total: <span className="font-semibold text-gray-600 dark:text-dark-text">{total || data.reduce((a, b) => a + b, 0)}</span>
            </p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
          <Download size={14} />
        </button>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-1.5 mb-2" style={{ height }}>
        {data.map((valor, i) => {
          const altura = (valor / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end group">
              <span className="text-[9px] font-semibold text-gray-400 dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                {valor}
              </span>
              <div
                style={{ height: `${Math.max(altura, 4)}%` }}
                className={`
                  w-full rounded-t-md transition-all duration-500 ease-out cursor-pointer relative overflow-hidden
                  ${colors.bar}
                  ${colors.hover}
                  group-hover:brightness-110
                  group-hover:scale-y-[1.02] group-hover:origin-bottom
                `}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      {labels && (
        <div className="flex justify-between text-[9px] text-gray-400 dark:text-dark-text-secondary pt-1 border-t border-gray-50 dark:border-dark-border">
          {labels.map((l, i) => (
            <span key={i} className="truncate px-0.5">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================================
// Stat Widget with Sparkline
// ========================================================
const StatWidget = ({ icon: Icono, label, total, color = "rose", sparklineData }) => {
  const iconBgMap = {
    rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-500",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-500",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
    violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-500",
    orange: "bg-orange-50 dark:bg-orange-500/10 text-orange-500",
    cyan: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500",
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBgMap[color] || iconBgMap.rose}`}>
          <Icono size={18} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{total}</p>
        </div>
      </div>
      {sparklineData && sparklineData.length > 0 && (
        <div className="opacity-50 group-hover:opacity-80 transition-opacity duration-300">
          <SparklineChart data={sparklineData} color={color} height={28} />
        </div>
      )}
    </div>
  );
};

// ========================================================
// Página de Estadísticas
// ========================================================
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

  // Preparar sparklines para cada widget
  const sparklineMap = {
    Usuarios: mockGraficas?.usuariosRegistrados?.data || [],
    Adopciones: mockGraficas?.adopciones?.data || [],
    Foro: mockGraficas?.foroActividad?.publicaciones || [],
    Mascotas: mockGraficas?.adopciones?.data?.slice().reverse() || [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Estadísticas</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary ml-11">
          Visualiza las estadísticas generales de la plataforma
        </p>
      </div>

      {/* Resumen rápido con sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sections.map((sec, i) => (
          <div
            key={i}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <StatWidget
              icono={sec.icon}
              label={sec.titulo}
              total={sec.total}
              color={sec.color}
              sparklineData={sparklineMap[sec.titulo]}
            />
          </div>
        ))}
      </div>

      {/* Gráficas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Usuarios Registrados por Mes */}
        <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <ModernBarChart
            title="Usuarios Registrados por Mes"
            icon={Users}
            data={mockGraficas.usuariosRegistrados.data}
            labels={mockGraficas.usuariosRegistrados.labels}
            color="rose"
            height={180}
            total={mockDashboardStats.usuariosRegistrados.total}
          />
        </div>

        {/* Mascotas Adoptadas */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ModernBarChart
            title="Mascotas Adoptadas"
            icon={Heart}
            data={mockGraficas.adopciones.data}
            labels={mockGraficas.adopciones.labels}
            color="emerald"
            height={180}
            total={mockDashboardStats.mascotasAdoptadas.total}
          />
        </div>

        {/* Solicitudes de Adopción - usando datos de foro como ejemplo */}
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <ModernBarChart
            title="Solicitudes de Adopción"
            icon={PawPrint}
            data={mockGraficas.foroActividad.publicaciones}
            labels={mockGraficas.foroActividad.labels}
            color="violet"
            height={180}
            total={mockDashboardStats.mascotasAdoptadas.total}
          />
        </div>

        {/* Productos Publicados */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <ModernBarChart
            title="Productos Publicados"
            icon={Store}
            data={mockGraficas.foroActividad.comentarios}
            labels={mockGraficas.foroActividad.labels}
            color="blue"
            height={180}
            total={mockProductosAdmin.length}
          />
        </div>

        {/* Actividad del Foro - Chart doble */}
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.35s" }}>
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-500/10">
                  <MessageSquare size={16} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Actividad del Foro</h3>
                  <p className="text-[11px] text-gray-400 dark:text-dark-text-secondary">
                    Publicaciones vs Comentarios
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-gray-500 dark:text-dark-text-secondary">Publicaciones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                  <span className="text-gray-500 dark:text-dark-text-secondary">Comentarios</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Publicaciones */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-3">
                  Publicaciones
                </p>
                <div className="flex items-end gap-1.5" style={{ height: 120 }}>
                  {mockGraficas.foroActividad.publicaciones.map((valor, i) => {
                    const max = Math.max(...mockGraficas.foroActividad.publicaciones);
                    const altura = (valor / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end group">
                        <span className="text-[8px] font-medium text-gray-400 dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                          {valor}
                        </span>
                        <div
                          style={{ height: `${altura}%` }}
                          className="w-full rounded-t-sm bg-amber-400 dark:bg-amber-500 transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-gray-400 dark:text-dark-text-secondary mt-1.5">
                  {mockGraficas.foroActividad.labels.map((l, i) => (
                    <span key={i}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-3">
                  Comentarios
                </p>
                <div className="flex items-end gap-1.5" style={{ height: 120 }}>
                  {mockGraficas.foroActividad.comentarios.map((valor, i) => {
                    const max = Math.max(...mockGraficas.foroActividad.comentarios);
                    const altura = (valor / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end group">
                        <span className="text-[8px] font-medium text-gray-400 dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                          {valor}
                        </span>
                        <div
                          style={{ height: `${altura}%` }}
                          className="w-full rounded-t-sm bg-violet-400 dark:bg-violet-500 transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-gray-400 dark:text-dark-text-secondary mt-1.5">
                  {mockGraficas.foroActividad.labels.map((l, i) => (
                    <span key={i}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
