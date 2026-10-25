import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Package, 
  Receipt 
} from 'lucide-react';

interface WorkflowTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowTrackerModal: React.FC<WorkflowTrackerModalProps> = ({ isOpen, onClose }) => {
  const { orders, quotes, designs, invoices, inspectedOrderId, setInspectedOrderId, createInvoiceForCompletedOP } = useApp();

  if (!isOpen) return null;

  // Selected or first order to inspect
  const selectedOrder = orders.find(o => o.id === (inspectedOrderId || orders[0]?.id)) || orders[0];
  const linkedQuote = quotes.find(q => q.id === selectedOrder?.quoteId);
  const linkedDesign = designs.find(d => d.orderId === selectedOrder?.id || d.quoteId === linkedQuote?.id);
  const linkedInvoice = invoices.find(inv => inv.opNumber === selectedOrder?.opNumber);

  // Workflow 6-stage definition
  const stages = [
    {
      num: 1,
      title: '1. Recepción y Cotización',
      desc: 'Ventas calcula materiales, horas máquina y emite presupuesto formal.',
      icon: FileText,
      isCompleted: !!linkedQuote,
      isActive: selectedOrder?.status === 'pendiente' && !linkedQuote?.status,
      data: linkedQuote ? `${linkedQuote.quoteNumber} • Total: $${linkedQuote.total.toLocaleString('es-MX')}` : 'Sin cotización vinculada'
    },
    {
      num: 2,
      title: '2. Aprobación y Creación de OP',
      desc: 'Anticipo cobrado, OP generada automáticamente y enrutada a ingeniería o piso.',
      icon: Compass,
      isCompleted: linkedQuote?.status === 'aprobada',
      isActive: selectedOrder?.status === 'pendiente',
      data: `OP: ${selectedOrder?.opNumber} • Anticipo: $${(linkedQuote?.advancePaid || 0).toLocaleString('es-MX')}`
    },
    {
      num: 3,
      title: '3. Planeación y Asignación de Recursos',
      desc: 'Verificación de materia prima (acero/resinas) en stock y calendarización de máquina.',
      icon: Cpu,
      isCompleted: selectedOrder?.rawMaterialAllocated && selectedOrder?.status !== 'pendiente',
      isActive: selectedOrder?.status === 'preparacion_herramental',
      data: `Material: ${selectedOrder?.material} • Asignado a: ${selectedOrder?.assignedOperator}`
    },
    {
      num: 4,
      title: '4. Proceso de Manufactura y Mermas',
      desc: 'Maquinado CNC / Inyección / Grabado láser con registro de scrap y control de calidad.',
      icon: ShieldCheck,
      isCompleted: selectedOrder?.progressPercent >= 90 || selectedOrder?.status === 'terminada_empaque',
      isActive: selectedOrder?.status === 'en_maquinado_inyeccion' || selectedOrder?.status === 'control_calidad',
      data: `Progreso: ${selectedOrder?.progressPercent}% • Máquina: ${selectedOrder?.assignedMachineId}`
    },
    {
      num: 5,
      title: '5. Empaque y Almacenaje',
      desc: 'El lote terminado pasa a almacén de producto terminado listo para entrega.',
      icon: Package,
      isCompleted: selectedOrder?.status === 'terminada_empaque',
      isActive: selectedOrder?.status === 'terminada_empaque' && !linkedInvoice,
      data: selectedOrder?.completedDate ? `Completado el ${selectedOrder.completedDate} • Listo en Almacén` : 'En proceso en piso de planta'
    },
    {
      num: 6,
      title: '6. Facturación y Cobranza',
      desc: 'Aviso automático a Gerencia, emisión de factura CFDI y cierre del ciclo financiero.',
      icon: Receipt,
      isCompleted: linkedInvoice?.status === 'cobrada',
      isActive: !!linkedInvoice && linkedInvoice.status !== 'cobrada',
      data: linkedInvoice ? `${linkedInvoice.invoiceNumber} • Saldo pend: $${linkedInvoice.pendingBalance.toLocaleString('es-MX')}` : 'Pendiente de emisión de factura final'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                Inteligencia Operativa
              </span>
              <h2 className="text-lg font-black tracking-tight">Trazabilidad 360° del Flujo de Trabajo</h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Desde la cotización inicial hasta la entrega del producto y liquidación contable
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Selector Tab */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Seleccionar Orden:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setInspectedOrderId(ord.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                ord.id === selectedOrder?.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {ord.opNumber} — {ord.clientCompany.substring(0, 20)}...
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  {selectedOrder?.opNumber}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Cliente: <strong className="text-slate-800">{selectedOrder?.clientCompany}</strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedOrder?.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cantidad: <strong>{selectedOrder?.quantity.toLocaleString('es-MX')} piezas</strong> • Entrega programada: <strong>{selectedOrder?.dueDate}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Precio Venta</div>
                <div className="text-base font-black text-slate-900">
                  ${selectedOrder?.salePrice.toLocaleString('es-MX')}
                </div>
              </div>

              {selectedOrder?.status === 'terminada_empaque' && !linkedInvoice && (
                <button
                  onClick={() => {
                    createInvoiceForCompletedOP(selectedOrder.id);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Emitir Factura Final</span>
                </button>
              )}
            </div>
          </div>

          {/* 6 Step Visualizer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Etapas del Ciclo Productivo y Administrativo
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stages.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.num}
                    className={`relative p-4 rounded-xl border transition-all ${
                      st.isCompleted
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : st.isActive
                        ? 'bg-cyan-50 border-cyan-400 shadow-xs ring-1 ring-cyan-400'
                        : 'bg-white border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            st.isCompleted
                              ? 'bg-emerald-600 text-white'
                              : st.isActive
                              ? 'bg-cyan-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{st.title}</span>
                      </div>

                      {st.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : st.isActive ? (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                        </span>
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                    </div>

                    <p className="mt-2 text-[11px] text-slate-600 leading-snug">{st.desc}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 font-mono text-[10px] text-slate-700 font-semibold truncate">
                      {st.data}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linked technical elements */}
          {linkedDesign && (
            <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-950 font-medium">
                  Plano CAD/CAM Vinculado: <strong>{linkedDesign.title}</strong> ({linkedDesign.fileFormat} • Tol: ±{linkedDesign.toleranceMm}mm)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 capitalize">
                {linkedDesign.status.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Grabados en Metal • Taller de Alta Precisión y Transformación de Plásticos
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Cerrar Vista
          </button>
        </div>

      </div>
    </div>
  );
};
