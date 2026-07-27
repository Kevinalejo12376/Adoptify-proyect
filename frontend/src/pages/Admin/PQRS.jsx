import React, { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, MessageSquare } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { listarPqrs, actualizarPqrs } from "../../api/admin";

const ESTADOS = ["pendiente", "en_proceso", "resuelto", "cerrado"];
const TIPOS = { peticion: "Petición", queja: "Queja", reclamo: "Reclamo", sugerencia: "Sugerencia" };

export default function AdminPQRS() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true); setError(null);
    try { setItems(await listarPqrs()); }
    catch (e) { setError(e?.message || "Error al cargar PQRS"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleEstado = async (id, estado) => {
    try { await actualizarPqrs(id, { estado }); await cargar(); }
    catch (e) { setError(e?.message); }
  };

  const handleResponder = async () => {
    if (!selected || !respuesta.trim()) return;
    setGuardando(true);
    try {
      await actualizarPqrs(selected.id, { estado: "resuelto", respuesta });
      setSelected(null); setRespuesta(""); await cargar();
    } catch (e) { setError(e?.message); }
    finally { setGuardando(false); }
  };

  const columnas = [
    { key: "tipo", titulo: "Tipo", render: (v) => TIPOS[v] || v, ordenable: true },
    { key: "asunto", titulo: "Asunto", ordenable: true },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    { key: "creado_en", titulo: "Fecha", tipo: "fecha", ordenable: true },
    {
      key: "acciones", titulo: "Acciones", tipo: "render", ordenable: false, className: "text-right",
      render: (_, f) => (
        <div className="flex gap-1 justify-end">
          <button onClick={(e) => { e.stopPropagation(); setSelected(f); setRespuesta(f.respuesta || ""); }}
            className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors">
            {f.respuesta ? "Ver" : "Responder"}
          </button>
          {f.estado !== "cerrado" && (
            <button onClick={(e) => { e.stopPropagation(); handleEstado(f.id, "cerrado"); }}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Cerrar
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">PQRS</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">Peticiones, quejas, reclamos y sugerencias</p>
      </div>
      {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-2" /><p>Cargando PQRS...</p>
        </div>
      ) : (
        <DataTable columnas={columnas} datos={items} placeholder="Buscar PQRS..." emptyMessage="No hay PQRS registrados" />
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{selected.asunto}</h3>
            <p className="text-xs text-gray-500 mb-3">{TIPOS[selected.tipo] || selected.tipo} · {selected.estado}</p>
            <div className="p-3 bg-gray-50 dark:bg-dark-bg/50 rounded-xl text-sm text-gray-700 dark:text-gray-300 mb-4">{selected.mensaje}</div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Respuesta</label>
            <textarea rows={4} value={respuesta} onChange={(e) => setRespuesta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-xl text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white resize-none mb-4"
              placeholder="Escribe tu respuesta..." />
            <div className="flex gap-2">
              <button onClick={handleResponder} disabled={guardando || !respuesta.trim()}
                className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-xl disabled:opacity-60">
                {guardando ? "Guardando..." : "Responder y resolver"}
              </button>
              <button onClick={() => setSelected(null)} className="px-5 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl text-gray-600 dark:text-gray-400">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
