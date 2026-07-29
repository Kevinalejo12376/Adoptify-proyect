import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, PawPrint, Heart, Eye, EyeOff, CheckCircle, XCircle,
  Sparkles, Mail, Lock, Building2, AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AutoFadingImage from "../../components/AutoFadingImage";
import logo from "../../assets/logo.png";
import loginDog from "../../assets/loginDog.jpg";
import mascotasImg from "../../assets/Mascotas.jpg";
import daycareImg from "../../assets/daycare.png";

const authCarouselImages = [loginDog, mascotasImg, daycareImg];

const REMEMBER_KEY = "adoptify_remembered_email";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const navigate = useNavigate();
  const { apiLogin, googleLogin } = useAuth();
  const googleBtnRef = useRef(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Recuperar email guardado de "Recordarme"
  const savedEmail = localStorage.getItem(REMEMBER_KEY) || "";

  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!savedEmail);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar contraseña (mayúscula, minúscula, número, especial)
  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  // Validar campo individual
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "email":
        if (!value.trim()) {
          error = "El correo es obligatorio";
        } else if (!validateEmail(value)) {
          error = "Formato de correo inválido";
        }
        break;
      case "password":
        if (!value) {
          error = "La contraseña es obligatoria";
        }
        break;
    }

    return error;
  };

  // Manejar cambio de campo con validación
  const handleFieldChange = (field, value) => {
    const setter = {
      email: setEmail,
      password: setPassword,
      rememberMe: setRememberMe,
    }[field];

    setter(value);

    if (field !== "rememberMe") {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Validar todos los campos
  const validateAll = () => {
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    // Guardar o limpiar email según "Recordarme"
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    // Login REAL contra el backend: maneja usuario, refugio y administrador.
    try {
      const loggedUser = await apiLogin(email, password);
      setIsLoading(false);
      setSuccess(true);
      const role = loggedUser?.role;
      setTimeout(() => {
        if (role === "administrador" || role === "administrador_principal") {
          navigate("/admin/dashboard");
        } else if (role === "refugio") {
          navigate("/refugio/dashboard");
        } else if (role === "tienda_aliada") {
          navigate("/tienda/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
      return;
    } catch (err) {
      setIsLoading(false);
      setErrors((prev) => ({
        ...prev,
        password: err?.message || "Correo o contraseña incorrectos",
      }));
    }
  };

  // ─── Google Sign-In ─────────────────────────────────────────────
  const handleGoogleLogin = async (credential) => {
    try {
      setIsLoading(true);
      const loggedUser = await googleLogin(credential);
      setIsLoading(false);
      setSuccess(true);
      const role = loggedUser?.role;
      setTimeout(() => {
        if (role === "administrador" || role === "administrador_principal") {
          navigate("/admin/dashboard");
        } else if (role === "refugio") {
          navigate("/refugio/dashboard");
        } else if (role === "tienda_aliada") {
          navigate("/tienda/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setErrors((prev) => ({
        ...prev,
        password: err?.message || "Error al iniciar sesion con Google",
      }));
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    // Cargar el script de Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              handleGoogleLogin(response.credential);
            }
          },
        });
        setGoogleLoaded(true);
      }
    };
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) existing.remove();
    };
  }, []);

  useEffect(() => {
    if (googleLoaded && googleBtnRef.current && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: "100%",
        logo_alignment: "center",
      });
    }
  }, [googleLoaded]);

  return (
    <div className="auth-page">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="auth-bg-circle auth-bg-circle-1" />
        <div className="auth-bg-circle auth-bg-circle-2" />
        <div className="auth-bg-circle auth-bg-circle-3" />
        <div className="auth-bg-circle auth-bg-circle-4" />
        <div className="auth-bg-circle auth-bg-circle-5" />
        <div className="auth-bg-circle auth-bg-circle-6" />
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-modal-content">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">¡Inicio de sesión exitoso!</h3>
            <p className="text-gray-500 mb-6">Redirigiendo al dashboard...</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF4D7A] to-[#FFA726] rounded-full animate-loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* Main Card - Two columns */}
      <div className="auth-card">
        {/* ===== LEFT PANEL - Decorative / Branding ===== */}
        <div className="auth-decorative-panel auth-animate-fade-in-left">
          {/* Back to Home - inside decorative panel */}
          <Link
            to="/"
            className="auth-back-btn"
          >
            <div className="auth-back-btn-icon">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Volver al inicio</span>
          </Link>

          {/* Decorative circles background */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF4D7A]/10 rounded-full blur-3xl -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFA726]/10 rounded-full blur-3xl translate-x-20 translate-y-20" />

          {/* Content */}
          <div className="auth-decorative-content">
            {/* Image with gradient border */}
            <div className="auth-image-wrapper">
              <div className="auth-image-border">
                <div className="auth-image-container">
                  <AutoFadingImage
                    images={authCarouselImages}
                    alt="Adoptify - Conectando corazones con patitas"
                    className="w-full h-full object-cover"
                    interval={5000}
                    fadeDuration={1000}
                  />
                </div>
              </div>
            </div>

            {/* Three circular gradient icons */}
            <div className="flex justify-center gap-5 mt-8">
              {[
                { Icon: PawPrint, delay: "0s" },
                { Icon: Heart, delay: "0.15s" },
                { Icon: Building2, delay: "0.3s" },
              ].map(({ Icon, delay }, i) => (
                <div
                  key={i}
                  className="auth-icon-circle"
                  style={{ animationDelay: delay }}
                >
                  <Icon className="w-6 h-6" />
                </div>
              ))}
            </div>

            {/* Google Sign-In Button */}
            <div className="mt-8 px-6">
              <div className="auth-divider mb-4">
                <span className="auth-divider-text">o continúa con</span>
              </div>
              <div className="flex justify-center">
                {GOOGLE_CLIENT_ID ? (
                  <div ref={googleBtnRef} />
                ) : (
                  <button
                    type="button"
                    onClick={() => alert(
                      'Para habilitar el inicio de sesion con Google:\n\n' +
                      '1. Ve a https://console.cloud.google.com/apis/credentials\n' +
                      '2. Crea un OAuth 2.0 Client ID (Web application)\n' +
                      '3. Agrega http://localhost:5173 en "Authorized JavaScript origins"\n' +
                      '4. Copia el Client ID en:\n' +
                      '   - frontend/.env: VITE_GOOGLE_CLIENT_ID=tu_client_id\n' +
                      '   - backend/.env: GOOGLE_CLIENT_ID="tu_client_id"'
                    )}
                    className="auth-social-btn w-full"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL - Form ===== */}
        <div className="auth-form-panel auth-animate-fade-in-right">
          <div className="auth-form-container">
            {/* Logo */}
            <div className="flex justify-center mb-1">
              <img
                src={logo}
                alt="Adoptify Logo"
                className="auth-logo"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-3">
              <h2 className="auth-title">Iniciar sesión</h2>
              <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="auth-label">
                  Correo electrónico
                </label>
                <div className={`auth-input-wrapper ${errors.email ? 'auth-input-error' : email && !errors.email ? 'auth-input-success' : ''}`}>
                  <Mail className="auth-input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="auth-input"
                  />
                  {errors.email ? (
                    <XCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  ) : email ? (
                    <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  ) : null}
                </div>
                {errors.email && (
                  <p className="auth-error-text">
                    <XCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="auth-label">
                  Contraseña
                </label>
                <div className={`auth-input-wrapper ${errors.password ? 'auth-input-error' : password && !errors.password ? 'auth-input-success' : ''}`}>
                  <Lock className="auth-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    className="auth-input"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-eye-btn"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                    {errors.password ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : password ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                </div>
                {errors.password && (
                  <p className="auth-error-text">
                    <XCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => handleFieldChange("rememberMe", e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                      rememberMe
                        ? 'border-[#FF4D7A] bg-gradient-to-br from-[#FF4D7A] to-[#FFA726]'
                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                    }`}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors font-medium">Recordarme</span>
                </label>
                <a href="#" className="auth-link text-sm">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-primary-btn"
              >
                <div className="auth-btn-shimmer" />
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Iniciar sesión</span>
                  </>
                )}
              </button>

              {/* Register link */}
              <div className="text-center text-sm text-gray-500 pt-1">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="auth-link font-semibold">
                  Crear cuenta
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
