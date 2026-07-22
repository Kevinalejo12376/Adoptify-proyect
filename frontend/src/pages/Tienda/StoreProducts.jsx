import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, PlusCircle, Search, SlidersHorizontal, Edit3, Eye, EyeOff,
  Trash2, Star, AlertTriangle, ChevronDown, Grid3X3, List, MoreHorizontal,
} from "lucide-react";
import { mockStoreProducts, mockStoreCategories } from "../../data/store/mockStoreData";

function StatusBadge({ estado }) {
  const config = {
    visible: { label: "Visible", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    oculto: { label: "Oculto", color: "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" },
  };
  const c = config[estado] || config.visible;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${c.color}`}>
      {estado === "visible" ? <Eye size={12} /> : <EyeOff size={12} />}
      {c.label}
    </span>
  );
}

function StockBadge({ stock, stockMinimo }) {
  if (stock === 0) {
    return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">Agotado</span>;
  }
  if (stock <= stockMinimo) {
    return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">Bajo stock</span>;
  }
  return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">{stock} uds</span>;
}

export default function StoreProducts() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [vista, setVista] = useState("grid");
  const [productos, setProductos] = useState(mockStoreProducts);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = productos.filter((p) => {
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
    if (categoriaFiltro && p.categoria !== categoriaFiltro) return false;
    if (estadoFiltro && p.estado !== estadoFiltro) return false;
    return true;
  });

  const toggleDisponibilidad = (id) => {
    setProductos(productos.map(p => p.id === id ? { ...p, estado: p.estado === "visible" ? "oculto" : "visible" } : p));
  };

  const toggleDestacado = (id) => {
    setProductos(productos.map(p => p.id === id ? { ...p, destacado: !p.destacado } : p));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">Productos</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Gestiona el catálogo de productos de tu tienda.
          </p>
        </div>
        <Link
          to="/tienda/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
        >
          <PlusCircle size={16} />
          Nuevo Producto
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            >
              <option value="">Todas las categorías</option>
              {mockStoreCategories.map((cat) => (
                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
              ))}
            </select>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            >
              <option value="">Todos los estados</option>
              <option value="visible">Visible</option>
              <option value="oculto">Oculto</option>
            </select>
            <div className="flex bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
              <button
                onClick={() => setVista("grid")}
                className={`p-2.5 ${vista === "grid" ? "bg-rose-500 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setVista("list")}
                className={`p-2.5 ${vista === "list" ? "bg-rose-500 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Grid / List */}
      {vista === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-border flex items-center justify-center relative">
                <Package size={48} className="text-gray-300 dark:text-gray-600" />
                {product.destacado && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold flex items-center gap-1">
                    <Star size={10} /> Destacado
                  </div>
                )}
                {product.descuento > 0 && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-bold">
                    -{product.descuento}%
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link to={`/tienda/productos/${product.id}`} className="text-sm font-semibold text-gray-900 dark:text-dark-text hover:text-rose-500 transition-colors line-clamp-2">
                      {product.nombre}
                    </Link>
                    <p className="text-[10px] text-gray-400 mt-0.5">{product.categoria}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-dark-text">
                    ${product.precio.toLocaleString("es-CO")}
                  </span>
                  {product.precioOriginal && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.precioOriginal.toLocaleString("es-CO")}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <StockBadge stock={product.stock} stockMinimo={product.stockMinimo} />
                  <StatusBadge estado={product.estado} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star size={12} className="text-amber-400" />
                    {product.calificacion} ({product.totalValoraciones})
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleDestacado(product.id)}
                      className={`p-1.5 rounded-lg transition-colors ${product.destacado ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-amber-500 hover:bg-gray-50"}`}
                      title={product.destacado ? "Quitar destacado" : "Marcar como destacado"}
                    >
                      <Star size={14} />
                    </button>
                    <button
                      onClick={() => toggleDisponibilidad(product.id)}
                      className={`p-1.5 rounded-lg transition-colors ${product.estado === "visible" ? "text-emerald-500 hover:text-gray-400" : "text-gray-400 hover:text-emerald-500"} hover:bg-gray-50`}
                      title={product.estado === "visible" ? "Ocultar" : "Mostrar"}
                    >
                      {product.estado === "visible" ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <Link
                      to={`/tienda/productos/editar/${product.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-colors"
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vista de lista */
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Producto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Precio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Vendidos</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-dark-border flex items-center justify-center">
                          <Package size={16} className="text-gray-400" />
                        </div>
                        <div>
                          <Link to={`/tienda/productos/${product.id}`} className="text-sm font-semibold text-gray-900 dark:text-dark-text hover:text-rose-500">
                            {product.nombre}
                          </Link>
                          {product.destacado && <span className="text-[10px] text-amber-500 ml-1">★</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.categoria}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                        ${product.precio.toLocaleString("es-CO")}
                      </span>
                      {product.descuento > 0 && (
                        <span className="text-[10px] text-rose-500 ml-1">-{product.descuento}%</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><StockBadge stock={product.stock} stockMinimo={product.stockMinimo} /></td>
                    <td className="px-4 py-3"><StatusBadge estado={product.estado} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.vendidos}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleDestacado(product.id)} className={`p-1.5 rounded-lg ${product.destacado ? "text-amber-500" : "text-gray-400"} hover:bg-gray-100`} title="Destacar">
                          <Star size={14} />
                        </button>
                        <button onClick={() => toggleDisponibilidad(product.id)} className={`p-1.5 rounded-lg ${product.estado === "visible" ? "text-emerald-500" : "text-gray-400"} hover:bg-gray-100`} title={product.estado === "visible" ? "Ocultar" : "Mostrar"}>
                          {product.estado === "visible" ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <Link to={`/tienda/productos/editar/${product.id}`} className="p-1.5 rounded-lg text-blue-500 hover:bg-gray-100" title="Editar">
                          <Edit3 size={14} />
                        </Link>
                        <Link to={`/tienda/productos/${product.id}`} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Ver detalle">
                          <MoreHorizontal size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">No se encontraron productos</h3>
          <p className="text-sm text-gray-500 mt-1">Intenta con otros filtros o crea un nuevo producto.</p>
        </div>
      )}
    </div>
  );
}
