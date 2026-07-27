import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, X, Eye, Edit3, Lock, Unlock,
  Trash2, KeyRound, Shield, Mail, UserCheck, Search,
  Calendar, Phone, MapPin, Clock, PawPrint, Heart,
  FileText, AlertTriangle, Loader2,
} from "lucide-react";
import Badge from "../../../components/admin/Badge";
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../../../api/admin";

// ========================================================
// GENERADOR DE AVATARES CON INICIALES Y COLORES PASTEL
// ========================================================
const AVATAR_COLORS = [
  { bg: "bg-red-100", text: "text-red-600", darkBg: "dark:bg-red-500/15", darkText: "dark:text-red-400" },
  { bg: "bg-blue-100", text: "text-blue-600", darkBg: "dark:bg-blue-500/15", darkText: "dark:text-blue-400" },
  { bg: "bg-green-100", text: "text-green-600", darkBg: "dark:bg-green-500/15", darkText: "dark:text-green-400" },
  { bg: "bg-purple-100", text: "text-purple-600", darkBg: "dark:bg-purple-500/15", darkText: "dark:text-purple-400" },
  { bg: "bg-amber-100", text: "text-amber-600", darkBg: "dark:bg-amber-500/15", darkText: "dark:text-amber-400" },
  { bg: "bg-teal-100", text: "text-teal-600", darkBg: "dark:bg-teal-500/15", darkText: "dark:text-teal-400" },
  { bg: "bg-pink-100", text: "text-pink-600", darkBg: "dark:bg-pink-500/15", darkText: "dark:text-pink-400" },
  { bg: "bg-indigo-100", text: "text-indigo-600", darkBg: "dark:bg-indigo-500/15", darkText: "dark:text-indigo-400" },
  { bg: "bg-orange-100", text: "text-orange-600", darkBg: "dark:bg-orange-500/15", darkText: "dark:text-orange-400" },
  { bg: "bg-cyan-100", text: "text-cyan-600", darkBg: "dark:bg-cyan-500/15", darkText: "dark:text-cyan-400" },
  { bg: "bg-lime-100", text: "text-lime-600", darkBg: "dark:bg-lime-500/15", darkText: "dark:text-lime-400" },
  { bg: "bg-violet-100", text: "text-violet-600", darkBg: "dark:bg-violet-500/15", darkText: "dark:text-violet-400" },
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

function UserAvatar({ name, size = "md", className = "" }) {
  const colors = getAvatarColor(name);
  const initials = getInitials(name);

  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-bold flex-shrink-0
        ${sizeMap[size] || sizeMap.md}
        ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}

// ========================================================
// BADGE DE ESTADO CON CÍRCULO DE COLOR
// ========================================================
const estadoConfig = {
  activo: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    label: "Activo",
  },
  pendiente: {
    dot: "bg-amber-400",
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    label: "Pendiente",
  },
  suspendido: {
    dot: "bg-red-500",
    bg: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    label: "Suspendido",
  },
  eliminado: {
    dot: "bg-gray-400",
    bg: "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
    label: "Eliminado",
  },
};

function StatusBadge({ estado }) {
  const config = estadoConfig[estado] || estadoConfig.pendiente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ========================================================
// BADGE DE ROL
// ========================================================
function RolBadge({ rol }) {
  const rolMap = {
    usuario: { label: "Usuario", bg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
    administrador: { label: "Admin", bg: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
    administrador_principal: { label: "Super Admin", bg: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
    refugio: { label: "Refugio", bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    tienda: { label: "Tienda", bg: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
  };
  const config = rolMap[rol] || { label: rol, bg: "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${config.bg}`}>
      {config.label}
    </span>
  );
}

// ========================================================
// TOAST NOTIFICATION
// ========================================================
function Toast({ message, type = "success", isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    error: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400",
    warning: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up-fade">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-lg backdrop-blur-sm ${typeStyles[type] || typeStyles.success}`}>
        {type === "success" && <UserCheck size={18} />}
        {type === "error" && <AlertTriangle size={18} />}
        {type === "warning" && <AlertTriangle size={18} />}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

// ========================================================
// MODAL VIEW USER (con acciones avanzadas internas)
// ========================================================
function ViewUserModal({ user, onClose, onEdit, onSuspend, onDelete, onResetPassword, onChangeRole, onSendEmail, soloVisualizacion = false }) {
  if (!user) return null;

  const infoRows = [
    { icon: Mail, label: "Correo electrónico", value: user.email },
    { icon: Phone, label: "Teléfono", value: user.telefono || "No registrado" },
    { icon: MapPin, label: "Ciudad", value: user.ubicacion || user.ciudad || "No registrada" },
    { icon: MapPin, label: "Dirección", value: user.direccion || "No registrada" },
    { icon: Calendar, label: "Fecha de registro", value: user.creado_en || user.fechaRegistro || "Desconocida" },
    { icon: Clock, label: "Último inicio de sesión", value: user.ultimoAcceso || "Nunca" },
  ];

  const stats = [
    { icon: PawPrint, label: "Mascotas publicadas", value: user.mascotasPublicadas ?? user.publicaciones ?? 0, color: "amber" },
    { icon: Heart, label: "Adopciones realizadas", value: user.mascotasAdoptadas ?? 0, color: "rose" },
    { icon: FileText, label: "Solicitudes activas", value: user.solicitudesActivas ?? 0, color: "blue" },
  ];

  const advancedActions = [
    { icon: KeyRound, label: "Restablecer contraseña", action: () => onResetPassword(user), color: "text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10" },
    { icon: Shield, label: "Cambiar rol", action: () => onChangeRole(user), color: "text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10" },
    { icon: Mail, label: "Enviar correo", action: () => onSendEmail(user), color: "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "Desconocida";
    try {
      return new Date(dateStr).toLocaleDateString("es-CO", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const colorMap = {
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-overlay" />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card rounded-2xl shadow-2xl animate-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con degradado */}
        <div className="relative h-28 bg-gradient-to-r from-rose-500 to-amber-500 rounded-t-2xl" />

        {/* Avatar superpuesto */}
        <div className="absolute top-16 left-6">
          <UserAvatar name={user.nombre} size="xl" className="ring-4 ring-white dark:ring-dark-card shadow-lg" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Info principal */}
        <div className="pt-14 px-6 pb-4 border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                {user.nombre || "Sin nombre"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-0.5">
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge estado={user.estado || (user.activo ? "activo" : "suspendido")} />
              <RolBadge rol={user.rol} />
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="px-6 py-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary">
            Información general
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {infoRows.map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-dark-bg/50">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-dark-card flex items-center justify-center flex-shrink-0">
                  <row.icon size={14} className="text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-dark-text-secondary">{row.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text truncate">
                    {row.label === "Fecha de registro" || row.label === "Último inicio de sesión"
                      ? formatDate(row.value)
                      : row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary mb-3">
            Estadísticas
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-dark-bg/50">
                <div className={`w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center ${colorMap[stat.color]}`}>
                  <stat.icon size={14} strokeWidth={2} />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-dark-text">{stat.value}</p>
                <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones avanzadas: Restablecer contraseña, Cambiar rol, Enviar correo */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-text-secondary mb-3">
            Acciones de cuenta
          </h4>
          <div className="grid grid-cols-1 gap-1.5">
            {advancedActions.map((action, i) => {
              const Icono = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => { action.action(); onClose(); }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${action.color} text-gray-700 dark:text-dark-text-secondary hover:scale-[1.01] active:scale-95`}
                >
                  <Icono size={16} strokeWidth={1.5} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botones rápidos: Editar, Suspender, Eliminar */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex items-center gap-2">
          <button
            onClick={() => { onClose(); onEdit(user); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-200 text-sm"
          >
            <Edit3 size={15} />
            Editar
          </button>
          <button
            onClick={() => { onClose(); onSuspend(user); }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm border ${
              user.activo
                ? "border-amber-200 dark:border-amber-500/20 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                : "border-emerald-200 dark:border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            }`}
          >
            {user.activo ? <Lock size={15} /> : <Unlock size={15} />}
            {user.activo ? "Suspender" : "Reactivar"}
          </button>
          <button
            onClick={() => { onClose(); onDelete(user); }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        </div>
        {!soloVisualizacion && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex items-center gap-2">
            <button
              onClick={() => { onClose(); onEdit(user); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-200 text-sm"
            >
              <Edit3 size={15} />
              Editar
            </button>
            <button
              onClick={() => { onClose(); onSuspend(user); }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm border ${
                user.activo
                  ? "border-amber-200 dark:border-amber-500/20 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                  : "border-emerald-200 dark:border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
              }`}
            >
              {user.activo ? <Lock size={15} /> : <Unlock size={15} />}
              {user.activo ? "Suspender" : "Reactivar"}
            </button>
            <button
              onClick={() => { onClose(); onDelete(user); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              title="Eliminar"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================================
// MODAL CREATE / EDIT USER
// ========================================================
function UserFormModal({ isOpen, onClose, onSave, user, loading }) {
  const emptyForm = {
    nombre: "", apellido: "", email: "", password: "",
    telefono: "", ubicacion: "", nombre_refugio: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        const parts = (user.nombre || "").split(" ");
        setForm({
          nombre: parts[0] || "",
          apellido: parts.slice(1).join(" ") || "",
          email: user.email || "",
          password: "",
          telefono: user.telefono || "",
          ubicacion: user.ubicacion || user.ciudad || "",
          nombre_refugio: user.refugio_nombre || "",
        });
      } else {
        setForm(emptyForm);
      }
      setError(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave(form, user);
    } catch (err) {
      setError(err?.message || "Error al guardar");
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-900 dark:text-dark-text placeholder-gray-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-overlay" />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card rounded-2xl shadow-2xl animate-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center">
              {user ? <Edit3 size={18} className="text-rose-500" /> : <Plus size={18} className="text-rose-500" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">
              {user ? "Editar Usuario" : "Crear Usuario"}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1">Nombre *</label>
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputClass} placeholder="Ej: Ana" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1">Apellido</label>
              <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} className={inputClass} placeholder="Ej: Martínez" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="usuario@email.com" />
          </div>

          {!user && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1">Contraseña *</label>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="••••••••" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1">Teléfono</label>
              <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className={inputClass} placeholder="+57 300 123 4567" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1">Ciudad</label>
              <input value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} className={inputClass} placeholder="Bogotá" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-200 text-sm disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Guardando...</>
              ) : (
                <>{user ? "Guardar cambios" : "Crear cuenta"}</>
              )}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-secondary font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-all duration-200 text-sm">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========================================================
// MODAL DE CONFIRMACIÓN (suspender / eliminar)
// ========================================================
function ActionConfirmModal({ config, onClose, onConfirm, loading }) {
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-overlay" />
      <div
        className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-2xl animate-modal-content overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 pb-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.iconBg || "bg-rose-50 dark:bg-rose-500/10"}`}>
              {config.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">{config.titulo}</h3>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-0.5">{config.subtitulo}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg/50 border border-gray-100 dark:border-dark-border">
            <p className="text-sm text-gray-700 dark:text-dark-text font-medium">{config.descripcion}</p>
            {config.consecuencias && (
              <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">{config.consecuencias}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-5 pt-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-dark-text-secondary bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 ${config.btnClass}`}
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Procesando...</>
            ) : (
              <>{config.btnIcon}{config.btnText}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// COMPONENTE PRINCIPAL: GestionUsuarios
// ========================================================
export default function GestionUsuarios({
  titulo, descripcion, rolCrear, rolesFiltro,
  esRefugio = false, emptyMessage = "No se encontraron registros",
  esAdminPrincipal = true, soloVisualizacion = false,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Modales
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Confirmación
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: "", type: "success", isOpen: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, isOpen: true });
  };

  const rolesKey = rolesFiltro.join(",");
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = rolesKey.split(",");
      const data = await listarUsuarios(roles[0]);
      const filtrados = data.filter((u) => roles.includes(u.rol));
      setItems(filtrados.map((u) => ({
        ...u,
        estado: u.activo ? "activo" : "suspendido",
      })));
    } catch (e) {
      setError(e?.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [rolesKey]);

  useEffect(() => { cargar(); }, [cargar]);

  // Filtrado local
  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (item.nombre || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.telefono || "").toLowerCase().includes(q) ||
      (item.ubicacion || item.ciudad || "").toLowerCase().includes(q)
    );
  });

  // ===== CRUD HANDLERS =====
  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      await crearUsuario({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
        ubicacion: form.ubicacion,
        rol: rolCrear,
        ...(esRefugio ? { nombre_refugio: form.nombre_refugio || form.nombre } : {}),
      });
      setShowCreate(false);
      await cargar();
      showToast("Usuario creado exitosamente");
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (form, user) => {
    setFormLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await actualizarUsuario(user.id, payload);
      setEditUser(null);
      await cargar();
      showToast("Usuario actualizado exitosamente");
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleSuspendReactivate = async (user) => {
    setConfirmLoading(true);
    try {
      await actualizarUsuario(user.id, { activo: !user.activo });
      setConfirmAction(null);
      await cargar();
      showToast(
        user.activo ? "Usuario suspendido correctamente" : "Usuario reactivado correctamente",
        user.activo ? "warning" : "success"
      );
    } catch (err) {
      showToast(err?.message || "Error al procesar", "error");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDelete = async (user) => {
    setConfirmLoading(true);
    try {
      await eliminarUsuario(user.id);
      setConfirmAction(null);
      await cargar();
      showToast("Usuario eliminado permanentemente", "error");
    } catch (err) {
      showToast(err?.message || "Error al eliminar", "error");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleResetPassword = (user) => {
    showToast(`Se ha enviado un enlace para restablecer la contraseña a ${user.email}`);
  };

  const handleChangeRole = (user) => {
    showToast(`Función de cambio de rol próximamente para ${user.nombre}`, "warning");
  };

  const handleSendEmail = (user) => {
    window.location.href = `mailto:${user.email}`;
  };

  // ===== CONFIGURACIÓN DE CONFIRMACIONES =====
  const handleConfirmSuspend = (user) => {
    setConfirmAction({
      type: "suspend",
      user,
      config: {
        titulo: user.activo ? "Suspender Usuario" : "Reactivar Usuario",
        subtitulo: user.activo ? "Esta acción impedirá el inicio de sesión" : "Restaurar acceso al usuario",
        descripcion: user.activo
          ? `¿Estás seguro de suspender a "${user.nombre}"? No podrá iniciar sesión hasta que sea reactivado.`
          : `¿Deseas reactivar a "${user.nombre}"? Podrá acceder nuevamente a la plataforma.`,
        consecuencias: user.activo
          ? "El usuario no podrá acceder a su cuenta ni realizar ninguna acción en la plataforma."
          : null,
        icon: user.activo ? <Lock size={22} className="text-amber-500" /> : <Unlock size={22} className="text-emerald-500" />,
        iconBg: user.activo ? "bg-amber-50 dark:bg-amber-500/10" : "bg-emerald-50 dark:bg-emerald-500/10",
        btnText: user.activo ? "Suspender" : "Reactivar",
        btnIcon: user.activo ? <Lock size={15} /> : <Unlock size={15} />,
        btnClass: user.activo
          ? "bg-amber-500 hover:bg-amber-600 text-white"
          : "bg-emerald-500 hover:bg-emerald-600 text-white",
      },
    });
  };

  const handleConfirmDelete = (user) => {
    setConfirmAction({
      type: "delete",
      user,
      config: {
        titulo: "Eliminar Usuario",
        subtitulo: "Esta acción no se puede deshacer",
        descripcion: `¿Estás seguro de eliminar permanentemente a "${user.nombre}"? Se eliminarán todos sus datos, publicaciones y registros asociados.`,
        consecuencias: "Toda la información del usuario será eliminada de forma permanente. No podrá recuperarse.",
        icon: <Trash2 size={22} className="text-red-500" />,
        iconBg: "bg-red-50 dark:bg-red-500/10",
        btnText: "Eliminar permanentemente",
        btnIcon: <Trash2 size={15} />,
        btnClass: "bg-red-500 hover:bg-red-600 text-white",
      },
    });
  };

  // ===== RENDER =====
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/10 dark:to-amber-500/10 flex items-center justify-center">
                <UserCheck size={18} className="text-rose-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">{titulo}</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary ml-12">{descripcion}</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-200 active:scale-95"
          >
            <Plus size={18} /> Nuevo usuario
          </button>
          {!soloVisualizacion && (
            <button
              onClick={() => { setShowCreate(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-200 active:scale-95"
            >
              <Plus size={18} /> Nuevo administrador
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-500/20 flex items-center gap-2 animate-fade-in">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      {/* Buscador */}
      <div className="animate-fade-in">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border animate-pulse flex items-center gap-4 px-5">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-border" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-200 dark:bg-dark-border rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-dark-border rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-dark-bg flex items-center justify-center mx-auto mb-4">
            <UserCheck size={28} className="text-gray-300 dark:text-dark-border" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-dark-text mb-1">
            {search ? "Sin resultados" : emptyMessage}
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
            {search ? "Intenta con otros términos de búsqueda" : "Aún no hay usuarios registrados en esta categoría"}
          </p>
        </div>
      ) : (
        <>
          {/* VISTA MÓVIL: Tarjetas */}
          <div className="grid grid-cols-1 sm:hidden gap-3">
            {filteredItems.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <UserAvatar name={user.nombre} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">
                          {user.nombre || "Sin nombre"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge estado={user.estado || (user.activo ? "activo" : "suspendido")} />
                      <RolBadge rol={user.rol} />
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-dark-border">
                      <button
                        onClick={() => setViewUser(user)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600"
                      >
                        <Eye size={13} /> Ver
                      </button>
                      <button
                        onClick={() => handleConfirmSuspend(user)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                          user.activo
                            ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                            : "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                        }`}
                      >
                        {user.activo ? <Lock size={13} /> : <Unlock size={13} />}
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(user)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20"
                      >
                        <Trash2 size={13} />
                      </button>
                      {!soloVisualizacion && (
                        <>
                          <button
                            onClick={() => handleConfirmSuspend(user)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                              user.activo
                                ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                                : "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                            }`}
                          >
                            {user.activo ? <Lock size={13} /> : <Unlock size={13} />}
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(user)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VISTA ESCRITORIO: Tabla moderna */}
          <div className="hidden sm:block bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/30">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-44">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                  {filteredItems.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-gray-50/50 dark:hover:bg-dark-bg/30 transition-all duration-150"
                    >
                      {/* Usuario con avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.nombre} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                              {user.nombre || "Sin nombre"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-dark-text-secondary truncate">
                              @{user.nombre?.toLowerCase().replace(/\s+/g, "") || "usuario"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <p className="text-sm text-gray-600 dark:text-dark-text-secondary truncate max-w-[200px]">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-dark-text-secondary">
                            {user.telefono || "Sin teléfono"} {user.ubicacion ? `· ${user.ubicacion}` : ""}
                          </p>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <StatusBadge estado={user.estado || (user.activo ? "activo" : "suspendido")} />
                      </td>

                      {/* Rol */}
                      <td className="px-5 py-3.5">
                        <RolBadge rol={user.rol} />
                      </td>

                      {/* Fecha de registro */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-500 dark:text-dark-text-secondary">
                          {user.creado_en || user.fechaRegistro
                            ? new Date(user.creado_en || user.fechaRegistro).toLocaleDateString("es-CO", {
                                year: "numeric", month: "short", day: "numeric",
                              })
                            : "-"}
                        </span>
                      </td>

                      {/* Acciones CRUD con iconos */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Ver detalles */}
                          <button
                            onClick={() => setViewUser(user)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
                            title="Ver detalles"
                          >
                            <Eye size={15} strokeWidth={1.5} />
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => setEditUser(user)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border transition-all duration-200"
                            title="Editar"
                          >
                            <Edit3 size={15} strokeWidth={1.5} />
                          </button>

                          {/* Suspender / Reactivar */}
                          <button
                            onClick={() => handleConfirmSuspend(user)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              user.activo
                                ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                : "text-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                            }`}
                            title={user.activo ? "Suspender" : "Reactivar"}
                          >
                            {user.activo ? <Lock size={15} strokeWidth={1.5} /> : <Unlock size={15} strokeWidth={1.5} />}
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => handleConfirmDelete(user)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                            title="Eliminar"
                          >
                            <Trash2 size={15} strokeWidth={1.5} />
                          </button>
                          {!soloVisualizacion && (
                            <>
                              {/* Editar */}
                              <button
                                onClick={() => setEditUser(user)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-border transition-all duration-200"
                                title="Editar"
                              >
                                <Edit3 size={15} strokeWidth={1.5} />
                              </button>

                              {/* Suspender / Reactivar */}
                              <button
                                onClick={() => handleConfirmSuspend(user)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  user.activo
                                    ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                    : "text-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                }`}
                                title={user.activo ? "Suspender" : "Reactivar"}
                              >
                                {user.activo ? <Lock size={15} strokeWidth={1.5} /> : <Unlock size={15} strokeWidth={1.5} />}
                              </button>

                              {/* Eliminar */}
                              <button
                                onClick={() => handleConfirmDelete(user)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                                title="Eliminar"
                              >
                                <Trash2 size={15} strokeWidth={1.5} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer con conteo */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-dark-text-secondary">
                Mostrando <span className="font-semibold text-gray-600 dark:text-dark-text">{filteredItems.length}</span> de{" "}
                <span className="font-semibold text-gray-600 dark:text-dark-text">{items.length}</span> usuarios
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-gray-400">{items.filter((u) => u.activo).length} activos</span>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[11px] text-gray-400">{items.filter((u) => !u.activo).length} suspendidos</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== MODALES ===== */}

      {/* Modal Ver Usuario (con acciones avanzadas internas) */}
      <ViewUserModal
        user={viewUser}
        onClose={() => setViewUser(null)}
        onEdit={(u) => { setEditUser(u); }}
        onSuspend={(u) => handleConfirmSuspend(u)}
        onDelete={(u) => handleConfirmDelete(u)}
        onResetPassword={handleResetPassword}
        onChangeRole={handleChangeRole}
        onSendEmail={handleSendEmail}
        soloVisualizacion={soloVisualizacion}
      />

      {/* Modal Crear Usuario */}
      <UserFormModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
        loading={formLoading}
      />

      {/* Modal Editar Usuario */}
      <UserFormModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSave={handleEdit}
        user={editUser}
        loading={formLoading}
      />

      {/* Modal Confirmación (suspender/eliminar) */}
      <ActionConfirmModal
        config={confirmAction?.config || null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.type === "suspend") {
            handleSuspendReactivate(confirmAction.user);
          } else if (confirmAction.type === "delete") {
            handleDelete(confirmAction.user);
          }
        }}
        loading={confirmLoading}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}
