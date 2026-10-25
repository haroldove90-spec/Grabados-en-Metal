import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { RoleType } from '../../types';
import { ShieldCheck, ShoppingCart, Compass, Cog } from 'lucide-react';

interface RoleOption {
  id: RoleType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  hoverBorder: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'admin',
    name: 'Administrador / Gerencia',
    icon: ShieldCheck,
    accentColor: 'text-slate-800 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white',
    hoverBorder: 'hover:border-slate-800'
  },
  {
    id: 'ventas',
    name: 'Ventas / Atención al Clientes',
    icon: ShoppingCart,
    accentColor: 'text-cyan-700 bg-cyan-50 group-hover:bg-cyan-600 group-hover:text-white',
    hoverBorder: 'hover:border-cyan-600'
  },
  {
    id: 'diseno',
    name: 'Diseño / Ingeniería',
    icon: Compass,
    accentColor: 'text-indigo-700 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
    hoverBorder: 'hover:border-indigo-600'
  },
  {
    id: 'produccion',
    name: 'Producción / Operadores',
    icon: Cog,
    accentColor: 'text-amber-700 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
    hoverBorder: 'hover:border-amber-600'
  }
];

export const RoleSelector: React.FC = () => {
  const { setCurrentRole } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Central System Logo without artificial container capsule */}
      <div className="mb-10 sm:mb-14">
        <BrandLogo size="xl" showSubtitle={true} align="center" />
      </div>

      {/* Grid: 2 columns mobile, 4 columns desktop */}
      <div className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className={`group relative flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${role.hoverBorder}`}
            >
              {/* Role Icon */}
              <div className={`p-4 rounded-xl mb-4 transition-colors duration-200 ${role.accentColor}`}>
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
              </div>

              {/* Only Role Name (no descriptions, no header) */}
              <span className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-slate-950 tracking-tight leading-snug">
                {role.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
