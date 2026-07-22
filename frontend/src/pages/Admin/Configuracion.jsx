import React, { useState } from "react";
import { Save, Globe, Mail, Shield, Image, FileText, Bot } from "lucide-react";
import ConfirmModal from "../../components/admin/ConfirmModal";

export default function AdminConfiguracion() {
  const [config, setConfig] = useState({
    nombre: "Adoptify",
    descripcion: "Plataforma de adopción de mascotas",
    email: "contacto@adoptify.com",
    telefono: "+57 300 000 0000",
    direccion: "Bogotá, Colombia",
    facebook: "https://facebook.com/adoptify",
    instagram: "https://instagram.com/adoptify",
    twitter: "https://twitter.com/adoptify",
  });
  const [apiConfig, setApiConfig] = useState({
    openaiKey: "",
    habilitarIA: false,
    moderacionAutomatica: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    {
      id: "general",
      titulo: "Información General",
      icono: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      campos: [
        { key: "nombre", label: "Nombre de la plataforma", type: "text" },
        { key: "descripcion", label: "Descripción", type: "textarea" },
        { key: "email", label: "Correo de contacto", type: "email" },
        { key: "telefono", label: "Teléfono", type: "text" },
        { key: "direccion", label: "Dirección", type: "text" },
      ],
    },
    {
      id: "social",
      titulo: "Redes Sociales",
      icono: Globe,
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-500/10",
      campos: [
        { key: "facebook", label: "Facebook", type: "url" },
        { key: "instagram", label: "Instagram", type: "url" },
        { key: "twitter", label: "Twitter / X", type: "url" },
      ],
    },
  ];

  const legalSections = [
    { icono: FileText, titulo: "Política de Privacidad", descripcion: "Documento de privacidad y tratamiento de datos" },
    { icono: Shield, titulo: "Términos y Condiciones", descripcion: "Términos de uso de la plataforma" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Configuración</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Administra la configuración general de Adoptify
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm ${
            saved
              ? "bg-emerald-500 text-white"
              : "text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600"
          }`}
        >
          <Save size={16} />
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      {/* Información General */}
      {sections.map((section) => (
        <div key={section.id} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-border">
            <div className={`w-9 h-9 rounded-xl ${section.bgColor} flex items-center justify-center ${section.color}`}>
              <section.icono size={18} />
            </div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text">{section.titulo}</h2>
          </div>
          <div className="p-4 space-y-4">
            {section.campos.map((campo) => (
              <div key={campo.key}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1.5">
                  {campo.label}
                </label>
                {campo.type === "textarea" ? (
                  <textarea
                    value={config[campo.key]}
                    onChange={(e) => setConfig((p) => ({ ...p, [campo.key]: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                  />
                ) : (
                  <input
                    type={campo.type}
                    value={config[campo.key]}
                    onChange={(e) => setConfig((p) => ({ ...p, [campo.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Documentos legales */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-border">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500">
            <FileText size={18} />
          </div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text">Documentos Legales</h2>
        </div>
        <div className="p-4 space-y-3">
          {legalSections.map((item) => (
            <div key={item.titulo} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-dark-card flex items-center justify-center text-gray-500">
                  <item.icono size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{item.titulo}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{item.descripcion}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Configuración IA */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-border">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Bot size={18} />
          </div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text">Configuración de IA</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-dark-text-secondary mb-1.5">
              API Key de OpenAI
            </label>
            <input
              type="password"
              value={apiConfig.openaiKey}
              onChange={(e) => setApiConfig((p) => ({ ...p, openaiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-border rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Habilitar asistente IA</p>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Permite usar IA para respuestas automáticas</p>
            </div>
            <div
              onClick={() => setApiConfig((p) => ({ ...p, habilitarIA: !p.habilitarIA }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${apiConfig.habilitarIA ? "bg-rose-500" : "bg-gray-300 dark:bg-gray-600"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${apiConfig.habilitarIA ? "translate-x-5" : ""}`} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-border rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Moderación automática</p>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">IA moderará contenido inapropiado automáticamente</p>
            </div>
            <div
              onClick={() => setApiConfig((p) => ({ ...p, moderacionAutomatica: !p.moderacionAutomatica }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${apiConfig.moderacionAutomatica ? "bg-rose-500" : "bg-gray-300 dark:bg-gray-600"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${apiConfig.moderacionAutomatica ? "translate-x-5" : ""}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
