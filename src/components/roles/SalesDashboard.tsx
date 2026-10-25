import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CatalogItem, Quote, Client, ProductType } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import {
  FileSpreadsheet,
  FilePlus2,
  Layers,
  Building2,
  Printer,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  FileDown,
  X,
  Search,
  Sparkles,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';

export const SalesDashboard: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    catalog,
    quotes,
    clients,
    addQuote,
    approveQuoteAndGenerateOP,
    addClient,
    setInspectedOrderId
  } = useApp();

  // Quotation Generator State
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<ProductType>('grabado');
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteMaterial, setQuoteMaterial] = useState('Acero Inoxidable 304');
  const [quoteQuantity, setQuoteQuantity] = useState<number>(100);
  const [quoteUnitPrice, setQuoteUnitPrice] = useState<number>(180);
  const [quoteAdvancePercent, setQuoteAdvancePercent] = useState<number>(50);
  const [quoteRequiresDesign, setQuoteRequiresDesign] = useState<boolean>(true);
  const [quoteNotes, setQuoteNotes] = useState('Condiciones: 50% de anticipo al ordenar y 50% contra entrega de lote.');

  // Modal State for Official Printable Quotation Document
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);

  // Modal State for Approving Quote with Advance payment
  const [approvingQuote, setApprovingQuote] = useState<Quote | null>(null);
  const [advanceInput, setAdvanceInput] = useState<number>(0);

  // New Client Modal State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    creditLimit: 100000,
    creditDays: 30,
    notes: ''
  });

  // Filter Catalog
  const [catalogFilter, setCatalogFilter] = useState<'all' | ProductType>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  const filteredCatalog = catalog.filter((item) => {
    const matchType = catalogFilter === 'all' || item.type === catalogFilter;
    const matchSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchType && matchSearch;
  });

  // Handle Quick Create from Catalog
  const handleSelectCatalogItem = (item: CatalogItem) => {
    setSelectedCategory(item.type);
    setQuoteTitle(item.name);
    setQuoteMaterial(item.materials[0] || 'Material Estándar');
    setQuoteUnitPrice(item.basePrice);
    setQuoteQuantity(item.type === 'molde' ? 1 : item.type === 'envase' ? 5000 : 250);
    setQuoteRequiresDesign(item.type !== 'envase');
    setActiveModule('nueva_cotizacion');
  };

  // Handle Submit Quote Form
  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId) || clients[0];
    const subtotal = quoteQuantity * quoteUnitPrice;
    const tax = Math.round(subtotal * 0.16);
    const total = subtotal + tax;

    const created = addQuote({
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientPhone: client.phone,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          id: `item-${Date.now()}`,
          productType: selectedCategory,
          title: quoteTitle || `Trabajo Especial de ${selectedCategory.toUpperCase()}`,
          description: `Especificación: ${quoteMaterial} para lote de ${quoteQuantity} unidades.`,
          material: quoteMaterial,
          quantity: quoteQuantity,
          unitPrice: quoteUnitPrice,
          totalPrice: subtotal,
          specs: {
            requiereDiseno: quoteRequiresDesign ? 'Sí (Aprobación previa)' : 'No'
          }
        }
      ],
      subtotal,
      tax,
      total,
      status: 'enviada',
      notes: quoteNotes,
      requiresDesign: quoteRequiresDesign,
      advancePercentage: quoteAdvancePercent,
      advancePaid: 0
    });

    setPreviewQuote(created);
    setActiveModule('cotizaciones');
  };

  // Handle Quote Approval -> OP Generation
  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingQuote) return;
    const result = approveQuoteAndGenerateOP(approvingQuote.id, advanceInput);
    setApprovingQuote(null);
    setInspectedOrderId(result.order.id);
  };

  // Handle Create Client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.company) return;
    const created = addClient({
      name: newClient.name,
      company: newClient.company,
      email: newClient.email,
      phone: newClient.phone,
      creditLimit: Number(newClient.creditLimit),
      creditDays: Number(newClient.creditDays),
      balanceDue: 0,
      previousDesignsCount: 0,
      notes: newClient.notes
    });
    setSelectedClientId(created.id);
    setShowAddClientModal(false);
    setNewClient({ name: '', company: '', email: '', phone: '', creditLimit: 100000, creditDays: 30, notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* MODULE: COTIZACIONES */}
      {activeModule === 'cotizaciones' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historial y Control de Cotizaciones</h3>
              <p className="text-xs text-slate-500">
                Presupuestos emitidos, aprobación de clientes y conversión directa a Órdenes de Producción (OP)
              </p>
            </div>
            <button
              onClick={() => setActiveModule('nueva_cotizacion')}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Cotización</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Cotizaciones Activas</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{quotes.length}</div>
              <p className="text-xs text-slate-500 mt-0.5">Total de propuestas registradas</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Aprobadas / En Planta</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {quotes.filter(q => q.status === 'aprobada').length}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Con anticipo cobrado y OP activa</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Pendientes de Decisión</span>
              <div className="text-2xl font-black text-cyan-600 mt-1">
                {quotes.filter(q => q.status === 'enviada' || q.status === 'borrador').length}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">En seguimiento con cliente</p>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Folio #</th>
                    <th className="py-2.5 px-4">Cliente / Empresa</th>
                    <th className="py-2.5 px-4">Descripción de Partidas</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                    <th className="py-2.5 px-4 text-right">Total (+IVA)</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                    <th className="py-2.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-700">{q.quoteNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{q.clientCompany}</div>
                        <div className="text-[10px] text-slate-500">{q.clientName}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 truncate">{q.items[0]?.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {q.items.length} partida(s) • Válida hasta {q.validUntil}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                        ${q.subtotal.toLocaleString('es-MX')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${q.total.toLocaleString('es-MX')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.status === 'aprobada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          q.status === 'enviada' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* View & Print PDF */}
                        <button
                          onClick={() => setPreviewQuote(q)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                          title="Ver cotización formal para imprimir o PDF"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </button>

                        {/* If not approved yet, button to Approve & Generate OP */}
                        {q.status !== 'aprobada' ? (
                          <button
                            onClick={() => {
                              setApprovingQuote(q);
                              setAdvanceInput(Math.round(q.total * (q.advancePercentage / 100)));
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-xs transition"
                            title="Aprobar presupuesto y generar Orden de Producción"
                          >
                            Aprobar y Crear OP
                          </button>
                        ) : (
                          <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                            {q.productionOrderId || 'OP Activa'}
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

      {/* MODULE: NUEVA COTIZACIÓN */}
      {activeModule === 'nueva_cotizacion' && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="border-b border-slate-200 pb-4 mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Generador Rápido de Presupuestos Técnicos</h3>
              <p className="text-xs text-slate-500">
                Calcula costos de material + tiempo de máquina y emite cotización para el cliente
              </p>
            </div>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Cliente</span>
            </button>
          </div>

          <form onSubmit={handleCreateQuote} className="space-y-5">
            {/* 1. Client selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cliente / Empresa Solicitante</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.company} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Línea de Manufactura / Producto</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('grabado');
                      setQuoteMaterial('Acero Inoxidable 304');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      selectedCategory === 'grabado' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Grabados Metal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('molde');
                      setQuoteMaterial('Acero P20 Pre-templado');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      selectedCategory === 'molde' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Moldes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('envase');
                      setQuoteMaterial('PET Virgen Grado Botella');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      selectedCategory === 'envase' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Envases Plástico
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Technical specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Título o Descripción de la Pieza</label>
                <input
                  type="text"
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  placeholder="Ej. Placa de Maquinaria Grabado Láser o Molde 2 Cavidades 500ml"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Seleccionado</label>
                <select
                  value={quoteMaterial}
                  onChange={(e) => setQuoteMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {selectedCategory === 'grabado' && (
                    <>
                      <option value="Acero Inoxidable 304">Acero Inox 304</option>
                      <option value="Acero Inoxidable 316">Acero Inox 316 Grado Marino</option>
                      <option value="Aluminio Anodizado 6061">Aluminio Anodizado 6061</option>
                      <option value="Latón Pulido C260">Latón Pulido Espejo</option>
                    </>
                  )}
                  {selectedCategory === 'molde' && (
                    <>
                      <option value="Acero P20 Pre-templado">Acero P20 Pre-templado (32 HRC)</option>
                      <option value="Aluminio Aeroespacial 7075-T6">Aluminio Aeroespacial 7075-T6</option>
                      <option value="Acero Templado H13">Acero Herramienta H13 (52 HRC)</option>
                    </>
                  )}
                  {selectedCategory === 'envase' && (
                    <>
                      <option value="PET Virgen Grado Botella">PET Virgen Grado Botella</option>
                      <option value="Polietileno de Alta Densidad (HDPE)">Polietileno HDPE</option>
                      <option value="Polipropileno Copolímero (PP)">Polipropileno PP</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* 3. Quantities and pricing calculation */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad (Pzas/Lote)</label>
                <input
                  type="number"
                  min="1"
                  value={quoteQuantity}
                  onChange={(e) => setQuoteQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Precio Unitario ($ MXN)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quoteUnitPrice}
                  onChange={(e) => setQuoteUnitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Anticipo Requerido (%)</label>
                <select
                  value={quoteAdvancePercent}
                  onChange={(e) => setQuoteAdvancePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value={30}>30% Anticipo</option>
                  <option value={50}>50% Anticipo (Estándar)</option>
                  <option value={70}>70% Anticipo (Especial)</option>
                  <option value={100}>100% Contado</option>
                </select>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Proyectado (+IVA)</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  ${Math.round(quoteQuantity * quoteUnitPrice * 1.16).toLocaleString('es-MX')}
                </span>
                <span className="text-[10px] text-slate-500">
                  Anticipo: ${Math.round(quoteQuantity * quoteUnitPrice * 1.16 * (quoteAdvancePercent / 100)).toLocaleString('es-MX')}
                </span>
              </div>
            </div>

            {/* 4. Options */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="reqDiseno"
                checked={quoteRequiresDesign}
                onChange={(e) => setQuoteRequiresDesign(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
              />
              <label htmlFor="reqDiseno" className="text-xs font-medium text-slate-700">
                Requiere validación y aprobación de planos 3D / Vectores por parte del área de Ingeniería antes de entrar a máquina
              </label>
            </div>

            {/* 5. Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condiciones Comerciales y Notas</label>
              <textarea
                rows={2}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModule('cotizaciones')}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Presupuesto y Emitir</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODULE: CATÁLOGO DE PRODUCTOS Y SERVICIOS */}
      {activeModule === 'catalogo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Catálogo Técnico de Capacidades</h3>
              <p className="text-xs text-slate-500">
                Grabados en metal, moldes de inyección/soplado y catálogo de envases plásticos
              </p>
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  catalogFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setCatalogFilter('grabado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  catalogFilter === 'grabado' ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                Grabados en Metal
              </button>
              <button
                onClick={() => setCatalogFilter('molde')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  catalogFilter === 'molde' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                Moldes Industriales
              </button>
              <button
                onClick={() => setCatalogFilter('envase')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  catalogFilter === 'envase' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                Envases de Plástico
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, polímero, acabado o aplicación..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'grabado' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                      item.type === 'molde' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Entrega: ~{item.leadTimeDays} días
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-snug">{item.description}</p>

                  {/* Technical Specs list */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Especificaciones Técnicas:</div>
                    {Object.entries(item.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-slate-700">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <strong className="text-slate-900 font-medium">{String(val)}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Materials badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.materials.map((mat, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer price & action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Precio Base</span>
                    <div className="text-base font-black text-slate-900 font-mono">
                      ${item.basePrice.toLocaleString('es-MX')} <span className="text-[10px] text-slate-500 font-normal">/{item.unit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectCatalogItem(item)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Cotizar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE: CRM DE CLIENTES */}
      {activeModule === 'crm' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Directorio de Clientes (CRM)</h3>
              <p className="text-xs text-slate-500">Historial de pedidos, líneas de crédito y especificaciones de marca</p>
            </div>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Cliente</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((cli) => (
              <div key={cli.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {cli.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {cli.previousDesignsCount} diseños previos
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{cli.company}</h4>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">{cli.name}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cli.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cli.phone}</span>
                    </div>
                  </div>

                  <p className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 italic">
                    «{cli.notes}»
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Línea de Crédito</span>
                    <div className="font-bold text-slate-900 font-mono">
                      ${cli.creditLimit.toLocaleString('es-MX')} ({cli.creditDays} días)
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClientId(cli.id);
                      setActiveModule('nueva_cotizacion');
                    }}
                    className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold rounded-lg transition"
                  >
                    Crear Cotización
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: OFICIAL PRINTABLE QUOTE / PDF PREVIEW */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Modal Header actions */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold">Presupuesto Formal Oficial — {previewQuote.quoteNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Printable Formal Letterhead) */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white" id="printable-quote">
              {/* Brand Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                <div>
                  <BrandLogo size="lg" showSubtitle={true} />
                  <p className="text-xs text-slate-500 mt-2">
                    Planta Industrial & Taller Central • Grabados de Precisión, Moldes y Transformación de Polímeros
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-slate-400">Cotización</span>
                  <div className="text-xl font-black text-slate-900 font-mono">{previewQuote.quoteNumber}</div>
                  <div className="text-xs text-slate-500 mt-1">Fecha: <strong>{previewQuote.date}</strong></div>
                  <div className="text-xs text-slate-500">Vigencia: <strong>{previewQuote.validUntil}</strong></div>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cliente / Empresa</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{previewQuote.clientCompany}</div>
                  <div className="text-slate-600">Atención: {previewQuote.clientName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Contacto y Envío</div>
                  <div className="text-slate-700">{previewQuote.clientEmail}</div>
                  <div className="text-slate-700">{previewQuote.clientPhone}</div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Partida</th>
                      <th className="py-2.5 px-3">Material y Especificaciones</th>
                      <th className="py-2.5 px-3 text-center">Cant.</th>
                      <th className="py-2.5 px-3 text-right">P. Unitario</th>
                      <th className="py-2.5 px-3 text-right">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewQuote.items.map((item, i) => (
                      <tr key={item.id}>
                        <td className="py-3 px-3 font-bold text-slate-900">{i + 1}. {item.title}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {item.description}
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Mat: {item.material}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{item.quantity.toLocaleString('es-MX')}</td>
                        <td className="py-3 px-3 text-right font-mono">${item.unitPrice.toLocaleString('es-MX')}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ${item.totalPrice.toLocaleString('es-MX')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Advance Condition */}
              <div className="flex justify-end">
                <div className="w-72 space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">${previewQuote.subtotal.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>I.V.A. (16%):</span>
                    <span className="font-mono font-bold">${previewQuote.tax.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Neto:</span>
                    <span className="font-mono">${previewQuote.total.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="pt-2 text-[11px] text-cyan-800 font-semibold border-t border-slate-200">
                    Anticipo Requerido ({previewQuote.advancePercentage}%): ${Math.round(previewQuote.total * (previewQuote.advancePercentage / 100)).toLocaleString('es-MX')}
                  </div>
                </div>
              </div>

              {/* Terms and Acceptance Signatures */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 uppercase text-[10px]">Términos de Manufactura y Garantía:</div>
                <p>1. {previewQuote.notes}</p>
                <p>2. Precios expresados en Moneda Nacional (MXN) más impuestos correspondientes.</p>
                <p>3. Tolerancias dimensionales conforme a norma ISO 2768-m para mecanizado y SPI para moldes de inyección.</p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-slate-500">
                <div className="border-t border-slate-300 pt-2">
                  <strong className="text-slate-800 block">Grabados en Metal S.A. de C.V.</strong>
                  Firma Autorizada de Planta
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <strong className="text-slate-800 block">{previewQuote.clientCompany}</strong>
                  Firma y Sello de Aceptación de Cotización
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewQuote(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 transition"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APROBACIÓN DE COTIZACIÓN Y CREACIÓN DE OP */}
      {approvingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Aprobar Presupuesto y Crear OP</h4>
            <p className="text-xs text-slate-500 mt-1">
              Al confirmar, el sistema generará automáticamente la <strong>Orden de Producción</strong> en el piso de planta y la tarea de diseño CAD/CAM si aplica.
            </p>

            <form onSubmit={handleConfirmApproval} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div>Folio: <strong>{approvingQuote.quoteNumber}</strong></div>
                <div>Cliente: <strong>{approvingQuote.clientCompany}</strong></div>
                <div>Total: <strong>${approvingQuote.total.toLocaleString('es-MX')}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monto de Anticipo Recibido ($ MXN)
                </label>
                <input
                  type="number"
                  min="0"
                  value={advanceInput}
                  onChange={(e) => setAdvanceInput(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Sugerido: 50% = ${Math.round(approvingQuote.total * 0.5).toLocaleString('es-MX')}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingQuote(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  Confirmar y Generar OP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALTA DE CLIENTE */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <h4 className="text-base font-bold text-slate-900">Registrar Nuevo Cliente (CRM)</h4>
            <p className="text-xs text-slate-500 mt-1">Datos fiscales, de contacto y condiciones de crédito</p>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa / Razón Social</label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="Ej. Envases y Tapas de México S.A."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Contacto</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Ej. Ing. Laura Valdés"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+52 55 ..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Límite Crédito ($)</label>
                  <input
                    type="number"
                    value={newClient.creditLimit}
                    onChange={(e) => setNewClient({ ...newClient, creditLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Días de Crédito</label>
                  <input
                    type="number"
                    value={newClient.creditDays}
                    onChange={(e) => setNewClient({ ...newClient, creditDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notas Comerciales</label>
                <textarea
                  rows={2}
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Especificaciones particulares o requerimientos de resina/acabado..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
