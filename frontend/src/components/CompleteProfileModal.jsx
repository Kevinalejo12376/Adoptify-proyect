import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Camera,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Quote,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";

// ─── Expresiones regulares de validación ───
const REGEX = {
  telefono: /^[\d\s\+\-\(\)]{7,20}$/,
  website: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-\.\/?%&=]*)?$/,
};

// ─── Campo de formulario reutilizable ───
function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  isTextarea = false,
  maxLength,
  helperText,
}) {
  const hasError = !!error;
  const isValid = !hasError && value && value.trim().length > 0;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && !isTextarea && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={4}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 dark:text-white transition-all duration-200 resize-none ${
              hasError
                ? "border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                : isValid
                ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
                : "border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 dark:text-white transition-all duration-200 ${
              Icon ? "pl-11" : "pl-4"
            } ${
              hasError
                ? "border-2 border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                : isValid
                ? "border-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
                : "border-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          />
        )}

        {/* Iconos de validación */}
        {!isTextarea && value && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {hasError && (
        <div className="flex items-center gap-1.5 mt-1 animate-slide-down">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Helper text */}
      {helperText && !hasError && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

// ─── Componente principal: CompleteProfileModal ───
export default function CompleteProfileModal({ isOpen, onClose, onComplete }) {
  const { user } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    telefono: "",
    ubicacion: "",
    bio: "",
    website: "",
    twitter: "",
    instagram: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [step, setStep] = useState(1);

  // Resetear formulario al abrir
  useEffect(() => {
    if (isOpen) {
      setFormData({
        telefono: user?.phone || "",
        ubicacion: user?.location || "",
        bio: "",
        website: "",
        twitter: "",
        instagram: "",
      });
      setErrors({});
      setSubmitError("");
      setSubmitSuccess(false);
      setStep(1);
    }
  }, [isOpen, user]);

  // ─── Validación de campo individual ───
  const validateField = useCallback((name, value) => {
    const val = value?.trim() || "";

    switch (name) {
      case "telefono":
        if (val && !REGEX.telefono.test(val)) {
          return "Formato de teléfono inválido (solo números, +, -, espacios)";
        }
        return "";

      case "ubicacion":
        if (val && val.length > 150) {
          return "La ubicación no puede exceder 150 caracteres";
        }
        return "";

      case "bio":
        if (val && val.length > 500) {
          return "La biografía no puede exceder 500 caracteres";
        }
        return "";

      case "website":
        if (val && !REGEX.website.test(val)) {
          return "Formato de URL inválido (ej: https://ejemplo.com)";
        }
        return "";

      case "twitter":
      case "instagram":
        if (val && val.length > 120) {
          return "Máximo 120 caracteres";
        }
        return "";

      default:
        return "";
    }
  }, []);

  // ─── Manejar cambio en cualquier campo ───
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar en tiempo real
    const error = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[name] = error;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  // ─── Validar todos los campos antes de enviar ───
  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // ─── Enviar formulario ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      // Enviar solo campos con contenido
      const payload = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim()) {
          payload[key] = value.trim();
        }
      });

      const result = await updateProfile(payload);
      setSubmitSuccess(true);
      setStep(2);

      // Notificar al padre después de 1.5s
      setTimeout(() => {
        if (onComplete) onComplete(result);
        onClose();
      }, 2000);
    } catch (err) {
      // Manejar errores del backend por campo
      if (err.data && err.data.detail) {
        if (typeof err.data.detail === "object" && !Array.isArray(err.data.detail)) {
          const serverErrors = {};
          Object.entries(err.data.detail).forEach(([field, msg]) => {
            if (formData.hasOwnProperty(field)) {
              serverErrors[field] = msg;
            }
          });
          if (Object.keys(serverErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...serverErrors }));
          } else {
            setSubmitError(err.data.detail._error || "Error al guardar el perfil");
          }
        } else if (Array.isArray(err.data.detail)) {
          const serverErrors = {};
          err.data.detail.forEach((e) => {
            const field = e.loc?.[e.loc.length - 1];
            if (field && formData.hasOwnProperty(field)) {
              serverErrors[field] = e.msg;
            }
          });
          if (Object.keys(serverErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...serverErrors }));
          } else {
            setSubmitError(err.message || "Error al guardar el perfil");
          }
        } else {
          setSubmitError(typeof err.data.detail === "string" ? err.data.detail : "Error al guardar el perfil");
        }
      } else {
        setSubmitError(err?.message || "Error al guardar el perfil. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Cerrar modal (skip) ───
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-modal-overlay"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white dark:bg-dark-card rounded-3xl shadow-2xl max-w-xl w-full animate-modal-content overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── HEADER GRADIENTE ─── */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />

          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all text-white disabled:opacity-50 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Completa tu Perfil
              </h2>
              <p className="text-sm text-rose-100">Cuéntanos más sobre ti</p>
            </div>
          </div>
        </div>

        {/* ─── STEP 1: FORMULARIO ─── */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Progreso visual */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full animate-pulse-subtle" />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Opcional
              </span>
            </div>

            {/* Mensaje de error general del servidor */}
            {submitError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
              </div>
            )}

            {/* Información personal adicional */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={errors.telefono}
                  icon={Phone}
                  placeholder="+57 300 123 4567"
                  helperText="Para que los refugios puedan contactarte"
                />
                <FormField
                  label="Ubicación"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  error={errors.ubicacion}
                  icon={MapPin}
                  placeholder="Bogotá, Colombia"
                  helperText="Tu ciudad o región"
                />
              </div>
            </div>

            {/* Biografía */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Quote className="w-4 h-4" />
                Sobre Ti
              </h3>
              <FormField
                label="Biografía"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                error={errors.bio}
                isTextarea
                placeholder="Cuéntanos sobre ti, tu experiencia con animales, por qué te gusta adoptar..."
                maxLength={500}
                helperText={`${formData.bio.length}/500 caracteres`}
              />
            </div>

            {/* Redes Sociales */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Redes y Sitio Web
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Sitio Web"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  error={errors.website}
                  icon={Globe}
                  placeholder="https://tusitio.com"
                />
                <FormField
                  label="Twitter / X"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  error={errors.twitter}
                  icon={MessageCircle}
                  placeholder="@tuusuario"
                />
              </div>
              <div className="sm:w-1/2">
                <FormField
                  label="Instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  error={errors.instagram}
                  icon={Camera}
                  placeholder="@tuusuario"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-dark-border disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Ahora no
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Perfil
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ─── STEP 2: ÉXITO ─── */}
        {step === 2 && (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-2">
                ¡Perfil completado!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Tu información ha sido guardada correctamente. Los refugios podrán conocerte mejor.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-rose-500 dark:text-rose-400 animate-pulse-subtle">
              <Sparkles className="w-4 h-4" />
              <span>Redirigiendo...</span>
            </div>
          </div>
        )}

        {/* ─── DECORACIÓN INFERIOR ─── */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
      </div>

      {/* Estilos adicionales */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
