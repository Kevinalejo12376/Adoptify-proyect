import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ScrollToTop from "../../components/ScrollToTop";
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Share2,
  Clock,
  Filter,
  ChevronDown,
  Heart,
  Bookmark,
  Send,
  X,
  Grid3X3,
  List,
  Sparkles,
  User,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";
import ForumRightPanel from "./components/ForumRightPanel";
import ForumPostCard from "./components/ForumPostCard";
import CreatePostModal from "./components/CreatePostModal";
import PostDetailModal from "./components/PostDetailModal";

// Sample data for the forum
const samplePosts = [
  {
    id: 1,
    title: "¿Cómo ayudar a mi perro con ansiedad por separación?",
    author: "María García",
    authorInitials: "MG",
    accountType: "user",
    badges: ["expert"],
    time: "hace 2 horas",
    category: "Cuidado",
    content: "Mi perro Max de 2 años tiene mucha ansiedad cuando me voy a trabajar. He intentado varias cosas pero nada parece funcionar. ¿Alguien tiene consejos? He probado con juguetes interactivos, dejar la televisión encendida, y paseos largos antes de irme, pero sigue llorando y rompiendo cosas cuando me voy.",
    tags: ["AnsiedadCanina", "CuidadoEmocional", "Consejos"],
    images: [],
    reactions: { like: 45, love: 12, celebrate: 8, support: 15, funny: 2 },
    comments: [
      { id: 101, author: "Carlos Rodríguez", isShelter: false, isAuthor: false, content: "Mi perro tenía el mismo problema. Lo que me funcionó fue el entrenamiento con refuerzo positivo y dejarle una prenda con mi olor.", time: "hace 1 hora", likes: 12, replies: [] },
      { id: 102, author: "Refugio Esperanza Animal", isShelter: true, isAuthor: false, content: "Te recomendamos consultar con un etólogo canino. En nuestro refugio trabajamos con profesionales que pueden ayudar.", time: "hace 45 min", likes: 8, replies: [
        { id: 103, author: "María García", isShelter: false, isAuthor: true, content: "¡Gracias por la recomendación! Buscaré un etólogo.", time: "hace 30 min", likes: 3, replies: [] }
      ]},
      { id: 104, author: "Laura Sánchez", isShelter: false, isAuthor: false, content: "Has probado con música clásica? A mi perro le relaja mucho.", time: "hace 20 min", likes: 5, replies: [] },
    ],
    isPinned: false,
    isSaved: false,
  },
  {
    id: 2,
    title: "🐾 ¡Gran Jornada de Adopción! 50 animales esperan un hogar",
    author: "Refugio Esperanza Animal",
    authorInitials: "RE",
    accountType: "shelter",
    badges: ["verified", "contributor"],
    time: "hace 5 horas",
    category: "Eventos",
    content: "Este sábado 20 de julio los esperamos en nuestra jornada de adopción en el Parque Central. Tendremos 30 perros y 20 gatos de todas las edades buscando un hogar lleno de amor. Todos están desparasitados, vacunados y esterilizados. ¡No faltes! 🐶🐱",
    tags: ["AdopciónResponsable", "JornadaAdopción", "Bogotá"],
    images: [],
    reactions: { like: 89, love: 56, celebrate: 34, support: 12, funny: 1 },
    comments: [
      { id: 201, author: "Ana López", isShelter: false, isAuthor: false, content: "¡Allí estaré! Estoy buscando un compañero para mi hija.", time: "hace 4 horas", likes: 7, replies: [] },
      { id: 202, author: "Pedro Martínez", isShelter: false, isAuthor: false, content: "¿Llevo mi propia transportadora para el gato?", time: "hace 3 horas", likes: 4, replies: [
        { id: 203, author: "Refugio Esperanza Animal", isShelter: true, isAuthor: true, content: "Sí, es recomendable traer transportadora si planeas adoptar un gato, y correa para perros.", time: "hace 2 horas", likes: 6, replies: [] }
      ]},
    ],
    isPinned: true,
    isSaved: true,
  },
  {
    id: 3,
    title: "Mi experiencia adoptando a Luna, una gata de 4 años",
    author: "Ana López",
    authorInitials: "AL",
    accountType: "user",
    badges: ["contributor"],
    time: "hace 1 día",
    category: "Historias",
    content: "Hace 6 meses adopté a Luna, una gata de 4 años que había sido rescatada de una situación difícil. Al principio fue todo un reto: no quería acercarse, se escondía debajo de la cama y apenas comía. Pero con paciencia, amor y mucha dedicación, hoy es la gata más cariñosa del mundo. No se rindan, adoptar un animal adulto es una de las experiencias más gratificantes.",
    tags: ["GatosAdorables", "AdopciónResponsable", "HistoriasDeÉxito"],
    images: [],
    reactions: { like: 67, love: 89, celebrate: 45, support: 23, funny: 3 },
    comments: [
      { id: 301, author: "Diego Torres", isShelter: false, isAuthor: false, content: "Qué hermosa historia. Yo también adopté un gato adulto y fue la mejor decisión.", time: "hace 20 horas", likes: 15, replies: [] },
      { id: 302, author: "Refugio Patitas Felices", isShelter: true, isAuthor: false, content: "Gracias por compartir. Las adopciones de adultos son las que más nos llenan de alegría. 🐱❤️", time: "hace 18 horas", likes: 12, replies: [] },
    ],
    isPinned: false,
    isSaved: false,
  },
  {
    id: 4,
    title: "Tips para entrenar a un cachorro Beagle",
    author: "Pedro Martínez",
    authorInitials: "PM",
    accountType: "user",
    badges: ["expert", "helper"],
    time: "hace 2 días",
    category: "Entrenamiento",
    content: "Los Beagles son perros inteligentes pero tercos. Aquí comparto algunos tips que me funcionaron con mi Rocky: 1) Usa refuerzo positivo siempre, 2) Sesiones cortas de 5-10 minutos, 3) Mucha paciencia con el olfato (es su superpoder), 4) Socialización temprano, 5) Ejercicio diario para evitar el aburrimiento. ¡Espero que les sirva!",
    tags: ["EntrenamientoCanino", "Beagles", "Tips"],
    images: [],
    reactions: { like: 89, love: 34, celebrate: 23, support: 45, funny: 12 },
    comments: [
      { id: 401, author: "María García", isShelter: false, isAuthor: false, content: "¡Excelentes consejos! Yo tengo un beagle de 1 año y confirmo todo.", time: "hace 1 día", likes: 8, replies: [] },
    ],
    isPinned: false,
    isSaved: true,
  },
  {
    id: 5,
    title: "🆘 Caso especial: Ayuda para Max, necesita cirugía urgente",
    author: "Refugio Patitas Felices",
    authorInitials: "PF",
    accountType: "shelter",
    badges: ["verified"],
    time: "hace 3 días",
    category: "Campañas",
    content: "Max es un pastor alemán de 5 años que fue rescatado de una situación de maltrato. Necesita una cirugía de cadera urgente con un costo de $2,500,000. Hemos reunido el 40% pero necesitamos su ayuda para completar el resto. Cualquier donación, por pequeña que sea, nos acerca a salvar a Max. Compartan por favor. 🐾",
    tags: ["RescateAnimal", "Donación", "CasoUrgente"],
    images: [],
    reactions: { like: 156, love: 89, celebrate: 12, support: 67, funny: 0 },
    comments: [
      { id: 501, author: "Laura Sánchez", isShelter: false, isAuthor: false, content: "Acabo de donar. ¡Fuerza Max! 🐶❤️", time: "hace 2 días", likes: 23, replies: [] },
      { id: 502, author: "Carlos Rodríguez", isShelter: false, isAuthor: false, content: "Compartido en mis redes. Espero que llegue a más personas.", time: "hace 2 días", likes: 12, replies: [] },
    ],
    isPinned: true,
    isSaved: false,
  },
  {
    id: 6,
    title: "Signos de que tu mascota necesita ir al veterinario",
    author: "Laura Sánchez",
    authorInitials: "LS",
    accountType: "user",
    badges: ["helper"],
    time: "hace 3 días",
    category: "Salud",
    content: "Como dueña responsable, he aprendido a identificar estas señales de alerta: pérdida de apetito, letargo excesivo, vómitos o diarrea persistentes, cambios en la micción, cojera, y cambios repentinos de comportamiento. Si notas alguno de estos signos, no esperes más y lleva a tu mascota al veterinario.",
    tags: ["SaludAnimal", "CuidadosBásicos", "Prevención"],
    images: [],
    reactions: { like: 54, love: 23, celebrate: 8, support: 34, funny: 1 },
    comments: [
      { id: 601, author: "Diego Torres", isShelter: false, isAuthor: false, content: "Muy importante. La prevención es clave.", time: "hace 2 días", likes: 6, replies: [] },
    ],
    isPinned: false,
    isSaved: false,
  },
  {
    id: 7,
    title: "¿Qué alimento recomiendan para Golden Retriever cachorro?",
    author: "Carlos Rodríguez",
    authorInitials: "CR",
    accountType: "user",
    badges: [],
    time: "hace 4 días",
    category: "Nutrición",
    content: "Acabo de adoptar un Golden Retriever de 3 meses. Quiero darle la mejor nutrición posible para su crecimiento. He visto muchas marcas pero no sé cuál es la mejor para razas grandes. ¿Qué me recomiendan?",
    tags: ["Alimentación", "GoldenRetriever", "Cachorros"],
    images: [],
    reactions: { like: 32, love: 8, celebrate: 3, support: 12, funny: 0 },
    comments: [],
    isPinned: false,
    isSaved: false,
  },
  {
    id: 8,
    title: "📢 Campaña de Vacunación Gratuita en Medellín",
    author: "Refugio Patitas Felices",
    authorInitials: "PF",
    accountType: "shelter",
    badges: ["verified", "expert"],
    time: "hace 5 días",
    category: "Campañas",
    content: "Este fin de semana estaremos realizando una jornada de vacunación gratuita para perros y gatos en la Comuna 13 de Medellín. Tendremos 500 dosis disponibles de vacuna múltiple y antirrábica. ¡No es necesario agendar! Solo lleguen con sus mascotas con correa o en transportadora.",
    tags: ["Vacunación", "Medellín", "SaludAnimal"],
    images: [],
    reactions: { like: 98, love: 45, celebrate: 56, support: 34, funny: 2 },
    comments: [
      { id: 801, author: "Ana López", isShelter: false, isAuthor: false, content: "¡Excelente iniciativa! Allí estaremos con nuestra perrita.", time: "hace 4 días", likes: 10, replies: [] },
    ],
    isPinned: false,
    isSaved: false,
  },
];

export default function Forum() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [postTypeFilter, setPostTypeFilter] = useState("all"); // story, question, tip, event, campaign, donation
  const [sortBy, setSortBy] = useState("newest"); // newest, popular, commented
  const [petTypeFilter, setPetTypeFilter] = useState("all"); // dog, cat, other
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("feed"); // feed, grid

  // Modal states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);

  // Filter and sort posts
  const filteredPosts = samplePosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === "all" || post.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Pinned posts always first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case "popular": {
          const totalA = Object.values(a.reactions).reduce((x, y) => x + y, 0);
          const totalB = Object.values(b.reactions).reduce((x, y) => x + y, 0);
          return totalB - totalA;
        }
        case "commented":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default:
          return 0; // Keep original order for "newest"
      }
    });

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleReactionChange = (postId, reactionId) => {
    console.log(`Post ${postId}: ${reactionId}`);
  };

  // Stats data
  const forumStats = [
    { label: "Publicaciones", value: "1,234", icon: MessageSquare, gradient: "from-rose-500 to-pink-500", bgLight: "bg-rose-50", textLight: "text-rose-600" },
    { label: "Comentarios", value: "8,567", icon: MessageCircle, gradient: "from-blue-500 to-cyan-500", bgLight: "bg-blue-50", textLight: "text-blue-600" },
    { label: "Refugios", value: "456", icon: Shield, gradient: "from-emerald-500 to-teal-500", bgLight: "bg-emerald-50", textLight: "text-emerald-600" },
    { label: "Reacciones", value: "12.3K", icon: Heart, gradient: "from-violet-500 to-fuchsia-500", bgLight: "bg-violet-50", textLight: "text-violet-600" },
  ];

  return (
    <div className={`min-h-screen pt-20 pb-12 transition-colors duration-300 ${
      isDark
        ? "bg-dark-bg"
        : "bg-gradient-to-br from-rose-50 via-white to-amber-50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Header Section ===== */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-display ${
                  isDark ? "text-dark-text" : "text-gray-900"
                }`}>
                  Comunidad
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-100 text-rose-700"
                }`}>
                  {filteredPosts.length} publicaciones
                </span>
              </div>
              <p className={`text-base sm:text-lg mt-1 ${
                isDark ? "text-dark-text-secondary" : "text-gray-600"
              }`}>
                Comparte experiencias, haz preguntas y conecta con otros amantes de los animales
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Create Post Button */}
              <button
                onClick={() => setShowCreatePost(true)}
                className="relative inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nueva Publicación</span>
                <span className="sm:hidden">Crear</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== Statistics Bar ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {forumStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 hover-lift group ${
                  isDark
                    ? "bg-dark-card border border-dark-border"
                    : "bg-white shadow-md shadow-gray-100/50"
                }`}
              >
                {/* Gradient Decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${
                      isDark ? "text-dark-text" : "text-gray-900"
                    }`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm sm:text-base mt-1 font-medium ${
                      isDark ? "text-dark-text-secondary" : "text-gray-500"
                    }`}>
                      {stat.label}
                    </p>
                  </div>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0 shadow-lg ${
                    isDark ? "shadow-rose-500/20" : ""
                  }`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>

                {/* Trend indicator */}
                <div className={`flex items-center gap-1.5 mt-3 pt-3 border-t ${
                  isDark ? "border-dark-border" : "border-gray-100"
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    isDark ? "text-emerald-400" : "text-emerald-500"
                  }`} />
                  <span className={`text-xs font-medium ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                    +12% este mes
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Search Bar ===== */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-dark-text-secondary" : "text-gray-400"
            }`} />
            <input
              type="text"
              placeholder="Buscar publicaciones, etiquetas o usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-36 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all ${
                isDark
                  ? "bg-dark-card border border-dark-border text-dark-text placeholder-dark-text-secondary"
                  : "bg-white border border-gray-200 text-gray-700 placeholder-gray-400 shadow-sm"
              }`}
            />
            {/* Search Meta + Filter Button */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Results count when searching */}
              {searchTerm && (
                <>
                  <span className={`text-xs hidden sm:inline ${
                    isDark ? "text-dark-text-secondary" : "text-gray-400"
                  }`}>
                    {filteredPosts.length} resultados
                  </span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className={`p-1.5 rounded-lg transition-all ${
                      isDark
                        ? "text-dark-text-secondary hover:text-dark-text hover:bg-white/5"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  showMobileFilters
                    ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                    : isDark
                    ? "bg-white/10 text-dark-text-secondary hover:text-dark-text hover:bg-white/15"
                    : "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  showMobileFilters ? "rotate-180" : ""
                }`} />
              </button>
            </div>
          </div>

          {/* ===== Filters Panel (Expandable) ===== */}
          {showMobileFilters && (
            <div className={`mt-3 p-5 rounded-2xl transition-all ${
              isDark
                ? "bg-dark-card border border-dark-border"
                : "bg-white shadow-lg border border-gray-100"
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Post Type Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-dark-text-secondary" : "text-gray-500"
                  }`}>
                    Tipo de publicación
                  </label>
                  <select
                    value={postTypeFilter}
                    onChange={(e) => setPostTypeFilter(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                      isDark
                        ? "bg-[#15151f] border border-dark-border text-dark-text"
                        : "bg-gray-50 border border-gray-200 text-gray-700"
                    }`}
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="story">Historia</option>
                    <option value="question">Pregunta</option>
                    <option value="tip">Consejo</option>
                    <option value="event">Evento</option>
                    <option value="campaign">Campaña</option>
                    <option value="donation">Donación</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-dark-text-secondary" : "text-gray-500"
                  }`}>
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                      isDark
                        ? "bg-[#15151f] border border-dark-border text-dark-text"
                        : "bg-gray-50 border border-gray-200 text-gray-700"
                    }`}
                  >
                    <option value="newest">Más recientes</option>
                    <option value="popular">Más populares</option>
                    <option value="commented">Más comentados</option>
                  </select>
                </div>

                {/* Pet Type Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-dark-text-secondary" : "text-gray-500"
                  }`}>
                    Tipo de mascota
                  </label>
                  <select
                    value={petTypeFilter}
                    onChange={(e) => setPetTypeFilter(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                      isDark
                        ? "bg-[#15151f] border border-dark-border text-dark-text"
                        : "bg-gray-50 border border-gray-200 text-gray-700"
                    }`}
                  >
                    <option value="all">Todos</option>
                    <option value="dog">Perros</option>
                    <option value="cat">Gatos</option>
                    <option value="other">Otros</option>
                  </select>
                </div>

                {/* Active Filters Info */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-dark-text-secondary" : "text-gray-500"
                  }`}>
                    Filtros activos
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {postTypeFilter !== "all" && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                        isDark ? "bg-rose-500/15 text-rose-300" : "bg-rose-50 text-rose-700"
                      }`}>
                        {postTypeFilter}
                      </span>
                    )}
                    {petTypeFilter !== "all" && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                        isDark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-700"
                      }`}>
                        {petTypeFilter === "dog" ? "Perros" : petTypeFilter === "cat" ? "Gatos" : "Otros"}
                      </span>
                    )}
                    {postTypeFilter === "all" && petTypeFilter === "all" && (
                      <span className={`text-xs ${
                        isDark ? "text-dark-text-secondary" : "text-gray-400"
                      }`}>
                        Ningún filtro adicional
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(postTypeFilter !== "all" || petTypeFilter !== "all") && (
                <button
                  onClick={() => {
                    setPostTypeFilter("all");
                    setPetTypeFilter("all");
                  }}
                  className={`mt-3 text-xs font-medium transition-all ${
                    isDark ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700"
                  }`}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <Zap className="w-3 h-3" />
              Para ti
            </button>
            <button
              onClick={() => setSelectedCategory("Historias")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "Historias"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              📖 Historias
            </button>
            <button
              onClick={() => setSelectedCategory("Campañas")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "Campañas"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              📢 Campañas
            </button>
            <button
              onClick={() => setSelectedCategory("Eventos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "Eventos"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              📅 Eventos
            </button>
            <button
              onClick={() => setSelectedCategory("Salud")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "Salud"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              🏥 Salud
            </button>
            <button
              onClick={() => setSelectedCategory("Entrenamiento")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "Entrenamiento"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              🎯 Entrenamiento
            </button>
            <button
              onClick={() => setSelectedCategory("Nutrición")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "Nutrición"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                  : isDark
                  ? "bg-white/5 text-dark-text-secondary hover:bg-white/10"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              🥗 Nutrición
            </button>
          </div>
        </div>

        {/* ===== Two Column Layout ===== */}
        <div className="flex gap-6">
          {/* ===== Center Feed ===== */}
          <div className="flex-1 min-w-0">
            {/* Feed Controls */}
            <div className={`flex items-center justify-between mb-4 px-1`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isDark ? "text-dark-text-secondary" : "text-gray-500"}`}>
                  {sortBy === "newest" ? "Más recientes" : sortBy === "popular" ? "Más populares" : "Más comentados"}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`text-xs px-2 py-1 rounded-lg focus:outline-none ${
                    isDark
                      ? "bg-dark-card border border-dark-border text-dark-text"
                      : "bg-white border border-gray-200 text-gray-600"
                  }`}
                >
                  <option value="newest">Más recientes</option>
                  <option value="popular">Más populares</option>
                  <option value="commented">Más comentados</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("feed")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "feed"
                      ? isDark
                        ? "bg-rose-500/15 text-rose-300"
                        : "bg-rose-50 text-rose-600"
                      : isDark
                      ? "text-dark-text-secondary hover:text-dark-text"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? isDark
                        ? "bg-rose-500/15 text-rose-300"
                        : "bg-rose-50 text-rose-600"
                      : isDark
                      ? "text-dark-text-secondary hover:text-dark-text"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {viewMode === "feed" ? (
              <div className="space-y-4">
                {/* AI Welcome Banner - AI Ready */}
                {filteredPosts.length > 0 && (
                  <div className={`p-4 rounded-2xl ${
                    isDark
                      ? "bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 border border-violet-500/20"
                      : "bg-gradient-to-r from-violet-50 via-fuchsia-50 to-rose-50 border border-violet-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isDark ? "text-violet-200" : "text-violet-800"}`}>
                          Descubre contenido relevante para ti
                        </p>
                        <p className={`text-xs ${isDark ? "text-dark-text-secondary" : "text-gray-500"}`}>
                          Basado en tus intereses y actividad reciente
                        </p>
                      </div>
                      <button className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        isDark
                          ? "bg-violet-500/20 text-violet-200 hover:bg-violet-500/30"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      }`}>
                        Personalizar
                      </button>
                    </div>
                  </div>
                )}

                {filteredPosts.map((post) => (
                  <ForumPostCard
                    key={post.id}
                    post={post}
                    onPostClick={handlePostClick}
                    onReactionChange={handleReactionChange}
                  />
                ))}
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPosts.map((post) => (
                  <ForumPostCard
                    key={post.id}
                    post={post}
                    onPostClick={handlePostClick}
                    onReactionChange={handleReactionChange}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className={`text-center py-16 rounded-2xl ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white shadow-md"
              }`}>
                <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? "text-dark-text-secondary" : "text-gray-300"
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-dark-text" : "text-gray-900"
                }`}>
                  No se encontraron publicaciones
                </h3>
                <p className={`text-sm mb-6 ${
                  isDark ? "text-dark-text-secondary" : "text-gray-600"
                }`}>
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setPostTypeFilter("all");
                      setPetTypeFilter("all");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg"
                  >
                    Limpiar filtros
                  </button>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      isDark
                        ? "bg-white/5 text-dark-text hover:bg-white/10"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Crear publicación
                  </button>
                </div>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isDark
                      ? "bg-white/5 text-dark-text-secondary hover:bg-white/10 hover:text-dark-text"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  Cargar más publicaciones
                </button>
              </div>
            )}
          </div>

          {/* ===== Right Sidebar (Hidden on tablet/mobile) ===== */}
          <div className="hidden xl:block w-[320px] shrink-0">
            <ForumRightPanel />
          </div>
        </div>
      </div>

      {/* ===== Create Post Modal ===== */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />

      {/* ===== Post Detail Modal ===== */}
      <PostDetailModal
        post={selectedPost}
        isOpen={showPostDetail}
        onClose={() => {
          setShowPostDetail(false);
          setSelectedPost(null);
        }}
      />
      <ScrollToTop />
    </div>
  );
}
