import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DesignFile, DesignStatus } from '../../types';
import {
  FolderGit2,
  CheckCircle,
  Eye,
  Plus,
  FileCode,
  Layers,
  Sliders,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ZoomIn,
  Move,
  RotateCw,
  Sparkles
} from 'lucide-react';

export const DesignDashboard: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    designs,
    updateDesignStatus,
    clients
  } = useApp();

  const [selectedDesignId, setSelectedDesignId] = useState<string>(designs[0]?.id || '');
  const [showNewDesignModal, setShowNewDesignModal] = useState(false);
  const [viewerLayer, setViewerLayer] = useState<{
    cotas: boolean;
    ejes: boolean;
    tolerancias: boolean;
    toolpath: boolean;
  }>({
    cotas: true,
    ejes: true,
    tolerancias: true,
    toolpath: true
  });

  const [feedbackNote, setFeedbackNote] = useState('');

  const selectedDesign = designs.find(d => d.id === selectedDesignId) || designs[0];

  const handleUpdateStatus = (designId: string, newStatus: DesignStatus) => {
    updateDesignStatus(designId, newStatus, feedbackNote || undefined);
    setFeedbackNote('');
  };

  return (
    <div className="space-y-6">
      {/* MODULE: REPOSITORIO DE PLANOS Y CAD/CAM */}
      {activeModule === 'repositorio' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Repositorio Técnico CAD/CAM y Modelado</h3>
              <p className="text-xs text-slate-500">
                Archivos STEP, IGES, DXF y vectores para centros de mecanizado CNC y grabado láser
              </p>
            </div>
            <button
              onClick={() => setActiveModule('visor_3d')}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Eye className="w-4 h-4" />
              <span>Abrir Visor Técnico</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Archivos Registrados</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{designs.length}</div>
              <p className="text-xs text-slate-500 mt-0.5">Modelos 3D y planos 2D</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Aprobados por Cliente</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {designs.filter(d => d.status === 'aprobado_cliente').length}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Listos para maquinado en piso</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">En Revisión Técnica</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {designs.filter(d => d.status === 'en_revision' || d.status === 'pendiente').length}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Verificando tolerancias y cotas</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Prototipos en Físico</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {designs.filter(d => d.status === 'prototipo_fabricado').length}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Muestras SLA / Maquinadas</p>
            </div>
          </div>

          {/* Design Files List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {designs.map((dsg) => (
              <div
                key={dsg.id}
                className={`p-5 bg-white rounded-xl border transition-all ${
                  dsg.id === selectedDesignId ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white">
                      {dsg.fileFormat}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{dsg.version}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    dsg.status === 'aprobado_cliente' ? 'bg-emerald-100 text-emerald-800' :
                    dsg.status === 'en_revision' ? 'bg-indigo-100 text-indigo-800' :
                    dsg.status === 'prototipo_fabricado' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {dsg.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{dsg.title}</h4>
                <div className="text-xs text-slate-500 mt-0.5">Cliente: <strong className="text-slate-700">{dsg.clientName}</strong></div>

                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Tolerancia Geométrica:</span>
                    <strong className="font-mono text-slate-900">± {dsg.toleranceMm} mm</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Última Actualización:</span>
                    <span className="font-mono text-slate-500">{dsg.updatedAt}</span>
                  </div>
                  <p className="pt-1 text-slate-600 italic">«{dsg.notes}»</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedDesignId(dsg.id);
                      setActiveModule('visor_3d');
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar Plano 2D/3D</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDesignId(dsg.id);
                      setActiveModule('aprobaciones');
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Cambiar Estatus →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE: APROBACIONES DE MUESTRAS Y PROTOTIPOS */}
      {activeModule === 'aprobaciones' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Control de Aprobaciones y Muestras Técnicas</h3>
            <p className="text-xs text-slate-500">
              Registra la validación técnica, fabricación de muestras prototipo y el visto bueno final del cliente
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of designs */}
            <div className="space-y-2 lg:col-span-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Seleccionar Diseño</span>
              {designs.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDesignId(d.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition ${
                    d.id === selectedDesign?.id
                      ? 'bg-indigo-50/80 border-indigo-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{d.fileFormat}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      d.status === 'aprobado_cliente' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{d.title}</div>
                  <div className="text-[11px] text-slate-500 truncate">{d.clientName}</div>
                </button>
              ))}
            </div>

            {/* Approval Details Panel */}
            {selectedDesign && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600">Expediente Técnico de Diseño</span>
                    <h4 className="text-base font-bold text-slate-900">{selectedDesign.title}</h4>
                    <p className="text-xs text-slate-500">Cliente: {selectedDesign.clientName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Estado Actual</span>
                    <div className="text-sm font-black text-indigo-700 uppercase">
                      {selectedDesign.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Formato Nativo:</span>
                    <strong className="font-mono text-slate-900">{selectedDesign.fileFormat} (Versión {selectedDesign.version})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tolerancia Exigida:</span>
                    <strong className="font-mono text-slate-900">± {selectedDesign.toleranceMm} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bitácora / Observaciones:</span>
                    <span className="text-slate-700 font-medium italic">{selectedDesign.notes}</span>
                  </div>
                </div>

                {/* Change status controls */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Actualizar Estatus de Muestra / Validación del Cliente
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedDesign.id, 'en_revision')}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition ${
                        selectedDesign.status === 'en_revision' ? 'bg-indigo-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      En Revisión
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedDesign.id, 'prototipo_fabricado')}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition ${
                        selectedDesign.status === 'prototipo_fabricado' ? 'bg-amber-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Prototipo Hecho
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedDesign.id, 'aprobado_cliente')}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition ${
                        selectedDesign.status === 'aprobado_cliente' ? 'bg-emerald-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      ✓ Aprobado Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedDesign.id, 'rechazado')}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition ${
                        selectedDesign.status === 'rechazado' ? 'bg-rose-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Rechazado c/Notas
                    </button>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Agregar Nota o Retroalimentación Técnica
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej. Cliente solicitó aumentar radio de acuerdo en 0.5mm..."
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdateStatus(selectedDesign.id, selectedDesign.status)}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
                      >
                        Guardar Nota
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE: VISOR TÉCNICO INTERACTIVO 2D/3D & COTAS */}
      {activeModule === 'visor_3d' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Visor Interactivo de Planos y Cavidades CAD</h3>
              <p className="text-xs text-slate-500">
                Inspección de cotas de mecanizado, trayectorias de fresa y tolerancias dimensionales
              </p>
            </div>

            {/* Layer switches */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-1.5 px-2 py-1 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewerLayer.cotas}
                  onChange={(e) => setViewerLayer({ ...viewerLayer, cotas: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Cotas (mm)</span>
              </label>
              <label className="flex items-center gap-1.5 px-2 py-1 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewerLayer.ejes}
                  onChange={(e) => setViewerLayer({ ...viewerLayer, ejes: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Ejes XYZ</span>
              </label>
              <label className="flex items-center gap-1.5 px-2 py-1 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewerLayer.tolerancias}
                  onChange={(e) => setViewerLayer({ ...viewerLayer, tolerancias: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Tolerancias</span>
              </label>
            </div>
          </div>

          {/* Interactive Canvas CAD / Simulation viewport */}
          <div className="relative w-full h-[520px] bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between p-4">
            {/* Top Toolbar overlay */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-white text-xs">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold">{selectedDesign?.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">({selectedDesign?.fileFormat})</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/60 text-slate-300">
                <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition" title="Rotar Modelo">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition" title="Pan">
                  <Move className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SVG Interactive Blueprint / 3D Simulation */}
            <div className="absolute inset-0 flex items-center justify-center p-8 select-none">
              <svg className="w-full h-full max-w-xl max-h-[420px]" viewBox="0 0 600 400" fill="none">
                <defs>
                  <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="metalCavityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#0f172a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Engineering Background Grid */}
                <rect width="600" height="400" fill="url(#gridPattern)" />

                {/* Coordinate Axes */}
                {viewerLayer.ejes && (
                  <g opacity="0.6">
                    <line x1="300" y1="20" x2="300" y2="380" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="200" x2="560" y2="200" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="308" y="35" fill="#38bdf8" fontSize="10" fontFamily="monospace">Z+ (Husillo)</text>
                    <text x="530" y="192" fill="#38bdf8" fontSize="10" fontFamily="monospace">X+ (Mesa)</text>
                  </g>
                )}

                {/* Technical Mold Cavity / Engraving Geometry */}
                {/* Outer Mold Block */}
                <rect x="140" y="80" width="320" height="240" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="2" />

                {/* Internal Machined Cavity Profile */}
                <path
                  d="M200 130 C200 110, 400 110, 400 130 L400 240 C400 270, 360 290, 300 290 C240 290, 200 270, 200 240 Z"
                  fill="url(#metalCavityGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Parting line & Cooling Channels */}
                <line x1="160" y1="180" x2="190" y2="180" stroke="#06b6d4" strokeWidth="3" />
                <line x1="410" y1="180" x2="440" y2="180" stroke="#06b6d4" strokeWidth="3" />
                <circle cx="175" cy="180" r="5" fill="#0284c7" />
                <circle cx="425" cy="180" r="5" fill="#0284c7" />

                {/* CNC Toolpath simulation contours */}
                {viewerLayer.toolpath && (
                  <g stroke="#f59e0b" strokeWidth="1" opacity="0.75" strokeDasharray="2 3">
                    <path d="M215 140 C215 125, 385 125, 385 140 L385 235 C385 260, 350 275, 300 275 C250 275, 215 260, 215 235 Z" />
                    <path d="M230 150 C230 140, 370 140, 370 150 L370 230 C370 250, 340 260, 300 260 C260 260, 230 250, 230 230 Z" />
                  </g>
                )}

                {/* Dimensions (Cotas) */}
                {viewerLayer.cotas && (
                  <g fill="#94a3b8" fontSize="11" fontFamily="monospace">
                    {/* Horizontal Width Dimension */}
                    <line x1="200" y1="65" x2="400" y2="65" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="200" y1="58" x2="200" y2="72" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="400" y1="58" x2="400" y2="72" stroke="#94a3b8" strokeWidth="1.2" />
                    <text x="270" y="60" fill="#f8fafc" fontWeight="bold">Ø 85.00 mm</text>

                    {/* Vertical Height Dimension */}
                    <line x1="110" y1="130" x2="110" y2="290" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="103" y1="130" x2="117" y2="130" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="103" y1="290" x2="117" y2="290" stroke="#94a3b8" strokeWidth="1.2" />
                    <text x="45" y="215" fill="#f8fafc" fontWeight="bold">H 160 mm</text>
                  </g>
                )}

                {/* Tolerances badge */}
                {viewerLayer.tolerancias && (
                  <g transform="translate(340, 310)">
                    <rect width="130" height="24" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                    <text x="10" y="16" fill="#c7d2fe" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      TOL ±{selectedDesign?.toleranceMm || 0.02} mm
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom info overlay */}
            <div className="flex items-center justify-between text-xs text-slate-400 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 font-mono">
              <div>
                <span>Post-procesador: <strong>FANUC / HAAS 5-Axis ISO G-Code</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span>Avance: <strong>1,800 mm/min</strong></span>
                <span>RPM: <strong>12,500 RPM</strong></span>
                <span className="text-emerald-400 font-bold">Colisión Check: PASS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
