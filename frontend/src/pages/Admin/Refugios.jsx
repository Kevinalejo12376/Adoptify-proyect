import React from "react";
import GestionUsuarios from "./components/GestionUsuarios";

export default function AdminRefugios() {
  return (
    <GestionUsuarios
      titulo="Gestión de Refugios"
      descripcion="Crea y administra los refugios registrados en la plataforma"
      rolCrear="refugio"
      rolesFiltro={["refugio"]}
      esRefugio
      emptyMessage="No hay refugios registrados"
    />
  );
}
