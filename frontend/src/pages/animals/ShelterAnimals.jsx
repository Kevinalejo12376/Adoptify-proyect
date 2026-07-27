import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PawPrint, Search, Heart, MapPin, CheckCircle, Star, Filter, ChevronDown, X } from "lucide-react";

export default function ShelterAnimals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock data - in a real app this would come from an API
  const shelter = {
    id: id || 1,
    name: "Hogar de huellas",
    location: "Ibagué - Tolima",
    verified: true,
    rating: 4.8,
    totalRatings: 127,
    logo: null,
    pets: [
      { id: 1, name: "Max", type: "Perro", breed: "Golden Retriever", age: "7 meses", size: "Grande", gender: "Macho", image: null },
      { id: 2, name: "Leo", type: "Perro", breed: "Labrador", age: "4 meses", size: "Mediano", gender: "Macho", image: null },
      { id: 3, name: "Layla", type: "Gato", breed: "Siamés", age: "24 meses", size: "Pequeño", gender: "Hembra", image: null },
      { id: 4, name: "Rio", type: "Perro", breed: "Beagle", age: "12 meses", size: "Mediano", gender: "Macho", image: null },
      { id: 5, name: "Luna", type: "Gato", breed: "Persa", age: "6 meses", size: "Pequeño", gender: "Hembra", image: null },
      { id: 6, name: "Thor", type: "Perro", breed: "Husky Siberiano", age: "18 meses", size: "Grande", gender: "Macho", image: null },
      { id: 7, name: "Mia", type: "Gato", breed: "Bengalí", age: "8 meses", size: "Pequeño", gender: "Hembra", image: null },
      { id: 8, name: "Rocky", type: "Perro", breed: "Bulldog", age: "36 meses", size: "Mediano", gender: "Macho", image: null },
      { id: 9, name: "Simba", type: "Gato", breed: "Maine Coon", age: "10 meses", size: "Grande", gender: "Macho", image: null },
      { id: 10, name: "Coco", type: "Perro", breed: "Caniche", age: "5 meses", size: "Pequeño", gender: "Hembra", image: null },
      { id: 11, name: "Nala", type: "Gato", breed: "Angora", age: "14 meses", size: "Mediano", gender: "Hembra", image: null },
      { id: 12, name: "Kira", type: "Perro", breed: "Pastor Alemán", age: "20 meses", size: "Grande", gender: "Hembra", image: null }
    ]
  };

  const filteredPets = shelter.pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || pet.type === selectedType;
    const matchesSize = selectedSize === "all" || pet.size === selectedSize;
    const matchesAge = selectedAge === "all" || pet.age.includes(selectedAge);
    const matchesGender = selectedGender === "all" || pet.gender === selectedGender;
    
    return matchesSearch && matchesType && matchesSize && matchesAge && matchesGender;
  });

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedSize("all");
    setSelectedAge("all");
    setSelectedGender("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-amber-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-rose-200/20 rounded-full blur-3xl animate-float-1" />
        <div className="absolute top-40 right-32 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl animate-float-2" />
        <div className="absolute bottom-32 left-40 w-44 h-44 bg-rose-300/15 rounded-full blur-3xl animate-float-3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 hover:text-rose-500 transition-all duration-300 hover:scale-105 ${
            isVisible ? "animate-fade-in-left" : "opacity-0"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al refugio
        </button>

        {/* Header */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 hover-lift ${
          isVisible ? "animate-fade-in-down" : "opacity-0"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <PawPrint className="w-8 h-8 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">{shelter.name}</h1>
                  {shelter.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    {shelter.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {shelter.rating} ({shelter.totalRatings})
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                    {shelter.pets.length} mascotas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className={`mb-6 ${
          isVisible ? "animate-fade-in-up animation-delay-100" : "opacity-0"
        }`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o raza..."
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
          <div className={`mb-6 bg-white rounded-2xl shadow-lg p-6 ${
            isVisible ? "animate-fade-in-up animation-delay-150" : "opacity-0"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">Todos</option>
                  <option value="Perro">Perros</option>
                  <option value="Gato">Gatos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">Todos</option>
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">Todas</option>
                  <option value="meses">Cachorros (meses)</option>
                  <option value="año">1 año</option>
                  <option value="años">Adultos (años)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">Todos</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className={`mb-6 flex justify-between items-center ${
          isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0"
        }`}>
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredPets.length}</span> mascotas
          </p>
        </div>

        {/* Pets Grid */}
        <div className={`${
          isVisible ? "animate-slide-up-fade animation-delay-300" : "opacity-0"
        }`}>
          {filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPets.map((pet, index) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  style={{ animationDelay: `${200 + index * 80}ms` }}
                >
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center overflow-hidden img-zoom-container">
                      <div className="zoom-content w-full h-full flex items-center justify-center">
                        <PawPrint className="w-20 h-20 text-rose-400 group-hover:text-rose-500 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                        <Heart className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        {pet.age}
                      </span>
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        {pet.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 font-display">{pet.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{pet.breed}</p>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs">{pet.size}</span>
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs">{pet.gender}</span>
                    </div>
                    <Link
                      to={`/animal/${pet.id}`}
                      className="block w-full px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-lg hover:from-rose-600 hover:to-amber-600 transition-all duration-300 text-center hover:shadow-md active:scale-95"
                    >
                      Ver perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron mascotas</h3>
              <p className="text-gray-500 mb-4">Intenta con otros filtros o términos de búsqueda</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
