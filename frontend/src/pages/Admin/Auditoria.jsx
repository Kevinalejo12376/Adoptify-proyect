import React from "react";
import { Clock, Shield, Users, Building2, PawPrint, Store, ShoppingCart, MessageSquare, Flag, HelpCircle, BarChart3, Settings, LogIn, LogOut } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/admin/Badge";
import { mockAuditoria } from "../../data/admin/mockData";

const actionIcons = {
  "Inicio de sesión": LogIn,
  "Cierre de sesión": LogOut,
  "Aprobación de refugio": Building2,
  "Suspensión de usuario": Users,
  "Cambio de permisos": Shield,
  "Cambio de estado": Shield,
  "Creación de administrador": Shield,
  "Respuesta de PQRS": HelpCircle,
  "Moderación de foro": MessageSquare,
  "Gestión de Marketplace": Store,
};

export default function AdminAuditoria() {
  const columnas = [
    {
      key: "accion",
      titulo: "Acción",
      tipo: "render",
      ordenable: true,
      render: (valor, fila) => {
        const Icono = actionIcons[valor] || Clock;
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-dark-border flex items-center justify-center text-gray-500">
              <Icono size={14} />
            </div>
            <span className="font-medium text-gray-900 dark:text-dark-text">{valor}</span>
          </div>
        );
      },
    },
    { key: "adminNombre", titulo: "Administrador", ordenable: true },
    { key: "modulo", titulo: "Módulo", ordenable: true },
    {
      key: "resultado",
      titulo: "Resultado",
      tipo: "badge",
      ordenable: true,
    },
    {
      key: "fecha",
      titulo: "Fecha",
      tipo: "render",
      ordenable: true,
      render: (valor) => (
        <span className="text-sm text-gray-500 dark:text-dark-text-secondary">
          {new Date(valor).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "detalle",
      titulo: "Detalle",
      tipo: "render",
      ordenable: false,
      render: (valor) => (
        <span className="text-sm text-gray-500 dark:text-dark-text-secondary max-w-[200px] truncate block" title={valor}>
          {valor}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Auditoría</h1>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          Historial completo de todas las acciones administrativas
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Clock size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Este registro es de solo lectura. Las entradas de auditoría no pueden ser editadas ni eliminadas.
        </p>
      </div>

      <DataTable
        columnas={columnas}
        datos={mockAuditoria}
        placeholder="Buscar en auditoría..."
        emptyMessage="No se encontraron registros de auditoría"
        itemsPerPage={15}
      />
    </div>
  );
}
