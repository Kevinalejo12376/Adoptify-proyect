import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, PawPrint, Heart, MapPin, Calendar, ChevronDown, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ScrollToTop from "../../components/ScrollToTop";

export default function Animals() {
  const { addFavorite, removeFavorite, isFavorite } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  const toggleFavorite = (animal) => {
    if (isFavorite(animal.id)) {
      removeFavorite(animal.id);
    } else {
      addFavorite(animal);
    }
  };

  const animals = [
    { id: 1, name: "Max", type: "Perro", breed: "Golden Retriever", age: "2 años", size: "Grande", gender: "Macho", shelter: "Refugio 'Hogar de huellas'", image: null },
    { id: 2, name: "Luna", type: "Gato", breed: "Siamés", age: "1 año", size: "Pequeño", gender: "Hembra", shelter: "Refugio 'Patitas de amor'", image: null },
    { id: 3, name: "Thor", type: "Perro", breed: "Husky Siberiano", age: "3 años", size: "Grande", gender: "Macho", shelter: "Fundación 'Amigo fiel'", image: null },
    { id: 4, name: "Mia", type: "Gato", breed: "Persa", age: "2 años", size: "Mediano", gender: "Hembra", shelter: "Refugio 'Nueva vida'", image: null },
    { id: 5, name: "Rocky", type: "Perro", breed: "Bulldog", age: "4 años", size: "Mediano", gender: "Macho", shelter: "Refugio 'Hogar de huellas'", image: null },
    { id: 6, name: "Simba", type: "Gato", breed: "Maine Coon", age: "1 año", size: "Grande", gender: "Macho", shelter: "Refugio 'Patitas de amor'", image: null },
    { id: 7, name: "Coco", type: "Perro", breed: "Beagle", age: "6 meses", size: "Pequeño", gender: "Hembra", shelter: "Fundación 'Amigo fiel'", image: null },
    { id: 8, name: "Nala", type: "Gato", breed: "Bengalí", age: "3 años", size: "Mediano", gender: "Hembra", shelter: "Refugio 'Nueva vida'", image: null },
  ];

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || animal.type === selectedType;
    const matchesSize = selectedSize === "all" || animal.size === selectedSize;
    const matchesAge = selectedAge === "all" || animal.age.includes(selectedAge);
    const matchesGender = selectedGender === "all" || animal.gender === selectedGender;
    
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
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">
            Explorar Mascotas
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra a tu compañero perfecto entre cientos de animales esperando un hogar
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
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
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
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
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredAnimals.length}</span> mascotas
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-rose-300 hover:text-rose-600 transition-all">
              Recientes
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-rose-300 hover:text-rose-600 transition-all">
              Populares
            </button>
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map((animal) => (
            <div key={animal.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
                  <PawPrint className="w-20 h-20 text-rose-400" />
                </div>
                <button
                  onClick={() => toggleFavorite(animal)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite(animal.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} 
                  />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {animal.type}
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {animal.age}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1 font-display">{animal.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{animal.breed}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {animal.shelter}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg">{animal.size}</span>
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg">{animal.gender}</span>
                  </div>
                  <Link 
                    to={`/animal/${animal.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-full hover:from-rose-600 hover:to-amber-600 transition-all"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAnimals.length === 0 && (
          <div className="text-center py-16">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron mascotas</h3>
            <p className="text-gray-600 mb-4">Intenta con otros filtros o términos de búsqueda</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
