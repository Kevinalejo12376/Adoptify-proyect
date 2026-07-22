import React, { useState, useEffect, useCallback } from "react";
import { UserX, RotateCcw, Trash2, Plus, X } from "lucide-react";
import DataTable from "../../../components/admin/DataTable";
import Badge from "../../../components/admin/Badge";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../../../api/admin";

/**
 * Gestor reutilizable de cuentas para el panel admin.
 * Lista, crea, suspende/activa y elimina usuarios de ciertos roles.
 *
 * Props:
 *  - titulo, descripcion
 *  - rolCrear: rol a crear ('usuario' | 'administrador' | 'refugio')
 *  - rolesFiltro: array de codigos de rol a mostrar (ej: ['administrador','administrador_principal'])
 *  - esRefugio: si true, pide nombre del refugio al crear
 */
export default function GestionUsuarios({ titulo, descripcion, rolCrear, rolesFiltro, esRefugio = false, emptyMessage = "No se encontraron registros" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const emptyForm = { nombre: "", apellido: "", email: "", password: "", telefono: "", ubicacion: "", nombre_refugio: "" };
  const [form, setForm] = useState(emptyForm);

  const [confirm, setConfirm] = useState(null); // { tipo: 'estado'|'eliminar', item }

  // Clave estable para evitar recrear la funcion en cada render.
  const rolesKey = rolesFiltro.join(",");
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = rolesKey.split(",");
      const data = await listarUsuarios();
      const filtrados = data.filter((u) => roles.includes(u.rol));
      setItems(filtrados.map((u) => ({ ...u, estado: u.activo ? "activo" : "suspendido" })));
    } catch (e) {
      setError(e?.message || "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [rolesKey]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);
    try {
      await crearUsuario({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
        ubicacion: form.ubicacion,
        rol: rolCrear,
        ...(esRefugio ? { nombre_refugio: form.nombre_refugio || form.nombre } : {}),
      });
      setShowCreate(false);
      setForm(emptyForm);
      await cargar();
    } catch (err) {
      setFormError(err?.message || "No se pudo crear la cuenta");
    } finally {
      setCreating(false);
    }
  };

  const confirmarAccion = async () => {
    if (!confirm) return;
    try {
      if (confirm.tipo === "estado") {
        await actualizarUsuario(confirm.item.id, { activo: !confirm.item.activo });
      } else if (confirm.tipo === "eliminar") {
        await eliminarUsuario(confirm.item.id);
      }
      await cargar();
    } catch (err) {
      setError(err?.message || "No se pudo completar la accion");
    } finally {
      setConfirm(null);
    }
  };

  const columnas = [
    { key: "nombre", titulo: "Nombre", tipo: "avatar", nombreAvatar: (f) => f.nombre, ordenable: true },
    { key: "email", titulo: "Email", ordenable: true },
    ...(esRefugio ? [{ key: "refugio_nombre", titulo: "Refugio", ordenable: true }] : []),
    { key: "telefono", titulo: "Teléfono" },
    { key: "ubicacion", titulo: "Ciudad" },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    { key: "creado_en", titulo: "Registro", tipo: "fecha", ordenable: true },
    {
      key: "acciones",
      titulo: "Acciones",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setConfirm({ tipo: "estado", item: fila }); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
            title={fila.activo ? "Suspender" : "Reactivar"}
          >
            {fila.activo ? <UserX size={15} /> : <RotateCcw size={15} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirm({ tipo: "eliminar", item: fila }); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const inputClass = "w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-white";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">{titulo}</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">{descripcion}</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setFormError(null); setShowCreate(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg"
        >
          <Plus size={18} /> Crear
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
      )}

      {loading ? (
        <div className="py-16 text-center text-gray-500">Cargando...</div>
      ) : (
        <DataTable
          columnas={columnas}
          datos={items}
          placeholder="Buscar..."
          emptyMessage={emptyMessage}
        />
      )}

      {/* Modal Crear */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{titulo} · Crear</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                <X size={18} />
              </button>
            </div>
            {formError && <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>}
            <form onSubmit={handleCrear} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Apellido</label>
                <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} className={inputClass} />
              </div>
              {esRefugio && (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del refugio</label>
                  <input value={form.nombre_refugio} onChange={(e) => setForm({ ...form, nombre_refugio: e.target.value })} className={inputClass} placeholder="Ej: Patitas Felices" />
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña *</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ciudad</label>
                <input value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} className={inputClass} />
              </div>
              <div className="col-span-2 flex gap-2 pt-2">
                <button type="submit" disabled={creating} className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl disabled:opacity-60">
                  {creating ? "Creando..." : "Crear cuenta"}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmacion suspender/eliminar */}
      <ConfirmModal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={confirmarAccion}
        titulo={confirm?.tipo === "eliminar" ? "Eliminar cuenta" : (confirm?.item?.activo ? "Suspender cuenta" : "Reactivar cuenta")}
        descripcion={
          confirm?.tipo === "eliminar"
            ? `¿Eliminar a "${confirm?.item?.nombre}"? Esta acción no se puede deshacer.`
            : `¿Deseas ${confirm?.item?.activo ? "suspender" : "reactivar"} a "${confirm?.item?.nombre}"?`
        }
        variant={confirm?.tipo === "eliminar" || confirm?.item?.activo ? "danger" : "success"}
        confirmText={confirm?.tipo === "eliminar" ? "Eliminar" : (confirm?.item?.activo ? "Suspender" : "Reactivar")}
        icon={confirm?.tipo === "eliminar" ? Trash2 : (confirm?.item?.activo ? UserX : RotateCcw)}
      />
    </div>
  );
}
