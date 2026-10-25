import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_MODULES } from './Sidebar';

export const BottomBar: React.FC = () => {
  const { currentRole, activeModule, setActiveModule } = useApp();

  if (!currentRole) return null;

  const modules = ROLE_MODULES[currentRole] || [];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[60px] ${
                isActive ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-600' : 'text-slate-400'}`} />
                {mod.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-cyan-600" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
                {mod.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
