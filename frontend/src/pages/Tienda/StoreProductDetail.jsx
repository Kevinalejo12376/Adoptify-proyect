import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Package, ArrowLeft, Edit3, Eye, EyeOff, Star, DollarSign, ShoppingCart,
  Calendar, Tag, BarChart3, ChevronDown, TrendingUp, Users, MessageSquare,
  AlertTriangle, CheckCircle, XCircle,
} from "lucide-react";
import { mockStoreProducts, mockStoreReviews, mockStoreTopProducts } from "../../data/store/mockStoreData";

export default function StoreProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockStoreProducts.find((p) => p.id === id);
  const reviews = mockStoreReviews.filter((r) => r.productoId === id);
  const stats = mockStoreTopProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Producto no encontrado</h2>
        <p className="text-gray-500 mt-2">El producto que buscas no existe o ha sido eliminado.</p>
        <Link to="/tienda/productos" className="inline-flex items-center gap-2 mt-4 text-rose-500 hover:text-rose-600 font-medium">
          <ArrowLeft size={16} /> Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/tienda/productos" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <ArrowLeft size={18} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">{product.nombre}</h1>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
              {product.categoria} {product.subcategoria ? `- ${product.subcategoria}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/tienda/productos/editar/${product.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-all"
          >
            <Edit3 size={16} />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image / Info Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Product Image Placeholder */}
              <div className="w-full sm:w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-border rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={64} className="text-gray-300 dark:text-gray-600" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    product.estado === "visible"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-50 text-gray-500"
                  }`}>
                    {product.estado === "visible" ? "Visible" : "Oculto"}
                  </span>
                  {product.destacado && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 flex items-center gap-1">
                      <Star size={12} /> Destacado
                    </span>
                  )}
                  {product.descuento > 0 && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600">
                      -{product.descuento}% OFF
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{product.descripcion}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Precio</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                      ${product.precio.toLocaleString("es-CO")}
                    </p>
                    {product.precioOriginal && (
                      <p className="text-xs text-gray-400 line-through">
                        ${product.precioOriginal.toLocaleString("es-CO")}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Stock</p>
                    <p className={`text-lg font-bold ${product.stock === 0 ? "text-red-500" : product.stock <= product.stockMinimo ? "text-amber-500" : "text-emerald-600"}`}>
                      {product.stock} unidades
                    </p>
                    <p className="text-xs text-gray-400">Mínimo: {product.stockMinimo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Detalles del Producto</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Marca", value: product.marca || "-" },
                { label: "Categoría", value: product.categoria },
                { label: "Subcategoría", value: product.subcategoria || "-" },
                { label: "Material", value: product.material || "-" },
                { label: "Peso", value: product.peso || "-" },
                { label: "Fecha publicación", value: new Date(product.fechaPublicacion).toLocaleDateString("es-CO") },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-dark-text mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            {product.tallas?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Tallas disponibles</p>
                <div className="flex gap-2">
                  {product.tallas.map((talla) => (
                    <span key={talla} className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-dark-bg text-xs font-medium text-gray-700 dark:text-dark-text">{talla}</span>
                  ))}
                </div>
              </div>
            )}
            {product.colores?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">Colores disponibles</p>
                <div className="flex gap-2">
                  {product.colores.map((color) => (
                    <span key={color} className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-dark-bg text-xs font-medium text-gray-700 dark:text-dark-text">{color}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Valoraciones */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">
                Valoraciones ({reviews.length})
              </h3>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400" />
                <span className="text-sm font-bold text-gray-900">{product.calificacion}</span>
                <span className="text-xs text-gray-400">({product.totalValoraciones})</span>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center text-xs font-bold text-rose-600">
                        {review.usuario[0]}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">{review.usuario}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} className={star <= review.calificacion ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{review.comentario}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(review.fecha).toLocaleDateString("es-CO")}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-4">No hay valoraciones aún</p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Stats & Actions */}
        <div className="space-y-6">
          {/* Estadísticas rápidas */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-rose-500" />
              Estadísticas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={14} className="text-blue-500" />
                  <span className="text-xs text-gray-500">Vendidos</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-dark-text">{product.vendidos}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-500" />
                  <span className="text-xs text-gray-500">Ingresos</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-dark-text">
                  ${(product.vendidos * product.precio).toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-500" />
                  <span className="text-xs text-gray-500">Calificación</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-dark-text">{product.calificacion}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-purple-500" />
                  <span className="text-xs text-gray-500">Publicado</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-dark-text">
                  {new Date(product.fechaPublicacion).toLocaleDateString("es-CO", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Acciones</h3>
            <div className="space-y-2">
              <Link
                to={`/tienda/productos/editar/${product.id}`}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                <Edit3 size={16} /> Editar producto
              </Link>
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
              >
                <Eye size={16} /> {product.estado === "visible" ? "Ocultar producto" : "Mostrar producto"}
              </button>
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
              >
                {product.destacado ? <Star size={16} /> : <Star size={16} />}
                {product.destacado ? "Quitar destacado" : "Marcar como destacado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
