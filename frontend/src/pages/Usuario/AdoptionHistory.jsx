import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Clock,
  ChevronRight,
  ArrowUp,
  Dog,
  Cat,
  Heart,
  ClipboardList,
  ThumbsUp,
  Home,
  UserCheck,
  FileText,
  ArrowRight,
  User,
} from "lucide-react";

const ADOPTIONS = [
  {
    id: 1,
    name: "Max",
    breed: "Golden Retriever",
    type: "dog",
    age: "2 años",
    shelter: "Refugio 'Hogar de huellas'",
    location: "Bogotá, Colombia",
    status: "approved",
    date: "15 Ene 2024",
    phone: "+57 300 123 4567",
    notes: "Adaptación excelente. Max disfruta de largos paseos en el parque.",
    followUpDate: "15 Abr 2024",
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siamés",
    type: "cat",
    age: "1.5 años",
    shelter: "Refugio 'Patitas de amor'",
    location: "Medellín, Colombia",
    status: "pending",
    date: "20 Feb 2024",
    phone: "+57 300 234 5678",
    notes: "Entrevista pendiente con el hogar temporal.",
    followUpDate: null,
    progress: 60,
  },
  {
    id: 3,
    name: "Rocky",
    breed: "Bulldog Francés",
    type: "dog",
    age: "3 años",
    shelter: "Fundación 'Amigo fiel'",
    location: "Cali, Colombia",
    status: "rejected",
    date: "10 Dic 2023",
    phone: "+57 300 345 6789",
    notes: "No cumple con los requisitos de espacio del hogar.",
    followUpDate: null,
  },
  {
    id: 4,
    name: "Misu",
    breed: "Persa",
    type: "cat",
    age: "4 años",
    shelter: "Refugio 'Nueva vida'",
    location: "Barranquilla, Colombia",
    status: "approved",
    date: "05 Mar 2024",
    phone: "+57 300 456 7890",
    notes: "Se adaptó rápidamente. Le encanta dormir al sol.",
    followUpDate: "05 Jun 2024",
  },
  {
    id: 5,
    name: "Toby",
    breed: "Beagle",
    type: "dog",
    age: "1 año",
    shelter: "Fundación 'Amigo fiel'",
    location: "Bogotá, Colombia",
    status: "pending",
    date: "28 Mar 2024",
    phone: "+57 300 567 8901",
    notes: "Documentación en revisión por el equipo jurídico.",
    followUpDate: null,
    progress: 40,
  },
  {
    id: 6,
    name: "Canela",
    breed: "Mestizo",
    type: "dog",
    age: "5 años",
    shelter: "Refugio 'Hogar de huellas'",
    location: "Medellín, Colombia",
    status: "rejected",
    date: "22 Nov 2023",
    phone: "+57 300 678 9012",
    notes: "Solicitud incompleta. Se requiere nuevo formulario.",
    followUpDate: null,
  },
];

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    darkBg: "dark:bg-emerald-900/20",
    border: "border-emerald-200",
    darkBorder: "dark:border-emerald-800",
    lightBg: "bg-emerald-50/50",
    label: "Aprobada",
    gradient: "from-emerald-400 to-emerald-500",
    progressColor: "bg-emerald-500",
  },
  pending: {
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    darkBg: "dark:bg-amber-900/20",
    border: "border-amber-200",
    darkBorder: "dark:border-amber-800",
    lightBg: "bg-amber-50/50",
    label: "En revisión",
    gradient: "from-amber-400 to-amber-500",
    progressColor: "bg-amber-500",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    darkBg: "dark:bg-red-900/20",
    border: "border-red-200",
    darkBorder: "dark:border-red-800",
    lightBg: "bg-red-50/50",
    label: "Rechazada",
    gradient: "from-red-400 to-red-500",
    progressColor: "bg-red-500",
  },
};

const FILTER_TABS = [
  { key: "all", label: "Todas", icon: ClipboardList },
  { key: "approved", label: "Aprobadas", icon: CheckCircle },
  { key: "pending", label: "En revisión", icon: AlertCircle },
  { key: "rejected", label: "Rechazadas", icon: XCircle },
];

const PROCESS_STEPS = [
  { icon: FileText, label: "Solicitud enviada", key: 0 },
  { icon: UserCheck, label: "Revisión de datos", key: 1 },
  { icon: MessageCircle, label: "Entrevista", key: 2 },
  { icon: Home, label: "Visita domiciliaria", key: 3 },
  { icon: Heart, label: "¡Adopción completada!", key: 4 },
];

export default function AdoptionHistory() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = useMemo(() => ({
    total: ADOPTIONS.length,
    approved: ADOPTIONS.filter((a) => a.status === "approved").length,
    pending: ADOPTIONS.filter((a) => a.status === "pending").length,
    rejected: ADOPTIONS.filter((a) => a.status === "rejected").length,
  }), []);

  const filteredAdoptions = useMemo(() => {
    let result = ADOPTIONS;

    if (activeFilter !== "all") {
      result = result.filter((a) => a.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          a.breed.toLowerCase().includes(term) ||
          a.shelter.toLowerCase().includes(term) ||
          a.location.toLowerCase().includes(term)
      );
    }

    return result;
  }, [activeFilter, searchTerm]);

  const getStatusStyle = (status) => STATUS_CONFIG[status];

  const getStatusCount = (status) => {
    if (status === "all") return stats.total;
    return stats[status];
  };

  const TypeIcon = ({ type }) => {
    if (type === "dog") return <Dog className="w-5 h-5 dark:text-gray-400" />;
    return <Cat className="w-5 h-5 dark:text-gray-400" />;
  };

  const AdoptionProgress = ({ progress }) => {
    const completedSteps = Math.round((progress / 100) * (PROCESS_STEPS.length - 1));

    return (
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-amber-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Progreso de la solicitud
          </span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-auto">
            {progress}%
          </span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {PROCESS_STEPS.slice(0, 3).map((step, i) => (
              <div
                key={step.key}
                className={`flex flex-col items-center transition-all duration-300 ${
                  i <= completedSteps
                    ? "text-amber-600 dark:text-gray-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                <step.icon className="w-3.5 h-3.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-[#1a0a0f] dark:via-[#0f0f13] dark:to-[#1a1208] relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-rose-200/20 dark:bg-rose-500/5 rounded-full blur-3xl animate-float-1" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl animate-float-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-300/10 dark:bg-rose-600/5 rounded-full blur-3xl animate-float-3" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            <span>Mi historial</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 font-display tracking-tight">
            Historial de{" "}
            <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              Adopciones
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Seguimiento completo de todas tus solicitudes de adopción
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: stats.total, icon: ClipboardList, color: "from-rose-400 to-amber-400", shadow: "shadow-rose-200 dark:shadow-rose-900/20" },
            { label: "Aprobadas", value: stats.approved, icon: CheckCircle, color: "from-emerald-400 to-emerald-500", shadow: "shadow-emerald-200 dark:shadow-emerald-900/20" },
            { label: "En revisión", value: stats.pending, icon: AlertCircle, color: "from-amber-400 to-amber-500", shadow: "shadow-amber-200 dark:shadow-amber-900/20" },
            { label: "Rechazadas", value: stats.rejected, icon: XCircle, color: "from-red-400 to-red-500", shadow: "shadow-red-200 dark:shadow-red-900/20" },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, raza o refugio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-100 dark:border-dark-border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-rose-300 dark:focus:border-rose-600 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-900/20 transition-all duration-300 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.key;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30 scale-105"
                        : "bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 border-2 border-gray-100 dark:border-dark-border"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {getStatusCount(tab.key)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>
              {filteredAdoptions.length === 0
                ? "Sin resultados"
                : filteredAdoptions.length === 1
                ? "1 solicitud encontrada"
                : `${filteredAdoptions.length} solicitudes encontradas`}
            </span>
          </div>
          {activeFilter !== "all" && (
            <button
              onClick={() => setActiveFilter("all")}
              className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Adoption Cards */}
        {filteredAdoptions.length > 0 ? (
          <div className="space-y-6">
            {filteredAdoptions.map((adoption, index) => {
              const style = getStatusStyle(adoption.status);
              const Icon = style.icon;
              const isPending = adoption.status === "pending";

              return (
                <div
                  key={adoption.id}
                  className="group bg-white dark:bg-dark-card rounded-2xl shadow-lg hover:shadow-2xl border-2 border-gray-100 dark:border-dark-border hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-500 overflow-hidden animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Status Accent Bar */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${style.gradient} transition-all duration-500 group-hover:h-2`}
                  />

                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-7">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${style.gradient} rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}
                        >
                          <PawPrint className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        <div
                          className={`absolute -top-2 -right-2 w-8 h-8 ${style.bg} dark:${style.darkBg} border-2 border-white dark:border-dark-card rounded-full flex items-center justify-center shadow-md`}
                        >
                          <TypeIcon type={adoption.type} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">
                                {adoption.name}
                              </h3>
                              <span className="text-sm text-gray-400 dark:text-gray-500">
                                • {adoption.age}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                              <TypeIcon type={adoption.type} />
                              {adoption.breed}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 ${style.bg} ${style.darkBg} rounded-xl border ${style.border} ${style.darkBorder} self-start`}
                          >
                            <Icon className={`w-4 h-4 ${style.color} dark:text-gray-400`} />
                            <span
                              className={`text-xs sm:text-sm font-bold ${style.color}`}
                            >
                              {style.label}
                            </span>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg rounded-xl px-3 py-2">
                            <MapPin className="w-4 h-4 text-rose-400 dark:text-rose-500 flex-shrink-0" />
                            <span className="truncate">{adoption.shelter}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg rounded-xl px-3 py-2">
                            <MapPin className="w-4 h-4 text-amber-400 dark:text-amber-500 flex-shrink-0" />
                            <span className="truncate">{adoption.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg rounded-xl px-3 py-2">
                            <Calendar className="w-4 h-4 text-rose-400 dark:text-rose-500 flex-shrink-0" />
                            <span>Solicitado: {adoption.date}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {adoption.notes && (
                          <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-dark-bg/50 rounded-xl px-3 py-2 mb-4">
                            <MessageCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                            <p className="italic">{adoption.notes}</p>
                          </div>
                        )}

                        {/* Follow-up Date for Approved */}
                        {adoption.status === "approved" && adoption.followUpDate && (
                          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2 mb-4">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">
                              Próximo seguimiento: {adoption.followUpDate}
                            </span>
                          </div>
                        )}

                        {/* Progress Timeline for Pending */}
                        {isPending && (
                          <AdoptionProgress progress={adoption.progress} />
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${adoption.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/30"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Phone */}
                          <a
                            href={`tel:${adoption.phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-dark-border"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">Llamar</span>
                          </a>

                          {/* View Profile (Approved) or Browse Others (Rejected) */}
                          {adoption.status === "approved" && (
                            <Link
                              to={`/animal/${adoption.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30"
                            >
                              <PawPrint className="w-4 h-4" />
                              <span>Ver perfil</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}

                          {adoption.status === "pending" && (
                            <Link
                              to={`/animal/${adoption.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-amber-200 dark:border-amber-800"
                            >
                              <PawPrint className="w-4 h-4" />
                              <span>Ver mascota</span>
                            </Link>
                          )}

                          {adoption.status === "rejected" && (
                            <Link
                              to="/animals"
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30"
                            >
                              <Search className="w-4 h-4" />
                              <span>Buscar otra mascota</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          )}

                          {/* Details Button */}
                          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 ml-auto">
                            <span>Detalles</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-rose-400 dark:text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-display">
              {searchTerm
                ? "Sin resultados de búsqueda"
                : activeFilter !== "all"
                ? `No hay solicitudes ${FILTER_TABS.find((t) => t.key === activeFilter)?.label.toLowerCase()}`
                : "No hay solicitudes de adopción"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "Intenta con otros términos o limpia los filtros para ver todas tus solicitudes."
                : activeFilter !== "all"
                ? "Cambia de filtro o explora mascotas disponibles para adoptar."
                : "Comienza explorando mascotas disponibles para adopción y envía tu primera solicitud."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || activeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 border border-gray-200 dark:border-dark-border"
                >
                  Limpiar filtros
                </button>
              )}
              <Link
                to="/animals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30"
              >
                <PawPrint className="w-5 h-5" />
                Explorar mascotas
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {filteredAdoptions.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to="/animals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-200 dark:hover:shadow-rose-900/30"
            >
              <PawPrint className="w-5 h-5" />
              Explorar más mascotas
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center animate-bounce-subtle"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out both;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
