import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionOrder, ProductionStatus, Machine, QualityRecord } from '../../types';
import {
  Factory,
  Boxes,
  Cpu,
  ShieldAlert,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Flame,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

const STATUS_COLUMNS: { id: ProductionStatus; title: string; color: string }[] = [
  { id: 'pendiente', title: 'Pendientes', color: 'border-slate-300 bg-slate-50' },
  { id: 'preparacion_herramental', title: 'Setup / Herramental', color: 'border-amber-400 bg-amber-50/50' },
  { id: 'en_maquinado_inyeccion', title: 'En Maquinado / Inyección', color: 'border-cyan-400 bg-cyan-50/50' },
  { id: 'control_calidad', title: 'Inspección de Calidad', color: 'border-indigo-400 bg-indigo-50/50' },
  { id: 'terminada_empaque', title: 'Terminada / Empaque', color: 'border-emerald-400 bg-emerald-50/50' },
];

export const ProductionDashboard: React.FC = () => {
  const {
    activeModule,
    orders,
    updateOrderStatus,
    inventory,
    adjustInventoryStock,
    machines,
    updateMachineStatus,
    qualityRecords,
    addQualityRecord,
    setInspectedOrderId
  } = useApp();

  // Stock Adjustment State
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(0);
  const [stockReason, setStockReason] = useState('Reabastecimiento de materia prima');

  // Quality Modal State
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [newQuality, setNewQuality] = useState({
    opNumber: orders[0]?.opNumber || 'OP-2026-088',
    inspectedPieces: 100,
    approvedPieces: 98,
    defectivePieces: 2,
    plasticScrapKg: 1.5,
    defectReason: 'rebaba' as QualityRecord['defectReason'],
    operator: 'Mateo Cárdenas',
    notes: 'Ajuste fino de parámetros en línea.'
  });

  // Machine state edit
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStockId && stockDelta !== 0) {
      adjustInventoryStock(selectedStockId, stockDelta, stockReason);
      setSelectedStockId(null);
      setStockDelta(0);
    }
  };

  const handleQualitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQualityRecord({
      opNumber: newQuality.opNumber,
      inspectedPieces: Number(newQuality.inspectedPieces),
      approvedPieces: Number(newQuality.approvedPieces),
      defectivePieces: Number(newQuality.defectivePieces),
      plasticScrapKg: Number(newQuality.plasticScrapKg),
      defectReason: newQuality.defectReason,
      operator: newQuality.operator,
      notes: newQuality.notes
    });
    setShowQualityModal(false);
  };

  // Group inventory by category
  const metalItems = inventory.filter(i => i.category === 'metal');
  const plasticItems = inventory.filter(i => i.category === 'plastico');
  const finishedItems = inventory.filter(i => i.category === 'envase_terminado');

  return (
    <div className="space-y-6">
      {/* MODULE: CONTROL DE ÓRDENES DE PRODUCCIÓN (OP) - KANBAN & LIST */}
      {activeModule === 'ordenes_op' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Control de Piso de Planta (Órdenes de Producción)</h3>
              <p className="text-xs text-slate-500">
                Seguimiento de tiempos de entrega, avance en mecanizado CNC, inyección de plástico y grabado
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                Total en Taller: <strong>{orders.length} OPs</strong>
              </span>
            </div>
          </div>

          {/* Kanban Board Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {STATUS_COLUMNS.map((col) => {
              const colOrders = orders.filter(o => o.status === col.id);
              return (
                <div key={col.id} className={`rounded-xl border p-3 flex flex-col min-h-[460px] ${col.color}`}>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800">{col.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 shadow-2xs">
                      {colOrders.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-cyan-700">{ord.opNumber}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{ord.productType}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{ord.title}</h4>
                        <div className="text-[11px] text-slate-500 truncate">{ord.clientCompany}</div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>Avance: {ord.progressPercent}%</span>
                            <span>{ord.quantity} pzas</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${ord.progressPercent}%` }}></div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {ord.dueDate}
                          </span>

                          {/* Quick advance status buttons */}
                          <div className="flex items-center gap-1">
                            {col.id === 'pendiente' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'preparacion_herramental', 30)}
                                className="px-2 py-0.5 bg-amber-500 text-white font-bold rounded hover:bg-amber-600 transition"
                              >
                                Setup →
                              </button>
                            )}
                            {col.id === 'preparacion_herramental' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'en_maquinado_inyeccion', 60)}
                                className="px-2 py-0.5 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700 transition"
                              >
                                Iniciar →
                              </button>
                            )}
                            {col.id === 'en_maquinado_inyeccion' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'control_calidad', 90)}
                                className="px-2 py-0.5 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition"
                              >
                                Calidad →
                              </button>
                            )}
                            {col.id === 'control_calidad' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'terminada_empaque', 100)}
                                className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition"
                              >
                                Terminar ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {colOrders.length === 0 && (
                      <div className="h-24 flex items-center justify-center text-xs text-slate-400 italic">
                        Sin trabajos en esta fase
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODULE: CONTROL DE INVENTARIOS (METALES, PLÁSTICOS, ENVASES) */}
      {activeModule === 'inventario' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Control de Inventario y Materias Primas</h3>
              <p className="text-xs text-slate-500">
                Monitoreo de bloques de acero, barras de latón, resinas poliméricas y producto terminado listo
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Alerta de Stock Mínimo en Resina PP
              </span>
            </div>
          </div>

          {/* 1. SECCIÓN METALES */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                <span>Inventario de Metales (Bloques, Placas y Barras para Moldes y Grabado)</span>
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Material / Aleación</th>
                    <th className="py-2.5 px-4">SKU</th>
                    <th className="py-2.5 px-4">Ubicación</th>
                    <th className="py-2.5 px-4 text-right">Existencia Actual</th>
                    <th className="py-2.5 px-4 text-right">Mínimo</th>
                    <th className="py-2.5 px-4 text-right">Costo Est. ($/kg)</th>
                    <th className="py-2.5 px-4 text-right">Ajuste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metalItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.typeDetails}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{item.sku}</td>
                      <td className="py-3 px-4 text-slate-600">{item.location}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {item.currentStock.toLocaleString('es-MX')} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800">
                        ${item.costPerUnit}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStockId(item.id);
                            setStockDelta(50);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition cursor-pointer"
                        >
                          Ajustar Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. SECCIÓN PLÁSTICOS Y RESINAS */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-600" />
                <span>Inventario de Resinas Plásticas, Pellets y Concentrados Masterbatch</span>
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Polímero / Aditivo</th>
                    <th className="py-2.5 px-4">SKU</th>
                    <th className="py-2.5 px-4">Ubicación</th>
                    <th className="py-2.5 px-4 text-right">Stock Actual</th>
                    <th className="py-2.5 px-4 text-right">Mínimo</th>
                    <th className="py-2.5 px-4 text-right">Costo ($/kg)</th>
                    <th className="py-2.5 px-4 text-right">Ajuste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plasticItems.map((item) => {
                    const isLow = item.currentStock < item.minStock;
                    return (
                      <tr key={item.id} className={isLow ? 'bg-rose-50/50' : 'hover:bg-slate-50'}>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.typeDetails}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{item.sku}</td>
                        <td className="py-3 px-4 text-slate-600">{item.location}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          <span className={isLow ? 'text-rose-600 font-black' : ''}>
                            {item.currentStock.toLocaleString('es-MX')} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          {item.minStock} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-800">
                          ${item.costPerUnit}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStockId(item.id);
                              setStockDelta(500);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition cursor-pointer"
                          >
                            Ajustar Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. PRODUCTO TERMINADO (ENVASES) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Stock de Envases Terminados Listos para Empaque y Despacho</span>
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Producto Terminado</th>
                    <th className="py-2.5 px-4">SKU</th>
                    <th className="py-2.5 px-4">Ubicación</th>
                    <th className="py-2.5 px-4 text-right">Unidades Listas</th>
                    <th className="py-2.5 px-4 text-right">Mínimo</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finishedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.typeDetails}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{item.sku}</td>
                      <td className="py-3 px-4 text-slate-600">{item.location}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        {item.currentStock.toLocaleString('es-MX')} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStockId(item.id);
                            setStockDelta(1000);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition cursor-pointer"
                        >
                          Empacar Más
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE: ASIGNACIÓN DE RECURSOS, MÁQUINAS Y TIEMPOS */}
      {activeModule === 'maquinas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Parque de Maquinaria y Tiempos de Uso</h3>
              <p className="text-xs text-slate-500">
                Centros de mecanizado CNC, láser fibra MOPA, electroerosión e inyectoras/sopladoras
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map((mach) => (
              <div
                key={mach.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{mach.type.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      mach.status === 'operando' ? 'bg-emerald-100 text-emerald-800' :
                      mach.status === 'preparacion' ? 'bg-amber-100 text-amber-800' :
                      mach.status === 'mantenimiento' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {mach.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{mach.name}</h4>
                  
                  <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span>Tarifa / Hora:</span>
                      <strong className="font-mono text-slate-900">${mach.hourlyRate} MXN/h</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Horas este Mes:</span>
                      <strong className="font-mono text-slate-900">{mach.totalHoursMonth} h</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Eficiencia OEE:</span>
                      <strong className="font-mono text-cyan-700 font-bold">{mach.efficiencyOEE}%</strong>
                    </div>
                    {mach.currentOpNumber && (
                      <div className="flex justify-between pt-1 border-t border-slate-200 text-cyan-800">
                        <span>Orden Activa:</span>
                        <strong className="font-mono">{mach.currentOpNumber}</strong>
                      </div>
                    )}
                    {mach.activeOperator && (
                      <div className="flex justify-between text-slate-500">
                        <span>Operador:</span>
                        <span>{mach.activeOperator}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Cambiar estado:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateMachineStatus(mach.id, 'operando')}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      Operar
                    </button>
                    <button
                      onClick={() => updateMachineStatus(mach.id, 'preparacion')}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                    >
                      Setup
                    </button>
                    <button
                      onClick={() => updateMachineStatus(mach.id, 'mantenimiento')}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                    >
                      Mant.
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE: CONTROL DE CALIDAD Y REGISTRO DE MERMAS */}
      {activeModule === 'calidad_mermas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Control de Calidad, Inspección y Mermas de Plástico</h3>
              <p className="text-xs text-slate-500">
                Registro de scrap, coladas frías, rebabas y motivos de rechazo para mejora continua
              </p>
            </div>
            <button
              onClick={() => setShowQualityModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Inspección / Merma</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Tasa de Aprobación Global</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">98.7%</div>
              <p className="text-xs text-slate-500 mt-0.5">Piezas conformes inspeccionadas</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Mermas de Polímeros (Scrap)</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {qualityRecords.reduce((acc, q) => acc + q.plasticScrapKg, 0).toFixed(1)} kg
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Recuperable para peletizado secundario</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Inspecciones Realizadas</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{qualityRecords.length}</div>
              <p className="text-xs text-slate-500 mt-0.5">Lotes evaluados en piso</p>
            </div>
          </div>

          {/* Quality History Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Bitácora de Control de Calidad
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Fecha y Hora</th>
                    <th className="py-2.5 px-4">OP #</th>
                    <th className="py-2.5 px-4">Inspector / Operador</th>
                    <th className="py-2.5 px-4 text-center">Inspeccionadas</th>
                    <th className="py-2.5 px-4 text-center">Conformes</th>
                    <th className="py-2.5 px-4 text-center">Rechazadas</th>
                    <th className="py-2.5 px-4 text-right">Merma Scrap</th>
                    <th className="py-2.5 px-4">Motivo Principal</th>
                    <th className="py-2.5 px-4">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {qualityRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">{r.timestamp}</td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-700">{r.opNumber}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{r.operator}</td>
                      <td className="py-3 px-4 text-center font-mono">{r.inspectedPieces}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">{r.approvedPieces}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">{r.defectivePieces}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        {r.plasticScrapKg} kg
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {r.defectReason ? r.defectReason.replace(/_/g, ' ') : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AJUSTE DE STOCK INVENTARIO */}
      {selectedStockId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Ajuste Manual de Inventario</h4>
            <p className="text-xs text-slate-500 mt-1">Ingresa la cantidad a agregar o descontar</p>

            <form onSubmit={handleStockSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cantidad a Ajustar (positivo suma, negativo resta)
                </label>
                <input
                  type="number"
                  value={stockDelta}
                  onChange={(e) => setStockDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo del Movimiento</label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStockId(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRO DE INSPECCIÓN DE CALIDAD */}
      {showQualityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Registrar Inspección de Calidad y Merma</h4>
            <p className="text-xs text-slate-500 mt-1">Control estadístico de piezas defectuosas y scrap de polímero</p>

            <form onSubmit={handleQualitySubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Orden de Producción (OP)</label>
                <select
                  value={newQuality.opNumber}
                  onChange={(e) => setNewQuality({ ...newQuality, opNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold font-mono"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.opNumber}>
                      {o.opNumber} — {o.title.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Muestra</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuality.inspectedPieces}
                    onChange={(e) => setNewQuality({ ...newQuality, inspectedPieces: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Conformes</label>
                  <input
                    type="number"
                    min="0"
                    value={newQuality.approvedPieces}
                    onChange={(e) => setNewQuality({ ...newQuality, approvedPieces: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rechazadas</label>
                  <input
                    type="number"
                    min="0"
                    value={newQuality.defectivePieces}
                    onChange={(e) => setNewQuality({ ...newQuality, defectivePieces: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-rose-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Merma Scrap Plástico (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newQuality.plasticScrapKg}
                    onChange={(e) => setNewQuality({ ...newQuality, plasticScrapKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo de Rechazo</label>
                  <select
                    value={newQuality.defectReason}
                    onChange={(e) => setNewQuality({ ...newQuality, defectReason: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="rebaba">Rebaba en línea de cierre</option>
                    <option value="falta_llenado">Falta de llenado (Short shot)</option>
                    <option value="poro_gas">Poro o burbuja de gas</option>
                    <option value="cota_fuera_tolerancia">Cota fuera de tolerancia</option>
                    <option value="falla_grabado">Defecto en grabado láser/CNC</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operador / Inspector</label>
                <input
                  type="text"
                  value={newQuality.operator}
                  onChange={(e) => setNewQuality({ ...newQuality, operator: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Acción Correctiva o Notas</label>
                <input
                  type="text"
                  value={newQuality.notes}
                  onChange={(e) => setNewQuality({ ...newQuality, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQualityModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Guardar Inspección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
