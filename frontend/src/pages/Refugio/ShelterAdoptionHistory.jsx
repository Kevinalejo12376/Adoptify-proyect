import React, { useState } from "react";
import { ClipboardList, Calendar, Clock, User, Dog, Cat, Heart, Search, Filter, CheckCircle, XCircle, AlertCircle, Download, ArrowUp, ChevronDown, MapPin } from "lucide-react";

export default function ShelterAdoptionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [timeFilter, setTimeFilter] = useState("todos");

  const [adoptions] = useState([
    { id: 1, user: "Ana López", pet: "Max", petType: "Perro", status: "finalizada", date: "14 Jul 2026", time: "10:30 AM", location: "Bogotá", notes: "Adopción exitosa. La familia tiene amplio jardín.", completedDate: "20 Jul 2026" },
    { id: 2, user: "Carlos Ruiz", pet: "Luna", petType: "Gato", status: "finalizada", date: "13 Jul 2026", time: "3:45 PM", location: "Medellín", notes: "Adopción exitosa. Carlos tiene experiencia con gatos.", completedDate: "18 Jul 2026" },
    { id: 3, user: "María Fernández", pet: "Rocky", petType: "Perro", status: "finalizada", date: "12 Jul 2026", time: "9:15 AM", location: "Cali", notes: "Adoptado por una veterinaria. Excelente hogar.", completedDate: "15 Jul 2026" },
    { id: 4, user: "Pedro Martínez", pet: "Mimi", petType: "Gato", status: "finalizada", date: "10 Jul 2026", time: "2:00 PM", location: "Bogotá", notes: "Mimi se adaptó muy bien a su nuevo hogar.", completedDate: "12 Jul 2026" },
    { id: 5, user: "Laura Gómez", pet: "Thor", petType: "Perro", status: "cerrada", date: "8 Jul 2026", time: "11:30 AM", location: "Barranquilla", notes: "Solicitud cerrada por cambio de situación laboral.", completedDate: "10 Jul 2026" },
    { id: 6, user: "Sofía Ramírez", pet: "Rocky", petType: "Perro", status: "finalizada", date: "28 Jun 2026", time: "4:00 PM", location: "Bogotá", notes: "Familia con experiencia previa en adopciones.", completedDate: "5 Jul 2026" },
    { id: 7, user: "Andrés Torres", pet: "Luna", petType: "Gato", status: "finalizada", date: "20 Jun 2026", time: "10:00 AM", location: "Medellín", notes: "Adoptado para compañía de adulto mayor.", completedDate: "25 Jun 2026" },
    { id: 8, user: "Valentina Ortiz", pet: "Max", petType: "Perro", status: "cerrada", date: "15 Jun 2026", time: "1:30 PM", location: "Cali", notes: "Solicitud cerrada por no cumplir con requisitos.", completedDate: "18 Jun 2026" },
  ]);

  const getStatusBadge = (status) => {
    const config = {
      "finalizada": { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", icon: Heart },
      "cerrada": { color: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400", icon: XCircle },
    };
    const c = config[status] || config["finalizada"];
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredAdoptions = adoptions.filter(ad => {
    const matchesSearch = ad.user.toLowerCase().includes(searchTerm.toLowerCase()) || ad.pet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todas" || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const finalizadas = adoptions.filter(a => a.status === "finalizada").length;
  const cerradas = adoptions.filter(a => a.status === "cerrada").length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 rounded-full text-sm font-medium mb-3">
              <Heart className="w-4 h-4" />
              <span>Historial de Solicitudes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">Historial</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary mt-1">Todas las solicitudes de adopción procesadas</p>
          </div>
          <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border transition-all">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl p-5 text-center border border-emerald-100 dark:border-emerald-500/20">
            <Heart className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-display">{finalizadas}</p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Finalizadas</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-500/10 dark:to-slate-500/10 rounded-2xl p-5 text-center border border-gray-100 dark:border-gray-500/20">
            <XCircle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 font-display">{cerradas}</p>
            <p className="text-xs text-gray-500/70 dark:text-gray-400/70">Cerradas</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl p-5 text-center border border-amber-100 dark:border-amber-500/20">
            <ClipboardList className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-display">{adoptions.length}</p>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Total</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-white" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
              <option value="todas">Todos los estados</option>
              <option value="finalizada">Finalizadas</option>
              <option value="cerrada">Cerradas</option>
            </select>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Solicitante</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Mascota</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Estado</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Fecha Solicitud</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Fecha Cierre</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {filteredAdoptions.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {ad.user.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.user}</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{ad.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {ad.petType === "Perro" ? <Dog className="w-4 h-4 text-emerald-500" /> : <Cat className="w-4 h-4 text-teal-500" />}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ad.pet}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(ad.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                        <Calendar className="w-3.5 h-3.5" />
                        {ad.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                        <Calendar className="w-3.5 h-3.5" />
                        {ad.completedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{ad.notes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAdoptions.length === 0 && (
            <div className="text-center py-16">
              <ClipboardList className="w-12 h-12 text-gray-300 dark:text-dark-text-secondary mx-auto mb-3" />
              <p className="text-gray-500 dark:text-dark-text-secondary">No se encontraron registros</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
