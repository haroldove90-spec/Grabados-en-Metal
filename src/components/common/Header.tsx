import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { RoleType } from '../../types';
import { 
  LogOut, 
  Menu, 
  ChevronDown, 
  ShieldCheck, 
  ShoppingCart, 
  Compass, 
  Cog, 
  GitBranch, 
  X 
} from 'lucide-react';

const ROLE_META: Record<RoleType, { name: string; icon: React.ComponentType<{ className?: string }>; tagColor: string }> = {
  admin: {
    name: 'Administrador / Gerencia',
    icon: ShieldCheck,
    tagColor: 'bg-slate-900 text-slate-100 border-slate-700'
  },
  ventas: {
    name: 'Ventas / Atención al Clientes',
    icon: ShoppingCart,
    tagColor: 'bg-cyan-700 text-cyan-50 border-cyan-800'
  },
  diseno: {
    name: 'Diseño / Ingeniería',
    icon: Compass,
    tagColor: 'bg-indigo-700 text-indigo-50 border-indigo-800'
  },
  produccion: {
    name: 'Producción / Operadores',
    icon: Cog,
    tagColor: 'bg-amber-600 text-amber-50 border-amber-700'
  }
};

export const Header: React.FC<{ onOpenWorkflowModal: () => void }> = ({ onOpenWorkflowModal }) => {
  const { currentRole, setCurrentRole, isSidebarOpen, toggleSidebar } = useApp();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentRole) return null;

  const currentMeta = ROLE_META[currentRole];
  const CurrentIcon = currentMeta.icon;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        
        {/* Left: Sidebar toggle (Desktop/Tablet) + Unencapsulated System Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Alternar menú lateral"
            className="hidden lg:flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <BrandLogo size="sm" showSubtitle={false} />
        </div>

        {/* Right: Rol Activo + Botón Flujo + Botón Instalar + Botón Cerrar Sesión */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Trazabilidad del Flujo General */}
          <button
            onClick={onOpenWorkflowModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            title="Ver trazabilidad completa del flujo operativo y comercial"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
            <span>Flujo Operativo</span>
          </button>

          {/* Selector de Rol Activo Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold border shadow-2xs transition-all cursor-pointer ${currentMeta.tagColor}`}
            >
              <CurrentIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-[170px] truncate">{currentMeta.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Cambiar Rol de Trabajo
                </div>
                {(Object.keys(ROLE_META) as RoleType[]).map((rKey) => {
                  const item = ROLE_META[rKey];
                  const ItemIcon = item.icon;
                  const isSelected = rKey === currentRole;
                  return (
                    <button
                      key={rKey}
                      onClick={() => {
                        setCurrentRole(rKey);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4 text-slate-500" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botón de Instalación Rápida PWA */}
          <PWAInstallButton />

          {/* Botón de Cierre de Sesión (vuelve al selector de inicio) */}
          <button
            onClick={() => setCurrentRole(null)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
            title="Cerrar sesión y volver al selector de roles"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
