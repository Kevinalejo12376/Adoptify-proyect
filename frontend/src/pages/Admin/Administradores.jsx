import React from "react";
import GestionUsuarios from "./components/GestionUsuarios";

export default function AdminAdministradores() {
  return (
    <GestionUsuarios
      titulo="Gestión de Administradores"
      descripcion="Crea y administra las cuentas de administrador de la plataforma"
      rolCrear="administrador"
      rolesFiltro={["administrador", "administrador_principal"]}
      emptyMessage="No hay administradores registrados"
    />
  );
}
