import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleType,
  Quote,
  ProductionOrder,
  DesignFile,
  InventoryItem,
  Machine,
  QualityRecord,
  Invoice,
  PayableAccount,
  SystemUser,
  Client,
  CatalogItem,
  ProductionStatus,
  DesignStatus
} from '../types';
import {
  INITIAL_CATALOG,
  INITIAL_CLIENTS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_DESIGNS,
  INITIAL_INVENTORY,
  INITIAL_MACHINES,
  INITIAL_QUALITY_RECORDS,
  INITIAL_INVOICES,
  INITIAL_PAYABLES,
  INITIAL_USERS
} from '../data/mockData';

interface AppContextType {
  // Navigation & Role State
  currentRole: RoleType | null;
  setCurrentRole: (role: RoleType | null) => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Workflow visualizer
  inspectedOrderId: string | null;
  setInspectedOrderId: (id: string | null) => void;

  // Data Stores
  catalog: CatalogItem[];
  clients: Client[];
  quotes: Quote[];
  orders: ProductionOrder[];
  designs: DesignFile[];
  inventory: InventoryItem[];
  machines: Machine[];
  qualityRecords: QualityRecord[];
  invoices: Invoice[];
  payables: PayableAccount[];
  users: SystemUser[];

  // Mutations
  addQuote: (quote: Omit<Quote, 'id' | 'quoteNumber'>) => Quote;
  approveQuoteAndGenerateOP: (quoteId: string, advancePaid: number) => { order: ProductionOrder; design?: DesignFile };
  updateOrderStatus: (orderId: string, newStatus: ProductionStatus, progress: number) => void;
  updateDesignStatus: (designId: string, newStatus: DesignStatus, notes?: string) => void;
  adjustInventoryStock: (itemId: string, delta: number, reason: string) => void;
  addQualityRecord: (record: Omit<QualityRecord, 'id' | 'timestamp'>) => void;
  registerClientPayment: (invoiceId: string, paymentAmount: number) => void;
  registerPayablePayment: (payableId: string, paymentAmount: number) => void;
  createInvoiceForCompletedOP: (orderId: string) => Invoice;
  toggleUserStatus: (userId: string) => void;
  addUser: (user: Omit<SystemUser, 'id'>) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateMachineStatus: (machineId: string, status: Machine['status'], operator?: string, opNumber?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start screen role is null initially as requested: "Acceso por Roles en Inicio"
  const [currentRole, setCurrentRole] = useState<RoleType | null>(() => {
    const saved = localStorage.getItem('gm_active_role');
    return (saved as RoleType) || null;
  });

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inspectedOrderId, setInspectedOrderId] = useState<string | null>(null);

  // Entities
  const [catalog] = useState<CatalogItem[]>(INITIAL_CATALOG);
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('gm_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('gm_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });
  const [orders, setOrders] = useState<ProductionOrder[]>(() => {
    const saved = localStorage.getItem('gm_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [designs, setDesigns] = useState<DesignFile[]>(() => {
    const saved = localStorage.getItem('gm_designs');
    return saved ? JSON.parse(saved) : INITIAL_DESIGNS;
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('gm_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [machines, setMachines] = useState<Machine[]>(() => {
    const saved = localStorage.getItem('gm_machines');
    return saved ? JSON.parse(saved) : INITIAL_MACHINES;
  });
  const [qualityRecords, setQualityRecords] = useState<QualityRecord[]>(() => {
    const saved = localStorage.getItem('gm_quality');
    return saved ? JSON.parse(saved) : INITIAL_QUALITY_RECORDS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('gm_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [payables, setPayables] = useState<PayableAccount[]>(() => {
    const saved = localStorage.getItem('gm_payables');
    return saved ? JSON.parse(saved) : INITIAL_PAYABLES;
  });
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('gm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('gm_active_role', currentRole);
    } else {
      localStorage.removeItem('gm_active_role');
    }
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('gm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gm_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('gm_designs', JSON.stringify(designs));
  }, [designs]);

  useEffect(() => {
    localStorage.setItem('gm_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('gm_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Set default activeModule when role changes
  useEffect(() => {
    if (!currentRole) return;
    if (currentRole === 'admin') setActiveModule('kpis');
    else if (currentRole === 'ventas') setActiveModule('cotizaciones');
    else if (currentRole === 'diseno') setActiveModule('repositorio');
    else if (currentRole === 'produccion') setActiveModule('ordenes_op');
  }, [currentRole]);

  // 1. Add new quote
  const addQuote = (quoteData: Omit<Quote, 'id' | 'quoteNumber'>): Quote => {
    const newNumber = `COT-2026-0${quotes.length + 44}`;
    const newQuote: Quote = {
      ...quoteData,
      id: `cot-${Date.now()}`,
      quoteNumber: newNumber,
    };
    setQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  };

  // 2. Approve quote & create OP + Design entry (Core business workflow)
  const approveQuoteAndGenerateOP = (quoteId: string, advancePaid: number) => {
    const targetQuote = quotes.find(q => q.id === quoteId);
    if (!targetQuote) throw new Error('Cotización no encontrada');

    const opNum = `OP-2026-0${orders.length + 90}`;
    const opId = `op-${Date.now()}`;

    // Calculate estimated production values
    const firstItem = targetQuote.items[0];
    const isMold = targetQuote.items.some(i => i.productType === 'molde');
    const isEngraving = targetQuote.items.some(i => i.productType === 'grabado');
    const isPlastics = targetQuote.items.some(i => i.productType === 'envase');

    const materialEstCost = Math.round(targetQuote.subtotal * 0.28);
    const machineEstCost = Math.round(targetQuote.subtotal * 0.32);
    const laborEstCost = Math.round(targetQuote.subtotal * 0.12);

    const newOrder: ProductionOrder = {
      id: opId,
      opNumber: opNum,
      quoteId: targetQuote.id,
      clientName: targetQuote.clientName,
      clientCompany: targetQuote.clientCompany,
      productType: isMold ? 'molde' : isEngraving ? 'grabado' : 'envase',
      title: firstItem ? `${firstItem.title} (${targetQuote.items.length > 1 ? `+${targetQuote.items.length - 1} items` : ''})` : `Orden de Producción ${opNum}`,
      quantity: firstItem ? firstItem.quantity : 1,
      material: firstItem?.material || 'Material estándar según especificación',
      estimatedMaterialKg: isPlastics ? Math.round((firstItem?.quantity || 1000) * 0.035) : isMold ? 45 : 20,
      assignedMachineId: isMold ? 'mach-01' : isEngraving ? 'mach-03' : 'mach-06',
      assignedOperator: isMold ? 'Mateo Cárdenas' : isEngraving ? 'Laura Méndez' : 'Javier Rocha',
      status: targetQuote.requiresDesign ? 'pendiente' : 'preparacion_herramental',
      progressPercent: 10,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      designApproved: !targetQuote.requiresDesign,
      rawMaterialAllocated: true,
      notes: `Generada automáticamente desde ${targetQuote.quoteNumber}. Anticipo registrado: $${advancePaid.toLocaleString('es-MX')}.`,
      materialCost: materialEstCost,
      machineHours: isMold ? 30 : 16,
      machineHourlyRate: isMold ? 750 : 500,
      machineCost: machineEstCost,
      laborHours: 18,
      laborHourlyRate: 200,
      laborCost: laborEstCost,
      salePrice: targetQuote.subtotal
    };

    // Update Quote status
    setQuotes(prev => prev.map(q => q.id === quoteId ? {
      ...q,
      status: 'aprobada',
      advancePaid: advancePaid,
      productionOrderId: opNum
    } : q));

    // Create Design Task if needed
    let createdDesign: DesignFile | undefined;
    if (targetQuote.requiresDesign) {
      createdDesign = {
        id: `dsg-${Date.now()}`,
        orderId: opId,
        quoteId: targetQuote.id,
        clientId: targetQuote.clientId,
        clientName: targetQuote.clientCompany,
        title: `Planos y Modelado CAD para ${newOrder.title}`,
        category: isMold ? 'molde_inyeccion' : isEngraving ? 'grabado_vectorial' : 'plano_envase',
        version: 'v1.0 (Pendiente Aprobación)',
        fileFormat: isMold ? 'STEP' : isEngraving ? 'DXF' : 'STEP',
        toleranceMm: isMold ? 0.02 : 0.015,
        status: 'en_revision',
        notes: `Diseño generado para OP ${opNum}. Requiere validación de tolerancias antes de maquinado.`,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        previewType: isMold ? 'cavity' : isEngraving ? 'toolpath' : 'contour'
      };
      setDesigns(prev => [createdDesign!, ...prev]);
    }

    setOrders(prev => [newOrder, ...prev]);

    return { order: newOrder, design: createdDesign };
  };

  // 3. Update Order status
  const updateOrderStatus = (orderId: string, newStatus: ProductionStatus, progress: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const isFinished = newStatus === 'terminada_empaque';
        return {
          ...o,
          status: newStatus,
          progressPercent: progress,
          completedDate: isFinished ? new Date().toISOString().split('T')[0] : o.completedDate
        };
      }
      return o;
    }));
  };

  // 4. Update Design status
  const updateDesignStatus = (designId: string, newStatus: DesignStatus, notes?: string) => {
    setDesigns(prev => prev.map(d => {
      if (d.id === designId) {
        return {
          ...d,
          status: newStatus,
          notes: notes !== undefined ? notes : d.notes,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return d;
    }));

    // If design is approved by client, unlock production order
    if (newStatus === 'aprobado_cliente') {
      const targetDesign = designs.find(d => d.id === designId);
      if (targetDesign?.orderId) {
        setOrders(prev => prev.map(o => {
          if (o.id === targetDesign.orderId) {
            return {
              ...o,
              designApproved: true,
              status: o.status === 'pendiente' ? 'preparacion_herramental' : o.status
            };
          }
          return o;
        }));
      }
    }
  };

  // 5. Adjust Inventory
  const adjustInventoryStock = (itemId: string, delta: number, _reason: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = Math.max(0, item.currentStock + delta);
        return {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  // 6. Quality record insertion
  const addQualityRecord = (record: Omit<QualityRecord, 'id' | 'timestamp'>) => {
    const newRecord: QualityRecord = {
      ...record,
      id: `qual-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setQualityRecords(prev => [newRecord, ...prev]);

    // If there is scrap plastic recorded, deduct/track in inventory
    if (record.plasticScrapKg > 0) {
      // Find PET or HDPE resin
      const resin = inventory.find(i => i.category === 'plastico');
      if (resin) {
        adjustInventoryStock(resin.id, -Math.round(record.plasticScrapKg), `Merma registrada en OP ${record.opNumber}`);
      }
    }
  };

  // 7. Client invoice payment
  const registerClientPayment = (invoiceId: string, paymentAmount: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + paymentAmount;
        const newPending = Math.max(0, inv.total - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          pendingBalance: newPending,
          status: newPending === 0 ? 'cobrada' : 'parcial'
        };
      }
      return inv;
    }));
  };

  // 8. Accounts payable payment
  const registerPayablePayment = (payableId: string, paymentAmount: number) => {
    setPayables(prev => prev.map(p => {
      if (p.id === payableId) {
        const newPaid = p.paidAmount + paymentAmount;
        return {
          ...p,
          paidAmount: newPaid,
          status: newPaid >= p.amount ? 'pagada' : 'pendiente'
        };
      }
      return p;
    }));
  };

  // 9. Create Invoice from Completed OP
  const createInvoiceForCompletedOP = (orderId: string): Invoice => {
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Orden no encontrada');

    const tax = Math.round(order.salePrice * 0.16);
    const total = order.salePrice + tax;
    const invNum = `FAC-2026-10${invoices.length + 4}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      opNumber: order.opNumber,
      clientName: order.clientCompany,
      clientRfc: 'RFC-GEN-2026-X',
      amount: order.salePrice,
      tax: tax,
      total: total,
      paidAmount: 0,
      pendingBalance: total,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pendiente'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  // 10. User status toggle
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status: u.status === 'activo' ? 'inactivo' : 'activo'
    } : u));
  };

  const addUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateMachineStatus = (machineId: string, status: Machine['status'], operator?: string, opNumber?: string) => {
    setMachines(prev => prev.map(m => m.id === machineId ? {
      ...m,
      status,
      activeOperator: operator !== undefined ? operator : m.activeOperator,
      currentOpNumber: opNumber !== undefined ? opNumber : m.currentOpNumber
    } : m));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeModule,
        setActiveModule,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        inspectedOrderId,
        setInspectedOrderId,
        catalog,
        clients,
        quotes,
        orders,
        designs,
        inventory,
        machines,
        qualityRecords,
        invoices,
        payables,
        users,
        addQuote,
        approveQuoteAndGenerateOP,
        updateOrderStatus,
        updateDesignStatus,
        adjustInventoryStock,
        addQualityRecord,
        registerClientPayment,
        registerPayablePayment,
        createInvoiceForCompletedOP,
        toggleUserStatus,
        addUser,
        addClient,
        updateMachineStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
