import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminNombre = user?.nombre || "Admin";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        adminNombre={adminNombre}
        onLogout={handleLogout}
      />

      {/* Contenido principal */}
      <div
        className={`
          transition-all duration-300
          lg:ml-[260px] pb-16 lg:pb-0
          ${sidebarCollapsed ? "lg:!ml-[72px]" : ""}
        `}
      >
        {/* Header */}
        <AdminHeader
          adminNombre={adminNombre}
          onLogout={handleLogout}
        />

        {/* Main Content (Outlet) */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
