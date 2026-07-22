import React, { useState } from "react";
import { Eye, MessageSquare, AlertCircle } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { mockPQRS } from "../../data/admin/mockData";

export default function AdminPQRS() {
  const [pqrsList, setPqrsList] = useState(mockPQRS);
  const [modalOpen, setModalOpen] = useState(false);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [selectedPqrs, setSelectedPqrs] = useState(null);
  const [respuesta, setRespuesta] = useState("");

  const handleRespond = (pqrs) => {
    setSelectedPqrs(pqrs);
    setRespuesta(pqrs.respuesta || "");
    setRespondModalOpen(true);
  };

  const confirmRespond = () => {
    if (!selectedPqrs || !respuesta.trim()) return;
    setPqrsList((prev) =>
      prev.map((p) =>
        p.id === selectedPqrs.id
          ? { ...p, estado: "respondida", respuesta, fechaRespuesta: new Date().toISOString() }
          : p
      )
    );
    setRespondModalOpen(false);
    setSelectedPqrs(null);
    setRespuesta("");
  };

  const handlePriority = (pqrs, prioridad) => {
    setPqrsList((prev) =>
      prev.map((p) => (p.id === pqrs.id ? { ...p, prioridad } : p))
    );
  };

  const columnas = [
    { key: "tipo", titulo: "Tipo", ordenable: true },
    { key: "asunto", titulo: "Asunto", ordenable: true },
    { key: "remitente", titulo: "Remitente", ordenable: true },
    { key: "prioridad", titulo: "Prioridad", tipo: "badge", ordenable: true },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    { key: "fecha", titulo: "Fecha", tipo: "fecha", ordenable: true },
    {
      key: "acciones",
      titulo: "Acciones",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedPqrs(fila); setModalOpen(true); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
            title="Ver detalle"
          >
            <Eye size={15} />
          </button>
          {(fila.estado === "pendiente" || fila.estado === "en_proceso") && (
            <button
              onClick={(e) => { e.stopPropagation(); handleRespond(fila); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
              title="Responder"
            >
              <MessageSquare size={15} />
            </button>
          )}
          <div className="relative group">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Prioridad">
              <AlertCircle size={15} />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px]">
              {["baja", "media", "alta"].map((p) => (
                <button
                  key={p}
                  onClick={(e) => { e.stopPropagation(); handlePriority(fila, p); }}
                  className={`block w-full text-left px-3 py-2 text-xs font-medium capitalize hover:bg-gray-50 dark:hover:bg-dark-border first:rounded-t-xl last:rounded-b-xl ${
                    fila.prioridad === p ? "text-rose-500" : "text-gray-600 dark:text-dark-text-secondary"
                  }`}
                >
                  {p === "baja" ? "🔵" : p === "media" ? "🟡" : "🔴"} {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">PQRS</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Gestiona Peticiones, Quejas, Reclamos y Sugerencias
        </p>
      </div>

      <DataTable
        columnas={columnas}
        datos={pqrsList}
        placeholder="Buscar PQRS..."
        emptyMessage="No se encontraron PQRS"
      />

      {/* Modal detalle */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedPqrs(null); }}
        onConfirm={() => { setModalOpen(false); setSelectedPqrs(null); }}
        titulo="Detalle de PQRS"
        descripcion={
          selectedPqrs ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-dark-border rounded-lg">
                  <p className="text-gray-500 dark:text-dark-text-secondary">Tipo</p>
                  <p className="font-medium">{selectedPqrs.tipo}</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-dark-border rounded-lg">
                  <p className="text-gray-500 dark:text-dark-text-secondary">Prioridad</p>
                  <Badge estado={selectedPqrs.prioridad} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1">Remitente</p>
                <p className="text-sm font-medium">{selectedPqrs.remitente} ({selectedPqrs.email})</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1">Asunto</p>
                <p className="text-sm font-medium">{selectedPqrs.asunto}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1">Contenido</p>
                <p className="text-sm text-gray-700 dark:text-dark-text bg-gray-50 dark:bg-dark-border p-3 rounded-xl">{selectedPqrs.contenido}</p>
              </div>
              {selectedPqrs.respuesta && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-1">Respuesta</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">{selectedPqrs.respuesta}</p>
                </div>
              )}
            </div>
          ) : ""
        }
        confirmText="Cerrar"
        variant="default"
      />

      {/* Modal responder */}
      <ConfirmModal
        isOpen={respondModalOpen}
        onClose={() => { setRespondModalOpen(false); setSelectedPqrs(null); setRespuesta(""); }}
        onConfirm={confirmRespond}
        titulo="Responder PQRS"
        descripcion={
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
              Respondiendo a: <strong>{selectedPqrs?.asunto}</strong> de {selectedPqrs?.remitente}
            </p>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />
          </div>
        }
        confirmText="Enviar respuesta"
        variant="success"
        icon={MessageSquare}
      />
    </div>
  );
}
