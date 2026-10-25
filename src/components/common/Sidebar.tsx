import React from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';
import {
  TrendingUp,
  Receipt,
  PieChart,
  Users,
  Layers,
  FileSpreadsheet,
  Building2,
  FilePlus2,
  FolderGit2,
  CheckCircle,
  Eye,
  Factory,
  Boxes,
  Cpu,
  ShieldAlert,
  LogOut,
  GitBranch
} from 'lucide-react';

interface ModuleDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const ROLE_MODULES: Record<RoleType, ModuleDef[]> = {
  admin: [
    { id: 'kpis', label: 'KPIs y Finanzas', icon: TrendingUp },
    { id: 'cobrar_pagar', label: 'Cobrar y Pagar', icon: Receipt },
    { id: 'rentabilidad', label: 'Rentabilidad OPs', icon: PieChart },
    { id: 'usuarios', label: 'Usuarios y Permisos', icon: Users }
  ],
  ventas: [
    { id: 'cotizaciones', label: 'Cotizaciones', icon: FileSpreadsheet },
    { id: 'nueva_cotizacion', label: 'Nueva Cotización', icon: FilePlus2, badge: 'Crear' },
    { id: 'catalogo', label: 'Catálogo Productos', icon: Layers },
    { id: 'crm', label: 'Clientes (CRM)', icon: Building2 }
  ],
  diseno: [
    { id: 'repositorio', label: 'Planos y CAD/CAM', icon: FolderGit2 },
    { id: 'aprobaciones', label: 'Muestras y Prototipos', icon: CheckCircle },
    { id: 'visor_3d', label: 'Visor Técnico & Cotas', icon: Eye }
  ],
  produccion: [
    { id: 'ordenes_op', label: 'Órdenes de Planta (OP)', icon: Factory },
    { id: 'inventario', label: 'Inventario (Metales/Plásticos)', icon: Boxes },
    { id: 'maquinas', label: 'Máquinas y Tiempos', icon: Cpu },
    { id: 'calidad_mermas', label: 'Calidad y Mermas', icon: ShieldAlert }
  ]
};

export const Sidebar: React.FC<{ onOpenWorkflowModal: () => void }> = ({ onOpenWorkflowModal }) => {
  const { currentRole, activeModule, setActiveModule, isSidebarOpen, setCurrentRole } = useApp();

  if (!currentRole || !isSidebarOpen) return null;

  const modules = ROLE_MODULES[currentRole] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800 shrink-0 select-none min-h-[calc(100vh-57px)]">
      {/* Role Title Section */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Módulos Operativos
        </div>
        <div className="mt-1 text-sm font-bold text-white capitalize">
          {currentRole === 'admin' && 'Gerencia General'}
          {currentRole === 'ventas' && 'Ventas y Clientes'}
          {currentRole === 'diseno' && 'Ingeniería y Diseño'}
          {currentRole === 'produccion' && 'Taller y Planta'}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{mod.label}</span>
              </div>
              {mod.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/30 text-cyan-200">
                  {mod.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Shortcuts: Workflow & Exit */}
      <div className="p-3 border-t border-slate-800 space-y-1 bg-slate-950/20">
        <button
          onClick={onOpenWorkflowModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>Trazabilidad 360°</span>
        </button>

        <button
          onClick={() => setCurrentRole(null)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cambiar Rol / Salir</span>
        </button>
      </div>
    </aside>
  );
};
