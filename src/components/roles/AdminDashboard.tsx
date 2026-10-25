import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, SystemUser } from '../../types';
import {
  TrendingUp,
  Receipt,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Users,
  Plus,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Layers,
  Factory
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activeModule,
    orders,
    invoices,
    payables,
    users,
    registerClientPayment,
    registerPayablePayment,
    toggleUserStatus,
    addUser,
    setInspectedOrderId
  } = useApp();

  // State for recording payments
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedPayableId, setSelectedPayableId] = useState<string | null>(null);
  const [payableAmount, setPayableAmount] = useState<number>(0);

  // State for new user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: RoleType;
    phone: string;
    shift: 'matutino' | 'vespertino' | 'mixto';
  }>({
    name: '',
    email: '',
    role: 'produccion',
    phone: '',
    shift: 'matutino'
  });

  // Financial Calculations
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalReceivable = invoices.reduce((acc, i) => acc + i.pendingBalance, 0);
  
  const totalPayablesAmount = payables.reduce((acc, p) => acc + p.amount, 0);
  const totalPayablesPaid = payables.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPayablesPending = totalPayablesAmount - totalPayablesPaid;

  const netCashFlow = totalCollected - totalPayablesPaid;
  const activeOrdersCount = orders.filter(o => o.status !== 'terminada_empaque').length;
  
  // Profitability calculations
  const totalProductionCost = orders.reduce((acc, o) => acc + (o.materialCost + o.machineCost + o.laborCost), 0);
  const totalSalesRevenue = orders.reduce((acc, o) => acc + o.salePrice, 0);
  const overallGrossProfit = totalSalesRevenue - totalProductionCost;
  const overallMarginPercent = totalSalesRevenue > 0 ? ((overallGrossProfit / totalSalesRevenue) * 100).toFixed(1) : '0';

  const handlePayInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoiceId && paymentAmount > 0) {
      registerClientPayment(selectedInvoiceId, paymentAmount);
      setSelectedInvoiceId(null);
      setPaymentAmount(0);
    }
  };

  const handlePayPayable = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPayableId && payableAmount > 0) {
      registerPayablePayment(selectedPayableId, payableAmount);
      setSelectedPayableId(null);
      setPayableAmount(0);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    addUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone || '+52 55 0000 0000',
      status: 'activo',
      shift: newUser.shift
    });
    setShowAddUserModal(false);
    setNewUser({ name: '', email: '', role: 'produccion', phone: '', shift: 'matutino' });
  };

  return (
    <div className="space-y-6">
      {/* MODULE 1: KPIS Y FINANZAS */}
      {activeModule === 'kpis' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sales */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Ventas del Mes</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                ${totalSalesRevenue.toLocaleString('es-MX')}
              </div>
              <div className="mt-1 flex items-center text-xs text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                <span>+18.4% vs mes anterior</span>
              </div>
            </div>

            {/* Active Orders */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Órdenes en Proceso</span>
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                  <Factory className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                {activeOrdersCount} OPs activas
              </div>
              <div className="mt-1 flex items-center text-xs text-slate-500 font-medium">
                <span>Capacidad de planta al 86%</span>
              </div>
            </div>

            {/* Production Efficiency OEE */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Eficiencia OEE Planta</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                87.6%
              </div>
              <div className="mt-1 flex items-center text-xs text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                <span>CNC Haas & Soplado al máximo</span>
              </div>
            </div>

            {/* Net Cash Flow */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Flujo de Caja Neto</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                ${netCashFlow.toLocaleString('es-MX')}
              </div>
              <div className="mt-1 flex items-center text-xs text-slate-500 font-medium">
                <span>Cobrado: ${totalCollected.toLocaleString('es-MX')}</span>
              </div>
            </div>
          </div>

          {/* Revenue Distribution and Floor Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Distribution by Business Unit */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-600" />
                <span>Ingresos por Unidad de Negocio</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Moldes de Inyección y Soplado</span>
                    <strong className="text-slate-900">54% ($235,000)</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-600 h-full rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Manufactura de Envases Plásticos</span>
                    <strong className="text-slate-900">32% ($140,000)</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Grabados en Metal (Láser y CNC)</span>
                    <strong className="text-slate-900">14% ($61,000)</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Margen promedio global: <strong className="text-emerald-700 font-bold">{overallMarginPercent}%</strong>
              </div>
            </div>

            {/* Active Production Orders Overview */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Factory className="w-4 h-4 text-indigo-600" />
                  <span>Estado de Órdenes de Producción en Curso</span>
                </h3>
                <span className="text-xs text-slate-500">Total: {orders.length} órdenes</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">OP #</th>
                      <th className="py-2.5 px-3">Cliente</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Progreso</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Entrega</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr 
                        key={ord.id} 
                        onClick={() => setInspectedOrderId(ord.id)}
                        className="hover:bg-slate-50 transition cursor-pointer"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-cyan-700">{ord.opNumber}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{ord.clientCompany}</td>
                        <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">{ord.productType}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-cyan-600 h-full" style={{ width: `${ord.progressPercent}%` }}></div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-600">{ord.progressPercent}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'terminada_empaque' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'en_maquinado_inyeccion' ? 'bg-cyan-100 text-cyan-800' :
                            ord.status === 'control_calidad' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{ord.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CUENTAS POR COBRAR Y PAGAR */}
      {activeModule === 'cobrar_pagar' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuentas por Cobrar (Clientes)</span>
              <div className="mt-1 text-2xl font-black text-cyan-700">
                ${totalReceivable.toLocaleString('es-MX')}
              </div>
              <p className="text-xs text-slate-500 mt-1">Facturas emitidas pendientes de pago</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuentas por Pagar (Proveedores)</span>
              <div className="mt-1 text-2xl font-black text-rose-600">
                ${totalPayablesPending.toLocaleString('es-MX')}
              </div>
              <p className="text-xs text-slate-500 mt-1">Acero, resinas plásticas y servicios</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Balance Proyectado</span>
              <div className="mt-1 text-2xl font-black text-emerald-700">
                +${(totalReceivable - totalPayablesPending).toLocaleString('es-MX')}
              </div>
              <p className="text-xs text-slate-500 mt-1">Margen positivo a favor del taller</p>
            </div>
          </div>

          {/* Cuentas por Cobrar Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-600" />
                <span>Facturas a Clientes (Cuentas por Cobrar)</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Total Facturado: ${totalInvoiced.toLocaleString('es-MX')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Factura #</th>
                    <th className="py-2.5 px-4">Cliente / Razón Social</th>
                    <th className="py-2.5 px-4">OP Ref</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                    <th className="py-2.5 px-4 text-right">Cobrado</th>
                    <th className="py-2.5 px-4 text-right">Saldo Pendiente</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{inv.clientName}</div>
                        <div className="text-[10px] text-slate-400">{inv.clientRfc}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-700">{inv.opNumber}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">${inv.total.toLocaleString('es-MX')}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">${inv.paidAmount.toLocaleString('es-MX')}</td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600">${inv.pendingBalance.toLocaleString('es-MX')}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'cobrada' ? 'bg-emerald-100 text-emerald-700' :
                          inv.status === 'parcial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.pendingBalance > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedInvoiceId(inv.id);
                              setPaymentAmount(inv.pendingBalance);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded transition"
                          >
                            Registrar Cobro
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Liquidada
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cuentas por Pagar (Proveedores) Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Cuentas por Pagar a Proveedores (Acero, Resinas, Insumos)</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Total Pendiente: ${totalPayablesPending.toLocaleString('es-MX')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Proveedor</th>
                    <th className="py-2.5 px-4">Concepto</th>
                    <th className="py-2.5 px-4">Vencimiento</th>
                    <th className="py-2.5 px-4 text-right">Monto</th>
                    <th className="py-2.5 px-4 text-right">Abonado</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payables.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-800">{p.supplierName}</td>
                      <td className="py-3 px-4 text-slate-600">{p.description}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{p.dueDate}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">${p.amount.toLocaleString('es-MX')}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">${p.paidAmount.toLocaleString('es-MX')}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'pagada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.status !== 'pagada' ? (
                          <button
                            onClick={() => {
                              setSelectedPayableId(p.id);
                              setPayableAmount(p.amount - p.paidAmount);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded transition"
                          >
                            Pagar Proveedor
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pagado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: REPORTES DE RENTABILIDAD POR ORDEN */}
      {activeModule === 'rentabilidad' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-600" />
              <span>Análisis Detallado de Costos vs. Precio de Venta por Orden</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Desglose técnico de costo de materia prima + tiempo máquina CNC/inyección + mano de obra especializada.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">OP #</th>
                    <th className="py-2.5 px-3">Descripción</th>
                    <th className="py-2.5 px-3 text-right">Mat. Prima ($)</th>
                    <th className="py-2.5 px-3 text-right">Máquina ($)</th>
                    <th className="py-2.5 px-3 text-right">Mano Obra ($)</th>
                    <th className="py-2.5 px-3 text-right">Costo Total ($)</th>
                    <th className="py-2.5 px-3 text-right">Venta ($)</th>
                    <th className="py-2.5 px-3 text-right">Utilidad Neta</th>
                    <th className="py-2.5 px-3 text-right">Margen (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => {
                    const totalCost = ord.materialCost + ord.machineCost + ord.laborCost;
                    const netProfit = ord.salePrice - totalCost;
                    const margin = ord.salePrice > 0 ? ((netProfit / ord.salePrice) * 100).toFixed(1) : '0';
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-cyan-700">{ord.opNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{ord.title}</div>
                          <div className="text-[10px] text-slate-500">{ord.clientCompany}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono">${ord.materialCost.toLocaleString('es-MX')}</td>
                        <td className="py-3 px-3 text-right font-mono">
                          ${ord.machineCost.toLocaleString('es-MX')}
                          <div className="text-[9px] text-slate-400">({ord.machineHours}h @ ${ord.machineHourlyRate}/h)</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono">
                          ${ord.laborCost.toLocaleString('es-MX')}
                          <div className="text-[9px] text-slate-400">({ord.laborHours}h @ ${ord.laborHourlyRate}/h)</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                          ${totalCost.toLocaleString('es-MX')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ${ord.salePrice.toLocaleString('es-MX')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                          +${netProfit.toLocaleString('es-MX')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                            {margin}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: GESTIÓN DE USUARIOS Y PERMISOS */}
      {activeModule === 'usuarios' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Equipo de Planta y Permisos</h3>
              <p className="text-xs text-slate-500">Administra operadores de CNC, diseñadores CAD/CAM, ventas y gerencia</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {users.map((usr) => (
              <div key={usr.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      usr.role === 'admin' ? 'bg-slate-900 text-white' :
                      usr.role === 'ventas' ? 'bg-cyan-100 text-cyan-800' :
                      usr.role === 'diseno' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {usr.role}
                    </span>
                    <button
                      onClick={() => toggleUserStatus(usr.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        usr.status === 'activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {usr.status}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{usr.name}</h4>
                  <p className="text-xs text-slate-500">{usr.email}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{usr.phone}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Turno: <strong className="capitalize text-slate-700">{usr.shift}</strong></span>
                  <button
                    onClick={() => toggleUserStatus(usr.id)}
                    className="text-xs text-cyan-700 hover:underline font-semibold"
                  >
                    {usr.status === 'activo' ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR COBRO CLIENTE */}
      {selectedInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Registrar Cobro de Factura</h4>
            <p className="text-xs text-slate-500 mt-1">Ingresa el monto recibido por transferencia o depósito</p>

            <form onSubmit={handlePayInvoice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monto a Cobrar ($ MXN)</label>
                <input
                  type="number"
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceId(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR PAGO A PROVEEDOR */}
      {selectedPayableId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Registrar Pago a Proveedor</h4>
            <p className="text-xs text-slate-500 mt-1">Acero, resina plástica o servicios de maquila</p>

            <form onSubmit={handlePayPayable} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monto a Pagar ($ MXN)</label>
                <input
                  type="number"
                  min="1"
                  value={payableAmount}
                  onChange={(e) => setPayableAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayableId(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                >
                  Confirmar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO USUARIO */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Alta de Nuevo Miembro de Equipo</h4>
            <p className="text-xs text-slate-500 mt-1">Asigna rol y datos para ingreso al sistema</p>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ej. Roberto Navarro"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rnavarro@grabadosenmetal.mx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rol Asignado</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as RoleType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="produccion">Producción / Operadores</option>
                    <option value="diseno">Diseño / Ingeniería</option>
                    <option value="ventas">Ventas / Atención</option>
                    <option value="admin">Administrador / Gerencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Turno</label>
                  <select
                    value={newUser.shift}
                    onChange={(e) => setNewUser({ ...newUser, shift: e.target.value as 'matutino' | 'vespertino' | 'mixto' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+52 55 ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
