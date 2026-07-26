import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Camera, Save, X,
  PawPrint, Heart, Settings, LogOut, Shield, ChevronRight,
  MessageCircle, Home, Clock, TrendingUp,
  AlertCircle,
  Image, Globe, Loader2,
  Search, ArrowUp, Quote, Sparkles
} from "lucide-react";
import { fetchProfile, updateProfile } from "../../api/auth";

// ─── Animated Counter ───
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

// ─── Section Divider ───
function SectionDivider({ icon: Icon, label, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">{label}</h3>
      </div>
      {action && (
        <button className="text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors flex items-center gap-1">
          {action} <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Empty State ───
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-10 px-4">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-dark-bg rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-4">{description}</p>
      {action}
    </div>
  );
}

// ─── Avatar Modal ───
function AvatarModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-modal-overlay" />
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center">
              <Image className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Cambiar Foto</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="w-36 h-36 bg-gradient-to-br from-rose-200 to-amber-200 dark:from-rose-900/40 dark:to-amber-900/40 rounded-full flex items-center justify-center border-4 border-white dark:border-dark-card shadow-xl transition-transform duration-300 group-hover:scale-105">
                <User className="w-16 h-16 text-rose-400 dark:text-rose-500" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-200 dark:border-dark-border rounded-2xl p-8 text-center hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 group cursor-pointer bg-gray-50/50 dark:bg-dark-bg/50">
            <div className="w-14 h-14 mx-auto mb-4 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Camera className="w-7 h-7 text-rose-500 dark:text-rose-400" />
            </div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Subir nueva foto
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Arrastra y suelta o haz clic para seleccionar
            </p>
            <input type="file" className="hidden" accept="image/*" id="avatar-upload" />
            <label
              htmlFor="avatar-upload"
              className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30 cursor-pointer"
            >
              Seleccionar imagen
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-6 py-3 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-dark-border">
              Cancelar
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30">
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Profile Modal ───
function EditProfileModal({ isOpen, user, editedUser, setEditedUser, onSave, onCancel, saving }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-modal-overlay" />
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Editar Perfil</h3>
          </div>
          <button onClick={onCancel} disabled={saving} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre completo</label>
              <input type="text" value={editedUser.name}
                onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                disabled={saving}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo electrónico</label>
              <input type="email" value={editedUser.email}
                onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={true}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all opacity-60 cursor-not-allowed" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
              <input type="tel" value={editedUser.phone}
                onChange={e => setEditedUser({ ...editedUser, phone: e.target.value })}
                disabled={saving}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ubicación</label>
              <input type="text" value={editedUser.location}
                onChange={e => setEditedUser({ ...editedUser, location: e.target.value })}
                disabled={saving}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all disabled:opacity-60" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biografía</label>
            <textarea rows="4" value={editedUser.bio}
              onChange={e => setEditedUser({ ...editedUser, bio: e.target.value })}
              disabled={saving}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all resize-none disabled:opacity-60" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sitio web</label>
              <input type="url" value={editedUser.website || ""}
                onChange={e => setEditedUser({ ...editedUser, website: e.target.value })}
                disabled={saving}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all disabled:opacity-60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter / X</label>
              <input type="text" value={editedUser.social?.twitter || ""}
                onChange={e => setEditedUser({ ...editedUser, social: { ...editedUser.social, twitter: e.target.value } })}
                disabled={saving}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all disabled:opacity-60" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram</label>
            <input type="text" value={editedUser.social?.instagram || ""}
              onChange={e => setEditedUser({ ...editedUser, social: { ...editedUser.social, instagram: e.target.value } })}
              disabled={saving}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:text-white transition-all disabled:opacity-60" />
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
          <button onClick={onCancel} disabled={saving} className="flex-1 px-6 py-3 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-dark-border disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={onSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30 disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function UserProfile() {
  const { user: authUser, profileCompleted, openProfileModal } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Construir el objeto de usuario combinando authUser + profile
  const user = {
    name: authUser?.name || authUser?.nombre || "",
    email: authUser?.email || "",
    phone: profile?.telefono || authUser?.phone || "",
    location: profile?.ubicacion || authUser?.location || "",
    bio: profile?.bio || "",
    joinDate: authUser?.creado_en
      ? (() => {
          const d = new Date(authUser.creado_en);
          const dia = String(d.getDate()).padStart(2, "0");
          const mes = String(d.getMonth() + 1).padStart(2, "0");
          const anio = String(d.getFullYear()).slice(-2);
          return `${dia}/${mes}/${anio}`;
        })()
      : "",
    avatar: profile?.avatar_url || null,
    cover: profile?.cover_url || null,
    website: profile?.website || "",
    social: {
      twitter: profile?.twitter || "",
      instagram: profile?.instagram || "",
    },
  };

  const [editedUser, setEditedUser] = useState({ ...user });

  // Actualizar editedUser cuando user cambie
  useEffect(() => {
    if (!loading) {
      setEditedUser({ ...user });
    }
  }, [profile, authUser, loading]);

  // ─── Fetch real profile data ───
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        // Si el perfil no existe o hay error, solo mostrar datos básicos del authUser
        console.warn("No se pudo cargar el perfil:", err);
        setError("No se pudo cargar la información adicional del perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ─── Save changes to API ───
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        telefono: editedUser.phone || null,
        ubicacion: editedUser.location || null,
        bio: editedUser.bio || null,
        website: editedUser.website || null,
        twitter: editedUser.social?.twitter || null,
        instagram: editedUser.social?.instagram || null,
      };
      // Limpiar campos vacíos
      Object.keys(payload).forEach(key => {
        if (!payload[key]) delete payload[key];
      });

      const result = await updateProfile(payload);
      setProfile(result);
      setShowEditModal(false);
    } catch (err) {
      setSaveError(err?.message || "Error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setShowEditModal(false);
    setSaveError(null);
  };

  const openEdit = () => {
    setEditedUser({ ...user });
    setShowEditModal(true);
    setSaveError(null);
  };

  // Stats con datos reales
  const stats = [
    { label: "Mascotas adoptadas", value: 0, icon: PawPrint, color: "from-rose-500 to-rose-600", shadow: "shadow-rose-200 dark:shadow-rose-900/30" },
    { label: "Favoritos", value: 0, icon: Heart, color: "from-amber-500 to-amber-600", shadow: "shadow-amber-200 dark:shadow-amber-900/30" },
    { label: "Miembro desde", value: user.joinDate || "—", icon: Calendar, color: "from-rose-500 to-amber-500", shadow: "shadow-rose-200 dark:shadow-rose-900/30", isText: true },
  ];

  const tabs = [
    { id: "overview", label: "Resumen", icon: User },
    { id: "pets", label: "Mis Mascotas", icon: PawPrint },
    { id: "activity", label: "Actividad", icon: Clock },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-[#1a0a0f] dark:via-[#0f0f13] dark:to-[#1a1208] relative">
      {/* ─── Animated Background Orbs ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-200/20 dark:bg-rose-500/5 rounded-full blur-3xl animate-float-1" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl animate-float-2" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-rose-300/10 dark:bg-rose-600/5 rounded-full blur-3xl animate-float-3" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-200/10 dark:bg-violet-500/5 rounded-full blur-3xl animate-float-4" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium mb-4 animate-scale-in">
            <Sparkles className="w-4 h-4" />
            <span>Mi espacio personal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 font-display tracking-tight">
            Mi{" "}
            <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              Perfil
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Gestiona tu información y conecta con la comunidad
          </p>
        </div>

        {/* ─── Profile Card ─── */}
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden mb-8 animate-slide-up-fade border border-gray-100 dark:border-dark-border">
          {/* Animated Cover */}
          <div className="relative h-40 sm:h-52 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-gradient overflow-hidden group">
            <div className="absolute inset-0 bg-black/10" />
            {/* Decorative circles on cover */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all text-white">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="relative px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-13 sm:-mt-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-rose-200 to-amber-200 dark:from-rose-900/40 dark:to-amber-900/40 rounded-3xl flex items-center justify-center border-4 border-white dark:border-dark-card shadow-2xl transition-all duration-500 group-hover:shadow-rose-200 dark:group-hover:shadow-rose-900/30 group-hover:scale-105 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-14 h-14 sm:w-20 sm:h-20 text-rose-400 dark:text-rose-500" />
                    )}
                    {/* Avatar hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-3xl">
                      <button
                        onClick={() => setShowAvatarModal(true)}
                        className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Camera className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name & Location */}
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display">
                    {user.name || "Usuario"}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-rose-400 dark:text-rose-500" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.location || "Ubicación no especificada"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={openEdit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit className="w-4 h-4" />
                Editar Perfil
              </button>
            </div>

            {/* Bio */}
            <div className="mt-5 sm:mt-6 p-4 sm:p-5 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-900/10 dark:to-amber-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-rose-400 dark:text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  {user.bio ? (
                    `"${user.bio}"`
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 not-italic">
                      No has añadido una biografía aún. {profileCompleted ? "" : "Completa tu perfil para contarnos sobre ti."}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {user.website && (
                <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                  <Globe className="w-4 h-4" /> {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {user.social?.twitter && (
                <a href={`https://twitter.com/${user.social.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                  <MessageCircle className="w-4 h-4" /> {user.social.twitter}
                </a>
              )}
              {user.social?.instagram && (
                <a href={`https://instagram.com/${user.social.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                  <Camera className="w-4 h-4" /> {user.social.instagram}
                </a>
              )}
            </div>

            {/* Error de carga del perfil */}
            {error && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Banner de perfil incompleto ─── */}
        {!profileCompleted && !loading && (
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl shadow-lg p-5 sm:p-6 mb-8 animate-fadeIn relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Completa tu perfil</h3>
                  <p className="text-sm text-rose-100">
                    Agrega información adicional para que los refugios te conozcan mejor
                  </p>
                </div>
              </div>
              <button
                onClick={openProfileModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-all duration-300 hover:shadow-lg whitespace-nowrap flex-shrink-0 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Completar ahora
              </button>
            </div>
          </div>
        )}

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-gray-100 dark:border-dark-border animate-fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display">
                    {stat.isText ? (
                      stat.value
                    ) : (
                      <AnimatedCounter end={stat.value} />
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Tabs Navigation ─── */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-1.5 mb-8 border border-gray-100 dark:border-dark-border overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30"
                      : "text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Tab Content ─── */}

        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white dark:bg-dark-card rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-dark-border animate-fadeIn">
              <SectionDivider icon={User} label="Información Personal" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: User, label: "Nombre completo", value: user.name || "—", color: "from-rose-500 to-rose-600" },
                  { icon: Mail, label: "Correo electrónico", value: user.email || "—", color: "from-amber-500 to-amber-600" },
                  { icon: Phone, label: "Teléfono", value: user.phone || "—", color: "from-emerald-500 to-emerald-600" },
                  { icon: MapPin, label: "Ubicación", value: user.location || "—", color: "from-violet-500 to-violet-600" },
                ].map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all duration-300 group animate-fadeIn"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.value === "—" ? (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        ) : (
                          item.value
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info adicional del perfil (website, twitter, instagram) si existen */}
              {(user.website || user.social?.twitter || user.social?.instagram) && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Redes y Sitio Web
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {user.website && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                        <Globe className="w-5 h-5 text-rose-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Sitio web</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.website.replace(/^https?:\/\//, "")}
                          </p>
                        </div>
                      </div>
                    )}
                    {user.social?.twitter && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                        <MessageCircle className="w-5 h-5 text-rose-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Twitter / X</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.social.twitter}
                          </p>
                        </div>
                      </div>
                    )}
                    {user.social?.instagram && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                        <Camera className="w-5 h-5 text-rose-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">Instagram</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.social.instagram}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-card rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-dark-border animate-fadeIn" style={{ animationDelay: "200ms" }}>
              <SectionDivider icon={TrendingUp} label="Acciones Rápidas" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/adoption-history"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-300 group border border-transparent hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PawPrint className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Historial de Adopciones</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estado de tus solicitudes</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-rose-500 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link to="/favorites"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all duration-300 group border border-transparent hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Favoritos</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mascotas guardadas</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link to="/settings"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-300 group border border-transparent hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Configuración</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ajustes de la cuenta</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link to="/settings"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-300 group border border-transparent hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Privacidad</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Datos y seguridad</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Logout */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border">
                <Link to="/login"
                  className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-300 group border border-transparent hover:border-red-200 dark:hover:border-red-800">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <LogOut className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">Cerrar Sesión</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Salir de tu cuenta</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─── Pets Tab ─── */}
        {activeTab === "pets" && (
          <div className="bg-white dark:bg-dark-card rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-dark-border animate-fadeIn">
            <SectionDivider icon={PawPrint} label="Mis Mascotas" />

            <EmptyState
              icon={PawPrint}
              title="No tienes mascotas registradas"
              description="Las mascotas que adoptes aparecerán aquí. Por ahora no hay ninguna registrada."
              action={
                <Link
                  to="/animals"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg text-sm"
                >
                  <Search className="w-4 h-4" />
                  Explorar mascotas
                </Link>
              }
            />
          </div>
        )}

        {/* ─── Activity Tab ─── */}
        {activeTab === "activity" && (
          <div className="bg-white dark:bg-dark-card rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-dark-border animate-fadeIn">
            <SectionDivider icon={Clock} label="Actividad Reciente" />

            <EmptyState
              icon={Clock}
              title="No hay actividad reciente"
              description="Tus interacciones como adopciones, comentarios en el foro y donaciones aparecerán aquí."
              action={
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg text-sm"
                >
                  <Home className="w-4 h-4" />
                  Ir al inicio
                </Link>
              }
            />
          </div>
        )}

        {/* ─── Footer Note ─── */}
        <div className="text-center mt-10 text-sm text-gray-400 dark:text-gray-600">
          <p>Completa tu perfil para obtener más visibilidad en la comunidad</p>
        </div>
      </div>

      {/* ─── Error de guardado ─── */}
      {saveError && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 shadow-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Error al guardar</p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">{saveError}</p>
            </div>
            <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      <AvatarModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} />
      <EditProfileModal
        isOpen={showEditModal}
        user={user}
        editedUser={editedUser}
        setEditedUser={setEditedUser}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />

      {/* ─── Scroll to Top ─── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-rose-200 dark:hover:shadow-rose-900/30 transition-all duration-300 hover:scale-110 active:scale-95 z-50 flex items-center justify-center animate-bounce-subtle"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* ─── Animations ─── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out both;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalContentIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-overlay {
          animation: modalOverlayIn 0.3s ease-out both;
        }
        .animate-modal-content {
          animation: modalContentIn 0.3s ease-out both;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
