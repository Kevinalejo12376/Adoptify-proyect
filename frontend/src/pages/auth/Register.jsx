import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, PawPrint, Heart, User, Mail, Lock, ArrowRight,
  Eye, EyeOff, CheckCircle, XCircle, Phone, FileText, Sparkles,
  Shield
} from "lucide-react";
import logo from "../../assets/logo.png";
import loginDog from "../../assets/loginDog.jpg";
import { useAuth } from "../../context/AuthContext";
import { getTiposDocumento } from "../../api/catalogos";

export default function Register() {
  const navigate = useNavigate();
  const { apiRegister } = useAuth();
  const [role, setRole] = useState("adopter");
  // Tipos de documento traidos de la base de datos (tabla tipos_documento)
  const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
    getTiposDocumento()
      .then((data) => setTiposDocumento(data))
      .catch((err) => {
        console.warn("[Register] No se pudieron cargar los tipos de documento:", err?.message || err);
        setTiposDocumento([]);
      });
  }, []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [terms, setTerms] = useState(false);
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

  // Validar documento (solo números)
  const validateDocumentNumber = (number) => {
    return /^\d+$/.test(number) && number.length >= 10;
  };

  // Validar teléfono
  const validatePhone = (phone) => {
    return /^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''));
  };

  // Validar espacios (no al inicio/final, no dobles)
  const validateSpaces = (value) => {
    return value === value.trim() && !/\s{2,}/.test(value);
  };

  // Validar si email ya está registrado (simulado)
  const isEmailRegistered = (email) => {
    const registeredEmails = localStorage.getItem("registeredEmails");
    const emails = registeredEmails ? JSON.parse(registeredEmails) : [];
    return emails.includes(email.toLowerCase());
  };

  // Validar campo individual
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) {
          error = "El nombre es obligatorio";
        } else if (!validateSpaces(value)) {
          error = "No se permiten espacios al inicio/final ni espacios dobles";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Los apellidos son obligatorios";
        } else if (!validateSpaces(value)) {
          error = "No se permiten espacios al inicio/final ni espacios dobles";
        }
        break;
      case "documentType":
        if (!value) {
          error = "El tipo de documento es obligatorio";
        }
        break;
      case "documentNumber":
        if (!value.trim()) {
          error = "El número de documento es obligatorio";
        } else if (!validateDocumentNumber(value)) {
          error = "Debe contener solo números y mínimo 10 dígitos";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "El teléfono es obligatorio";
        } else if (!validatePhone(value)) {
          error = "Formato inválido (ej: 300 123 4567)";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "El correo es obligatorio";
        } else if (!validateEmail(value)) {
          error = "Formato de correo inválido";
        } else if (!validateSpaces(value)) {
          error = "No se permiten espacios al inicio/final ni espacios dobles";
        }
        break;
      case "password":
        if (!value) {
          error = "La contraseña es obligatoria";
        } else if (!validatePassword(value)) {
          error = "Debe tener mayúscula, minúscula, número y carácter especial";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Confirmar contraseña es obligatorio";
        } else if (value !== password) {
          error = "Las contraseñas no coinciden";
        }
        break;
      case "terms":
        if (!value) {
          error = "Debes aceptar los términos y condiciones";
        }
        break;
    }

    return error;
  };

  // Manejar cambio de campo con validación
  const handleFieldChange = (field, value) => {
    const setter = {
      firstName: setFirstName,
      lastName: setLastName,
      documentType: setDocumentType,
      documentNumber: setDocumentNumber,
      phone: setPhone,
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
      terms: setTerms
    }[field];

    setter(value);

    if (field !== "terms") {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    } else {
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
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      documentType: validateField("documentType", documentType),
      documentNumber: validateField("documentNumber", documentNumber),
      phone: validateField("phone", phone),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
      terms: validateField("terms", terms)
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

    // Mapea el rol del formulario al rol del backend ('usuario' | 'refugio').
    const rol = role === "shelter" || role === "refugio" ? "refugio" : "usuario";

    try {
      // Registro REAL en la base de datos (crea el usuario).
      await apiRegister({
        nombre: firstName,
        apellido: lastName,
        email,
        password,
        telefono: phone,
        tipo_documento: documentType, // codigo del catalogo (ej: 'CC')
        numero_documento: documentNumber,
        rol,
        ...(rol === "refugio" ? { nombre_refugio: `${firstName} ${lastName}`.trim() } : {}),
      });

      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      // Error del backend (ej: correo ya registrado) -> mostrarlo en el campo email.
      setErrors((prev) => ({
        ...prev,
        email: err?.message || "No se pudo crear la cuenta",
      }));
    }
  };

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
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">¡Cuenta creada exitosamente!</h3>
            <p className="text-gray-500 mb-6">Redirigiendo al inicio de sesión...</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF4D7A] to-[#FFA726] rounded-full animate-loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* Main Card - Two columns */}
      <div className="auth-card">
        {/* ===== LEFT PANEL - Form ===== */}
        <div className="auth-form-panel auth-animate-fade-in-left">
          <div className="auth-form-container">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="Adoptify Logo"
                className="auth-logo"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-5">
              <h2 className="auth-title">Crea tu cuenta</h2>
              <p className="auth-subtitle">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="auth-link font-semibold">
                  Inicia sesión
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Scrollable form fields container */}
              <div className="auth-form-scroll">
                <div className="space-y-3.5 pr-2">
                  {/* Document Type and Number */}
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label htmlFor="documentType" className="auth-label">
                        Tipo Doc.
                      </label>
                      <div className={`auth-input-wrapper ${errors.documentType ? 'auth-input-error' : documentType && !errors.documentType ? 'auth-input-success' : ''}`}>
                        <FileText className="auth-input-icon" />
                        <select
                          id="documentType"
                          value={documentType}
                          onChange={(e) => handleFieldChange("documentType", e.target.value)}
                          className="auth-input auth-select"
                        >
                          <option value="">Seleccionar</option>
                          {tiposDocumento.map((td) => (
                            <option key={td.id} value={td.codigo}>
                              {td.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.documentType ? (
                          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        ) : documentType ? (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                      {errors.documentType && (
                        <p className="auth-error-text">
                          <XCircle className="w-3 h-3" />
                          {errors.documentType}
                        </p>
                      )}
                    </div>

                    <div className="col-span-3 space-y-1.5">
                      <label htmlFor="documentNumber" className="auth-label">
                        Número de Documento
                      </label>
                      <div className={`auth-input-wrapper ${errors.documentNumber ? 'auth-input-error' : documentNumber && !errors.documentNumber ? 'auth-input-success' : ''}`}>
                        <FileText className="auth-input-icon" />
                        <input
                          id="documentNumber"
                          type="text"
                          placeholder="1234567890"
                          value={documentNumber}
                          onChange={(e) => handleFieldChange("documentNumber", e.target.value)}
                          className="auth-input"
                        />
                        {errors.documentNumber ? (
                          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        ) : documentNumber ? (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                      {errors.documentNumber && (
                        <p className="auth-error-text">
                          <XCircle className="w-3 h-3" />
                          {errors.documentNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Name and Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="auth-label">
                        Nombres
                      </label>
                      <div className={`auth-input-wrapper ${errors.firstName ? 'auth-input-error' : firstName && !errors.firstName ? 'auth-input-success' : ''}`}>
                        <User className="auth-input-icon" />
                        <input
                          id="firstName"
                          type="text"
                          placeholder="Juan"
                          value={firstName}
                          onChange={(e) => handleFieldChange("firstName", e.target.value)}
                          className="auth-input"
                        />
                        {errors.firstName ? (
                          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        ) : firstName ? (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                      {errors.firstName && (
                        <p className="auth-error-text">
                          <XCircle className="w-3 h-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="auth-label">
                        Apellidos
                      </label>
                      <div className={`auth-input-wrapper ${errors.lastName ? 'auth-input-error' : lastName && !errors.lastName ? 'auth-input-success' : ''}`}>
                        <User className="auth-input-icon" />
                        <input
                          id="lastName"
                          type="text"
                          placeholder="Pérez"
                          value={lastName}
                          onChange={(e) => handleFieldChange("lastName", e.target.value)}
                          className="auth-input"
                        />
                        {errors.lastName ? (
                          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        ) : lastName ? (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                      {errors.lastName && (
                        <p className="auth-error-text">
                          <XCircle className="w-3 h-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="auth-label">
                      Teléfono
                    </label>
                    <div className={`auth-input-wrapper ${errors.phone ? 'auth-input-error' : phone && !errors.phone ? 'auth-input-success' : ''}`}>
                      <Phone className="auth-input-icon" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="300 123 4567"
                        value={phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="auth-input"
                      />
                      {errors.phone ? (
                        <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      ) : phone ? (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    {errors.phone && (
                      <p className="auth-error-text">
                        <XCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="auth-label">
                      Correo Electrónico
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
                        <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      ) : email ? (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    {errors.email && (
                      <p className="auth-error-text">
                        <XCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-2 gap-3">
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
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-eye-btn auth-eye-btn-inset"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="auth-error-text">
                          <XCircle className="w-3 h-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="confirmPassword" className="auth-label">
                        Confirmar Contraseña
                      </label>
                      <div className={`auth-input-wrapper ${errors.confirmPassword ? 'auth-input-error' : confirmPassword && !errors.confirmPassword ? 'auth-input-success' : ''}`}>
                        <Lock className="auth-input-icon" />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                          className="auth-input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="auth-eye-btn auth-eye-btn-inset"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="auth-error-text">
                          <XCircle className="w-3 h-3" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start pt-1">
                    <label htmlFor="terms" className="relative mt-0.5 cursor-pointer">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => handleFieldChange("terms", e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        terms
                          ? 'border-[#FF4D7A] bg-gradient-to-br from-[#FF4D7A] to-[#FFA726]'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}>
                        {terms && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                    <label htmlFor="terms" className="ml-2.5 text-sm text-gray-500 leading-relaxed cursor-pointer select-none">
                      Acepto los{" "}
                      <a href="#" className="font-semibold text-[#FF4D7A] hover:text-[#e04060] hover:underline underline-offset-2 transition-colors">
                        Términos y Condiciones
                      </a>{" "}
                      y la{" "}
                      <a href="#" className="font-semibold text-[#FF4D7A] hover:text-[#e04060] hover:underline underline-offset-2 transition-colors">
                        Política de Privacidad
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="auth-error-text">
                      <XCircle className="w-3 h-3" />
                      {errors.terms}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button - Outside scroll */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-primary-btn"
                >
                  <div className="auth-btn-shimmer" />
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Crear Cuenta</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== RIGHT PANEL - Decorative / Branding ===== */}
        <div className="auth-decorative-panel auth-animate-fade-in-right">
          {/* Back to Home */}
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
                  <img
                    src={loginDog}
                    alt="Adoptify - Conectando corazones con patitas"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Three circular gradient icons */}
            <div className="flex justify-center gap-5 mt-8">
              {[
                { Icon: PawPrint, delay: "0s" },
                { Icon: Heart, delay: "0.15s" },
                { Icon: Shield, delay: "0.3s" },
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
          </div>
        </div>
      </div>
    </div>
  );
}
