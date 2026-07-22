import React, { useState } from "react";
import { EyeOff, RotateCcw, Trash2, Star, MessageSquare } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { mockForoAdmin, mockComentariosAdmin } from "../../data/admin/mockData";

export default function AdminForo() {
  const [publicaciones, setPublicaciones] = useState(mockForoAdmin);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const handleAction = (post, accion) => {
    setSelectedPost(post);
    setModalAction(accion);
    setModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedPost) return;
    if (modalAction === "delete-comment") {
      // Simular eliminación de comentario
      setModalOpen(false);
      setSelectedPost(null);
      return;
    }
    setPublicaciones((prev) =>
      prev.map((p) =>
        p.id === selectedPost.id
          ? {
              ...p,
              estado: modalAction === "hide" ? "oculto" : "visible",
              destacado: modalAction === "feature" ? true : modalAction === "unfeature" ? false : p.destacado,
            }
          : p
      )
    );
    setModalOpen(false);
    setSelectedPost(null);
    setModalAction(null);
  };

  const columnas = [
    { key: "titulo", titulo: "Publicación", ordenable: true },
    { key: "autor", titulo: "Autor", ordenable: true },
    { key: "categoria", titulo: "Categoría", ordenable: true },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    { key: "comentarios", titulo: "Comentarios", ordenable: true, className: "text-center" },
    {
      key: "reportes",
      titulo: "Reportes",
      ordenable: true,
      className: "text-center",
      render: (valor) => (
        <span className={`text-sm font-medium ${valor > 0 ? "text-red-500" : "text-gray-500"}`}>{valor}</span>
      ),
    },
    {
      key: "destacado",
      titulo: "Destacado",
      tipo: "render",
      ordenable: true,
      className: "text-center",
      render: (valor) => valor ? <Star size={14} className="text-amber-500 inline" /> : "—",
    },
    {
      key: "acciones",
      titulo: "Acciones",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <div className="flex items-center justify-end gap-1">
          {!fila.destacado && (
            <button
              onClick={(e) => { e.stopPropagation(); handleAction(fila, "feature"); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
              title="Destacar"
            >
              <Star size={15} />
            </button>
          )}
          {fila.destacado && (
            <button
              onClick={(e) => { e.stopPropagation(); handleAction(fila, "unfeature"); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
              title="Quitar destacado"
            >
              <Star size={15} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleAction(fila, fila.estado === "oculto" ? "restore" : "hide"); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
            title={fila.estado === "oculto" ? "Restaurar" : "Ocultar"}
          >
            {fila.estado === "oculto" ? <RotateCcw size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      ),
    },
  ];

  const comentariosCol = [
    { key: "autor", titulo: "Autor", ordenable: true },
    { key: "contenido", titulo: "Contenido", ordenable: true },
    { key: "fecha", titulo: "Fecha", tipo: "fecha", ordenable: true },
    { key: "estado", titulo: "Estado", tipo: "badge", ordenable: true },
    {
      key: "acciones",
      titulo: "",
      tipo: "render",
      ordenable: false,
      className: "text-right",
      render: (_, fila) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleAction(fila, "delete-comment"); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          title="Eliminar comentario"
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Administración del Foro</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Modera publicaciones, comentarios y contenido destacado
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3">Publicaciones</h2>
        <DataTable
          columnas={columnas}
          datos={publicaciones}
          placeholder="Buscar publicaciones..."
          emptyMessage="No se encontraron publicaciones"
        />
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3">Comentarios Recientes</h2>
        <DataTable
          columnas={comentariosCol}
          datos={mockComentariosAdmin}
          buscador={false}
          emptyMessage="No hay comentarios"
        />
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        titulo={
          modalAction === "hide" ? "Ocultar Publicación" :
          modalAction === "restore" ? "Restaurar Publicación" :
          modalAction === "feature" ? "Destacar Publicación" :
          modalAction === "unfeature" ? "Quitar Destacado" :
          "Eliminar Comentario"
        }
        descripcion={
          modalAction === "hide" ? `¿Ocultar "${selectedPost?.titulo}"? No será visible en el foro.` :
          modalAction === "restore" ? `¿Restaurar "${selectedPost?.titulo}"? Volverá a ser visible.` :
          modalAction === "feature" ? `¿Destacar "${selectedPost?.titulo}"? Aparecerá como publicación destacada.` :
          modalAction === "unfeature" ? `¿Quitar destacado a "${selectedPost?.titulo}"?` :
          "¿Eliminar este comentario permanentemente?"
        }
        variant={
          modalAction === "hide" ? "warning" :
          modalAction === "restore" || modalAction === "feature" ? "success" :
          "danger"
        }
        confirmText={
          modalAction === "hide" ? "Ocultar" :
          modalAction === "restore" ? "Restaurar" :
          modalAction === "feature" ? "Destacar" :
          modalAction === "unfeature" ? "Quitar" :
          "Eliminar"
        }
        icon={modalAction === "delete-comment" ? Trash2 : undefined}
      />
    </div>
  );
}
