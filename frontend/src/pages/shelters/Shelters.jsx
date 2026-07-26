import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Phone, Mail, Star, Heart, Users, PawPrint, ArrowRight, Filter, ChevronDown, Home, Loader2 } from "lucide-react";
import ScrollToTop from "../../components/ScrollToTop";
import { useFavorites } from "../../context/FavoritesContext";
import { listarRefugios } from "../../api/refugios";

export default function Shelters() {
  const { isShelterFavorite, toggleShelterFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga los refugios reales desde la base de datos.
  useEffect(() => {
    let activo = true;
    (async () => {
      setLoading(true); setError(null);
      try {
        const data = await listarRefugios();
        if (!activo) return;
        setShelters(data.map((r) => ({
          id: r.id,
          name: r.nombre,
          location: r.ubicacion || "Sin ciudad",
          address: r.direccion || "",
          phone: r.telefono || "",
          email: r.email || "",
          rating: 0,
          animals: null,
          description: r.descripcion || "Refugio comprometido con el bienestar animal.",
          image: null,
        })));
      } catch (e) {
        if (activo) setError(e?.message || "No se pudieron cargar los refugios");
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  // Ciudades generadas dinamicamente a partir de los refugios reales.
  const cities = ["all", ...Array.from(new Set(shelters.map((s) => s.location).filter(Boolean)))];

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || shelter.location === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">
            Refugios Asociados
          </h1>
          <p className="text-xl text-gray-600">
            Conoce a los refugios que trabajan incansablemente por el bienestar de los animales
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar refugio por nombre o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por ciudad</h3>
            <div className="flex flex-wrap gap-2">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCity === city
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {city === "all" ? "Todas" : city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Estado de carga / error */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
            <p>Cargando refugios...</p>
          </div>
        )}
        {error && !loading && (
          <div className="py-6 mb-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>
        )}

        {!loading && !error && (
        <>
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredShelters.length}</span> refugios
          </p>
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map((shelter) => (
            <div key={shelter.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
                  <Home className="w-20 h-20 text-rose-400" />
                </div>
                {shelter.rating > 0 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {shelter.rating}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleShelterFavorite(shelter);
                  }}
                  className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 ${
                    isShelterFavorite(shelter.id)
                      ? "bg-rose-500 text-white"
                      : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-rose-500"
                  }`}
                  title={isShelterFavorite(shelter.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart className={`w-5 h-5 ${isShelterFavorite(shelter.id) ? "fill-white" : ""}`} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{shelter.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{shelter.location}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{shelter.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Activo
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {shelter.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-rose-500" />
                      <span>{shelter.phone}</span>
                    </div>
                  )}
                  {shelter.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-rose-500" />
                      <span className="truncate">{shelter.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {shelter.phone && (
                  <a
                    href={`https://wa.me/${shelter.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </a>
                  )}
                  <Link
                    to={`/shelter/${shelter.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all"
                  >
                    Ver más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredShelters.length === 0 && (
          <div className="text-center py-16">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron refugios</h3>
            <p className="text-gray-600 mb-4">Intenta con otros filtros o términos de búsqueda</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
        </>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
