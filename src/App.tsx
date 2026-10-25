import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelector } from './components/roles/RoleSelector';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomBar } from './components/common/BottomBar';
import { AdminDashboard } from './components/roles/AdminDashboard';
import { SalesDashboard } from './components/roles/SalesDashboard';
import { DesignDashboard } from './components/roles/DesignDashboard';
import { ProductionDashboard } from './components/roles/ProductionDashboard';
import { WorkflowTrackerModal } from './components/workflow/WorkflowTrackerModal';

const DashboardContent: React.FC = () => {
  const { currentRole } = useApp();
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  // If no role has been chosen yet, show the Role Selector start screen (strictly no header, no descriptions)
  if (!currentRole) {
    return <RoleSelector />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Cabecera Institucional Unificada */}
      <Header onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)} />

      {/* Main Layout Area: Sidebar (Desktop) + Main Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)} />

        {/* Dynamic Workspace (no redundant horizontal tabs) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentRole === 'admin' && <AdminDashboard />}
            {currentRole === 'ventas' && <SalesDashboard />}
            {currentRole === 'diseno' && <DesignDashboard />}
            {currentRole === 'produccion' && <ProductionDashboard />}
          </div>
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomBar />

      {/* Trazabilidad 360° del Flujo General del Sistema Modal */}
      <WorkflowTrackerModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
