import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Users,
  PawPrint,
  ArrowRight,
  Filter,
  ChevronDown,
  Home,
  X,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Phone as PhoneIcon,
  Mail as MailIcon,
} from "lucide-react";
import ScrollToTop from "../../components/ScrollToTop";
import { useFavorites } from "../../context/FavoritesContext";

export default function Shelters() {
  const { isShelterFavorite, toggleShelterFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const shelters = [
    {
      id: 1,
      name: "Refugio 'Hogar de huellas'",
      location: "Bogotá",
      address: "Calle 123 #45-67",
      phone: "+57 300 123 4567",
      email: "contacto@hogardehuellas.org",
      rating: 4.8,
      animals: 45,
      description: "Dedicados al rescate y rehabilitación de animales en situación de calle. Trabajamos con amor y dedicación para encontrar hogares responsables.",
      image: null
    },
    {
      id: 2,
      name: "Refugio 'Patitas de amor'",
      location: "Medellín",
      address: "Carrera 78 #12-34",
      phone: "+57 300 234 5678",
      email: "info@patitasdeamor.org",
      rating: 4.9,
      animals: 62,
      description: "Nuestra misión es proteger y cuidar a los animales más vulnerables. Ofrecemos atención veterinaria, alimentación y mucho amor.",
      image: null
    },
    {
      id: 3,
      name: "Fundación 'Amigo fiel'",
      location: "Cali",
      address: "Avenida 5 #67-89",
      phone: "+57 300 345 6789",
      email: "fundacion@amigofiel.org",
      rating: 4.7,
      animals: 38,
      description: "Somos una organización sin ánimo de lucro comprometida con el bienestar animal. Educamos a la comunidad sobre tenencia responsable.",
      image: null
    },
    {
      id: 4,
      name: "Refugio 'Nueva vida'",
      location: "Barranquilla",
      address: "Calle 72 #34-56",
      phone: "+57 300 456 7890",
      email: "refugio@nuevavida.org",
      rating: 4.6,
      animals: 51,
      description: "Damos una segunda oportunidad a animales que necesitan un hogar. Nuestro equipo trabaja incansablemente por cada vida.",
      image: null
    },
    {
      id: 5,
      name: "Refugio 'Esperanza animal'",
      location: "Bucaramanga",
      address: "Carrera 33 #21-43",
      phone: "+57 300 567 8901",
      email: "esperanza@refugio.org",
      rating: 4.8,
      animals: 29,
      description: "Protegemos y rehabilitamos animales maltratados o abandonados. Buscamos familias amorosas que les den el hogar que merecen.",
      image: null
    },
    {
      id: 6,
      name: "Fundación 'Corazón peludo'",
      location: "Pereira",
      address: "Calle 19 #56-78",
      phone: "+57 300 678 9012",
      email: "corazon@fundacion.org",
      rating: 4.5,
      animals: 33,
      description: "Trabajamos por el bienestar de los animales a través de rescates, adopciones y programas educativos en la comunidad.",
      image: null
    }
  ];

  const cities = ["all", "Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Pereira"];

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || shelter.location === selectedCity;
    return matchesSearch && matchesCity;
  });

  const hasActiveFilters = selectedCity !== "all" || searchTerm !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
  };

  const getShelterGradient = (id) => {
    const gradients = [
      "from-rose-400 to-pink-500",
      "from-amber-400 to-orange-500",
      "from-emerald-400 to-teal-500",
      "from-blue-400 to-indigo-500",
      "from-violet-400 to-purple-500",
      "from-cyan-400 to-sky-500",
    ];
    return gradients[(id - 1) % gradients.length];
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500/10 to-amber-500/10 dark:from-rose-900/20 dark:to-amber-900/20 text-rose-600 dark:text-rose-400 rounded-full text-sm font-semibold mb-4 border border-rose-200/50 dark:border-rose-800/30">
            <Building2 className="w-4 h-4" />
            Refugios
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-dark-text mb-4 font-display leading-tight">
            Refugios{" "}
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              Asociados
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-dark-text-secondary max-w-2xl">
            Conoce a los refugios que trabajan incansablemente por el bienestar de los animales
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar refugio por nombre o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-36 py-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm dark:text-dark-text dark:placeholder-dark-text-secondary"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary hover:text-rose-600 dark:hover:text-rose-400 bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                  title="Limpiar filtros"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  showFilters
                    ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-200/40 dark:shadow-rose-500/20"
                    : "bg-white dark:bg-dark-card text-gray-600 dark:text-dark-text-secondary border border-gray-200 dark:border-dark-border hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg dark:shadow-dark-border/20 border border-gray-100 dark:border-dark-border overflow-hidden">
              {/* Filters Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-gradient-to-r from-rose-50/50 to-amber-50/50 dark:from-rose-900/5 dark:to-amber-900/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text font-display">
                    Filtrar por ciudad
                  </h3>
                  {hasActiveFilters && (
                    <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full">
                      Activos
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-gray-400 dark:text-dark-text-secondary hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar todo
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        selectedCity === city
                          ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-200/40 dark:shadow-rose-500/20 scale-105"
                          : "bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text-secondary border border-gray-200 dark:border-dark-border hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/10"
                      }`}
                    >
                      <MapPin className={`w-4 h-4 ${selectedCity === city ? "" : "text-gray-400 dark:text-dark-text-secondary"}`} />
                      {city === "all" ? "Todas las ciudades" : city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results info */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              Mostrando{" "}
              <span className="font-semibold text-gray-900 dark:text-dark-text">
                {filteredShelters.length}
              </span>{" "}
              {filteredShelters.length === 1 ? "refugio" : "refugios"}
              {hasActiveFilters && (
                <span className="text-gray-400 dark:text-dark-text-secondary">
                  {" "}(con filtros aplicados)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map((shelter) => {
            const gradient = getShelterGradient(shelter.id);
            const isFav = isShelterFavorite(shelter.id);

            return (
              <div
                key={shelter.id}
                className="group bg-white dark:bg-dark-card rounded-2xl shadow-lg dark:shadow-dark-border/20 overflow-hidden hover:shadow-xl dark:hover:shadow-dark-border/40 transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 dark:border-dark-border"
              >
                {/* Shelter Image */}
                <Link to={`/shelter/${shelter.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 dark:opacity-40`} />
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)'
                      }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <Home className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm text-gray-700 dark:text-dark-text text-sm font-semibold rounded-full shadow-lg">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {shelter.rating}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute top-12 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm text-gray-700 dark:text-dark-text text-xs font-bold rounded-full shadow-lg">
                        <MapPin className="w-2.5 h-2.5 text-rose-500" />
                        {shelter.location}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleShelterFavorite(shelter);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isFav
                          ? "bg-rose-500 text-white scale-110"
                          : "bg-white/90 dark:bg-dark-card/90 text-gray-400 hover:bg-white dark:hover:bg-dark-card opacity-0 group-hover:opacity-100"
                      }`}
                      title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? "fill-white" : ""
                        }`}
                      />
                    </button>
                  </div>
                </Link>

                {/* Shelter Info */}
                <div className="p-5">
                  {/* Name */}
                  <Link to={`/shelter/${shelter.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-2 font-display line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {shelter.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-base text-gray-500 dark:text-dark-text-secondary mb-4 line-clamp-2 leading-relaxed">
                    {shelter.description}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-dark-text-secondary">
                      <PawPrint className="w-3.5 h-3.5 text-rose-400" />
                      {shelter.animals} animales
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-dark-text-secondary">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Activo
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                      <PhoneIcon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="truncate">{shelter.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                      <MailIcon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="truncate">{shelter.email}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5">
                    <a
                      href={`https://wa.me/${shelter.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200/50 dark:shadow-emerald-500/20 active:scale-[0.97] transition-all duration-300"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <Link
                      to={`/shelter/${shelter.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-200/50 dark:shadow-rose-500/20 active:scale-[0.97] transition-all duration-300"
                    >
                      Ver más
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredShelters.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center">
              <Home className="w-10 h-10 text-rose-400 dark:text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">
              No se encontraron refugios
            </h3>
            <p className="text-gray-500 dark:text-dark-text-secondary mb-6 max-w-md mx-auto">
              Intenta con otros filtros o términos de búsqueda. ¡Tenemos muchos refugios asociados!
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg shadow-rose-200/50 dark:shadow-rose-500/20 hover:scale-105 active:scale-95"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
