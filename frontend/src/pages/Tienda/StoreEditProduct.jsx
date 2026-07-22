import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Package, ArrowLeft, Save, Upload, X, Plus, Trash2, Star,
} from "lucide-react";
import { mockStoreProducts, mockStoreCategories } from "../../data/store/mockStoreData";

const defaultProduct = {
  nombre: "",
  descripcion: "",
  precio: "",
  precioOriginal: "",
  categoria: "",
  subcategoria: "",
  marca: "",
  stock: "",
  stockMinimo: "",
  disponible: true,
  destacado: false,
  estado: "visible",
  tallas: [],
  colores: [],
  peso: "",
  material: "",
  imagenes: [],
};

export default function StoreEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "nuevo";
  const existingProduct = !isNew ? mockStoreProducts.find((p) => p.id === id) : null;

  const [form, setForm] = useState(existingProduct ? {
    ...existingProduct,
    precio: existingProduct.precio.toString(),
    precioOriginal: existingProduct.precioOriginal ? existingProduct.precioOriginal.toString() : "",
    stock: existingProduct.stock.toString(),
    stockMinimo: existingProduct.stockMinimo.toString(),
  } : defaultProduct);

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0) newErrors.precio = "Precio inválido";
    if (!form.categoria) newErrors.categoria = "Selecciona una categoría";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = "Stock inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Aquí iría la lógica para guardar en BD
    // Por ahora redirigimos al listado
    navigate("/tienda/productos");
  };

  const addTalla = (talla) => {
    if (talla && !form.tallas.includes(talla)) {
      handleChange("tallas", [...form.tallas, talla]);
    }
  };

  const removeTalla = (talla) => {
    handleChange("tallas", form.tallas.filter((t) => t !== talla));
  };

  const addColor = (color) => {
    if (color && !form.colores.includes(color)) {
      handleChange("colores", [...form.colores, color]);
    }
  };

  const removeColor = (color) => {
    handleChange("colores", form.colores.filter((c) => c !== color));
  };

  const [nuevaTalla, setNuevaTalla] = useState("");
  const [nuevoColor, setNuevoColor] = useState("");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tienda/productos" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <ArrowLeft size={18} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text font-display">
              {isNew ? "Nuevo Producto" : "Editar Producto"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
              {isNew ? "Completa los datos para registrar un nuevo producto." : `Editando: ${existingProduct?.nombre}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
        >
          <Save size={16} />
          {isNew ? "Crear Producto" : "Guardar Cambios"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Información Básica</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Nombre del producto *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${errors.nombre ? "border-red-300 focus:border-red-500" : "border-gray-200 dark:border-dark-border focus:border-rose-500"}`}
                placeholder="Ej: Cama Ortopédica para Perros"
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Descripción *</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                rows={3}
                className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none ${errors.descripcion ? "border-red-300 focus:border-red-500" : "border-gray-200 dark:border-dark-border focus:border-rose-500"}`}
                placeholder="Descripción del producto..."
              />
              {errors.descripcion && <p className="text-xs text-red-500 mt-1">{errors.descripcion}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Categoría *</label>
              <select
                value={form.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${errors.categoria ? "border-red-300" : "border-gray-200 dark:border-dark-border"}`}
              >
                <option value="">Seleccionar categoría</option>
                {mockStoreCategories.map((cat) => (
                  <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                ))}
              </select>
              {errors.categoria && <p className="text-xs text-red-500 mt-1">{errors.categoria}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Subcategoría</label>
              <input
                type="text"
                value={form.subcategoria}
                onChange={(e) => handleChange("subcategoria", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="Ej: Ortopédicas"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Marca</label>
              <input
                type="text"
                value={form.marca}
                onChange={(e) => handleChange("marca", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="Ej: PetComfort"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Peso</label>
              <input
                type="text"
                value={form.peso}
                onChange={(e) => handleChange("peso", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="Ej: 2.5 kg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Material</label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => handleChange("material", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="Ej: Espuma viscoelástica"
              />
            </div>
          </div>
        </div>

        {/* Precios y Stock */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Precio y Stock</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Precio *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  type="number"
                  value={form.precio}
                  onChange={(e) => handleChange("precio", e.target.value)}
                  className={`w-full pl-7 pr-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${errors.precio ? "border-red-300" : "border-gray-200 dark:border-dark-border"}`}
                  placeholder="0"
                />
              </div>
              {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Precio original (con descuento)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  type="number"
                  value={form.precioOriginal}
                  onChange={(e) => handleChange("precioOriginal", e.target.value)}
                  className="w-full pl-7 pr-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Stock *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${errors.stock ? "border-red-300" : "border-gray-200 dark:border-dark-border"}`}
                placeholder="0"
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Stock mínimo</label>
              <input
                type="number"
                value={form.stockMinimo}
                onChange={(e) => handleChange("stockMinimo", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Tallas y Colores */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Variantes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tallas */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Tallas</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={nuevaTalla}
                  onChange={(e) => setNuevaTalla(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTalla(nuevaTalla); setNuevaTalla(""); } }}
                  className="flex-1 px-3.5 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="Agregar talla..."
                />
                <button
                  type="button"
                  onClick={() => { addTalla(nuevaTalla); setNuevaTalla(""); }}
                  className="px-3 py-2 bg-gray-100 dark:bg-dark-border rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tallas.map((talla) => (
                  <span key={talla} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-lg text-xs font-medium text-gray-700 dark:text-dark-text">
                    {talla}
                    <button type="button" onClick={() => removeTalla(talla)} className="text-gray-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-dark-text-secondary mb-1.5">Colores</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={nuevoColor}
                  onChange={(e) => setNuevoColor(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(nuevoColor); setNuevoColor(""); } }}
                  className="flex-1 px-3.5 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                  placeholder="Agregar color..."
                />
                <button
                  type="button"
                  onClick={() => { addColor(nuevoColor); setNuevoColor(""); }}
                  className="px-3 py-2 bg-gray-100 dark:bg-dark-border rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.colores.map((color) => (
                  <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-dark-bg rounded-lg text-xs font-medium text-gray-700 dark:text-dark-text">
                    {color}
                    <button type="button" onClick={() => removeColor(color)} className="text-gray-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Imágenes</h3>
          <div className="flex flex-wrap gap-3">
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-dark-border flex flex-col items-center justify-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 transition-colors">
              <Upload size={20} className="text-gray-400" />
              <span className="text-[10px] text-gray-400 mt-1">Subir</span>
              <input type="file" className="hidden" accept="image/*" multiple />
            </label>
            {form.imagenes.map((img, index) => (
              <div key={index} className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-dark-border flex items-center justify-center relative group">
                <Package size={32} className="text-gray-400" />
                <button
                  type="button"
                  onClick={() => handleChange("imagenes", form.imagenes.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Configuración adicional */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">Configuración</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Producto disponible</p>
                <p className="text-xs text-gray-400">Mostrar en la tienda</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.estado === "visible"}
                  onChange={(e) => handleChange("estado", e.target.checked ? "visible" : "oculto")}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-amber-500" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Producto destacado</p>
                <p className="text-xs text-gray-400">Aparecerá en la sección de destacados</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(e) => handleChange("destacado", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-amber-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Botón de guardar */}
        <div className="flex justify-end gap-3">
          <Link
            to="/tienda/productos"
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-dark-text-secondary bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
          >
            <Save size={16} />
            {isNew ? "Crear Producto" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
