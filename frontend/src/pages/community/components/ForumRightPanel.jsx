import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import {
  Pin,
  Calendar,
  Syringe,
  Gift,
  Star,
  Sparkles,
  Shield,
  MapPin,
  Users,
  ExternalLink,
  Bot,
  Lightbulb,
  Heart,
  MessageSquare,
  Clock,
  TrendingUp,
} from "lucide-react";

const featuredPosts = [
  {
    id: 101,
    title: "📢 ¡Gran jornada de adopción este sábado!",
    excerpt: "Más de 50 perros y gatos esperan un hogar. ¡Te esperamos!",
    author: "Refugio Esperanza Animal",
    time: "Fijado",
    category: "Evento",
  },
  {
    id: 102,
    title: "🆘 Caso especial: Ayuda para Max",
    excerpt: "Max necesita una cirugía urgente. Cualquier donación es bienvenida.",
    author: "Refugio Patitas Felices",
    time: "Fijado",
    category: "Caso especial",
  },
];

const upcomingEvents = [
  {
    id: 201,
    title: "Jornada de Esterilización",
    date: "20 Jul 2026",
    location: "Clínica Veterinaria Municipal",
    type: "sterilization",
    icon: Syringe,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
  },
  {
    id: 202,
    title: "Vacunación Gratuita",
    date: "25 Jul 2026",
    location: "Parque Central",
    type: "vaccination",
    icon: Syringe,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-500/10",
  },
  {
    id: 203,
    title: "Feria de Adopción",
    date: "30 Jul 2026",
    location: "Plaza Mayor",
    type: "adoption",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-500/10",
  },
];

const popularTags = [
  { name: "AdopciónResponsable", count: 156 },
  { name: "CuidadosBásicos", count: 98 },
  { name: "PerrosFelices", count: 87 },
  { name: "GatosAdorables", count: 76 },
  { name: "SaludAnimal", count: 65 },
  { name: "EntrenamientoCanino", count: 54 },
  { name: "Alimentación", count: 48 },
  { name: "RescateAnimal", count: 42 },
  { name: "Esterilización", count: 38 },
  { name: "Vacunación", count: 35 },
];

const featuredShelters = [
  { name: "Refugio Esperanza", animals: 45, city: "Bogotá", color: "from-rose-500 to-pink-500" },
  { name: "Patitas Felices", animals: 32, city: "Medellín", color: "from-amber-500 to-orange-500" },
  { name: "Huellitas de Amor", animals: 28, city: "Cali", color: "from-emerald-500 to-teal-500" },
];

export default function ForumRightPanel() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardClass = `rounded-2xl p-5 ${
    isDark
      ? "bg-dark-card border border-dark-border"
      : "bg-white shadow-md shadow-gray-100/50"
  }`;

  const sectionTitleClass = `text-sm font-semibold uppercase tracking-wider mb-4 ${
    isDark ? "text-dark-text-secondary" : "text-gray-500"
  }`;

  return (
    <aside className="space-y-5">
      {/* ===== AI Assistant Card - AI Ready ===== */}
      <div className={`${cardClass} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? "text-dark-text" : "text-gray-900"}`}>
                Asistente IA
              </h3>
              <p className={`text-xs ${isDark ? "text-dark-text-secondary" : "text-gray-500"}`}>
                Respuestas inteligentes
              </p>
            </div>
            <span
              className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                isDark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-600"
              }`}
            >
              Beta
            </span>
          </div>
          <p className={`text-sm mb-3 ${isDark ? "text-dark-text-secondary" : "text-gray-600"}`}>
            Pregunta sobre adopción, cuidados o encuentra el refugio ideal para ti.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              "¿Cómo adoptar?",
              "Cuidados básicos",
              "Refugios cerca",
              "Alimentación",
            ].map((hint) => (
              <button
                key={hint}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  isDark
                    ? "bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {hint}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              className={`flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                isDark
                  ? "bg-[#15151f] border border-dark-border text-dark-text placeholder-dark-text-secondary"
                  : "bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400"
              }`}
              disabled
            />
            <button
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isDark
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-violet-100 text-violet-700"
              }`}
              disabled
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          <p
            className={`text-xs mt-2 text-center ${
              isDark ? "text-dark-text-secondary" : "text-gray-400"
            }`}
          >
            Próximamente disponible
          </p>
        </div>
      </div>

      {/* ===== Featured/Pinned Posts ===== */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <Pin className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
          <h3 className={sectionTitleClass}>Destacados</h3>
        </div>
        <div className="space-y-3">
          {featuredPosts.map((post) => (
            <button
              key={post.id}
              className={`w-full text-left p-3 rounded-xl transition-all group ${
                isDark
                  ? "hover:bg-white/5"
                  : "hover:bg-amber-50"
              }`}
            >
              <p
                className={`text-sm font-semibold leading-snug group-hover:text-rose-500 transition-colors ${
                  isDark ? "text-dark-text" : "text-gray-900"
                }`}
              >
                {post.title}
              </p>
              <p
                className={`text-xs mt-1 line-clamp-2 ${
                  isDark ? "text-dark-text-secondary" : "text-gray-500"
                }`}
              >
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? "bg-amber-500/10 text-amber-300" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  📌 {post.category}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-dark-text-secondary" : "text-gray-400"}`}
                >
                  {post.author}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Upcoming Events ===== */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className={`w-4 h-4 ${isDark ? "text-rose-400" : "text-rose-500"}`} />
          <h3 className={sectionTitleClass}>Próximos Eventos</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className={`flex gap-3 p-3 rounded-xl transition-all ${
                  isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${event.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${event.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? "text-dark-text" : "text-gray-900"
                    }`}
                  >
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs flex items-center gap-1 ${
                        isDark ? "text-dark-text-secondary" : "text-gray-500"
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className={`w-3 h-3 ${isDark ? "text-dark-text-secondary" : "text-gray-400"}`} />
                    <span
                      className={`text-xs ${isDark ? "text-dark-text-secondary" : "text-gray-500"}`}
                    >
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          to="/shelters"
          className={`flex items-center justify-center gap-1 mt-3 text-xs font-medium transition-all ${
            isDark
              ? "text-rose-400 hover:text-rose-300"
              : "text-rose-600 hover:text-rose-700"
          }`}
        >
          Ver todos los eventos
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* ===== Campaigns ===== */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <Star className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
          <h3 className={sectionTitleClass}>Campañas Activas</h3>
        </div>
        <div className="space-y-3">
          <div
            className={`p-3 rounded-xl ${
              isDark ? "bg-rose-500/10 border border-rose-500/20" : "bg-rose-50 border border-rose-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Syringe className={`w-4 h-4 ${isDark ? "text-rose-400" : "text-rose-600"}`} />
              <p
                className={`text-sm font-semibold ${
                  isDark ? "text-rose-300" : "text-rose-700"
                }`}
              >
                Campaña de Esterilización
              </p>
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-dark-text-secondary" : "text-gray-600"
              }`}
            >
              200 esterilizaciones gratuitas para perros y gatos en zonas vulnerables.
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={isDark ? "text-dark-text-secondary" : "text-gray-500"}>Progreso</span>
                <span className={isDark ? "text-rose-300" : "text-rose-600"}>72%</span>
              </div>
              <div
                className={`h-2 rounded-full ${
                  isDark ? "bg-dark-border" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                  style={{ width: "72%" }}
                ></div>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl ${
              isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Gift className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
              <p
                className={`text-sm font-semibold ${
                  isDark ? "text-amber-300" : "text-amber-700"
                }`}
              >
                Donación de Alimento
              </p>
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-dark-text-secondary" : "text-gray-600"
              }`}
            >
              Recolectamos alimento para más de 300 animales en refugios locales.
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={isDark ? "text-dark-text-secondary" : "text-gray-500"}>Meta</span>
                <span className={isDark ? "text-amber-300" : "text-amber-600"}>2,000 kg</span>
              </div>
              <div
                className={`h-2 rounded-full ${
                  isDark ? "bg-dark-border" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Popular Tags ===== */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
          <h3 className={sectionTitleClass}>Etiquetas Populares</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.slice(0, 8).map((tag) => (
            <button
              key={tag.name}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-rose-500/20 hover:text-rose-300"
                  : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              <span>#</span>
              {tag.name}
              <span
                className={`text-xs ${
                  isDark ? "text-dark-text-secondary" : "text-gray-400"
                }`}
              >
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Featured Shelters ===== */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
          <h3 className={sectionTitleClass}>Refugios Destacados</h3>
        </div>
        <div className="space-y-3">
          {featuredShelters.map((shelter) => (
            <Link
              key={shelter.name}
              to="/shelters"
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${shelter.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
              >
                {shelter.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold group-hover:text-rose-500 transition-colors ${
                    isDark ? "text-dark-text" : "text-gray-900"
                  }`}
                >
                  {shelter.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin
                    className={`w-3 h-3 ${isDark ? "text-dark-text-secondary" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-xs ${isDark ? "text-dark-text-secondary" : "text-gray-500"}`}
                  >
                    {shelter.city}
                  </span>
                  <Users
                    className={`w-3 h-3 ${isDark ? "text-dark-text-secondary" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-xs ${isDark ? "text-dark-text-secondary" : "text-gray-500"}`}
                  >
                    {shelter.animals} animales
                  </span>
                </div>
              </div>
              <ExternalLink
                className={`w-4 h-4 shrink-0 ${
                  isDark
                    ? "text-dark-text-secondary group-hover:text-rose-400"
                    : "text-gray-400 group-hover:text-rose-500"
                } transition-colors`}
              />
            </Link>
          ))}
        </div>
        <Link
          to="/shelters"
          className={`flex items-center justify-center gap-1 mt-3 text-xs font-medium transition-all ${
            isDark
              ? "text-rose-400 hover:text-rose-300"
              : "text-rose-600 hover:text-rose-700"
          }`}
        >
          Ver todos los refugios
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* ===== AI Recommendations Placeholder ===== */}
      <div
        className={`${cardClass} border-2 border-dashed ${
          isDark ? "border-violet-500/30" : "border-violet-300/50"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`w-4 h-4 ${isDark ? "text-violet-400" : "text-violet-500"}`} />
          <h3
            className={`text-sm font-semibold uppercase tracking-wider ${
              isDark ? "text-violet-300" : "text-violet-700"
            }`}
          >
            Recomendaciones IA
          </h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <Lightbulb
              className={`w-8 h-8 mx-auto mb-2 ${
                isDark ? "text-violet-400" : "text-violet-500"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                isDark ? "text-dark-text" : "text-gray-900"
              }`}
            >
              Recomendaciones inteligentes
            </p>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-dark-text-secondary" : "text-gray-500"
              }`}
            >
              Próximamente: Contenido personalizado para ti
            </p>
            <div className="flex items-center justify-center gap-1 mt-3">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
              <div
                className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
