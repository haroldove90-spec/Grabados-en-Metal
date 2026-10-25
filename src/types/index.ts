export type RoleType = 
  | 'admin' 
  | 'ventas' 
  | 'diseno' 
  | 'produccion';

export interface UserRoleInfo {
  id: RoleType;
  title: string;
  shortTitle: string;
  badge: string;
  color: string;
  accentColor: string;
  bgLight: string;
  iconName: string;
}

export type ProductType = 'grabado' | 'molde' | 'envase';

export interface CatalogItem {
  id: string;
  type: ProductType;
  name: string;
  category: string;
  description: string;
  materials: string[];
  specs: Record<string, string | number>;
  basePrice: number;
  unit: string;
  leadTimeDays: number;
}

export interface QuoteItem {
  id: string;
  catalogItemId?: string;
  productType: ProductType;
  title: string;
  description: string;
  material: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specs: Record<string, string | number>;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'borrador' | 'enviada' | 'aprobada' | 'rechazada';
  notes: string;
  requiresDesign: boolean;
  productionOrderId?: string;
  advancePercentage: number;
  advancePaid: number;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  creditLimit: number;
  creditDays: number;
  balanceDue: number;
  previousDesignsCount: number;
  notes: string;
  createdAt: string;
}

export type DesignStatus = 
  | 'pendiente' 
  | 'en_revision' 
  | 'prototipo_fabricado' 
  | 'aprobado_cliente' 
  | 'rechazado';

export interface DesignFile {
  id: string;
  orderId?: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  title: string;
  category: 'grabado_vectorial' | 'molde_inyeccion' | 'molde_soplado' | 'plano_envase';
  version: string;
  fileFormat: 'STEP' | 'IGES' | 'DXF' | 'DWG' | 'STL' | 'AI_VECTOR';
  toleranceMm: number;
  status: DesignStatus;
  notes: string;
  updatedAt: string;
  previewType: 'contour' | 'cavity' | 'toolpath' | 'mesh';
}

export type ProductionStatus = 
  | 'pendiente' 
  | 'preparacion_herramental' 
  | 'en_maquinado_inyeccion' 
  | 'control_calidad' 
  | 'terminada_empaque';

export interface ProductionOrder {
  id: string;
  opNumber: string;
  quoteId: string;
  clientName: string;
  clientCompany: string;
  productType: ProductType;
  title: string;
  quantity: number;
  material: string;
  estimatedMaterialKg: number;
  assignedMachineId: string;
  assignedOperator: string;
  status: ProductionStatus;
  progressPercent: number;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  designApproved: boolean;
  rawMaterialAllocated: boolean;
  notes: string;
  
  // Cost breakdown for profitability
  materialCost: number;
  machineHours: number;
  machineHourlyRate: number;
  machineCost: number;
  laborHours: number;
  laborHourlyRate: number;
  laborCost: number;
  salePrice: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'metal' | 'plastico' | 'envase_terminado' | 'herramental';
  typeDetails: string;
  sku: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  location: string;
  lastUpdated: string;
}

export interface Machine {
  id: string;
  name: string;
  type: 'fresadora_cnc' | 'torno_cnc' | 'laser_mopa' | 'electroerosion_edm' | 'inyectora_plastico' | 'sopladora_pet';
  hourlyRate: number;
  status: 'operando' | 'preparacion' | 'mantenimiento' | 'disponible';
  currentOpNumber?: string;
  activeOperator?: string;
  totalHoursMonth: number;
  efficiencyOEE: number;
}

export interface QualityRecord {
  id: string;
  opNumber: string;
  timestamp: string;
  inspectedPieces: number;
  approvedPieces: number;
  defectivePieces: number;
  plasticScrapKg: number;
  defectReason?: 'rebaba' | 'poro_gas' | 'falta_llenado' | 'cota_fuera_tolerancia' | 'falla_grabado' | 'otro';
  operator: string;
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  opNumber: string;
  clientName: string;
  clientRfc: string;
  amount: number;
  tax: number;
  total: number;
  paidAmount: number;
  pendingBalance: number;
  issueDate: string;
  dueDate: string;
  status: 'pendiente' | 'parcial' | 'cobrada' | 'vencida';
}

export interface PayableAccount {
  id: string;
  supplierName: string;
  category: 'materia_prima' | 'herramental' | 'servicios_electricos' | 'mantenimiento';
  description: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'pendiente' | 'pagada';
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  phone: string;
  status: 'activo' | 'inactivo';
  shift: 'matutino' | 'vespertino' | 'mixto';
}
