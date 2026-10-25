import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Monitor, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>PWA Activa</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-300 rounded-md shadow-xs transition-colors cursor-pointer group"
        title="Instalar Grabados en Metal en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-cyan-600 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Instalar Grabados en Metal</h3>
                  <p className="text-xs text-slate-500">Acceso directo como aplicación nativa</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600">
              {/* Android & Chromium Guide */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1.5">
                  <Smartphone className="w-4 h-4 text-cyan-600" />
                  <span>En Android o Chrome / Edge</span>
                </div>
                <p>
                  1. Toca los <strong>tres puntos</strong> en la esquina superior del navegador.<br />
                  2. Selecciona <strong>«Instalar aplicación»</strong> o <strong>«Agregar a la pantalla principal»</strong>.
                </p>
                {isInstallable && (
                  <button
                    onClick={() => {
                      install();
                      setShowModal(false);
                    }}
                    className="mt-2.5 w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md text-xs transition"
                  >
                    Confirmar Instalación Ahora
                  </button>
                )}
              </div>

              {/* iOS Safari Guide */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1.5">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span>En iPhone / iPad (Safari)</span>
                </div>
                <p className="space-y-1">
                  <span className="flex items-center gap-1.5">
                    1. Toca el botón <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-500" /> en la barra inferior.
                  </span>
                  <span className="flex items-center gap-1.5">
                    2. Desliza hacia abajo y pulsa <strong>«Agregar a inicio»</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />.
                  </span>
                </p>
              </div>

              {/* Desktop Computer Guide */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                  <Monitor className="w-4 h-4 text-slate-700" />
                  <span>En Computadora (Windows / Mac)</span>
                </div>
                <p>
                  Haz clic en el icono de instalación <Download className="w-3 h-3 inline text-slate-600" /> en el extremo derecho de la barra de direcciones de Chrome o Edge.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
