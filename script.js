/**
 * LawnQuote - Field Quoting Tool for Lawn Care & Landscaping Crews
 * 
 * Complies strictly with .agents/skills/quote-rules/SKILL.md:
 * - Area-based services round yard size UP to the next 1,000 sq ft
 * - Minimum job charge floor applied when subtotal is below baseline
 * - Final quote total rounded to the nearest multiple of $5
 * - Zero native popups (alert/confirm/prompt); all validations inline
 * - Defensive localStorage read/write with graceful in-memory fallback
 * - Fairway Pro Brand & Modern Thumb Navigation System
 * - Bilingual English / Spanish Localization & Pipeline CRM
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Constants & Baseline Configuration
  // ---------------------------------------------------------------------------
  const DEFAULT_SETTINGS = {
    businessName: 'GreenThumb Lawn & Landscape',
    phone: '(555) 234-5678',
    email: 'quotes@greenthumb-example.com',
    minJobCharge: 50.0,
    quoteTerms: 'Estimates valid for 14 days. Payment due upon completion of services.',
    rates: {
      mowing: 12.0,      // $ per 1,000 sq ft
      edging: 4.0,       // $ per 1,000 sq ft
      leaf: 8.0,         // $ per 1,000 sq ft
      fertilizer: 9.0,   // $ per 1,000 sq ft
      overseed: 18.0,    // $ per 1,000 sq ft
      mulch: 85.0,       // $ per cubic yard
      hedge: 55.0        // $ per crew hour
    }
  };

  const STORAGE_KEY = 'lawnquote_crew_settings_v1';
  const ESTIMATE_COUNTER_KEY = 'lawnquote_estimate_counter_v1';
  const SAVED_ESTIMATES_KEY = 'lawnquote_saved_estimates_v1';
  const LEGACY_SAVED_QUOTES_KEY = 'lawnquote_saved_quotes_v1';
  const LANG_STORAGE_KEY = 'lawnquote_language_v1';

  // ---------------------------------------------------------------------------
  // Translations Dictionary (English & Spanish)
  // ---------------------------------------------------------------------------
  const TRANSLATIONS = {
    en: {
      appTitle: 'LawnQuote',
      appSubtitle: 'Field Quoting for Lawn & Landscaping Crews',
      navPriceSheet: 'Price Sheet',
      navYardServices: 'Yard & Services',
      navPreview: 'Quote Preview',
      navSavedQuotes: 'Saved',
      stepPriceSheet: 'Price Sheet',
      stepYardServices: 'Yard & Services',
      stepPreview: 'Quote Preview',

      // Price Sheet
      pricesheetHint: "Crew Pricing Setup: We've pre-filled realistic baseline rates ($12/1k mowing, $50 min charge). Update with your crew's actual pricing, then tap Save Settings.",
      priceSheetTitle: 'Business Price Sheet & Settings',
      priceSheetDesc: "Set your crew's rates and business details. Everything is saved locally on your phone.",
      bizInfoTitle: 'Business Information',
      lblBizName: 'Business Name *',
      placeholderBizName: 'e.g. GreenThumb Lawn & Landscape',
      lblPhone: 'Phone Number',
      placeholderPhone: '(555) 234-5678',
      lblEmail: 'Email Address',
      placeholderEmail: 'quotes@greenthumb-example.com',
      minChargeTitle: 'Minimum Charge & Terms',
      lblMinCharge: 'Minimum Job Charge ($) *',
      hintMinCharge: 'No job is billed below this baseline floor',
      lblTerms: 'Quote Terms & Conditions',
      placeholderTerms: 'e.g. Estimates valid for 14 days. Payment due upon completion.',
      ratesTitle: 'Service Rates',
      lblRateMowing: 'Mowing Rate ($ per 1,000 sq ft) *',
      lblRateEdging: 'Edging Rate ($ per 1,000 sq ft) *',
      lblRateLeaf: 'Leaf Cleanup Rate ($ per 1,000 sq ft) *',
      lblRateMulch: 'Mulch Rate ($ per cubic yard delivered & spread) *',
      lblRateHedge: 'Hedge Trimming Rate ($ per crew hour) *',
      lblRateFertilizer: 'Fertilization Rate ($ per 1,000 sq ft) *',
      lblRateOverseed: 'Overseeding & Rye Grass Rate ($ per 1,000 sq ft) *',
      btnSaveSettings: 'Save Settings',
      btnExportBackup: 'Export Backup',
      btnImportBackup: 'Import Backup',
      btnResetSettings: 'Reset to Realistic Defaults',
      toastSettingsSaved: 'Settings saved successfully!',
      toastSettingsReset: 'Settings reset to realistic defaults!',

      // Screen 2: New Quote
      quotingAs: 'Quoting as:',
      sampleProfileBadge: '(Sample Profile)',
      btnEditRates: 'Edit Rates',
      newQuoteTitle: 'Create New Quote',
      newQuoteDesc: 'Price out a job in under a minute right from the curb.',
      btnFillFake: 'Fill Sample',
      custInfoTitle: 'Customer Information',
      lblCustName: 'Customer Name *',
      placeholderCustName: 'e.g. Jane Doe (Fake Customer)',
      lblCustAddress: 'Property / Service Address *',
      placeholderCustAddress: 'e.g. 742 Evergreen Terrace, Springfield, TX 75001',
      lblYardSize: 'Lawn / Yard Size (sq ft) *',
      hintYardSize: 'Area rounded up to next 1,000 sq ft · 4,200 sq ft = 5 units',
      btnMeasureMap: 'Measure on Aerial Map',
      yardSizeHintText: 'Measure property boundaries from aerial photos, or type yard size by hand.',
      aerialMeasureNote: '📷 Measured from aerial photo. Please double-check.',
      servicesTitle: 'Services to Include',
      servicesDesc: 'Select services for this quote. Rates apply automatically from your Price Sheet.',
      svcNameMowing: 'Lawn Mowing',
      svcDescMowing: 'Weekly rotary cut, debris clearance & cleanup',
      svcNameEdging: 'Perimeter Edging',
      svcDescEdging: 'Vertical mechanical edging along hardscapes and curbs',
      svcNameLeaf: 'Leaf Cleanup',
      svcDescLeaf: 'Blow out plant beds and rake lawn turf clean of tree foliage',
      svcNameMulch: 'Mulch Delivery & Install',
      svcDescMulch: 'Premium shredded hardwood mulch installed at 2-3" depth',
      svcNameHedge: 'Hedge Trimming',
      svcDescHedge: 'Precision trimming and debris cleanup of perimeter hedges/shrubs',
      svcNameFertilizer: 'Turf Fertilization',
      svcDescFertilizer: 'Balanced seasonal nutrient application to promote deep root growth',
      svcNameOverseed: 'Overseeding & Rye Grass',
      svcDescOverseed: 'Slit-seeding & broadcast application for lush seasonal turf cover',
      lblMulchQty: 'Quantity (Cubic Yards) *',
      unitMulch: 'cu yds',
      lblHedgeQty: 'Estimated Crew Labor (Hours) *',
      unitHedge: 'hours',
      unitYardSize: 'sq ft',
      unit1kSqFt: '1k sq ft',
      unitCuYd: 'cu yd',
      unitHour: 'hr',
      svcError: 'Please select at least one service.',
      photosTitle: 'Job Site Photos (Optional)',
      photosDesc: "Take new photos or pick from your phone's photo library. Thumbnails are included on the quote.",
      btnSnapPhoto: 'Take Photo or Choose Files',
      liveEstimateLabel: 'Live Estimate',
      liveEstimateSub: 'Calculated live · Includes min floor & $5 rounding',
      btnGenerateQuote: 'Generate Quote Preview',

      // Screen 3: Quote Preview
      emptyStateTitle: 'No Active Quote Yet',
      emptyStateText: 'Enter property measurements and select services in Step 2 to generate a professional, print-ready quote in under 60 seconds.',
      btnEmptyStart: 'Create New Quote',
      btnEmptySample: 'Load Reference Sample ($335.00)',
      quoteTypeEstimate: 'ESTIMATE',
      lblEstimateNum: 'Estimate #:',
      lblDate: 'Date:',
      lblValidThrough: 'Valid Through:',
      lblPreparedFor: 'PREPARED FOR',
      lblPropertyScope: 'PROPERTY & SCOPE',
      lblMeasuredLawnArea: 'Measured Lawn Area:',
      thServiceDesc: 'Service Description',
      thQtyScope: 'Quantity / Scope',
      thUnitRate: 'Unit Rate',
      thAmount: 'Amount',
      lblSubtotal: 'Subtotal',
      lblMinFloorAdj: 'Minimum Job Floor Adjustment',
      minFloorNote: '(Minimum floor of ${min} applied)',
      lblCashRounding: 'Cash Rounding (Nearest $5)',
      lblTotalEstimate: 'Total Estimate',
      termsTitle: 'Terms & Conditions',
      photosTitlePreview: 'Job Site Property Photos',
      thankYou: 'Thank you for considering our lawn care & landscaping crew!',
      sigLine: 'Authorized Signature',
      sigDate: 'Date',
      btnSaveEstimate: 'Save Estimate',
      btnUpdateEstimate: 'Update Estimate',
      btnSavedCheck: 'Saved!',
      btnPrint: 'Print / Save as PDF',
      btnEditQuote: 'Edit Quote',
      btnStartFresh: 'Start Fresh',

      // Screen 4: Saved Estimates & Pipeline
      savedQuotesTitle: 'Saved Estimates & Pipeline',
      savedQuotesDesc: 'Track quotes, follow up with customers, and monitor your closing rate.',
      statPending: 'Pending Quotes',
      subInPipeline: '{val} in pipeline',
      statWon: 'Won Revenue',
      subClosedJobs: '{n} closed jobs',
      subClosedJobSingle: '1 closed job',
      statWinRate: 'Win Rate',
      subDecided: '{won} of {total} decided',
      filterAll: 'All',
      filterPending: 'Pending',
      filterWon: 'Won',
      filterLost: 'Lost',
      emptySavedTitle: 'No Saved Estimates Yet',
      emptySavedDesc: 'Create an estimate in Yard & Services and tap Save Estimate on Quote Preview to track your jobs here.',
      btnCreateFirstQuote: 'Create First Quote',
      followUpBadge: 'Follow up ({days}d)',
      btnReopen: 'Reopen',
      btnMarkWon: '✓ Mark Won',
      btnMarkLost: '✕ Mark Lost',
      btnRevert: '↩ Revert to Pending',
      btnDuplicate: 'Duplicate',
      btnDelete: 'Delete',
      deleteConfirmMsg: 'Delete estimate #{id}? This cannot be undone.',
      timeToday: 'Today',
      timeYesterday: '1 day ago',
      timeDaysAgo: '{n} days ago',
      aerialBadgeTag: '📷 Aerial',
      quoteSavedToast: 'Estimate #{id} saved to pipeline!',
      quoteUpdatedToast: 'Estimate #{id} updated!',
      quoteSavedNoPhotos: 'Estimate #{id} saved (photos omitted due to storage limit).',
      quoteDuplicatedToast: 'Duplicated as #{id}',
      quoteDeletedToast: 'Estimate #{id} deleted.',
      quoteSaveError: 'Unable to save estimate to local storage.',
      confirmStartFresh: 'Start a fresh new quote?',

      // Aerial Map Modal
      mapModalTitle: 'Aerial Lot Measurement',
      mapModalSub: 'Trace property boundaries on USGS aerial photos (updated periodically; may be a few years old)',
      mapSearchPlaceholder: 'Search property address...',
      mapBtnFind: 'Find',
      mapOfflineTitle: 'Aerial Map Unavailable Offline',
      mapOfflineDesc: 'Aerial imagery requires an active internet connection. You can enter your yard size directly in the quote form without interrupting your quote.',
      mapOfflineBtn: 'Type Yard Size by Hand',
      mapBtnUndo: 'Undo Point',
      mapBtnNextArea: 'Finish / Next Area',
      mapBtnClear: 'Clear',
      mapTracedArea: 'Traced Lawn Area:',
      mapAreaBreakdown: '{n} area(s)',
      mapDisclaimer: '⚠️ Estimate Note: Aerial measurements are estimates (photos may be a few years old). Exclude the house, driveway, and beds, and verify the number before quoting.',
      mapUseArea: 'Use this area'
    },
    es: {
      appTitle: 'LawnQuote',
      appSubtitle: 'Cotizaciones de Campo para Equipos de Jardinería',
      navPriceSheet: 'Tarifas',
      navYardServices: 'Terreno y Servicios',
      navPreview: 'Vista Previa',
      navSavedQuotes: 'Guardadas',
      stepPriceSheet: 'Tarifas',
      stepYardServices: 'Terreno y Servicios',
      stepPreview: 'Vista Previa',

      // Price Sheet
      pricesheetHint: 'Configuración de Tarifas: Hemos completado tarifas base realistas ($12/1k corte, $50 cargo mínimo). Modifique según sus precios y presione Guardar Configuración.',
      priceSheetTitle: 'Tarifas y Configuración del Negocio',
      priceSheetDesc: 'Configure las tarifas y datos de su cuadrilla. Todo se guarda localmente en su teléfono.',
      bizInfoTitle: 'Información del Negocio',
      lblBizName: 'Nombre del Negocio *',
      placeholderBizName: 'ej. GreenThumb Jardinería y Mantenimiento',
      lblPhone: 'Número de Teléfono',
      placeholderPhone: '(555) 234-5678',
      lblEmail: 'Correo Electrónico',
      placeholderEmail: 'cotizaciones@greenthumb-ejemplo.com',
      minChargeTitle: 'Cargo Mínimo y Términos',
      lblMinCharge: 'Cargo Mínimo por Trabajo ($) *',
      hintMinCharge: 'Ningún trabajo se factura por debajo de este monto',
      lblTerms: 'Términos y Condiciones de la Cotización',
      placeholderTerms: 'ej. Estimaciones válidas por 14 días. Pago al finalizar los servicios.',
      ratesTitle: 'Tarifas de Servicios',
      lblRateMowing: 'Tarifa de Corte ($ por 1,000 pies²) *',
      lblRateEdging: 'Tarifa de Bordeado ($ por 1,000 pies²) *',
      lblRateLeaf: 'Tarifa de Limpieza de Hojas ($ por 1,000 pies²) *',
      lblRateMulch: 'Tarifa de Mantillo ($ por yarda cúbica entregada e instalada) *',
      lblRateHedge: 'Tarifa de Poda de Setos ($ por hora de cuadrilla) *',
      lblRateFertilizer: 'Tarifa de Fertilización ($ por 1,000 pies²) *',
      lblRateOverseed: 'Tarifa de Resiembra y Rye ($ por 1,000 pies²) *',
      btnSaveSettings: 'Guardar Configuración',
      btnExportBackup: 'Exportar Respaldo',
      btnImportBackup: 'Importar Respaldo',
      btnResetSettings: 'Restablecer Valores Predeterminados',
      toastSettingsSaved: '¡Configuración guardada exitosamente!',
      toastSettingsReset: '¡Configuración restablecida a valores predeterminados!',

      // Screen 2: New Quote
      quotingAs: 'Cotizando como:',
      sampleProfileBadge: '(Perfil de Ejemplo)',
      btnEditRates: 'Editar Tarifas',
      newQuoteTitle: 'Crear Nueva Cotización',
      newQuoteDesc: 'Cotice un trabajo en menos de un minuto desde el vehículo.',
      btnFillFake: 'Llenar Ejemplo',
      custInfoTitle: 'Información del Cliente',
      lblCustName: 'Nombre del Cliente *',
      placeholderCustName: 'ej. Juana Pérez (Cliente de Ejemplo)',
      lblCustAddress: 'Dirección de la Propiedad *',
      placeholderCustAddress: 'ej. 742 Evergreen Terrace, Springfield, TX 75001',
      lblYardSize: 'Tamaño del Césped (pies²) *',
      hintYardSize: 'Área redondeada hacia arriba a los siguientes 1,000 pies² · 4,200 pies² = 5 unidades',
      btnMeasureMap: 'Medir en Mapa Aéreo',
      yardSizeHintText: 'Mida los límites de la propiedad con fotos aéreas o escriba el tamaño a mano.',
      aerialMeasureNote: '📷 Medido desde foto aérea. Por favor verifique.',
      servicesTitle: 'Servicios a Incluir',
      servicesDesc: 'Seleccione los servicios. Las tarifas se aplican automáticamente desde su lista de precios.',
      svcNameMowing: 'Corte de Césped',
      svcDescMowing: 'Corte rotativo semanal, despeje de residuos y soplado',
      svcNameEdging: 'Bordeado Perimetral',
      svcDescEdging: 'Bordeado mecánico vertical a lo largo de aceras y cordones',
      svcNameLeaf: 'Limpieza de Hojas',
      svcDescLeaf: 'Limpieza con soplador de canteros y rastrillado de follaje',
      svcNameMulch: 'Entrega e Instalación de Mantillo',
      svcDescMulch: 'Mantillo de madera triturada premium instalado a 2-3" de espesor',
      svcNameHedge: 'Poda de Setos',
      svcDescHedge: 'Poda de precisión y retiro de ramas de setos y arbustos',
      svcNameFertilizer: 'Fertilización de Césped',
      svcDescFertilizer: 'Aplicación estacional de nutrientes para raíces profundas',
      svcNameOverseed: 'Resiembra y Césped Rye',
      svcDescOverseed: 'Sembrado con hendidura y dispersión para césped verde de invierno',
      lblMulchQty: 'Cantidad (Yardas Cúbicas) *',
      unitMulch: 'yd³',
      lblHedgeQty: 'Mano de Obra Estimada (Horas) *',
      unitHedge: 'horas',
      unitYardSize: 'pies²',
      unit1kSqFt: '1k pies²',
      unitCuYd: 'yd³',
      unitHour: 'hr',
      svcError: 'Por favor seleccione al menos un servicio.',
      photosTitle: 'Fotos del Lugar de Trabajo (Opcional)',
      photosDesc: 'Tome nuevas fotos o elija de su galería. Las miniaturas se incluirán en la cotización.',
      btnSnapPhoto: 'Tomar Foto o Elegir Archivos',
      liveEstimateLabel: 'Estimado en Vivo',
      liveEstimateSub: 'Calculado en vivo · Incluye mínimo y redondeo a $5',
      btnGenerateQuote: 'Generar Vista Previa',

      // Screen 3: Quote Preview
      emptyStateTitle: 'No Hay Cotización Activa Aún',
      emptyStateText: 'Ingrese las medidas de la propiedad y seleccione los servicios en el Paso 2 para generar una cotización profesional en menos de 60 segundos.',
      btnEmptyStart: 'Crear Nueva Cotización',
      btnEmptySample: 'Cargar Ejemplo de Referencia ($335.00)',
      quoteTypeEstimate: 'PRESUPUESTO',
      lblEstimateNum: 'Presupuesto #:',
      lblDate: 'Fecha:',
      lblValidThrough: 'Válido Hasta:',
      lblPreparedFor: 'PREPARADO PARA',
      lblPropertyScope: 'PROPIEDAD Y ALCANCE',
      lblMeasuredLawnArea: 'Área Medida del Césped:',
      thServiceDesc: 'Descripción del Servicio',
      thQtyScope: 'Cantidad / Alcance',
      thUnitRate: 'Tarifa Unitaria',
      thAmount: 'Monto',
      lblSubtotal: 'Subtotal',
      lblMinFloorAdj: 'Ajuste por Cargo Mínimo',
      minFloorNote: '(Mínimo de ${min} aplicado)',
      lblCashRounding: 'Redondeo en Efectivo ($5 más cercano)',
      lblTotalEstimate: 'Estimación Total',
      termsTitle: 'Términos y Condiciones',
      photosTitlePreview: 'Fotos del Lugar de Trabajo',
      thankYou: '¡Gracias por considerar a nuestra cuadrilla de jardinería y mantenimiento!',
      sigLine: 'Firma Autorizada',
      sigDate: 'Fecha',
      btnSaveEstimate: 'Guardar Estimación',
      btnUpdateEstimate: 'Actualizar Estimación',
      btnSavedCheck: '¡Guardada!',
      btnPrint: 'Imprimir / Guardar PDF',
      btnEditQuote: 'Editar Cotización',
      btnStartFresh: 'Comenzar de Nuevo',

      // Screen 4: Saved Estimates & Pipeline
      savedQuotesTitle: 'Estimaciones Guardadas y Flujo de Trabajo',
      savedQuotesDesc: 'Dé seguimiento a cotizaciones, contacte a clientes y supervise su tasa de cierre.',
      statPending: 'Cotizaciones Pendientes',
      subInPipeline: '{val} en seguimiento',
      statWon: 'Ingresos Ganados',
      subClosedJobs: '{n} trabajos ganados',
      subClosedJobSingle: '1 trabajo ganado',
      statWinRate: 'Tasa de Éxito',
      subDecided: '{won} de {total} decididas',
      filterAll: 'Todas',
      filterPending: 'Pendientes',
      filterWon: 'Ganadas',
      filterLost: 'Perdidas',
      emptySavedTitle: 'No Hay Estimaciones Guardadas Aún',
      emptySavedDesc: 'Cree una cotización en Terreno y Servicios y presione Guardar Estimación en Vista Previa para dar seguimiento aquí.',
      btnCreateFirstQuote: 'Crear Primera Cotización',
      followUpBadge: 'Seguimiento ({days}d)',
      btnReopen: 'Reabrir',
      btnMarkWon: '✓ Marcar Ganada',
      btnMarkLost: '✕ Marcar Perdida',
      btnRevert: '↩ Volver a Pendiente',
      btnDuplicate: 'Duplicar',
      btnDelete: 'Eliminar',
      deleteConfirmMsg: '¿Eliminar estimación #{id}? No se puede deshacer.',
      timeToday: 'Hoy',
      timeYesterday: 'Hace 1 día',
      timeDaysAgo: 'Hace {n} días',
      aerialBadgeTag: '📷 Aérea',
      quoteSavedToast: '¡Estimación #{id} guardada en el flujo de trabajo!',
      quoteUpdatedToast: '¡Estimación #{id} actualizada!',
      quoteSavedNoPhotos: 'Estimación #{id} guardada (sin fotos por límite de almacenamiento).',
      quoteDuplicatedToast: 'Duplicada como #{id}',
      quoteDeletedToast: 'Estimación #{id} eliminada.',
      quoteSaveError: 'No se pudo guardar la estimación en el almacenamiento local.',
      confirmStartFresh: '¿Comenzar una nueva cotización en blanco?',

      // Aerial Map Modal
      mapModalTitle: 'Medición Aérea del Terreno',
      mapModalSub: 'Trace los límites del terreno en fotos aéreas (actualizadas periódicamente; pueden tener algunos años)',
      mapSearchPlaceholder: 'Buscar dirección de la propiedad...',
      mapBtnFind: 'Buscar',
      mapOfflineTitle: 'Mapa Aéreo No Disponible Sin Conexión',
      mapOfflineDesc: 'Las imágenes aéreas requieren conexión a internet activa. Puede ingresar el tamaño del césped directamente en el formulario.',
      mapOfflineBtn: 'Escribir Tamaño a Mano',
      mapBtnUndo: 'Deshacer Punto',
      mapBtnNextArea: 'Finalizar / Siguiente Área',
      mapBtnClear: 'Limpiar',
      mapTracedArea: 'Área Medida del Césped:',
      mapAreaBreakdown: '{n} área(s)',
      mapDisclaimer: '⚠️ Nota de Estimación: Las mediciones aéreas son aproximadas (las fotos pueden tener algunos años). Excluya la casa, entrada y canteros, y verifique el total antes de cotizar.',
      mapUseArea: 'Usar esta área'
    }
  };

  /**
   * Generates sequential estimate numbers (Q-0001, Q-0002, ...)
   * Saved persistently in localStorage with defensive try/catch and in-memory fallback.
   * Numbers are strictly monotonic and never reused even if a quote is discarded.
   */
  function getNextQuoteNumber() {
    let count = 1;
    try {
      const stored = window.localStorage.getItem(ESTIMATE_COUNTER_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          count = parsed;
        }
      }
      window.localStorage.setItem(ESTIMATE_COUNTER_KEY, String(count + 1));
    } catch (e) {
      console.warn('LocalStorage error reading estimate counter:', e);
      count = window._inMemoryEstimateCounter || 1;
      window._inMemoryEstimateCounter = count + 1;
    }
    const padded = String(count).padStart(4, '0');
    return `Q-${padded}`;
  }

  // Industry benchmark guardrails for outlier / typo detection
  const RATE_BENCHMARKS = {
    mowing: { min: 3, max: 40, label: 'Mowing', typical: '$10–$25 / 1k sq ft' },
    edging: { min: 1, max: 25, label: 'Edging', typical: '$3–$10 / 1k sq ft' },
    leaf: { min: 2, max: 35, label: 'Leaf cleanup', typical: '$6–$15 / 1k sq ft' },
    fertilizer: { min: 3, max: 40, label: 'Fertilization', typical: '$6–$18 / 1k sq ft' },
    overseed: { min: 5, max: 60, label: 'Overseeding / Rye', typical: '$12–$30 / 1k sq ft' },
    mulch: { min: 20, max: 200, label: 'Mulch', typical: '$70–$120 / cu yd' },
    hedge: { min: 15, max: 150, label: 'Hedge trimming', typical: '$45–$75 / hr' },
    minJobCharge: { min: 10, max: 250, label: 'Minimum job charge', typical: '$35–$100' }
  };

  // State
  let currentSettings = null;
  let currentLanguage = 'en';
  let currentQuoteData = null; // null until user creates a quote
  let attachedPhotos = [];     // Array of base64 data URLs
  let pendingRateWarning = false;
  let rateWarningTimer = null;
  let currentSavedFilter = 'all';
  let yardMeasuredOnMap = false;
  let lastMeasuredMapSqFt = 0;

  // ---------------------------------------------------------------------------
  // 2. DOM Elements (Grouped by Screen Domain)
  // ---------------------------------------------------------------------------
  const DOM = {
    screens: {
      'screen-pricesheet': document.getElementById('screen-pricesheet'),
      'screen-newquote': document.getElementById('screen-newquote'),
      'screen-preview': document.getElementById('screen-preview'),
      'screen-saved': document.getElementById('screen-saved')
    },
    lang: {
      btnEn: document.getElementById('btn-lang-en'),
      btnEs: document.getElementById('btn-lang-es')
    },
    nav: {
      tabs: document.querySelectorAll('.tab-btn'),
      savedCount: document.getElementById('nav-saved-count'),
      gotoPriceSheetBtn: document.getElementById('btn-goto-pricesheet'),
      stepBtns: document.querySelectorAll('.step-item'),
      stepBtn1: document.getElementById('step-btn-1'),
      stepBtn2: document.getElementById('step-btn-2'),
      stepBtn3: document.getElementById('step-btn-3'),
      stepConn1: document.getElementById('step-conn-1'),
      stepConn2: document.getElementById('step-conn-2')
    },
    priceSheet: {
      form: document.getElementById('price-sheet-form'),
      bizName: document.getElementById('setting-business-name'),
      phone: document.getElementById('setting-phone'),
      email: document.getElementById('setting-email'),
      minCharge: document.getElementById('setting-min-charge'),
      terms: document.getElementById('setting-terms'),
      rateMowing: document.getElementById('setting-rate-mowing'),
      rateEdging: document.getElementById('setting-rate-edging'),
      rateLeaf: document.getElementById('setting-rate-leaf'),
      rateFertilizer: document.getElementById('setting-rate-fertilizer'),
      rateOverseed: document.getElementById('setting-rate-overseed'),
      rateMulch: document.getElementById('setting-rate-mulch'),
      rateHedge: document.getElementById('setting-rate-hedge'),
      resetBtn: document.getElementById('btn-reset-settings'),
      toast: document.getElementById('settings-toast'),
      warningBanner: document.getElementById('pricesheet-warning'),
      hintBanner: document.getElementById('pricesheet-hint-banner'),
      exportBtn: document.getElementById('btn-export-backup'),
      importBtn: document.getElementById('btn-import-backup'),
      importFileInput: document.getElementById('backup-file-input'),
      errors: {
        bizName: document.getElementById('error-setting-business-name'),
        minCharge: document.getElementById('error-setting-min-charge'),
        rateMowing: document.getElementById('error-setting-rate-mowing'),
        rateEdging: document.getElementById('error-setting-rate-edging'),
        rateLeaf: document.getElementById('error-setting-rate-leaf'),
        rateFertilizer: document.getElementById('error-setting-rate-fertilizer'),
        rateOverseed: document.getElementById('error-setting-rate-overseed'),
        rateMulch: document.getElementById('error-setting-rate-mulch'),
        rateHedge: document.getElementById('error-setting-rate-hedge')
      }
    },
    newQuote: {
      form: document.getElementById('new-quote-form'),
      quickFillBtn: document.getElementById('btn-fill-fake'),
      activeBizName: document.getElementById('quote-active-biz-name'),
      sampleBadge: document.getElementById('biz-strip-sample-badge'),
      custName: document.getElementById('quote-cust-name'),
      custAddress: document.getElementById('quote-cust-address'),
      yardSize: document.getElementById('quote-yard-size'),
      svcMowing: document.getElementById('svc-mowing'),
      svcEdging: document.getElementById('svc-edging'),
      svcLeaf: document.getElementById('svc-leaf'),
      svcFertilizer: document.getElementById('svc-fertilizer'),
      svcOverseed: document.getElementById('svc-overseed'),
      svcMulch: document.getElementById('svc-mulch'),
      svcHedge: document.getElementById('svc-hedge'),
      mulchContainer: document.getElementById('mulch-qty-container'),
      hedgeContainer: document.getElementById('hedge-qty-container'),
      qtyMulch: document.getElementById('qty-mulch'),
      qtyHedge: document.getElementById('qty-hedge'),
      mulchMinusBtn: document.getElementById('btn-mulch-minus'),
      mulchPlusBtn: document.getElementById('btn-mulch-plus'),
      hedgeMinusBtn: document.getElementById('btn-hedge-minus'),
      hedgePlusBtn: document.getElementById('btn-hedge-plus'),
      photoInput: document.getElementById('photo-input'),
      thumbnails: document.getElementById('photo-thumbnails'),
      liveTotalChip: document.getElementById('live-total-chip'),
      liveRunningTotal: document.getElementById('live-running-total'),
      errors: {
        custName: document.getElementById('error-quote-cust-name'),
        custAddress: document.getElementById('error-quote-cust-address'),
        yardSize: document.getElementById('error-quote-yard-size'),
        qtyMulch: document.getElementById('error-qty-mulch'),
        qtyHedge: document.getElementById('error-qty-hedge'),
        svc: document.getElementById('svc-error')
      },
      badges: {
        mowing: document.getElementById('badge-rate-mowing'),
        edging: document.getElementById('badge-rate-edging'),
        leaf: document.getElementById('badge-rate-leaf'),
        fertilizer: document.getElementById('badge-rate-fertilizer'),
        overseed: document.getElementById('badge-rate-overseed'),
        mulch: document.getElementById('badge-rate-mulch'),
        hedge: document.getElementById('badge-rate-hedge')
      }
    },
    preview: {
      saveBtn: document.getElementById('btn-save-quote'),
      printBtn: document.getElementById('btn-print'),
      editBtn: document.getElementById('btn-edit-quote'),
      newQuoteBtn: document.getElementById('btn-new-quote'),
      toast: document.getElementById('quote-action-toast'),
      emptyState: document.getElementById('quote-empty-state'),
      quoteCard: document.getElementById('quote-card'),
      actions: document.querySelector('.preview-actions'),
      emptyStartBtn: document.getElementById('btn-empty-start-quote'),
      emptySampleBtn: document.getElementById('btn-empty-sample-quote'),
      bizName: document.getElementById('view-biz-name'),
      bizPhone: document.getElementById('view-biz-phone'),
      bizEmail: document.getElementById('view-biz-email'),
      quoteDate: document.getElementById('view-quote-date'),
      quoteId: document.getElementById('view-quote-id'),
      custName: document.getElementById('view-cust-name'),
      custAddress: document.getElementById('view-cust-address'),
      yardSize: document.getElementById('view-yard-size'),
      lineItems: document.getElementById('quote-line-items'),
      subtotal: document.getElementById('view-subtotal'),
      minChargeRow: document.getElementById('row-min-charge'),
      minChargeFloor: document.getElementById('view-min-charge-floor'),
      minChargeAdj: document.getElementById('view-min-charge-adj'),
      roundingAdj: document.getElementById('view-rounding-adj'),
      finalTotal: document.getElementById('view-final-total'),
      terms: document.getElementById('view-quote-terms'),
      photosSection: document.getElementById('quote-preview-photos'),
      photosGallery: document.getElementById('quote-photos-gallery'),
      highValueWarning: document.getElementById('preview-high-value-warning')
    },
    saved: {
      screen: document.getElementById('screen-saved'),
      pendingVal: document.getElementById('metric-pending-val'),
      pendingSub: document.getElementById('metric-pending-sub'),
      wonVal: document.getElementById('metric-won-val'),
      wonSub: document.getElementById('metric-won-sub'),
      winrateCard: document.getElementById('metric-winrate-card'),
      winrateVal: document.getElementById('metric-winrate-val'),
      winrateSub: document.getElementById('metric-winrate-sub'),
      filterBtns: document.querySelectorAll('.filter-pill'),
      filterCounts: {
        all: document.getElementById('count-filter-all'),
        pending: document.getElementById('count-filter-pending'),
        won: document.getElementById('count-filter-won'),
        lost: document.getElementById('count-filter-lost')
      },
      listContainer: document.getElementById('saved-estimates-list'),
      emptyState: document.getElementById('saved-empty-state'),
      emptyTitle: document.getElementById('saved-empty-title'),
      emptyDesc: document.getElementById('saved-empty-desc'),
      createNewBtn: document.getElementById('btn-saved-create-new'),
      toast: document.getElementById('saved-action-toast')
    },
    map: {
      btnOpen: document.getElementById('btn-open-map'),
      modal: document.getElementById('map-modal'),
      btnClose: document.getElementById('btn-close-map'),
      searchInput: document.getElementById('map-search-input'),
      btnSearch: document.getElementById('btn-map-search'),
      searchStatus: document.getElementById('map-search-status'),
      offlineBanner: document.getElementById('map-offline-banner'),
      btnOfflineDismiss: document.getElementById('btn-map-offline-dismiss'),
      canvas: document.getElementById('map-canvas'),
      btnUndo: document.getElementById('btn-map-undo'),
      btnNewArea: document.getElementById('btn-map-new-area'),
      btnClear: document.getElementById('btn-map-clear'),
      areaDisplay: document.getElementById('map-area-display'),
      areaBreakdown: document.getElementById('map-area-breakdown'),
      btnUseArea: document.getElementById('btn-map-use-area')
    }
  };

  // ---------------------------------------------------------------------------
  // 3. UI Helpers: Translations, Error Messaging, Formatting, Steppers & Confirmations
  // ---------------------------------------------------------------------------

  function t(key) {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : key);
  }

  function setLanguage(lang) {
    currentLanguage = (lang === 'es') ? 'es' : 'en';
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, currentLanguage);
    } catch (e) {
      console.warn('Could not persist language choice:', e);
    }

    document.documentElement.lang = currentLanguage;

    // Toggle active state on language buttons
    if (DOM.lang.btnEn && DOM.lang.btnEs) {
      DOM.lang.btnEn.classList.toggle('active', currentLanguage === 'en');
      DOM.lang.btnEs.classList.toggle('active', currentLanguage === 'es');
      DOM.lang.btnEn.setAttribute('aria-pressed', currentLanguage === 'en' ? 'true' : 'false');
      DOM.lang.btnEs.setAttribute('aria-pressed', currentLanguage === 'es' ? 'true' : 'false');
    }

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== undefined && val !== null) {
        el.textContent = val;
      }
    });

    // Update placeholders
    if (DOM.priceSheet.bizName) DOM.priceSheet.bizName.placeholder = t('placeholderBizName');
    if (DOM.priceSheet.phone) DOM.priceSheet.phone.placeholder = t('placeholderPhone');
    if (DOM.priceSheet.email) DOM.priceSheet.email.placeholder = t('placeholderEmail');
    if (DOM.priceSheet.terms) DOM.priceSheet.terms.placeholder = t('placeholderTerms');
    if (DOM.newQuote.custName) DOM.newQuote.custName.placeholder = t('placeholderCustName');
    if (DOM.newQuote.custAddress) DOM.newQuote.custAddress.placeholder = t('placeholderCustAddress');
    if (DOM.map.searchInput) DOM.map.searchInput.placeholder = t('mapSearchPlaceholder');

    // Update unit suffixes
    const yardSuffix = document.getElementById('unit-yard-size');
    if (yardSuffix) yardSuffix.textContent = t('unitYardSize');
    const mulchSuffix = document.getElementById('unit-mulch');
    if (mulchSuffix) mulchSuffix.textContent = t('unitMulch');
    const hedgeSuffix = document.getElementById('unit-hedge');
    if (hedgeSuffix) hedgeSuffix.textContent = t('unitHedge');

    // Update Rate Badges on Screen 2
    updateScreenBadges();

    // Re-render Quote Preview if currently active
    if (currentQuoteData) {
      renderQuotePreview(currentQuoteData);
    }

    // Re-render Saved Screen if visible
    renderSavedScreen();
  }

  function loadLanguage() {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        currentLanguage = stored;
      }
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    setLanguage(currentLanguage);
  }

  /**
   * Formats numeric amounts to standard US Currency with commas (e.g., $12,000.00)
   */
  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return '$' + num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function setFieldError(inputElem, errorElem, message) {
    if (inputElem) inputElem.classList.add('input-invalid');
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.style.display = 'flex';
    }
  }

  function clearFieldError(inputElem, errorElem) {
    if (inputElem) inputElem.classList.remove('input-invalid');
    if (errorElem) {
      errorElem.textContent = '';
      errorElem.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Photo Compression Helper (Thumbnail ~400px wide JPEG)
   * Prevents local storage quota overflow when saving quotes with attached site photos.
   */
  function compressImageToThumbnail(dataUrl, maxWidth = 400, quality = 0.7) {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (e) {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  async function compressPhotoList(photos) {
    if (!photos || !photos.length) return [];
    return Promise.all(photos.map(p => compressImageToThumbnail(p, 400, 0.7)));
  }

  /**
   * Reusable 44px stepper handler for decimal quantity inputs (Mulch & Hedge)
   */
  function setupStepper(minusBtn, plusBtn, inputElem, errorElem, step, minVal) {
    if (!minusBtn || !plusBtn || !inputElem) return;

    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let val = parseFloat(inputElem.value) || minVal;
      val = Math.max(minVal, Math.round((val - step) * 10) / 10);
      inputElem.value = val;
      clearFieldError(inputElem, errorElem);
      inputElem.dispatchEvent(new Event('input', { bubbles: true }));
    });

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let val = parseFloat(inputElem.value) || minVal;
      val = Math.round((val + step) * 10) / 10;
      inputElem.value = val;
      clearFieldError(inputElem, errorElem);
      inputElem.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  /**
   * Reusable inline 2-tap confirmation helper (eliminates native confirm() popups)
   */
  function bindTwoStepConfirm(button, promptText, defaultText, onConfirm) {
    let pending = false;
    let timer = null;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!pending) {
        pending = true;
        button.innerHTML = `⚠️ ${promptText}`;
        button.classList.add('btn-secondary');
        button.classList.remove('btn-outline');

        timer = setTimeout(() => {
          pending = false;
          button.innerHTML = defaultText;
          button.classList.remove('btn-secondary');
          button.classList.add('btn-outline');
        }, 3500);
        return;
      }

      clearTimeout(timer);
      pending = false;
      button.innerHTML = defaultText;
      button.classList.remove('btn-secondary');
      button.classList.add('btn-outline');
      onConfirm();
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Screen Navigation & Connected 3-Step Progress
  // ---------------------------------------------------------------------------

  function showScreen(screenId) {
    Object.keys(DOM.screens).forEach(id => {
      if (DOM.screens[id]) {
        DOM.screens[id].style.display = (id === screenId) ? 'block' : 'none';
      }
    });

    DOM.nav.tabs.forEach(btn => {
      const isTarget = btn.getAttribute('data-target') === screenId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    updateStepProgress(screenId);

    // If on Quote Preview screen, toggle empty state vs rendered quote card
    if (screenId === 'screen-preview') {
      const hasQuote = currentQuoteData !== null;
      if (DOM.preview.emptyState) {
        DOM.preview.emptyState.style.display = hasQuote ? 'none' : 'block';
      }
      if (DOM.preview.quoteCard) {
        DOM.preview.quoteCard.style.display = hasQuote ? 'block' : 'none';
      }
      if (DOM.preview.actions) {
        DOM.preview.actions.style.display = hasQuote ? 'flex' : 'none';
      }
    }

    // If on Saved Estimates screen, refresh pipeline metrics & cards
    if (screenId === 'screen-saved') {
      renderSavedScreen();
    }

    updateNavBadge();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateStepProgress(screenId) {
    const nav = DOM.nav;
    if (!nav.stepBtn1 || !nav.stepBtn2 || !nav.stepBtn3) return;

    const stepNavContainer = document.querySelector('.step-progress-nav');
    if (stepNavContainer) {
      stepNavContainer.style.display = (screenId === 'screen-saved') ? 'none' : 'block';
    }

    nav.stepBtns.forEach(btn => {
      btn.classList.remove('active', 'completed');
    });
    if (nav.stepConn1) nav.stepConn1.classList.remove('completed');
    if (nav.stepConn2) nav.stepConn2.classList.remove('completed');

    if (screenId === 'screen-pricesheet') {
      nav.stepBtn1.classList.add('active');
    } else if (screenId === 'screen-newquote') {
      nav.stepBtn1.classList.add('completed');
      if (nav.stepConn1) nav.stepConn1.classList.add('completed');
      nav.stepBtn2.classList.add('active');
    } else if (screenId === 'screen-preview') {
      nav.stepBtn1.classList.add('completed');
      nav.stepBtn2.classList.add('completed');
      if (nav.stepConn1) nav.stepConn1.classList.add('completed');
      if (nav.stepConn2) nav.stepConn2.classList.add('completed');
      nav.stepBtn3.classList.add('active');
    }
  }

  // Navigation tab clicks
  DOM.nav.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      if (target) showScreen(target);
    });
  });

  // Step progress button clicks
  DOM.nav.stepBtns.forEach(stepBtn => {
    stepBtn.addEventListener('click', () => {
      const target = stepBtn.getAttribute('data-target');
      if (target) showScreen(target);
    });
  });

  // Edit rates link on Screen 2
  if (DOM.nav.gotoPriceSheetBtn) {
    DOM.nav.gotoPriceSheetBtn.addEventListener('click', () => {
      showScreen('screen-pricesheet');
    });
  }

  // Language buttons
  if (DOM.lang.btnEn) {
    DOM.lang.btnEn.addEventListener('click', () => setLanguage('en'));
  }
  if (DOM.lang.btnEs) {
    DOM.lang.btnEs.addEventListener('click', () => setLanguage('es'));
  }

  // ---------------------------------------------------------------------------
  // 5. Settings Management (Defensive LocalStorage Handling)
  // ---------------------------------------------------------------------------

  function loadSettings() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        currentSettings = {
          businessName: parsed.businessName || DEFAULT_SETTINGS.businessName,
          phone: parsed.phone !== undefined ? parsed.phone : DEFAULT_SETTINGS.phone,
          email: parsed.email !== undefined ? parsed.email : DEFAULT_SETTINGS.email,
          minJobCharge: (typeof parsed.minJobCharge === 'number' && parsed.minJobCharge >= 0) ? parsed.minJobCharge : DEFAULT_SETTINGS.minJobCharge,
          quoteTerms: parsed.quoteTerms || DEFAULT_SETTINGS.quoteTerms,
          rates: {
            mowing: (parsed.rates && typeof parsed.rates.mowing === 'number') ? parsed.rates.mowing : DEFAULT_SETTINGS.rates.mowing,
            edging: (parsed.rates && typeof parsed.rates.edging === 'number') ? parsed.rates.edging : DEFAULT_SETTINGS.rates.edging,
            leaf: (parsed.rates && typeof parsed.rates.leaf === 'number') ? parsed.rates.leaf : DEFAULT_SETTINGS.rates.leaf,
            fertilizer: (parsed.rates && typeof parsed.rates.fertilizer === 'number') ? parsed.rates.fertilizer : DEFAULT_SETTINGS.rates.fertilizer,
            overseed: (parsed.rates && typeof parsed.rates.overseed === 'number') ? parsed.rates.overseed : DEFAULT_SETTINGS.rates.overseed,
            mulch: (parsed.rates && typeof parsed.rates.mulch === 'number') ? parsed.rates.mulch : DEFAULT_SETTINGS.rates.mulch,
            hedge: (parsed.rates && typeof parsed.rates.hedge === 'number') ? parsed.rates.hedge : DEFAULT_SETTINGS.rates.hedge
          }
        };
      } else {
        currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (err) {
      console.warn('LocalStorage error reading settings:', err);
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    populateSettingsForm();
    updateScreenBadges();
  }

  function saveSettingsToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
      return true;
    } catch (err) {
      console.warn('LocalStorage error writing settings:', err);
      return false;
    }
  }

  function populateSettingsForm() {
    const s = DOM.priceSheet;
    const data = currentSettings || DEFAULT_SETTINGS;
    s.bizName.value = data.businessName;
    s.phone.value = data.phone || '';
    s.email.value = data.email || '';
    s.minCharge.value = data.minJobCharge;
    s.terms.value = data.quoteTerms;
    s.rateMowing.value = data.rates.mowing;
    s.rateEdging.value = data.rates.edging;
    s.rateLeaf.value = data.rates.leaf;
    s.rateFertilizer.value = data.rates.fertilizer;
    s.rateOverseed.value = data.rates.overseed;
    s.rateMulch.value = data.rates.mulch;
    s.rateHedge.value = data.rates.hedge;
  }

  function updateScreenBadges() {
    const s = currentSettings || DEFAULT_SETTINGS;
    const r = s.rates;
    const b = DOM.newQuote.badges;

    const unit1k = t('unit1kSqFt');
    const unitYd = t('unitCuYd');
    const unitHr = t('unitHour');

    if (b.mowing) b.mowing.textContent = `${formatCurrency(r.mowing)} / ${unit1k}`;
    if (b.edging) b.edging.textContent = `${formatCurrency(r.edging)} / ${unit1k}`;
    if (b.leaf) b.leaf.textContent = `${formatCurrency(r.leaf)} / ${unit1k}`;
    if (b.fertilizer) b.fertilizer.textContent = `${formatCurrency(r.fertilizer)} / ${unit1k}`;
    if (b.overseed) b.overseed.textContent = `${formatCurrency(r.overseed)} / ${unit1k}`;
    if (b.mulch) b.mulch.textContent = `${formatCurrency(r.mulch)} / ${unitYd}`;
    if (b.hedge) b.hedge.textContent = `${formatCurrency(r.hedge)} / ${unitHr}`;

    if (DOM.newQuote.activeBizName) {
      DOM.newQuote.activeBizName.textContent = s.businessName;
    }
    if (DOM.newQuote.sampleBadge) {
      DOM.newQuote.sampleBadge.style.display = (s.businessName === DEFAULT_SETTINGS.businessName) ? 'inline-block' : 'none';
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Form Validations (Inline Errors, No Alert Dialogs)
  // ---------------------------------------------------------------------------

  function validatePriceSheetForm() {
    const s = DOM.priceSheet;
    let valid = true;

    if (!s.bizName.value.trim()) {
      setFieldError(s.bizName, s.errors.bizName, 'Business name is required.');
      valid = false;
    } else {
      clearFieldError(s.bizName, s.errors.bizName);
    }

    const minChargeVal = parseFloat(s.minCharge.value);
    if (isNaN(minChargeVal) || minChargeVal < 0) {
      setFieldError(s.minCharge, s.errors.minCharge, 'Minimum charge must be a valid number >= $0.');
      valid = false;
    } else {
      clearFieldError(s.minCharge, s.errors.minCharge);
    }

    const rateChecks = [
      { input: s.rateMowing, err: s.errors.rateMowing, name: 'Mowing rate', field: 'mowing' },
      { input: s.rateEdging, err: s.errors.rateEdging, name: 'Edging rate', field: 'edging' },
      { input: s.rateLeaf, err: s.errors.rateLeaf, name: 'Leaf cleanup rate', field: 'leaf' },
      { input: s.rateFertilizer, err: s.errors.rateFertilizer, name: 'Fertilization rate', field: 'fertilizer' },
      { input: s.rateOverseed, err: s.errors.rateOverseed, name: 'Overseeding rate', field: 'overseed' },
      { input: s.rateMulch, err: s.errors.rateMulch, name: 'Mulch rate', field: 'mulch' },
      { input: s.rateHedge, err: s.errors.rateHedge, name: 'Hedge trimming rate', field: 'hedge' }
    ];

    const rates = {};
    rateChecks.forEach(r => {
      const val = parseFloat(r.input.value);
      if (isNaN(val) || val < 0) {
        setFieldError(r.input, r.err, `${r.name} must be a valid number >= $0.`);
        valid = false;
      } else {
        clearFieldError(r.input, r.err);
        rates[r.field] = val;
      }
    });

    if (!valid) return null;

    return {
      businessName: s.bizName.value.trim(),
      phone: s.phone.value.trim(),
      email: s.email.value.trim(),
      minJobCharge: minChargeVal,
      quoteTerms: s.terms.value.trim(),
      rates
    };
  }

  function validateNewQuoteForm() {
    const q = DOM.newQuote;
    let valid = true;

    // 1. Customer Name
    const nameVal = q.custName.value.trim();
    if (!nameVal) {
      setFieldError(q.custName, q.errors.custName, 'Customer name is required.');
      valid = false;
    } else {
      clearFieldError(q.custName, q.errors.custName);
    }

    // 2. Customer Address
    const addressVal = q.custAddress.value.trim();
    if (!addressVal) {
      setFieldError(q.custAddress, q.errors.custAddress, 'Property / Service address is required.');
      valid = false;
    } else {
      clearFieldError(q.custAddress, q.errors.custAddress);
    }

    // 3. Yard Size (must be positive number > 0)
    const yardSizeVal = parseFloat(q.yardSize.value);
    if (isNaN(yardSizeVal) || yardSizeVal <= 0) {
      setFieldError(q.yardSize, q.errors.yardSize, 'Yard size must be a valid positive number greater than 0 sq ft.');
      valid = false;
    } else if (yardSizeVal > 500000) {
      setFieldError(q.yardSize, q.errors.yardSize, 'Yard size cannot exceed 500,000 sq ft (approx 11.5 acres).');
      valid = false;
    } else {
      clearFieldError(q.yardSize, q.errors.yardSize);
    }

    // 4. Services Selection
    const hasService = q.svcMowing.checked || q.svcEdging.checked || q.svcLeaf.checked || q.svcFertilizer.checked || q.svcOverseed.checked || q.svcMulch.checked || q.svcHedge.checked;
    if (!hasService) {
      q.errors.svc.style.display = 'block';
      valid = false;
    } else {
      q.errors.svc.style.display = 'none';
    }

    // 5. Mulch Quantity (if selected)
    let mulchYards = 0;
    if (q.svcMulch.checked) {
      mulchYards = parseFloat(q.qtyMulch.value);
      if (isNaN(mulchYards) || mulchYards <= 0) {
        setFieldError(q.qtyMulch, q.errors.qtyMulch, 'Mulch quantity must be greater than 0 cubic yards.');
        valid = false;
      } else if (mulchYards > 200) {
        setFieldError(q.qtyMulch, q.errors.qtyMulch, 'Mulch quantity cannot exceed 200 cubic yards per job.');
        valid = false;
      } else {
        clearFieldError(q.qtyMulch, q.errors.qtyMulch);
      }
    }

    // 6. Hedge Trimming Hours (if selected)
    let hedgeHours = 0;
    if (q.svcHedge.checked) {
      hedgeHours = parseFloat(q.qtyHedge.value);
      if (isNaN(hedgeHours) || hedgeHours <= 0) {
        setFieldError(q.qtyHedge, q.errors.qtyHedge, 'Hedge trimming hours must be greater than 0.');
        valid = false;
      } else if (hedgeHours > 80) {
        setFieldError(q.qtyHedge, q.errors.qtyHedge, 'Hedge trimming crew hours cannot exceed 80 hours per job.');
        valid = false;
      } else {
        clearFieldError(q.qtyHedge, q.errors.qtyHedge);
      }
    }

    if (!valid) return null;

    return {
      custName: nameVal,
      custAddress: addressVal,
      yardSize: yardSizeVal,
      services: {
        mowing: q.svcMowing.checked,
        edging: q.svcEdging.checked,
        leaf: q.svcLeaf.checked,
        fertilizer: q.svcFertilizer.checked,
        overseed: q.svcOverseed.checked,
        mulch: q.svcMulch.checked,
        hedge: q.svcHedge.checked
      },
      quantities: {
        mulchYards,
        hedgeHours
      }
    };
  }

  // ---------------------------------------------------------------------------
  // 7. Core Quoting & Pricing Calculation Engine
  // ---------------------------------------------------------------------------

  function calculateQuote(yardSize, services, quantities, rates, minJobCharge) {
    const areaUnits = Math.ceil(yardSize / 1000.0);
    const lineItems = [];

    const unitYard = t('unitYardSize');
    const unit1k = t('unit1kSqFt');
    const unitYd = t('unitCuYd');
    const unitHr = t('unitHour');
    const billedAsText = (currentLanguage === 'es') ? 'facturado como' : 'billed as';

    if (services.mowing) {
      const rate = rates.mowing;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'mowing',
        name: t('svcNameMowing'),
        description: t('svcDescMowing'),
        areaUnits,
        unitRate: rate,
        unitLabel: unit1k,
        qty: `${yardSize.toLocaleString()} ${unitYard} (${billedAsText} ${areaUnits} × 1,000 ${unitYard})`,
        rate: `${formatCurrency(rate)} / ${unit1k}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.edging) {
      const rate = rates.edging;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'edging',
        name: t('svcNameEdging'),
        description: t('svcDescEdging'),
        areaUnits,
        unitRate: rate,
        unitLabel: unit1k,
        qty: `${yardSize.toLocaleString()} ${unitYard} (${billedAsText} ${areaUnits} × 1,000 ${unitYard})`,
        rate: `${formatCurrency(rate)} / ${unit1k}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.leaf) {
      const rate = rates.leaf;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'leaf',
        name: t('svcNameLeaf'),
        description: t('svcDescLeaf'),
        areaUnits,
        unitRate: rate,
        unitLabel: unit1k,
        qty: `${yardSize.toLocaleString()} ${unitYard} (${billedAsText} ${areaUnits} × 1,000 ${unitYard})`,
        rate: `${formatCurrency(rate)} / ${unit1k}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.fertilizer) {
      const rate = rates.fertilizer !== undefined ? rates.fertilizer : DEFAULT_SETTINGS.rates.fertilizer;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'fertilizer',
        name: t('svcNameFertilizer'),
        description: t('svcDescFertilizer'),
        areaUnits,
        unitRate: rate,
        unitLabel: unit1k,
        qty: `${yardSize.toLocaleString()} ${unitYard} (${billedAsText} ${areaUnits} × 1,000 ${unitYard})`,
        rate: `${formatCurrency(rate)} / ${unit1k}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.overseed) {
      const rate = rates.overseed !== undefined ? rates.overseed : DEFAULT_SETTINGS.rates.overseed;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'overseed',
        name: t('svcNameOverseed'),
        description: t('svcDescOverseed'),
        areaUnits,
        unitRate: rate,
        unitLabel: unit1k,
        qty: `${yardSize.toLocaleString()} ${unitYard} (${billedAsText} ${areaUnits} × 1,000 ${unitYard})`,
        rate: `${formatCurrency(rate)} / ${unit1k}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.mulch) {
      const rate = rates.mulch;
      const amount = quantities.mulchYards * rate;
      lineItems.push({
        key: 'mulch',
        name: t('svcNameMulch'),
        description: t('svcDescMulch'),
        units: quantities.mulchYards,
        unitRate: rate,
        unitLabel: unitYd,
        qty: `${quantities.mulchYards} ${t('unitMulch')}`,
        rate: `${formatCurrency(rate)} / ${unitYd}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.hedge) {
      const rate = rates.hedge;
      const amount = quantities.hedgeHours * rate;
      lineItems.push({
        key: 'hedge',
        name: t('svcNameHedge'),
        description: t('svcDescHedge'),
        units: quantities.hedgeHours,
        unitRate: rate,
        unitLabel: unitHr,
        qty: `${quantities.hedgeHours} ${t('unitHedge')}`,
        rate: `${formatCurrency(rate)} / ${unitHr}`,
        amount: Math.round(amount * 100) / 100
      });
    }

    // Step 3: Subtotal Calculation
    const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);

    // Step 4: Minimum Job Charge Floor Enforcement
    const floor = minJobCharge || 0;
    let minChargeAdj = 0;
    let baseTotal = subtotal;

    if (subtotal < floor) {
      minChargeAdj = Math.round((floor - subtotal) * 100) / 100;
      baseTotal = floor;
    }

    // Step 5: Nearest $5 Rounding Rule
    const finalTotal = Math.round(baseTotal / 5.0) * 5.0;
    const roundingAdj = Math.round((finalTotal - baseTotal) * 100) / 100;

    return {
      areaUnits,
      lineItems,
      subtotal,
      minCharge: floor,
      minChargeAdj,
      roundingAdj,
      finalTotal
    };
  }

  // ---------------------------------------------------------------------------
  // 8. Live Running Total Calculation on Screen 2
  // ---------------------------------------------------------------------------
  function updateLiveRunningTotal() {
    const q = DOM.newQuote;
    if (!q.liveRunningTotal) return;

    const rawYard = q.yardSize.value.trim();
    const yardSize = parseFloat(rawYard);
    const hasService = q.svcMowing.checked || q.svcEdging.checked || q.svcLeaf.checked || q.svcFertilizer.checked || q.svcOverseed.checked || q.svcMulch.checked || q.svcHedge.checked;

    if (!rawYard || isNaN(yardSize) || yardSize <= 0 || !hasService) {
      q.liveRunningTotal.textContent = '—';
      return;
    }

    const services = {
      mowing: q.svcMowing.checked,
      edging: q.svcEdging.checked,
      leaf: q.svcLeaf.checked,
      fertilizer: q.svcFertilizer.checked,
      overseed: q.svcOverseed.checked,
      mulch: q.svcMulch.checked,
      hedge: q.svcHedge.checked
    };

    const quantities = {
      mulchYards: q.svcMulch.checked ? (parseFloat(q.qtyMulch.value) || 0) : 0,
      hedgeHours: q.svcHedge.checked ? (parseFloat(q.qtyHedge.value) || 0) : 0
    };

    const rates = (currentSettings && currentSettings.rates) ? currentSettings.rates : DEFAULT_SETTINGS.rates;
    const minCharge = (currentSettings && currentSettings.minJobCharge !== undefined) ? currentSettings.minJobCharge : DEFAULT_SETTINGS.minJobCharge;

    const pricing = calculateQuote(yardSize, services, quantities, rates, minCharge);
    q.liveRunningTotal.textContent = formatCurrency(pricing.finalTotal);
  }

  // ---------------------------------------------------------------------------
  // 9. Render Quote Preview (Strict Skill Section Ordering: 1 -> 7)
  // ---------------------------------------------------------------------------
  function renderQuotePreview(quote) {
    const p = DOM.preview;

    // SECTION 1: Header / Branding
    p.bizName.textContent = currentSettings.businessName;
    p.bizPhone.textContent = currentSettings.phone ? currentSettings.phone : '';
    p.bizEmail.textContent = currentSettings.email ? currentSettings.email : '';
    
    // Format date in current language
    const quoteDateObj = quote.createdAt ? new Date(quote.createdAt) : new Date();
    p.quoteDate.textContent = quoteDateObj.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    p.quoteId.textContent = `#${quote.quoteId}`;

    const validElem = document.getElementById('view-quote-valid');
    if (validElem) {
      if (quote.validThrough) {
        validElem.textContent = quote.validThrough;
      } else {
        const d = new Date(quoteDateObj.getTime());
        d.setDate(d.getDate() + 14);
        validElem.textContent = d.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }

    // SECTION 2: Customer Details
    p.custName.textContent = quote.custName;
    p.custAddress.textContent = quote.custAddress;
    p.yardSize.textContent = `${quote.yardSize.toLocaleString()} ${t('unitYardSize')}`;

    // SECTION 3: Itemized Table
    p.lineItems.innerHTML = '';
    quote.lineItems.forEach(item => {
      const tr = document.createElement('tr');

      // Localized name and description if key exists
      let itemName = item.name;
      let itemDesc = item.description;
      if (item.key) {
        const keyPascal = item.key.charAt(0).toUpperCase() + item.key.slice(1);
        itemName = t('svcName' + keyPascal) || item.name;
        itemDesc = t('svcDesc' + keyPascal) || item.description;
      }

      tr.innerHTML = `
        <td>
          <div class="item-service-title">${escapeHtml(itemName)}</div>
          <div class="item-service-desc">${escapeHtml(itemDesc)}</div>
          <div class="item-service-meta-mobile">${escapeHtml(item.qty)} &bull; ${escapeHtml(item.rate)}</div>
        </td>
        <td class="text-center tabular-num">${escapeHtml(item.qty)}</td>
        <td class="text-right tabular-num">${escapeHtml(item.rate)}</td>
        <td class="text-right tabular-num"><strong>${formatCurrency(item.amount)}</strong></td>
      `;
      p.lineItems.appendChild(tr);
    });

    // SECTION 4: Totals Breakdown
    p.subtotal.textContent = formatCurrency(quote.subtotal);

    if (quote.minChargeAdj > 0) {
      p.minChargeRow.style.display = 'flex';
      p.minChargeFloor.textContent = formatCurrency(quote.minCharge).replace('$', '');
      p.minChargeAdj.textContent = `+${formatCurrency(quote.minChargeAdj)}`;
    } else {
      p.minChargeRow.style.display = 'none';
    }

    const roundingSign = quote.roundingAdj >= 0 ? '+' : '-';
    p.roundingAdj.textContent = `${roundingSign}${formatCurrency(Math.abs(quote.roundingAdj))}`;
    p.finalTotal.textContent = formatCurrency(quote.finalTotal);

    // Safeguard: High-Value / Sanity Advisory (Hidden on Print)
    if (p.highValueWarning) {
      if (quote.finalTotal >= 1000 || quote.yardSize >= 20000) {
        const highValMsg = (currentLanguage === 'es')
          ? `<strong>Aviso de Cotización Elevada:</strong> ${formatCurrency(quote.finalTotal)} para ${quote.yardSize.toLocaleString()} ${t('unitYardSize')}. Por favor verifique el área y cantidades antes de enviar al cliente.`
          : `<strong>High Quote Advisory:</strong> ${formatCurrency(quote.finalTotal)} for ${quote.yardSize.toLocaleString()} sq ft. Please verify yard size and quantities before sending to the customer.`;
        p.highValueWarning.innerHTML = highValMsg;
        p.highValueWarning.style.display = 'block';
      } else {
        p.highValueWarning.style.display = 'none';
      }
    }

    // SECTION 5: Quote Terms & Conditions
    p.terms.textContent = (quote.terms !== undefined ? quote.terms : currentSettings.quoteTerms) || t('placeholderTerms');

    // SECTION 6: Site Photos
    if (quote.photos && quote.photos.length > 0) {
      p.photosSection.style.display = 'block';
      p.photosGallery.innerHTML = '';
      quote.photos.forEach((dataUrl, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'preview-photo-wrap';
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = `Site reference photo ${idx + 1}`;
        wrap.appendChild(img);
        p.photosGallery.appendChild(wrap);
      });
    } else {
      p.photosSection.style.display = 'none';
      p.photosGallery.innerHTML = '';
    }

    // Save button label toggle
    const isSaved = getSavedEstimates().some(e => e.quoteId === quote.quoteId);
    const saveBtnLabel = p.saveBtn.querySelector('[data-i18n]');
    if (saveBtnLabel) {
      saveBtnLabel.textContent = isSaved ? t('btnUpdateEstimate') : t('btnSaveEstimate');
    }
  }

  // ---------------------------------------------------------------------------
  // 10. Event Listeners & Binding
  // ---------------------------------------------------------------------------

  // Auto-clear validation errors as user types & update live running total
  const q = DOM.newQuote;
  [
    { input: q.custName, err: q.errors.custName },
    { input: q.custAddress, err: q.errors.custAddress },
    { input: q.yardSize, err: q.errors.yardSize },
    { input: q.qtyMulch, err: q.errors.qtyMulch },
    { input: q.qtyHedge, err: q.errors.qtyHedge }
  ].forEach(pair => {
    pair.input.addEventListener('input', () => {
      clearFieldError(pair.input, pair.err);
      if (pair.input === q.yardSize) {
        if (parseFloat(q.yardSize.value) !== lastMeasuredMapSqFt) {
          yardMeasuredOnMap = false;
          const note = document.getElementById('aerial-measure-note');
          if (note) note.style.display = 'none';
        }
      }
      updateLiveRunningTotal();
    });
  });

  [q.svcMowing, q.svcEdging, q.svcLeaf, q.svcFertilizer, q.svcOverseed, q.svcMulch, q.svcHedge].forEach(cb => {
    cb.addEventListener('change', () => {
      if (q.svcMowing.checked || q.svcEdging.checked || q.svcLeaf.checked || q.svcFertilizer.checked || q.svcOverseed.checked || q.svcMulch.checked || q.svcHedge.checked) {
        q.errors.svc.style.display = 'none';
      }
      updateLiveRunningTotal();
    });
  });

  // Service Expandable Containers
  function toggleServiceQty(checkbox, container, input) {
    if (checkbox.checked) {
      container.style.display = 'block';
      if (input && (!input.value || parseFloat(input.value) <= 0)) {
        input.value = input.getAttribute('value') || '1';
      }
    } else {
      container.style.display = 'none';
    }
  }

  q.svcMulch.addEventListener('change', () => {
    toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch);
    updateLiveRunningTotal();
  });
  q.svcHedge.addEventListener('change', () => {
    toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge);
    updateLiveRunningTotal();
  });

  // Steppers for Mulch (cu yds) and Hedge (hrs)
  setupStepper(q.mulchMinusBtn, q.mulchPlusBtn, q.qtyMulch, q.errors.qtyMulch, 0.5, 0.5);
  setupStepper(q.hedgeMinusBtn, q.hedgePlusBtn, q.qtyHedge, q.errors.qtyHedge, 0.5, 0.5);

  // Photo Upload & Thumbnails (with Canvas Downscaling to prevent OOM Crashes)
  function downscaleImage(file, maxDimension = 800, quality = 0.75) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  q.photoInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const compressed = await downscaleImage(file);
      if (compressed) {
        attachedPhotos.push(compressed);
      }
    }
    renderThumbnails();
    q.photoInput.value = '';
  });

  function renderThumbnails() {
    q.thumbnails.innerHTML = '';
    attachedPhotos.forEach((dataUrl, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'thumb-item';

      const img = document.createElement('img');
      img.src = dataUrl;
      img.alt = `Site photo thumbnail ${idx + 1}`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'thumb-remove-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.setAttribute('aria-label', `Remove photo ${idx + 1}`);
      removeBtn.addEventListener('click', () => {
        attachedPhotos.splice(idx, 1);
        renderThumbnails();
      });

      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      q.thumbnails.appendChild(wrap);
    });
  }

  // Quick-Fill Sample Button (Reference Example from Skill)
  q.quickFillBtn.addEventListener('click', () => {
    q.custName.value = (currentLanguage === 'es')
      ? 'Juana Pérez (Cliente de Ejemplo)'
      : 'Jane Doe (Fake Sample Customer)';
    q.custAddress.value = '742 Evergreen Terrace, Springfield, TX 75001';
    q.yardSize.value = 4200;

    clearFieldError(q.custName, q.errors.custName);
    clearFieldError(q.custAddress, q.errors.custAddress);
    clearFieldError(q.yardSize, q.errors.yardSize);
    clearFieldError(q.qtyMulch, q.errors.qtyMulch);
    clearFieldError(q.qtyHedge, q.errors.qtyHedge);
    q.errors.svc.style.display = 'none';

    q.svcMowing.checked = true;
    q.svcEdging.checked = true;
    q.svcLeaf.checked = false;
    q.svcFertilizer.checked = false;
    q.svcOverseed.checked = false;

    q.svcMulch.checked = true;
    toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch);
    q.qtyMulch.value = 2;

    q.svcHedge.checked = true;
    toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge);
    q.qtyHedge.value = 1.5;

    updateLiveRunningTotal();
  });

  // Price Sheet Form Submit (with Safeguard: Rate Outlier & Typo Detection)
  DOM.priceSheet.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const validated = validatePriceSheetForm();
    if (!validated) return;

    // Check for extreme rate outliers (e.g. $120 vs $12)
    if (!pendingRateWarning) {
      const warnings = [];
      if (validated.minJobCharge < RATE_BENCHMARKS.minJobCharge.min || validated.minJobCharge > RATE_BENCHMARKS.minJobCharge.max) {
        warnings.push(`Minimum charge ($${validated.minJobCharge}) is outside typical range (${RATE_BENCHMARKS.minJobCharge.typical})`);
      }
      Object.keys(RATE_BENCHMARKS).forEach(key => {
        if (key === 'minJobCharge') return;
        const rateVal = validated.rates[key];
        const bench = RATE_BENCHMARKS[key];
        if (rateVal < bench.min || rateVal > bench.max) {
          warnings.push(`${bench.label} rate ($${rateVal}) is outside typical range (${bench.typical})`);
        }
      });

      if (warnings.length > 0) {
        pendingRateWarning = true;
        const banner = DOM.priceSheet.warningBanner;
        if (banner) {
          banner.innerHTML = `⚠️ <strong>Unusual Rate Notice:</strong> ${warnings.join('; ')}.<br>Tap <strong>Save Settings</strong> again to confirm these rates.`;
          banner.style.display = 'block';
        }

        clearTimeout(rateWarningTimer);
        rateWarningTimer = setTimeout(() => {
          pendingRateWarning = false;
          if (banner) banner.style.display = 'none';
        }, 5000);
        return;
      }
    }

    // Outliers confirmed or all rates in normal range
    pendingRateWarning = false;
    clearTimeout(rateWarningTimer);
    if (DOM.priceSheet.warningBanner) DOM.priceSheet.warningBanner.style.display = 'none';
    if (DOM.priceSheet.hintBanner) DOM.priceSheet.hintBanner.style.display = 'none';

    currentSettings = validated;
    const saved = saveSettingsToStorage();
    updateScreenBadges();
    updateLiveRunningTotal();

    const toast = DOM.priceSheet.toast;
    toast.textContent = saved ? t('toastSettingsSaved') : 'Settings updated in memory (localStorage blocked).';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  });

  // Safeguard: Backup Export & Import (Prevents Data Loss on Phone Loss / Browser Data Clearing)
  if (DOM.priceSheet.exportBtn) {
    DOM.priceSheet.exportBtn.addEventListener('click', () => {
      try {
        const jsonStr = JSON.stringify(currentSettings, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lawnquote-settings-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const toast = DOM.priceSheet.toast;
        toast.textContent = 'Settings backup exported successfully!';
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2800);
      } catch (err) {
        console.error('Export failed:', err);
      }
    });
  }

  if (DOM.priceSheet.importBtn && DOM.priceSheet.importFileInput) {
    DOM.priceSheet.importBtn.addEventListener('click', () => {
      DOM.priceSheet.importFileInput.click();
    });

    DOM.priceSheet.importFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed && typeof parsed === 'object' && parsed.rates && typeof parsed.rates === 'object') {
            currentSettings = parsed;
            saveSettingsToStorage();
            populateSettingsForm();
            updateScreenBadges();
            updateLiveRunningTotal();
            if (DOM.priceSheet.warningBanner) DOM.priceSheet.warningBanner.style.display = 'none';
            if (DOM.priceSheet.hintBanner) DOM.priceSheet.hintBanner.style.display = 'none';

            const toast = DOM.priceSheet.toast;
            toast.textContent = 'Settings successfully restored from backup!';
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2800);
          } else {
            setFieldError(null, DOM.priceSheet.errors.bizName, 'Backup file missing valid rate structure.');
          }
        } catch (err) {
          setFieldError(null, DOM.priceSheet.errors.bizName, 'Invalid JSON backup file.');
        }
        DOM.priceSheet.importFileInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Reset to Defaults (Two-Tap Confirmation)
  bindTwoStepConfirm(
    DOM.priceSheet.resetBtn,
    'Tap again to confirm reset',
    t('btnResetSettings'),
    () => {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettingsToStorage();
      populateSettingsForm();
      updateScreenBadges();
      updateLiveRunningTotal();

      const s = DOM.priceSheet;
      Object.values(s.errors).forEach(err => { if (err) err.style.display = 'none'; });
      [s.bizName, s.minCharge, s.rateMowing, s.rateEdging, s.rateLeaf, s.rateFertilizer, s.rateOverseed, s.rateMulch, s.rateHedge].forEach(i => {
        if (i) i.classList.remove('input-invalid');
      });

      s.toast.textContent = t('toastSettingsReset');
      s.toast.style.display = 'block';
      setTimeout(() => { s.toast.style.display = 'none'; }, 2800);
    }
  );

  // New Quote Form Submit
  q.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = validateNewQuoteForm();
    if (!formData) return;

    // Run pure calculation engine
    const pricing = calculateQuote(
      formData.yardSize,
      formData.services,
      formData.quantities,
      currentSettings.rates,
      currentSettings.minJobCharge
    );

    const today = new Date();
    const valid = new Date();
    valid.setDate(valid.getDate() + 14);

    const quoteData = {
      quoteId: getNextQuoteNumber(),
      createdAt: Date.now(),
      dateFormatted: today.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      validThrough: valid.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      custName: formData.custName,
      custAddress: formData.custAddress,
      yardSize: formData.yardSize,
      measuredOnMap: Boolean(yardMeasuredOnMap),
      serviceSelections: {
        mowing: formData.services.mowing,
        edging: formData.services.edging,
        leaf: formData.services.leaf,
        fertilizer: formData.services.fertilizer,
        overseed: formData.services.overseed,
        mulch: formData.services.mulch,
        mulchQty: formData.quantities.mulchYards,
        hedge: formData.services.hedge,
        hedgeQty: formData.quantities.hedgeHours
      },
      lineItems: pricing.lineItems,
      subtotal: pricing.subtotal,
      minCharge: pricing.minCharge,
      minChargeAdj: pricing.minChargeAdj,
      roundingAdj: pricing.roundingAdj,
      finalTotal: pricing.finalTotal,
      terms: currentSettings.quoteTerms,
      photos: [...attachedPhotos],
      status: 'pending'
    };

    currentQuoteData = quoteData;
    renderQuotePreview(quoteData);
    showScreen('screen-preview');
  });

  // Empty State Action Buttons in Screen 3
  if (DOM.preview.emptyStartBtn) {
    DOM.preview.emptyStartBtn.addEventListener('click', () => {
      showScreen('screen-newquote');
    });
  }

  if (DOM.preview.emptySampleBtn) {
    DOM.preview.emptySampleBtn.addEventListener('click', () => {
      q.quickFillBtn.click();
      q.form.dispatchEvent(new Event('submit', { cancelable: true }));
    });
  }

  // Quote Preview Actions (Print, Edit, Start Fresh)
  DOM.preview.printBtn.addEventListener('click', () => {
    window.print();
  });

  DOM.preview.editBtn.addEventListener('click', () => {
    showScreen('screen-newquote');
  });

  // Start Fresh (Two-Tap Confirmation)
  bindTwoStepConfirm(
    DOM.preview.newQuoteBtn,
    'Tap again to confirm',
    t('btnStartFresh'),
    () => {
      q.form.reset();
      attachedPhotos = [];
      renderThumbnails();
      currentQuoteData = null;
      yardMeasuredOnMap = false;
      lastMeasuredMapSqFt = 0;

      clearFieldError(q.custName, q.errors.custName);
      clearFieldError(q.custAddress, q.errors.custAddress);
      clearFieldError(q.yardSize, q.errors.yardSize);
      clearFieldError(q.qtyMulch, q.errors.qtyMulch);
      clearFieldError(q.qtyHedge, q.errors.qtyHedge);
      q.errors.svc.style.display = 'none';

      toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch);
      toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge);
      updateLiveRunningTotal();

      const note = document.getElementById('aerial-measure-note');
      if (note) note.style.display = 'none';

      showScreen('screen-newquote');

      const toast = DOM.preview.toast;
      toast.textContent = (currentLanguage === 'es') ? 'Formulario limpio para una nueva cotización.' : 'Form cleared for new customer quote.';
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }
  );

  // ---------------------------------------------------------------------------
  // 11. Screen 4: Saved Estimates & Pipeline System (Part C)
  // ---------------------------------------------------------------------------

  function showSavedToast(msg) {
    const toast = DOM.saved.toast;
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2800);
  }

  function showQuotePreviewToast(msg) {
    const toast = DOM.preview.toast;
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2800);
  }

  function getSavedEstimates() {
    try {
      let raw = window.localStorage.getItem(SAVED_ESTIMATES_KEY);
      if (!raw) {
        raw = window.localStorage.getItem(LEGACY_SAVED_QUOTES_KEY);
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (!item.quoteId && item.id) {
              item.quoteId = item.id;
            }
            if (item.status) {
              item.status = item.status.toLowerCase();
            }
            return item;
          });
        }
      }
    } catch (err) {
      console.warn('LocalStorage error reading saved estimates:', err);
    }
    return window._inMemorySavedEstimates || [];
  }

  function saveSavedEstimatesList(list) {
    window._inMemorySavedEstimates = list;
    try {
      window.localStorage.setItem(SAVED_ESTIMATES_KEY, JSON.stringify(list));
      updateNavBadge(list);
      return { success: true, strippedPhotos: false };
    } catch (err) {
      console.warn('Failed saving estimates to localStorage, attempting without photos:', err);
      try {
        const noPhotosList = list.map(item => ({ ...item, photos: [] }));
        window.localStorage.setItem(SAVED_ESTIMATES_KEY, JSON.stringify(noPhotosList));
        updateNavBadge(noPhotosList);
        return { success: true, strippedPhotos: true };
      } catch (err2) {
        console.error('Fatal storage quota error:', err2);
        return { success: false, error: err2 };
      }
    }
  }

  function updateNavBadge(estimates) {
    const list = estimates || getSavedEstimates();
    const pendingCount = list.filter(e => !e.status || e.status === 'pending').length;
    const badge = DOM.nav.savedCount;
    if (badge) {
      if (pendingCount > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = pendingCount.toString();
      } else {
        badge.style.display = 'none';
      }
    }
  }

  async function saveEstimateToStorage(quote) {
    const list = getSavedEstimates();
    const existingIdx = list.findIndex(e => e.quoteId === quote.quoteId);
    const quoteCopy = JSON.parse(JSON.stringify(quote));

    // Compress photos to thumbnails before saving
    if (quoteCopy.photos && quoteCopy.photos.length > 0) {
      try {
        quoteCopy.photos = await compressPhotoList(quoteCopy.photos);
      } catch (e) {
        // Keep existing
      }
    }

    if (existingIdx >= 0) {
      quoteCopy.status = list[existingIdx].status || quoteCopy.status || 'pending';
      quoteCopy.createdAt = list[existingIdx].createdAt || quoteCopy.createdAt || Date.now();
      list[existingIdx] = quoteCopy;
    } else {
      quoteCopy.status = quoteCopy.status || 'pending';
      quoteCopy.createdAt = quoteCopy.createdAt || Date.now();
      list.unshift(quoteCopy);
    }
    return saveSavedEstimatesList(list);
  }

  function getDaysSince(timestamp) {
    if (!timestamp) return 0;
    const created = new Date(timestamp).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - created);
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  function getDaysSinceLabel(timestamp) {
    const days = getDaysSince(timestamp);
    if (days === 0) return t('timeToday');
    if (days === 1) return t('timeYesterday');
    return t('timeDaysAgo').replace('{n}', days.toString());
  }

  function updatePipelineSummary(estimates) {
    const pending = estimates.filter(e => !e.status || e.status === 'pending');
    const won = estimates.filter(e => e.status === 'won');
    const lost = estimates.filter(e => e.status === 'lost');

    const pendingCount = pending.length;
    const pendingValue = pending.reduce((sum, e) => sum + (Number(e.finalTotal) || 0), 0);

    const wonCount = won.length;
    const wonValue = won.reduce((sum, e) => sum + (Number(e.finalTotal) || 0), 0);

    const lostCount = lost.length;
    const decided = wonCount + lostCount;
    const winRate = decided > 0 ? Math.round((wonCount / decided) * 100) : 0;

    if (DOM.saved.pendingVal) DOM.saved.pendingVal.textContent = pendingCount;
    if (DOM.saved.pendingSub) DOM.saved.pendingSub.textContent = t('subInPipeline').replace('{val}', formatCurrency(pendingValue));

    if (DOM.saved.wonVal) DOM.saved.wonVal.textContent = formatCurrency(wonValue);
    if (DOM.saved.wonSub) {
      DOM.saved.wonSub.textContent = (wonCount === 1)
        ? t('subClosedJobSingle')
        : t('subClosedJobs').replace('{n}', wonCount.toString());
    }

    if (DOM.saved.winrateCard) {
      if (decided > 0) {
        DOM.saved.winrateCard.style.display = 'flex';
        if (DOM.saved.winrateVal) DOM.saved.winrateVal.textContent = `${winRate}%`;
        if (DOM.saved.winrateSub) {
          DOM.saved.winrateSub.textContent = t('subDecided')
            .replace('{won}', wonCount.toString())
            .replace('{total}', decided.toString());
        }
      } else {
        DOM.saved.winrateCard.style.display = 'none';
      }
    }

    if (DOM.saved.filterCounts) {
      if (DOM.saved.filterCounts.all) DOM.saved.filterCounts.all.textContent = estimates.length;
      if (DOM.saved.filterCounts.pending) DOM.saved.filterCounts.pending.textContent = pendingCount;
      if (DOM.saved.filterCounts.won) DOM.saved.filterCounts.won.textContent = wonCount;
      if (DOM.saved.filterCounts.lost) DOM.saved.filterCounts.lost.textContent = lostCount;
    }

    updateNavBadge(estimates);
  }

  function renderSavedScreen() {
    const allEstimates = getSavedEstimates();
    allEstimates.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    updatePipelineSummary(allEstimates);

    let filtered = allEstimates;
    if (currentSavedFilter === 'pending') {
      filtered = allEstimates.filter(e => !e.status || e.status === 'pending');
    } else if (currentSavedFilter === 'won') {
      filtered = allEstimates.filter(e => e.status === 'won');
    } else if (currentSavedFilter === 'lost') {
      filtered = allEstimates.filter(e => e.status === 'lost');
    }

    const container = DOM.saved.listContainer;
    const emptyState = DOM.saved.emptyState;
    if (!container || !emptyState) return;

    if (filtered.length === 0) {
      container.style.display = 'none';
      container.innerHTML = '';
      emptyState.style.display = 'block';

      if (allEstimates.length === 0) {
        DOM.saved.emptyTitle.textContent = t('emptySavedTitle');
        DOM.saved.emptyDesc.innerHTML = t('emptySavedDesc');
        if (DOM.saved.createNewBtn) DOM.saved.createNewBtn.style.display = 'inline-flex';
      } else {
        const filterTitle = t('filter' + currentSavedFilter.charAt(0).toUpperCase() + currentSavedFilter.slice(1));
        DOM.saved.emptyTitle.textContent = `No ${filterTitle} Quotes`;
        DOM.saved.emptyDesc.textContent = (currentLanguage === 'es')
          ? `Actualmente no tiene cotizaciones marcadas como ${filterTitle}.`
          : `You don't currently have any estimates marked as ${currentSavedFilter}.`;
        if (DOM.saved.createNewBtn) DOM.saved.createNewBtn.style.display = 'none';
      }
      return;
    }

    emptyState.style.display = 'none';
    container.style.display = 'flex';
    container.innerHTML = '';

    filtered.forEach(quote => {
      const card = document.createElement('article');
      card.className = 'saved-estimate-card';
      card.setAttribute('data-quote-id', quote.quoteId);

      const status = quote.status || 'pending';
      const statusBadgeClass = `badge-${status}`;
      const statusLabel = t('filter' + status.charAt(0).toUpperCase() + status.slice(1)) || status;

      const daysAgo = getDaysSince(quote.createdAt);
      const daysAgoLabel = getDaysSinceLabel(quote.createdAt);
      const isNeedsFollowUp = (status === 'pending' && daysAgo >= 3);

      const servicesSummary = (quote.lineItems && quote.lineItems.length > 0)
        ? quote.lineItems.map(i => {
            if (i.key) {
              const kPascal = i.key.charAt(0).toUpperCase() + i.key.slice(1);
              return t('svcName' + kPascal) || i.name;
            }
            return i.name;
          }).join(', ')
        : (currentLanguage === 'es' ? 'Servicios de jardinería' : 'Lawn services');

      const aerialBadgeHtml = quote.measuredOnMap
        ? `<span class="badge-aerial-tag" title="Yard size measured on aerial map">${t('aerialBadgeTag') || '📷 Aerial'}</span>`
        : '';

      const followUpHtml = isNeedsFollowUp
        ? `<span class="badge badge-followup">⚠️ ${t('followUpBadge').replace('{days}', daysAgo.toString())}</span>`
        : '';

      let statusButtonsHtml = '';
      if (status === 'pending') {
        statusButtonsHtml = `
          <button type="button" class="btn btn-secondary btn-action-won" title="Mark this estimate as Won">${t('btnMarkWon')}</button>
          <button type="button" class="btn btn-outline btn-action-lost" title="Mark this estimate as Lost">${t('btnMarkLost')}</button>
        `;
      } else if (status === 'won') {
        statusButtonsHtml = `
          <button type="button" class="btn btn-outline btn-action-pending" title="Move back to Pending">${t('btnRevert')}</button>
          <button type="button" class="btn btn-outline btn-action-lost" title="Mark as Lost">${t('btnMarkLost')}</button>
        `;
      } else if (status === 'lost') {
        statusButtonsHtml = `
          <button type="button" class="btn btn-secondary btn-action-won" title="Mark as Won">${t('btnMarkWon')}</button>
          <button type="button" class="btn btn-outline btn-action-pending" title="Move back to Pending">${t('btnRevert')}</button>
        `;
      }

      card.innerHTML = `
        <div class="saved-card-header">
          <div class="saved-card-meta">
            <span class="saved-card-id">#${escapeHtml(quote.quoteId)}</span>
            <span>&bull;</span>
            <span>${escapeHtml(quote.dateFormatted || '')}</span>
            <span>&bull;</span>
            <span>${escapeHtml(daysAgoLabel)}</span>
          </div>
          <div class="saved-card-badges">
            ${followUpHtml}
            <span class="badge badge-status ${statusBadgeClass}">${statusLabel}</span>
          </div>
        </div>
        <div class="saved-card-body">
          <div class="saved-cust-info">
            <div class="saved-cust-name">${escapeHtml(quote.custName || 'Unnamed Customer')}</div>
            <div class="saved-cust-address">${escapeHtml(quote.custAddress || 'No address provided')}</div>
            <div class="saved-cust-details">
              <span>${Number(quote.yardSize).toLocaleString()} ${t('unitYardSize')}</span>
              ${aerialBadgeHtml}
              <span>&bull;</span>
              <span>${escapeHtml(servicesSummary)}</span>
            </div>
          </div>
          <div class="saved-total-wrap">
            <div class="saved-total-label">${t('lblTotalEstimate')}</div>
            <div class="saved-total-amount">${formatCurrency(quote.finalTotal)}</div>
          </div>
        </div>
        <div class="saved-card-actions no-print">
          <button type="button" class="btn btn-primary btn-action-reopen">${t('btnReopen')}</button>
          ${statusButtonsHtml}
          <button type="button" class="btn btn-outline btn-action-duplicate">${t('btnDuplicate')}</button>
          <button type="button" class="btn btn-outline btn-action-delete">${t('btnDelete')}</button>
        </div>
      `;

      const reopenBtn = card.querySelector('.btn-action-reopen');
      if (reopenBtn) {
        reopenBtn.addEventListener('click', () => {
          reopenEstimate(quote.quoteId);
        });
      }

      const wonBtn = card.querySelector('.btn-action-won');
      if (wonBtn) {
        wonBtn.addEventListener('click', () => {
          updateEstimateStatus(quote.quoteId, 'won');
        });
      }

      const lostBtn = card.querySelector('.btn-action-lost');
      if (lostBtn) {
        lostBtn.addEventListener('click', () => {
          updateEstimateStatus(quote.quoteId, 'lost');
        });
      }

      const pendingBtn = card.querySelector('.btn-action-pending');
      if (pendingBtn) {
        pendingBtn.addEventListener('click', () => {
          updateEstimateStatus(quote.quoteId, 'pending');
        });
      }

      const duplicateBtn = card.querySelector('.btn-action-duplicate');
      if (duplicateBtn) {
        duplicateBtn.addEventListener('click', () => {
          duplicateEstimate(quote.quoteId);
        });
      }

      const deleteBtn = card.querySelector('.btn-action-delete');
      if (deleteBtn) {
        bindTwoStepConfirm(
          deleteBtn,
          t('deleteConfirmMsg').replace('{id}', quote.quoteId),
          t('btnDelete'),
          () => {
            deleteEstimate(quote.quoteId);
          }
        );
      }

      container.appendChild(card);
    });
  }

  function reopenEstimate(quoteId) {
    const list = getSavedEstimates();
    const found = list.find(e => e.quoteId === quoteId);
    if (!found) return;

    currentQuoteData = JSON.parse(JSON.stringify(found));
    renderQuotePreview(currentQuoteData);
    showScreen('screen-preview');
  }

  function updateEstimateStatus(quoteId, newStatus) {
    const list = getSavedEstimates();
    const found = list.find(e => e.quoteId === quoteId);
    if (!found) return;

    found.status = newStatus;
    saveSavedEstimatesList(list);
    renderSavedScreen();

    const label = newStatus === 'won' ? t('filterWon') : (newStatus === 'lost' ? t('filterLost') : t('filterPending'));
    showSavedToast(t('quoteUpdatedToast').replace('{id}', quoteId));
  }

  function duplicateEstimate(quoteId) {
    const list = getSavedEstimates();
    const source = list.find(e => e.quoteId === quoteId);
    if (!source) return;

    // Populate form with customer info and measurements
    q.custName.value = source.custName || '';
    q.custAddress.value = source.custAddress || '';
    q.yardSize.value = source.yardSize || '';

    // Service selections
    const selections = source.serviceSelections || {};
    q.svcMowing.checked = selections.mowing !== undefined ? selections.mowing : true;
    q.svcEdging.checked = selections.edging !== undefined ? selections.edging : true;
    q.svcLeaf.checked = Boolean(selections.leaf);
    q.svcFertilizer.checked = Boolean(selections.fertilizer);
    q.svcOverseed.checked = Boolean(selections.overseed);

    q.svcMulch.checked = Boolean(selections.mulch);
    toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch);
    q.qtyMulch.value = selections.mulchQty || 2;

    q.svcHedge.checked = Boolean(selections.hedge);
    toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge);
    q.qtyHedge.value = selections.hedgeQty || 1.5;

    // Photos
    attachedPhotos = source.photos ? [...source.photos] : [];
    renderThumbnails();

    const newId = getNextQuoteNumber();
    const today = new Date();
    const valid = new Date();
    valid.setDate(valid.getDate() + 14);

    const newQuote = JSON.parse(JSON.stringify(source));
    newQuote.quoteId = newId;
    newQuote.createdAt = Date.now();
    newQuote.dateFormatted = today.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    newQuote.validThrough = valid.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    newQuote.status = 'pending';

    list.unshift(newQuote);
    saveSavedEstimatesList(list);
    renderSavedScreen();
    showSavedToast(t('quoteDuplicatedToast').replace('{id}', newId));
  }

  function deleteEstimate(quoteId) {
    let list = getSavedEstimates();
    list = list.filter(e => e.quoteId !== quoteId);
    saveSavedEstimatesList(list);
    renderSavedScreen();
    showSavedToast(t('quoteDeletedToast').replace('{id}', quoteId));
  }

  // Save Estimate Action (Screen 3)
  if (DOM.preview.saveBtn) {
    DOM.preview.saveBtn.addEventListener('click', async () => {
      if (!currentQuoteData) return;

      const res = await saveEstimateToStorage(currentQuoteData);
      if (!res.success) {
        showQuotePreviewToast(t('quoteSaveError'));
        return;
      }

      const saveLabel = DOM.preview.saveBtn.querySelector('[data-i18n]') || DOM.preview.saveBtn;
      const originalText = saveLabel.textContent;
      saveLabel.textContent = t('btnSavedCheck') || 'Saved!';
      setTimeout(() => {
        saveLabel.textContent = t('btnUpdateEstimate') || 'Update Estimate';
      }, 2000);

      if (res.strippedPhotos) {
        showQuotePreviewToast(t('quoteSavedNoPhotos').replace('{id}', currentQuoteData.quoteId));
      } else {
        showQuotePreviewToast(t('quoteSavedToast').replace('{id}', currentQuoteData.quoteId));
      }

      updateNavBadge();
      renderSavedScreen();
    });
  }

  // Filter Pills Event Listeners (Screen 4)
  if (DOM.saved.filterBtns) {
    DOM.saved.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.saved.filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentSavedFilter = btn.getAttribute('data-filter') || 'all';
        renderSavedScreen();
      });
    });
  }

  // Create First Quote Action in Empty State (Screen 4)
  if (DOM.saved.createNewBtn) {
    DOM.saved.createNewBtn.addEventListener('click', () => {
      showScreen('screen-newquote');
    });
  }

  // ---------------------------------------------------------------------------
  // 12. Measure on Map Satellite Tool (Leaflet + Turf.js + Nominatim)
  // ---------------------------------------------------------------------------
  let leafletMap = null;
  let mapTileLayer = null;
  let isMapInitialized = false;
  let completedAreas = [];       // Array of arrays of { lat, lng }
  let currentAreaPoints = [];    // Current polygon vertices
  let drawnLayersGroup = null;   // L.featureGroup for rendered shapes
  let totalTracedSqFt = 0;

  function calculateSphericalPolygonArea(coords) {
    if (coords.length < 4) return 0;
    try {
      if (typeof turf !== 'undefined' && turf.polygon && turf.area) {
        const poly = turf.polygon([coords]);
        const sqMeters = turf.area(poly);
        return Math.round(sqMeters * 10.7639104);
      }
    } catch (e) {
      console.warn('Turf.js calculation error, using spherical planar fallback:', e);
    }

    // Geodesic / spherical fallback
    let area = 0;
    const n = coords.length - 1;
    const d2r = Math.PI / 180.0;
    for (let i = 0; i < n; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      area += (p2[0] - p1[0]) * d2r * (2 + Math.sin(p1[1] * d2r) + Math.sin(p2[1] * d2r));
    }
    area = area * 6378137.0 * 6378137.0 / 2.0;
    const sqM = Math.abs(area);
    return Math.round(sqM * 10.7639104);
  }

  function redrawMapPolygons() {
    if (!drawnLayersGroup) return;
    drawnLayersGroup.clearLayers();

    totalTracedSqFt = 0;
    let completedSqFt = 0;

    // 1. Draw completed areas (Green with solid boundary)
    completedAreas.forEach((pts, idx) => {
      if (pts.length >= 3) {
        const ring = pts.map(p => [p.lng, p.lat]);
        ring.push([pts[0].lng, pts[0].lat]);
        const areaSqFt = calculateSphericalPolygonArea(ring);
        completedSqFt += areaSqFt;

        const poly = L.polygon(pts, {
          color: '#10B981',
          weight: 2.5,
          fillColor: '#10B981',
          fillOpacity: 0.35
        });
        poly.bindTooltip(`Area ${idx + 1}: ${areaSqFt.toLocaleString()} sq ft`, {
          permanent: false,
          direction: 'center',
          className: 'map-polygon-tooltip'
        });
        drawnLayersGroup.addLayer(poly);
      }
    });

    // 2. Draw current in-progress area (Amber / Mint with active vertices)
    if (currentAreaPoints.length > 0) {
      currentAreaPoints.forEach((pt, idx) => {
        const marker = L.circleMarker([pt.lat, pt.lng], {
          radius: 6,
          color: '#FFFFFF',
          weight: 2,
          fillColor: (idx === 0) ? '#F59E0B' : '#10B981',
          fillOpacity: 1
        });
        drawnLayersGroup.addLayer(marker);
      });

      if (currentAreaPoints.length >= 2) {
        const polyline = L.polyline(currentAreaPoints, {
          color: '#F59E0B',
          weight: 2.5,
          dashArray: '6, 6'
        });
        drawnLayersGroup.addLayer(polyline);
      }

      if (currentAreaPoints.length >= 3) {
        const activeRing = currentAreaPoints.map(p => [p.lng, p.lat]);
        activeRing.push([currentAreaPoints[0].lng, currentAreaPoints[0].lat]);
        const activeAreaSqFt = calculateSphericalPolygonArea(activeRing);

        const activePoly = L.polygon(currentAreaPoints, {
          color: '#F59E0B',
          weight: 2,
          fillColor: '#F59E0B',
          fillOpacity: 0.2
        });
        drawnLayersGroup.addLayer(activePoly);
        totalTracedSqFt = completedSqFt + activeAreaSqFt;
      } else {
        totalTracedSqFt = completedSqFt;
      }
    } else {
      totalTracedSqFt = completedSqFt;
    }

    DOM.map.areaDisplay.textContent = `${totalTracedSqFt.toLocaleString()} ${t('unitYardSize')}`;
    const numAreas = completedAreas.length + (currentAreaPoints.length >= 3 ? 1 : 0);
    DOM.map.areaBreakdown.textContent = t('mapAreaBreakdown').replace('{n}', numAreas.toString());

    DOM.map.btnUseArea.disabled = (totalTracedSqFt <= 0);
  }

  function initMap() {
    if (isMapInitialized && leafletMap) return;

    if (typeof L === 'undefined') {
      DOM.map.offlineBanner.style.display = 'block';
      return;
    }

    try {
      leafletMap = L.map('map-canvas', {
        center: [32.7767, -96.7970],
        zoom: 18,
        maxZoom: 20,
        zoomControl: true
      });

      mapTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri, USGS, Maxar',
        maxNativeZoom: 19,
        maxZoom: 20
      }).addTo(leafletMap);

      mapTileLayer.on('tileerror', () => {
        DOM.map.offlineBanner.style.display = 'block';
      });

      drawnLayersGroup = L.featureGroup().addTo(leafletMap);

      leafletMap.on('click', (e) => {
        currentAreaPoints.push({ lat: e.latlng.lat, lng: e.latlng.lng });
        redrawMapPolygons();
      });

      isMapInitialized = true;
    } catch (e) {
      console.error('Failed to initialize Leaflet satellite map:', e);
      DOM.map.offlineBanner.style.display = 'block';
    }
  }

  function geocodeAddressWithNominatim(addressQuery) {
    if (!addressQuery || !addressQuery.trim()) return;

    DOM.map.searchStatus.style.display = 'block';
    DOM.map.searchStatus.textContent = (currentLanguage === 'es') ? 'Buscando dirección...' : 'Searching address...';
    DOM.map.searchStatus.className = 'map-status-banner';

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`;

    fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (leafletMap) {
            leafletMap.setView([lat, lon], 19);
            DOM.map.searchStatus.textContent = (currentLanguage === 'es')
              ? `✓ Propiedad encontrada: ${data[0].display_name.split(',')[0]}`
              : `✓ Found: ${data[0].display_name.split(',')[0]}`;
            DOM.map.searchStatus.className = 'map-status-banner map-status-success';
            setTimeout(() => {
              DOM.map.searchStatus.style.display = 'none';
            }, 3500);
          }
        } else {
          DOM.map.searchStatus.textContent = (currentLanguage === 'es')
            ? 'Dirección no encontrada. Puede hacer zoom y desplazarse manualmente.'
            : 'Address not found. You can pan and zoom manually.';
          DOM.map.searchStatus.className = 'map-status-banner map-status-warning';
        }
      })
      .catch(err => {
        console.warn('Geocoding error:', err);
        DOM.map.searchStatus.textContent = (currentLanguage === 'es')
          ? 'Búsqueda no disponible sin conexión. Puede hacer zoom y desplazarse manualmente.'
          : 'Geocoding offline. You can pan and zoom manually.';
        DOM.map.searchStatus.className = 'map-status-banner map-status-warning';
      });
  }

  // Measure Map Modal Events
  DOM.map.btnOpen.addEventListener('click', () => {
    DOM.map.modal.style.display = 'flex';
    initMap();

    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 200);

    const addr = DOM.newQuote.custAddress.value.trim();
    if (addr) {
      DOM.map.searchInput.value = addr;
      geocodeAddressWithNominatim(addr);
    }
  });

  DOM.map.btnClose.addEventListener('click', () => {
    DOM.map.modal.style.display = 'none';
  });

  DOM.map.btnOfflineDismiss.addEventListener('click', () => {
    DOM.map.modal.style.display = 'none';
    DOM.newQuote.yardSize.focus();
  });

  DOM.map.btnSearch.addEventListener('click', () => {
    const qStr = DOM.map.searchInput.value.trim();
    if (qStr) {
      geocodeAddressWithNominatim(qStr);
    }
  });

  DOM.map.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      DOM.map.btnSearch.click();
    }
  });

  DOM.map.btnUndo.addEventListener('click', () => {
    if (currentAreaPoints.length > 0) {
      currentAreaPoints.pop();
      redrawMapPolygons();
    } else if (completedAreas.length > 0) {
      currentAreaPoints = completedAreas.pop();
      redrawMapPolygons();
    }
  });

  DOM.map.btnNewArea.addEventListener('click', () => {
    if (currentAreaPoints.length >= 3) {
      completedAreas.push([...currentAreaPoints]);
      currentAreaPoints = [];
      redrawMapPolygons();
    }
  });

  DOM.map.btnClear.addEventListener('click', () => {
    completedAreas = [];
    currentAreaPoints = [];
    redrawMapPolygons();
  });

  DOM.map.btnUseArea.addEventListener('click', () => {
    if (totalTracedSqFt > 0) {
      lastMeasuredMapSqFt = totalTracedSqFt;
      yardMeasuredOnMap = true;
      DOM.newQuote.yardSize.value = totalTracedSqFt;
      DOM.newQuote.yardSize.dispatchEvent(new Event('input', { bubbles: true }));
      DOM.map.modal.style.display = 'none';

      const note = document.getElementById('aerial-measure-note');
      if (note) {
        note.style.display = 'block';
        note.textContent = t('aerialMeasureNote');
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 13. Initialization
  // ---------------------------------------------------------------------------
  loadSettings();
  loadLanguage();
  updateNavBadge();
  showScreen('screen-newquote');
  updateLiveRunningTotal();

})();
