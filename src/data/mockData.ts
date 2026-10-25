import { 
  CatalogItem, 
  Quote, 
  Client, 
  DesignFile, 
  ProductionOrder, 
  InventoryItem, 
  Machine, 
  QualityRecord, 
  Invoice, 
  PayableAccount, 
  SystemUser 
} from '../types';

export const INITIAL_CATALOG: CatalogItem[] = [
  // --- GRABADOS EN METAL ---
  {
    id: 'cat-grab-01',
    type: 'grabado',
    name: 'Placa Conmemorativa / Industrial Láser Fibra',
    category: 'Grabados en Metal',
    description: 'Grabado de alta precisión en profundidad y marcado negro recocido para placas de maquinaria y premiación.',
    materials: ['Acero Inoxidable 304', 'Acero Inoxidable 316', 'Aluminio Anodizado', 'Latón Pulido'],
    specs: {
      acabado: 'Láser Fibra MOPA 60W / Contraste Negro o Grabado Profundo',
      espesorSugerido: '1.5 mm a 4.0 mm',
      resolucionDpi: '1200 DPI',
      resistencia: 'Intemperie, UV y solventes industriales'
    },
    basePrice: 480,
    unit: 'pieza',
    leadTimeDays: 3
  },
  {
    id: 'cat-grab-02',
    type: 'grabado',
    name: 'Cuño / Troquel de Alto y Bajo Relieve en Acero D2',
    category: 'Grabados en Metal',
    description: 'Fresado CNC y grabado tridimensional para estampación en cuero, metales blandos, jabón y joyería.',
    materials: ['Acero Herramienta D2', 'Acero Templado H13', 'Latón Naval'],
    specs: {
      acabado: 'Micro-fresado CNC + Pulido espejo con pasta diamantada',
      durezaHrc: '58 - 62 HRC (tratamiento térmico incluido)',
      cotaTolerancia: '± 0.015 mm'
    },
    basePrice: 4200,
    unit: 'pieza',
    leadTimeDays: 7
  },
  {
    id: 'cat-grab-03',
    type: 'grabado',
    name: 'Rodillo Cilíndrico y Postizas de Marcaje Continuo',
    category: 'Grabados en Metal',
    description: 'Grabado rotativo de 4to eje para estampado continuo de códigos, textura estriada y logotipos en líneas de producción.',
    materials: ['Acero 1045 Cementado', 'Bronce Fosforado', 'Acero 4140'],
    specs: {
      acabado: 'Grabado en 4to Eje CNC + Rectificado cilíndrico',
      diametroMax: '250 mm',
      profundidadGrabado: '0.4 mm a 1.2 mm'
    },
    basePrice: 6500,
    unit: 'pieza',
    leadTimeDays: 10
  },

  // --- MOLDES INDUSTRIALES ---
  {
    id: 'cat-mold-01',
    type: 'molde',
    name: 'Molde de Inyección para Tapa Flip-Top / Rosca 28mm',
    category: 'Moldes de Inyección',
    description: 'Molde de canal frío o caliente para tapas y dosificadores de alta producción con expulsión automática neumática.',
    materials: ['Acero P20 Pre-tratado', 'Acero Inox 420 (Anti-corrosión)', 'Cobre Berilio para enfriamiento'],
    specs: {
      tipoMolde: 'Inyección de Plástico',
      cavidades: 4,
      vidaUtilCiclos: '800,000 ciclos garantizados',
      tiempoCicloSec: '12 - 16 seg'
    },
    basePrice: 125000,
    unit: 'molde completo',
    leadTimeDays: 35
  },
  {
    id: 'cat-mold-02',
    type: 'molde',
    name: 'Molde de Soplado para Botella PET 500ml / 1 Litro',
    category: 'Moldes de Soplado',
    description: 'Cavidades maquinadas en aluminio aeroespacial para máquinas de soplado de preforma estirada con fondo petalóide.',
    materials: ['Aluminio Certificado 7075-T6', 'Fondo en Acero Inoxidable 304'],
    specs: {
      tipoMolde: 'Soplado Bi-orientado PET',
      cavidades: 2,
      vidaUtilCiclos: '1,500,000 ciclos',
      circuitoEnfriamiento: 'Canales de agua helada integrados'
    },
    basePrice: 78000,
    unit: 'juego de cavidades',
    leadTimeDays: 25
  },
  {
    id: 'cat-mold-03',
    type: 'molde',
    name: 'Molde de Inyección Técnica para Pieza Automotriz / Industrial',
    category: 'Moldes de Inyección',
    description: 'Matricería de alta precisión con correderas mecánicas y botadores de precisión para polímeros de ingeniería (PA66, POM, ABS).',
    materials: ['Acero H13 Tratado', 'Portamolde estándar HASCO/DME'],
    specs: {
      tipoMolde: 'Inyección de Precisión con Correderas',
      cavidades: 2,
      vidaUtilCiclos: '1,000,000 ciclos',
      cotaTolerancia: '± 0.01 mm'
    },
    basePrice: 185000,
    unit: 'molde completo',
    leadTimeDays: 45
  },

  // --- ENVASES DE PLÁSTICO ---
  {
    id: 'cat-env-01',
    type: 'envase',
    name: 'Botella PET Boston Round 500 ml',
    category: 'Envases de Plástico',
    description: 'Envase cilíndrico cristalino para cosméticos, sanitizantes, jarabes y productos químicos ligeros.',
    materials: ['PET Virgen Grado Alimento', 'PET Reciclado Grado R-PET (opcional)'],
    specs: {
      capacidad: '500 ml (desborde 525 ml)',
      cuelloRosca: '28/410 mm',
      pesoGramos: '32 g',
      coloresDisponibles: 'Cristal transparente, Ámbar, Azul Cobalto, Negro'
    },
    basePrice: 3.40,
    unit: 'pieza (millar)',
    leadTimeDays: 5
  },
  {
    id: 'cat-env-02',
    type: 'envase',
    name: 'Frasco HDPE Boca Ancha 250 ml (Nutracéutico / Químico)',
    category: 'Envases de Plástico',
    description: 'Fabricado por inyección-soplado en polietileno de alta densidad para polvos, cápsulas y pastillas.',
    materials: ['Polietileno de Alta Densidad (HDPE)'],
    specs: {
      capacidad: '250 ml',
      cuelloRosca: '38/400 mm inviolable',
      pesoGramos: '24 g',
      coloresDisponibles: 'Blanco opaco, Natural traslúcido'
    },
    basePrice: 2.90,
    unit: 'pieza (millar)',
    leadTimeDays: 6
  },
  {
    id: 'cat-env-03',
    type: 'envase',
    name: 'Galón Industrial HDPE 3.78 Litros con Asa Integrada',
    category: 'Envases de Plástico',
    description: 'Envase reforzado para agroquímicos, lubricantes automotrices, desinfectantes y detergentes.',
    materials: ['HDPE Copolímero Alto Peso Molecular'],
    specs: {
      capacidad: '3,785 ml (1 Galón)',
      cuelloRosca: '38 mm con precinto de seguridad',
      pesoGramos: '145 g reforzado',
      coloresDisponibles: 'Natural, Blanco, Amarillo industrial'
    },
    basePrice: 16.50,
    unit: 'pieza (lote)',
    leadTimeDays: 7
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Ing. Carlos Mendoza',
    company: 'Laboratorios Farmacéuticos San Rafael S.A.',
    email: 'cmendoza@sanrafael.com.mx',
    phone: '+52 55 4192 8830',
    creditLimit: 250000,
    creditDays: 30,
    balanceDue: 45000,
    previousDesignsCount: 8,
    notes: 'Cliente preferente. Requiere certificados de grado alimenticio FDA en todas las resinas PET.',
    createdAt: '2024-03-15'
  },
  {
    id: 'cli-002',
    name: 'Lic. Mariana Ortiz',
    company: 'Cosméticos y Fragancias Esencia Maya',
    email: 'compras@esenciamaya.com',
    phone: '+52 33 1890 2211',
    creditLimit: 120000,
    creditDays: 15,
    balanceDue: 0,
    previousDesignsCount: 4,
    notes: 'Solicita botellas PET en color ámbar con logotipo grabado en alto relieve en la base del molde.',
    createdAt: '2024-08-20'
  },
  {
    id: 'cli-003',
    name: 'Arq. Roberto Villegas',
    company: 'Industrializadora Metalmecánica del Bajío',
    email: 'rvillegas@inmetalbajio.com',
    phone: '+52 442 330 1199',
    creditLimit: 500000,
    creditDays: 45,
    balanceDue: 185000,
    previousDesignsCount: 14,
    notes: 'Pedidos recurrentes de placas de identificación láser y moldes de inyección para partes de ensamble.',
    createdAt: '2023-11-02'
  },
  {
    id: 'cli-004',
    name: 'Andrea Fuentes',
    company: 'Distribuidora de Limpieza EcoClean Plus',
    email: 'afuentes@ecocleanplus.mx',
    phone: '+52 81 8320 9940',
    creditLimit: 180000,
    creditDays: 30,
    balanceDue: 28000,
    previousDesignsCount: 2,
    notes: 'Comprador de galones de 3.78L en lotes de 10,000 piezas mensuales.',
    createdAt: '2025-01-10'
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'cot-2026-041',
    quoteNumber: 'COT-2026-041',
    clientId: 'cli-001',
    clientName: 'Ing. Carlos Mendoza',
    clientCompany: 'Laboratorios Farmacéuticos San Rafael S.A.',
    clientEmail: 'cmendoza@sanrafael.com.mx',
    clientPhone: '+52 55 4192 8830',
    date: '2026-10-22',
    validUntil: '2026-11-15',
    items: [
      {
        id: 'item-01',
        catalogItemId: 'cat-mold-02',
        productType: 'molde',
        title: 'Molde de Soplado PET Frasco Jarabe 250ml',
        description: 'Juego de cavidades en Aluminio 7075 con grabado de marca en base y cuello 28mm PCO',
        material: 'Aluminio 7075-T6 + Inserto Acero Inox',
        quantity: 1,
        unitPrice: 72000,
        totalPrice: 72000,
        specs: { cavidades: 2, cicloEstimado: '14 seg', grabadoLogotipo: 'Sí' }
      },
      {
        id: 'item-02',
        catalogItemId: 'cat-env-01',
        productType: 'envase',
        title: 'Lote Inicial de Producción: Frascos PET Ámbar 250ml',
        description: 'Frascos soplados con resina PET ámbar grado farmacéutico UV',
        material: 'PET Virgen + Pigmento Ámbar UV 2%',
        quantity: 25000,
        unitPrice: 2.80,
        totalPrice: 70000,
        specs: { empaque: 'Cajas corrugadas x 250 pzas', palletizado: '100 cajas/pallet' }
      }
    ],
    subtotal: 142000,
    tax: 22720,
    total: 164720,
    status: 'aprobada',
    notes: 'Condición comercial: 50% anticipo al ordenar, saldo contra entrega tras prueba de molde aprobada.',
    requiresDesign: true,
    productionOrderId: 'OP-2026-088',
    advancePercentage: 50,
    advancePaid: 82360
  },
  {
    id: 'cot-2026-042',
    quoteNumber: 'COT-2026-042',
    clientId: 'cli-002',
    clientName: 'Lic. Mariana Ortiz',
    clientCompany: 'Cosméticos y Fragancias Esencia Maya',
    clientEmail: 'compras@esenciamaya.com',
    clientPhone: '+52 33 1890 2211',
    date: '2026-10-24',
    validUntil: '2026-11-08',
    items: [
      {
        id: 'item-03',
        catalogItemId: 'cat-grab-01',
        productType: 'grabado',
        title: 'Placas Metálicas Personalizadas Edición Oro Láser Fibra',
        description: 'Placas de latón pulido espejo calibre 18 con grabado vectorial decorativo de marca',
        material: 'Latón Brillante C260',
        quantity: 1200,
        unitPrice: 42.50,
        totalPrice: 51000,
        specs: { acabado: 'Grabado láser fibra + Laca protectora poliuretano', dimension: '65 x 30 mm' }
      }
    ],
    subtotal: 51000,
    tax: 8160,
    total: 59160,
    status: 'enviada',
    notes: 'Muestra virtual enviada al cliente para aprobación de tipografía y logotipo.',
    requiresDesign: true,
    advancePercentage: 50,
    advancePaid: 0
  },
  {
    id: 'cot-2026-043',
    quoteNumber: 'COT-2026-043',
    clientId: 'cli-004',
    clientName: 'Andrea Fuentes',
    clientCompany: 'Distribuidora de Limpieza EcoClean Plus',
    clientEmail: 'afuentes@ecocleanplus.mx',
    clientPhone: '+52 81 8320 9940',
    date: '2026-10-25',
    validUntil: '2026-11-10',
    items: [
      {
        id: 'item-04',
        catalogItemId: 'cat-env-03',
        productType: 'envase',
        title: 'Galón Industrial HDPE 3.78L Blanco c/Tapa Inviolable',
        description: 'Envase reforzado 145g con regatón antiderrapante y nivel visible',
        material: 'HDPE Copolímero Virgen + 1% Masterbatch Blanco',
        quantity: 8000,
        unitPrice: 15.80,
        totalPrice: 126400,
        specs: { capacidad: '3.78 L', tapon: 'Rosca 38mm estriada con liner' }
      }
    ],
    subtotal: 126400,
    tax: 20224,
    total: 146624,
    status: 'borrador',
    notes: 'Cotización sujeta a disponibilidad de resina HDPE en tolva.',
    requiresDesign: false,
    advancePercentage: 35,
    advancePaid: 0
  }
];

export const INITIAL_ORDERS: ProductionOrder[] = [
  {
    id: 'op-001',
    opNumber: 'OP-2026-088',
    quoteId: 'cot-2026-041',
    clientName: 'Ing. Carlos Mendoza',
    clientCompany: 'Laboratorios Farmacéuticos San Rafael S.A.',
    productType: 'molde',
    title: 'Molde de Soplado PET Frasco 250ml Jarabe',
    quantity: 1,
    material: 'Bloque Aluminio Aeroespacial 7075-T6 (48 kg)',
    estimatedMaterialKg: 48,
    assignedMachineId: 'mach-01', // CNC Haas VF-3
    assignedOperator: 'Mateo Cárdenas (Técnico CNC)',
    status: 'en_maquinado_inyeccion',
    progressPercent: 65,
    startDate: '2026-10-23',
    dueDate: '2026-11-12',
    designApproved: true,
    rawMaterialAllocated: true,
    notes: 'Cavidad 1 concluida con desbaste y semi-acabado. En proceso de maquinado de circuito refrigerante.',
    materialCost: 14500,
    machineHours: 32,
    machineHourlyRate: 750,
    machineCost: 24000,
    laborHours: 24,
    laborHourlyRate: 220,
    laborCost: 5280,
    salePrice: 72000
  },
  {
    id: 'op-002',
    opNumber: 'OP-2026-085',
    quoteId: 'cot-2026-038',
    clientName: 'Arq. Roberto Villegas',
    clientCompany: 'Industrializadora Metalmecánica del Bajío',
    productType: 'grabado',
    title: '500 Placas de Acero Inox 316 con Marcado Láser de Código QR y Trazabilidad',
    quantity: 500,
    material: 'Lámina Acero Inox 316 Calibre 14 (38 kg cortada)',
    estimatedMaterialKg: 38,
    assignedMachineId: 'mach-03', // Grabadora Láser MOPA 60W
    assignedOperator: 'Laura Méndez (Especialista Láser)',
    status: 'control_calidad',
    progressPercent: 92,
    startDate: '2026-10-21',
    dueDate: '2026-10-26',
    designApproved: true,
    rawMaterialAllocated: true,
    notes: 'Verificando escaneabilidad de código Datamatrix y contraste superficial.',
    materialCost: 8900,
    machineHours: 14,
    machineHourlyRate: 450,
    machineCost: 6300,
    laborHours: 12,
    laborHourlyRate: 200,
    laborCost: 2400,
    salePrice: 32500
  },
  {
    id: 'op-003',
    opNumber: 'OP-2026-084',
    quoteId: 'cot-2026-035',
    clientName: 'Lic. Mariana Ortiz',
    clientCompany: 'Cosméticos y Fragancias Esencia Maya',
    productType: 'envase',
    title: 'Producción de 15,000 Botellas PET 500ml Esmeriladas',
    quantity: 15000,
    material: 'Resina PET Pellets Virgen (480 kg) + Aditivo Mate',
    estimatedMaterialKg: 480,
    assignedMachineId: 'mach-06', // Sopladora PET
    assignedOperator: 'Javier Rocha (Operador Soplado)',
    status: 'terminada_empaque',
    progressPercent: 100,
    startDate: '2026-10-18',
    dueDate: '2026-10-24',
    completedDate: '2026-10-24',
    designApproved: true,
    rawMaterialAllocated: true,
    notes: 'Lote terminado y empacado en 60 cajas. Listo en almacén de producto terminado para entrega y facturación.',
    materialCost: 19200,
    machineHours: 26,
    machineHourlyRate: 600,
    machineCost: 15600,
    laborHours: 20,
    laborHourlyRate: 180,
    laborCost: 3600,
    salePrice: 51000
  },
  {
    id: 'op-004',
    opNumber: 'OP-2026-089',
    quoteId: 'cot-2026-040',
    clientName: 'Andrea Fuentes',
    clientCompany: 'Distribuidora de Limpieza EcoClean Plus',
    productType: 'molde',
    title: 'Mantenimiento Mayor y Ajuste de Cavidad Molde Galón 3.78L',
    quantity: 1,
    material: 'Inserto de Cobre Berilio C17200 + Pernos Guía',
    estimatedMaterialKg: 12,
    assignedMachineId: 'mach-04', // Electroerosionadora EDM
    assignedOperator: 'Gerardo Morales (Matricero Senior)',
    status: 'preparacion_herramental',
    progressPercent: 25,
    startDate: '2026-10-25',
    dueDate: '2026-11-04',
    designApproved: true,
    rawMaterialAllocated: true,
    notes: 'Portamolde desarmado en mesa de ajuste para inspección de desgaste en área de cierre.',
    materialCost: 6500,
    machineHours: 18,
    machineHourlyRate: 700,
    machineCost: 12600,
    laborHours: 16,
    laborHourlyRate: 250,
    laborCost: 4000,
    salePrice: 38000
  }
];

export const INITIAL_DESIGNS: DesignFile[] = [
  {
    id: 'dsg-001',
    orderId: 'op-001',
    quoteId: 'cot-2026-041',
    clientId: 'cli-001',
    clientName: 'Laboratorios Farmacéuticos San Rafael S.A.',
    title: 'Ensamble 3D Molde Soplado Frasco 250ml - Planos y Cavidades',
    category: 'molde_soplado',
    version: 'v2.1 (Aprobado Final)',
    fileFormat: 'STEP',
    toleranceMm: 0.02,
    status: 'aprobado_cliente',
    notes: 'Aprobada la geometría del fondo petalóide y el radio del cuello roscado.',
    updatedAt: '2026-10-23 11:30',
    previewType: 'cavity'
  },
  {
    id: 'dsg-002',
    orderId: 'op-002',
    quoteId: 'cot-2026-038',
    clientId: 'cli-003',
    clientName: 'Industrializadora Metalmecánica del Bajío',
    title: 'Vector de Grabado Micro-percusión y Láser Marcado Placa Serie Q-400',
    category: 'grabado_vectorial',
    version: 'v1.4',
    fileFormat: 'DXF',
    toleranceMm: 0.015,
    status: 'aprobado_cliente',
    notes: 'Verificada la fuente tipográfica DIN 1451 y espaciado de códigos GS1.',
    updatedAt: '2026-10-21 16:45',
    previewType: 'toolpath'
  },
  {
    id: 'dsg-003',
    clientId: 'cli-002',
    clientName: 'Cosméticos y Fragancias Esencia Maya',
    title: 'Propuesta de Cuño Bajo Relieve y Textura Floral para Envase Crema 120ml',
    category: 'grabado_vectorial',
    version: 'v1.0 (En Revisión)',
    fileFormat: 'AI_VECTOR',
    toleranceMm: 0.05,
    status: 'en_revision',
    notes: 'Enviado render 3D con simulación de luz rasante al cliente. Pendiente confirmación de espesor de línea.',
    updatedAt: '2026-10-24 14:10',
    previewType: 'contour'
  },
  {
    id: 'dsg-004',
    clientId: 'cli-004',
    clientName: 'Distribuidora de Limpieza EcoClean Plus',
    title: 'Modelado CAD/CAM Tapa Dosificadora con Sello de Inducción',
    category: 'molde_inyeccion',
    version: 'v1.0 (Pendiente Muestra)',
    fileFormat: 'STEP',
    toleranceMm: 0.025,
    status: 'prototipo_fabricado',
    notes: 'Prototipo impreso en 3D SLA resina técnica entregado para prueba funcional de cierre.',
    updatedAt: '2026-10-25 09:20',
    previewType: 'mesh'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // --- METALES ---
  {
    id: 'inv-m-01',
    name: 'Bloques de Acero P20 Pre-templado (Mecanizado de Moldes)',
    category: 'metal',
    typeDetails: 'Dimensiones 250 x 300 x 400 mm / Dureza 30-34 HRC',
    sku: 'MET-P20-BLK',
    currentStock: 1250,
    minStock: 400,
    unit: 'kg',
    costPerUnit: 145, // $145/kg
    location: 'Rack M-1 (Taller de Moldes)',
    lastUpdated: '2026-10-24'
  },
  {
    id: 'inv-m-02',
    name: 'Placas de Aluminio Aeroespacial 7075-T6 (Moldes de Soplado)',
    category: 'metal',
    typeDetails: 'Espesores 50mm, 75mm y 100mm / Alta conductividad térmica',
    sku: 'MET-AL7075-PL',
    currentStock: 680,
    minStock: 300,
    unit: 'kg',
    costPerUnit: 290,
    location: 'Rack M-2',
    lastUpdated: '2026-10-23'
  },
  {
    id: 'inv-m-03',
    name: 'Láminas Acero Inoxidable 304 / 316 (Grabado Láser)',
    category: 'metal',
    typeDetails: 'Calibres 14, 16, 18, 20 / Acabado 2B y Satinado Scotch',
    sku: 'MET-INOX-LAM',
    currentStock: 420,
    minStock: 250,
    unit: 'kg',
    costPerUnit: 185,
    location: 'Estante L-4 (Área Láser)',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'inv-m-04',
    name: 'Barras y Chapas de Latón C260 (Cuños y Placas de Alta Gama)',
    category: 'metal',
    typeDetails: 'Aleación 70% Cu / 30% Zn para micro-fresado diamantado',
    sku: 'MET-LAT-BAR',
    currentStock: 195,
    minStock: 150,
    unit: 'kg',
    costPerUnit: 260,
    location: 'Gabinete Seguro B-1',
    lastUpdated: '2026-10-20'
  },

  // --- PLÁSTICOS & RESINAS ---
  {
    id: 'inv-p-01',
    name: 'Resina PET Virgen en Pellets (Grado Botella / FDA)',
    category: 'plastico',
    typeDetails: 'Viscosidad intrínseca 0.82 dl/g / Grado alimentario y fármaco',
    sku: 'RES-PET-082',
    currentStock: 8400,
    minStock: 2500,
    unit: 'kg',
    costPerUnit: 34.50,
    location: 'Silo Exterior 1 y Almacén Resinas',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'inv-p-02',
    name: 'Polietileno de Alta Densidad (HDPE) Inyección/Soplado',
    category: 'plastico',
    typeDetails: 'Índice de fluidez 0.35 g/10min / Excelente resistencia química',
    sku: 'RES-HDPE-SOP',
    currentStock: 4600,
    minStock: 2000,
    unit: 'kg',
    costPerUnit: 38.00,
    location: 'Almacén Resinas - Zona B',
    lastUpdated: '2026-10-22'
  },
  {
    id: 'inv-p-03',
    name: 'Polipropileno Copolímero (PP) para Tapas y Bisagras Flip-Top',
    category: 'plastico',
    typeDetails: 'MFI 12 g/10min / Alta resiliencia al doblado repetido',
    sku: 'RES-PP-COP',
    currentStock: 1200,
    minStock: 1500, // ALERTA BAJO STOCK
    unit: 'kg',
    costPerUnit: 42.00,
    location: 'Almacén Resinas - Zona C',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'inv-p-04',
    name: 'Concentrado Masterbatch Pigmento Ámbar UV y Blanco Dióxido',
    category: 'plastico',
    typeDetails: 'Concentración de pigmento al 60% / Dosificación al 1-2%',
    sku: 'COL-MAST-UV',
    currentStock: 340,
    minStock: 100,
    unit: 'kg',
    costPerUnit: 140.00,
    location: 'Cuarto de Mezclas y Dosificación',
    lastUpdated: '2026-10-18'
  },

  // --- PRODUCTO TERMINADO (ENVASES) ---
  {
    id: 'inv-pt-01',
    name: 'Botella PET 500ml Boston Round Cristal (Cajas x 200 pzas)',
    category: 'envase_terminado',
    typeDetails: 'Stock empacado con liner antipolvo listo para entrega inmediata',
    sku: 'PT-BOT-500-CR',
    currentStock: 18400,
    minStock: 5000,
    unit: 'piezas',
    costPerUnit: 2.15,
    location: 'Nave de Empaque - Racks Pallet 3 y 4',
    lastUpdated: '2026-10-25'
  },
  {
    id: 'inv-pt-02',
    name: 'Frasco HDPE 250ml Boca Ancha Blanco (Cajas x 250 pzas)',
    category: 'envase_terminado',
    typeDetails: 'Producto farmacéutico descontaminado listo para despacho',
    sku: 'PT-FRS-250-BL',
    currentStock: 9250,
    minStock: 3000,
    unit: 'piezas',
    costPerUnit: 1.80,
    location: 'Nave de Empaque - Rack Pallet 1',
    lastUpdated: '2026-10-24'
  },
  {
    id: 'inv-pt-03',
    name: 'Galón HDPE 3.78 Litros con Asa Natural (Bolsas x 50 pzas)',
    category: 'envase_terminado',
    typeDetails: 'Galón para químicos y limpieza de alta resistencia',
    sku: 'PT-GAL-378-NAT',
    currentStock: 4200,
    minStock: 2000,
    unit: 'piezas',
    costPerUnit: 11.20,
    location: 'Patio de Maniobras - Tarimas 8 a 12',
    lastUpdated: '2026-10-23'
  }
];

export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'mach-01',
    name: 'Centro de Maquinado CNC Haas VF-3 (5 Ejes)',
    type: 'fresadora_cnc',
    hourlyRate: 750,
    status: 'operando',
    currentOpNumber: 'OP-2026-088',
    activeOperator: 'Mateo Cárdenas',
    totalHoursMonth: 198,
    efficiencyOEE: 88.5
  },
  {
    id: 'mach-02',
    name: 'Torno CNC de Alta Precisión Mazak Quick Turn',
    type: 'torno_cnc',
    hourlyRate: 580,
    status: 'disponible',
    totalHoursMonth: 142,
    efficiencyOEE: 82.0
  },
  {
    id: 'mach-03',
    name: 'Estación de Grabado Láser Fibra MOPA 60W',
    type: 'laser_mopa',
    hourlyRate: 450,
    status: 'operando',
    currentOpNumber: 'OP-2026-085',
    activeOperator: 'Laura Méndez',
    totalHoursMonth: 215,
    efficiencyOEE: 94.2
  },
  {
    id: 'mach-04',
    name: 'Electroerosionadora por Penetración EDM AgieCharmilles',
    type: 'electroerosion_edm',
    hourlyRate: 700,
    status: 'preparacion',
    currentOpNumber: 'OP-2026-089',
    activeOperator: 'Gerardo Morales',
    totalHoursMonth: 110,
    efficiencyOEE: 76.4
  },
  {
    id: 'mach-05',
    name: 'Inyectora de Plástico Hidráulica 180 Toneladas',
    type: 'inyectora_plastico',
    hourlyRate: 650,
    status: 'disponible',
    totalHoursMonth: 230,
    efficiencyOEE: 89.1
  },
  {
    id: 'mach-06',
    name: 'Sopladora Automática PET Bi-orientada 2 Cavidades',
    type: 'sopladora_pet',
    hourlyRate: 600,
    status: 'mantenimiento',
    totalHoursMonth: 245,
    efficiencyOEE: 84.8
  }
];

export const INITIAL_QUALITY_RECORDS: QualityRecord[] = [
  {
    id: 'qual-001',
    opNumber: 'OP-2026-085',
    timestamp: '2026-10-25 11:20',
    inspectedPieces: 250,
    approvedPieces: 248,
    defectivePieces: 2,
    plasticScrapKg: 0,
    defectReason: 'falla_grabado',
    operator: 'Laura Méndez',
    notes: 'Micro-desalineación en línea 3 de texto. Lente focal recalibrado de inmediato.'
  },
  {
    id: 'qual-002',
    opNumber: 'OP-2026-084',
    timestamp: '2026-10-24 15:40',
    inspectedPieces: 5000,
    approvedPieces: 4940,
    defectivePieces: 60,
    plasticScrapKg: 14.5,
    defectReason: 'falta_llenado',
    operator: 'Javier Rocha',
    notes: 'Presión de pre-soplado ajustada de 8 bar a 9.5 bar. Mermas recuperadas para peletizado.'
  },
  {
    id: 'qual-003',
    opNumber: 'OP-2026-083',
    timestamp: '2026-10-22 09:15',
    inspectedPieces: 1200,
    approvedPieces: 1180,
    defectivePieces: 20,
    plasticScrapKg: 6.2,
    defectReason: 'rebaba',
    operator: 'Mateo Cárdenas',
    notes: 'Ajuste de fuerza de cierre en molde de tapa flip-top. Problema mitigado al 100%.'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-fac-101',
    invoiceNumber: 'FAC-2026-101',
    opNumber: 'OP-2026-084',
    clientName: 'Cosméticos y Fragancias Esencia Maya',
    clientRfc: 'CEM180922KX8',
    amount: 51000,
    tax: 8160,
    total: 59160,
    paidAmount: 29580,
    pendingBalance: 29580,
    issueDate: '2026-10-24',
    dueDate: '2026-11-08',
    status: 'parcial'
  },
  {
    id: 'inv-fac-102',
    invoiceNumber: 'FAC-2026-102',
    opNumber: 'OP-2026-079',
    clientName: 'Industrializadora Metalmecánica del Bajío',
    clientRfc: 'IMB090412R33',
    amount: 185000,
    tax: 29600,
    total: 214600,
    paidAmount: 0,
    pendingBalance: 214600,
    issueDate: '2026-10-15',
    dueDate: '2026-11-29',
    status: 'pendiente'
  },
  {
    id: 'inv-fac-103',
    invoiceNumber: 'FAC-2026-099',
    opNumber: 'OP-2026-072',
    clientName: 'Laboratorios Farmacéuticos San Rafael S.A.',
    clientRfc: 'LFS920311PP1',
    amount: 140000,
    tax: 22400,
    total: 162400,
    paidAmount: 162400,
    pendingBalance: 0,
    issueDate: '2026-10-01',
    dueDate: '2026-10-31',
    status: 'cobrada'
  }
];

export const INITIAL_PAYABLES: PayableAccount[] = [
  {
    id: 'pay-01',
    supplierName: 'Aceros Especiales y Forjas del Norte',
    category: 'materia_prima',
    description: 'Bloques de Acero P20 y H13 para moldes de inyección',
    amount: 68500,
    paidAmount: 30000,
    dueDate: '2026-11-05',
    status: 'pendiente'
  },
  {
    id: 'pay-02',
    supplierName: 'Petroquímica Polímeros de México',
    category: 'materia_prima',
    description: '10 Toneladas de resina PET Virgen grado botella',
    amount: 345000,
    paidAmount: 200000,
    dueDate: '2026-11-12',
    status: 'pendiente'
  },
  {
    id: 'pay-03',
    supplierName: 'Herramientas de Corte Sandvik & Kyocera',
    category: 'herramental',
    description: 'Fresas toroidales, brocas de carburo y pasta diamantada',
    amount: 24300,
    paidAmount: 24300,
    dueDate: '2026-10-20',
    status: 'pagada'
  },
  {
    id: 'pay-04',
    supplierName: 'Comisión Federal de Electricidad (CFE Tarifa GDMTH)',
    category: 'servicios_electricos',
    description: 'Consumo energía eléctrica industrial mes de Octubre',
    amount: 42100,
    paidAmount: 0,
    dueDate: '2026-11-02',
    status: 'pendiente'
  }
];

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr-01',
    name: 'Ing. Alejandro Solís',
    email: 'gerencia@grabadosenmetal.mx',
    role: 'admin',
    phone: '+52 55 5511 2233',
    status: 'activo',
    shift: 'mixto'
  },
  {
    id: 'usr-02',
    name: 'Lic. Claudia Paredes',
    email: 'ventas@grabadosenmetal.mx',
    role: 'ventas',
    phone: '+52 55 5511 2234',
    status: 'activo',
    shift: 'matutino'
  },
  {
    id: 'usr-03',
    name: 'Ing. Daniel Morales',
    email: 'ingenieria@grabadosenmetal.mx',
    role: 'diseno',
    phone: '+52 55 5511 2235',
    status: 'activo',
    shift: 'matutino'
  },
  {
    id: 'usr-04',
    name: 'Mateo Cárdenas',
    email: 'taller.cnc@grabadosenmetal.mx',
    role: 'produccion',
    phone: '+52 55 5511 2236',
    status: 'activo',
    shift: 'matutino'
  }
];
