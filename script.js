/**
 * LawnQuote - Instant Field Quoting Tool for Lawn Care & Landscaping Crews
 * GitHub Pages Compatible · Zero Dependencies · LocalStorage Persistence
 * English & Spanish Localization · Saved Quotes Pipeline
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Translations Dictionary (English & Spanish)
  // ---------------------------------------------------------------------------
  const TRANSLATIONS = {
    en: {
      appTitle: 'LawnQuote',
      appSubtitle: 'Field Quoting for Lawn & Landscaping Crews',
      navPriceSheet: 'Price Sheet',
      navNewQuote: 'New Quote',
      navPreview: 'Quote Preview',
      navSavedQuotes: 'Saved Quotes',

      // Price Sheet
      priceSheetTitle: 'Business Price Sheet & Settings',
      priceSheetDesc: "Set your crew's rates and business details. Everything is saved locally on your phone.",
      bizInfoTitle: '🏢 Business Information',
      lblBizName: 'Business Name',
      placeholderBizName: 'e.g. GreenThumb Lawn & Landscape',
      lblPhone: 'Phone Number',
      placeholderPhone: '(555) 234-5678',
      lblEmail: 'Email Address',
      placeholderEmail: 'quotes@greenthumb-example.com',
      minChargeTitle: '📋 Minimum Charge & Terms',
      lblMinCharge: 'Minimum Job Charge ($)',
      hintMinCharge: 'No job is billed below this floor',
      lblTerms: 'Quote Terms & Conditions',
      placeholderTerms: 'e.g. Estimates valid for 14 days. Payment due upon completion.',
      ratesTitle: '💵 Service Rates',
      lblRateMowing: 'Mowing Rate ($ per 1,000 sq ft)',
      lblRateEdging: 'Edging Rate ($ per 1,000 sq ft)',
      lblRateLeaf: 'Leaf Cleanup Rate ($ per 1,000 sq ft)',
      lblRateMulch: 'Mulch Rate ($ per cubic yard delivered & spread)',
      lblRateHedge: 'Hedge Trimming Rate ($ per crew hour)',
      btnSaveSettings: '💾 Save Settings',
      btnResetSettings: '↺ Reset to Realistic Defaults',
      toastSettingsSaved: 'Settings saved successfully!',
      toastSettingsReset: 'Settings reset to realistic defaults!',

      // New Quote
      newQuoteTitle: 'Create New Quote',
      newQuoteDesc: 'Price out a job in under a minute right from the curb.',
      btnFillFake: '⚡ Fill Fake Sample',
      custInfoTitle: '👤 Customer Information',
      lblCustName: 'Customer Name *',
      placeholderCustName: 'e.g. Jane Doe (Sample Customer)',
      lblCustAddress: 'Property / Service Address *',
      placeholderCustAddress: 'e.g. 123 Maple Street, Sampleville, TX 75001',
      lblYardSize: 'Lawn / Yard Size (sq ft) *',
      hintYardSize: '1/4 acre ≈ 10,890 sq ft · Typical yard ≈ 4,000–7,000 sq ft',
      unitYardSize: 'sq ft',
      servicesTitle: '🛠️ Services to Include',
      servicesDesc: 'Select services for this quote. Rates apply automatically from your Price Sheet.',
      svcNameMowing: 'Mowing',
      svcNameEdging: 'Edging',
      svcNameLeaf: 'Leaf Cleanup',
      svcNameMulch: 'Mulch Delivery & Install',
      svcNameHedge: 'Hedge Trimming',
      lblMulchQty: 'Quantity (Cubic Yards):',
      unitMulch: 'cu yds',
      lblHedgeQty: 'Estimated Crew Labor (Hours):',
      unitHedge: 'hours',
      svcError: 'Please select at least one service.',
      photosTitle: '📸 Job Site Photos (Optional)',
      photosDesc: 'Take or select photos from your phone. Thumbnails will appear below and can be attached to the quote preview.',
      btnSnapPhoto: '📷 Snap Photo or Upload Files',
      btnGenerateQuote: 'Generate Quote Preview →',

      // Quote Preview
      btnSaveQuote: 'Save Quote',
      btnUpdateQuote: 'Update Quote',
      btnPrint: 'Print / Save as PDF',
      btnEdit: 'Edit Quote',
      btnStartFresh: 'Start Fresh',
      badgeServiceQuote: 'SERVICE QUOTE',
      lblQuoteDate: 'Quote Date:',
      lblQuoteRef: 'Quote Ref:',
      lblPreparedFor: 'PREPARED FOR:',
      lblServiceScope: 'SERVICE SCOPE:',
      lblMeasuredYardSize: 'Measured Yard Size:',
      thService: 'Service Description',
      thQty: 'Quantity / Scope',
      thRate: 'Unit Rate',
      thTotal: 'Amount',
      lblSubtotal: 'Subtotal:',
      lblMinChargeAdj: 'Minimum Job Charge Adjustment:',
      hintFloorOf: 'Floor of $',
      hintApplied: 'applied',
      lblRoundingAdj: 'Nearest $5 Rounding Adjustment:',
      lblFinalTotal: 'Total Quote:',
      termsTitle: 'Quote Terms & Conditions',
      photosPreviewTitle: 'Job Site Property Photos',
      thankYou: 'Thank you for considering our lawn care & landscaping crew!',
      sigAcceptance: 'Customer Acceptance Signature',
      sigDate: 'Date',

      // Saved Quotes Screen
      savedQuotesTitle: 'Saved Quotes Pipeline',
      savedQuotesDesc: 'Track and follow up on customer quotes to win more jobs.',
      statPending: 'Pending',
      statWon: 'Won',
      statWinRate: 'Win Rate',
      filterAll: 'All',
      filterPending: 'Pending',
      filterWon: 'Won',
      filterLost: 'Lost',
      emptyTitle: 'No Saved Quotes Yet',
      emptyDesc: 'Create your first quote and tap Save Quote to build your pipeline.',
      btnEmptyNew: 'Create New Quote',
      followUpBadge: 'Follow up',
      btnMarkWon: 'Mark Won',
      btnMarkLost: 'Mark Lost',
      btnRevert: 'Revert to Pending',
      btnDuplicate: 'Duplicate',
      btnDelete: 'Delete',
      deleteConfirmMsg: 'Delete quote {id}? This cannot be undone.',
      btnConfirmDelete: 'Yes, Delete',
      btnCancelDelete: 'Cancel',

      // Notifications & Time
      timeToday: 'Today',
      timeYesterday: '1 day ago',
      timeDaysAgo: '{n} days ago',
      quoteSavedToast: 'Quote {id} saved',
      quoteUpdatedToast: 'Quote {id} updated',
      quoteSavedNoPhotos: 'Quote {id} saved without photos due to storage limit',
      quoteSaveError: 'Unable to save quote to local storage',
      quoteDuplicatedToast: 'Duplicated as {id} with today’s date. Ready to review.',
      confirmStartFresh: 'Start a fresh new quote?',
      confirmResetSettings: 'Reset all prices and settings to realistic default sample rates?'
    },
    es: {
      appTitle: 'LawnQuote',
      appSubtitle: 'Cotizaciones de Campo para Equipos de Jardinería',
      navPriceSheet: 'Tarifas',
      navNewQuote: 'Nueva Cotización',
      navPreview: 'Vista Previa',
      navSavedQuotes: 'Cotizaciones Guardadas',

      // Price Sheet
      priceSheetTitle: 'Tarifas y Configuración del Negocio',
      priceSheetDesc: 'Configure las tarifas y datos de su equipo. Todo se guarda localmente en su teléfono.',
      bizInfoTitle: '🏢 Información de la Empresa',
      lblBizName: 'Nombre de la Empresa',
      placeholderBizName: 'ej. GreenThumb Jardinería y Mantenimiento',
      lblPhone: 'Teléfono',
      placeholderPhone: '(555) 234-5678',
      lblEmail: 'Correo Electrónico',
      placeholderEmail: 'cotizaciones@greenthumb-ejemplo.com',
      minChargeTitle: '📋 Cargo Mínimo y Términos',
      lblMinCharge: 'Cargo Mínimo por Trabajo ($)',
      hintMinCharge: 'Ningún trabajo se factura por debajo de este monto',
      lblTerms: 'Términos y Condiciones de la Cotización',
      placeholderTerms: 'ej. Estimaciones válidas por 14 días. Pago al finalizar los servicios.',
      ratesTitle: '💵 Tarifas de Servicios',
      lblRateMowing: 'Tarifa de Corte ($ por 1,000 pies²)',
      lblRateEdging: 'Tarifa de Bordeado ($ por 1,000 pies²)',
      lblRateLeaf: 'Tarifa de Limpieza de Hojas ($ por 1,000 pies²)',
      lblRateMulch: 'Tarifa de Mantillo ($ por yarda cúbica entregada e instalada)',
      lblRateHedge: 'Tarifa de Poda de Setos ($ por hora de cuadrilla)',
      btnSaveSettings: '💾 Guardar Configuración',
      btnResetSettings: '↺ Restablecer Valores Predeterminados',
      toastSettingsSaved: '¡Configuración guardada exitosamente!',
      toastSettingsReset: '¡Configuración restablecida a valores predeterminados!',

      // New Quote
      newQuoteTitle: 'Crear Nueva Cotización',
      newQuoteDesc: 'Cotice un trabajo en menos de un minuto desde el vehículo.',
      btnFillFake: '⚡ Llenar Datos de Prueba',
      custInfoTitle: '👤 Información del Cliente',
      lblCustName: 'Nombre del Cliente *',
      placeholderCustName: 'ej. Juana Pérez (Cliente de Prueba)',
      lblCustAddress: 'Dirección de la Propiedad *',
      placeholderCustAddress: 'ej. 123 Calle Roble, Springfield, TX 75001',
      lblYardSize: 'Tamaño del Césped (pies²) *',
      hintYardSize: '1/4 acre ≈ 10,890 pies² · Césped típico ≈ 4,000–7,000 pies²',
      unitYardSize: 'pies²',
      servicesTitle: '🛠️ Servicios a Incluir',
      servicesDesc: 'Seleccione los servicios. Las tarifas se aplican automáticamente desde su lista de precios.',
      svcNameMowing: 'Corte de Césped',
      svcNameEdging: 'Bordeado',
      svcNameLeaf: 'Limpieza de Hojas',
      svcNameMulch: 'Entrega e Instalación de Mantillo',
      svcNameHedge: 'Poda de Setos',
      lblMulchQty: 'Cantidad (Yardas Cúbicas):',
      unitMulch: 'yd³',
      lblHedgeQty: 'Mano de Obra Estimada (Horas):',
      unitHedge: 'horas',
      svcError: 'Por favor seleccione al menos un servicio.',
      photosTitle: '📸 Fotos del Lugar de Trabajo (Opcional)',
      photosDesc: 'Tome o seleccione fotos desde su teléfono. Las miniaturas se adjuntarán a la cotización.',
      btnSnapPhoto: '📷 Tomar Foto o Subir Archivos',
      btnGenerateQuote: 'Generar Vista Previa →',

      // Quote Preview
      btnSaveQuote: 'Guardar Cotización',
      btnUpdateQuote: 'Actualizar Cotización',
      btnPrint: 'Imprimir / Guardar PDF',
      btnEdit: 'Editar Cotización',
      btnStartFresh: 'Comenzar de Nuevo',
      badgeServiceQuote: 'COTIZACIÓN DE SERVICIOS',
      lblQuoteDate: 'Fecha:',
      lblQuoteRef: 'Ref. de Cotización:',
      lblPreparedFor: 'PREPARADO PARA:',
      lblServiceScope: 'ALCANCE DEL SERVICIO:',
      lblMeasuredYardSize: 'Área Medida del Césped:',
      thService: 'Descripción del Servicio',
      thQty: 'Cantidad / Alcance',
      thRate: 'Tarifa Unitaria',
      thTotal: 'Total',
      lblSubtotal: 'Subtotal:',
      lblMinChargeAdj: 'Ajuste por Cargo Mínimo:',
      hintFloorOf: 'Mínimo de $',
      hintApplied: 'aplicado',
      lblRoundingAdj: 'Ajuste por Redondeo al $5 Más Cercano:',
      lblFinalTotal: 'Cotización Total:',
      termsTitle: 'Términos y Condiciones de la Cotización',
      photosPreviewTitle: 'Fotos del Lugar de Trabajo',
      thankYou: '¡Gracias por considerar a nuestro equipo de jardinería y mantenimiento de césped!',
      sigAcceptance: 'Firma de Aceptación del Cliente',
      sigDate: 'Fecha',

      // Saved Quotes Screen
      savedQuotesTitle: 'Cotizaciones Guardadas',
      savedQuotesDesc: 'Dé seguimiento a las cotizaciones para ganar más trabajos.',
      statPending: 'Pendientes',
      statWon: 'Ganadas',
      statWinRate: 'Tasa de Éxito',
      filterAll: 'Todas',
      filterPending: 'Pendientes',
      filterWon: 'Ganadas',
      filterLost: 'Perdidas',
      emptyTitle: 'No Hay Cotizaciones Guardadas',
      emptyDesc: 'Cree su primera cotización y presione Guardar Cotización para comenzar su flujo de trabajo.',
      btnEmptyNew: 'Crear Nueva Cotización',
      followUpBadge: 'Dar seguimiento',
      btnMarkWon: 'Marcar Ganada',
      btnMarkLost: 'Marcar Perdida',
      btnRevert: 'Volver a Pendiente',
      btnDuplicate: 'Duplicar',
      btnDelete: 'Eliminar',
      deleteConfirmMsg: '¿Eliminar la cotización {id}? Esta acción no se puede deshacer.',
      btnConfirmDelete: 'Sí, Eliminar',
      btnCancelDelete: 'Cancelar',

      // Notifications & Time
      timeToday: 'Hoy',
      timeYesterday: 'Hace 1 día',
      timeDaysAgo: 'Hace {n} días',
      quoteSavedToast: 'Cotización {id} guardada',
      quoteUpdatedToast: 'Cotización {id} actualizada',
      quoteSavedNoPhotos: 'Cotización {id} guardada sin fotos por límite de almacenamiento',
      quoteSaveError: 'No se pudo guardar la cotización en el almacenamiento local',
      quoteDuplicatedToast: 'Duplicada como {id} con fecha de hoy. Lista para revisar.',
      confirmStartFresh: '¿Comenzar una nueva cotización en blanco?',
      confirmResetSettings: '¿Restablecer todas las tarifas y configuraciones a valores predeterminados?'
    }
  };

  // ---------------------------------------------------------------------------
  // Default Settings & Realistic Baseline Rates
  // ---------------------------------------------------------------------------
  const DEFAULT_SETTINGS = {
    businessName: 'GreenThumb Lawn & Landscape',
    phone: '(555) 234-5678',
    email: 'quotes@greenthumb-example.com',
    minJobCharge: 50.0,
    quoteTerms: 'Estimates valid for 14 days. Payment due upon completion of services.',
    rates: {
      mowing: 12.0,      // per 1,000 sq ft
      edging: 4.0,       // per 1,000 sq ft
      leaf: 8.0,         // per 1,000 sq ft
      mulch: 85.0,       // per cubic yard
      hedge: 55.0        // per crew hour
    }
  };

  // Storage Keys
  const STORAGE_KEY = 'lawnquote_crew_settings_v1';
  const SAVED_QUOTES_KEY = 'lawnquote_saved_quotes_v1';
  const LANG_STORAGE_KEY = 'lawnquote_language_v1';
  const COUNTER_STORAGE_KEY = 'lawnquote_quote_counter_v1';

  // State
  let currentSettings = null;
  let currentLanguage = 'en';
  let attachedPhotos = []; // Array of base64 data URLs
  let currentQuoteData = null;
  let pendingDuplicatedQuoteId = null;
  let savedQuotes = [];
  let activeFilter = 'all';

  // DOM Elements - Language & Navigation
  const btnLangEn = document.getElementById('btn-lang-en');
  const btnLangEs = document.getElementById('btn-lang-es');
  const navTabs = document.querySelectorAll('.tab-btn');
  const navSavedCount = document.getElementById('nav-saved-count');
  const screens = {
    'screen-pricesheet': document.getElementById('screen-pricesheet'),
    'screen-newquote': document.getElementById('screen-newquote'),
    'screen-preview': document.getElementById('screen-preview'),
    'screen-savedquotes': document.getElementById('screen-savedquotes')
  };

  // DOM Elements - Screen 1: Price Sheet
  const priceSheetForm = document.getElementById('price-sheet-form');
  const inputBizName = document.getElementById('setting-business-name');
  const inputBizPhone = document.getElementById('setting-phone');
  const inputBizEmail = document.getElementById('setting-email');
  const inputMinCharge = document.getElementById('setting-min-charge');
  const inputTerms = document.getElementById('setting-terms');
  const inputRateMowing = document.getElementById('setting-rate-mowing');
  const inputRateEdging = document.getElementById('setting-rate-edging');
  const inputRateLeaf = document.getElementById('setting-rate-leaf');
  const inputRateMulch = document.getElementById('setting-rate-mulch');
  const inputRateHedge = document.getElementById('setting-rate-hedge');
  const btnResetSettings = document.getElementById('btn-reset-settings');
  const settingsToast = document.getElementById('settings-toast');

  // DOM Elements - Screen 2: New Quote Form
  const newQuoteForm = document.getElementById('new-quote-form');
  const btnFillFake = document.getElementById('btn-fill-fake');
  const inputCustName = document.getElementById('quote-cust-name');
  const inputCustAddress = document.getElementById('quote-cust-address');
  const inputYardSize = document.getElementById('quote-yard-size');
  const unitYardSize = document.getElementById('unit-yard-size');
  
  const svcMowing = document.getElementById('svc-mowing');
  const svcEdging = document.getElementById('svc-edging');
  const svcLeaf = document.getElementById('svc-leaf');
  const svcMulch = document.getElementById('svc-mulch');
  const svcHedge = document.getElementById('svc-hedge');

  const mulchQtyContainer = document.getElementById('mulch-qty-container');
  const hedgeQtyContainer = document.getElementById('hedge-qty-container');
  const inputQtyMulch = document.getElementById('qty-mulch');
  const inputQtyHedge = document.getElementById('qty-hedge');
  const unitMulch = document.getElementById('unit-mulch');
  const unitHedge = document.getElementById('unit-hedge');
  const svcError = document.getElementById('svc-error');

  const photoInput = document.getElementById('photo-input');
  const photoThumbnails = document.getElementById('photo-thumbnails');
  const newQuoteToast = document.getElementById('new-quote-toast');

  function showNewQuoteToast(message, type = 'success') {
    if (!newQuoteToast) return;
    newQuoteToast.textContent = message;
    newQuoteToast.className = `toast toast-save ${type === 'error' ? 'toast-error' : (type === 'warning' ? 'toast-warning' : '')}`;
    newQuoteToast.style.display = 'block';
    setTimeout(() => {
      newQuoteToast.style.display = 'none';
    }, 3200);
  }

  // Service Rate Badges in Screen 2
  const badgeMowing = document.getElementById('badge-rate-mowing');
  const badgeEdging = document.getElementById('badge-rate-edging');
  const badgeLeaf = document.getElementById('badge-rate-leaf');
  const badgeMulch = document.getElementById('badge-rate-mulch');
  const badgeHedge = document.getElementById('badge-rate-hedge');

  // DOM Elements - Screen 3: Quote Preview
  const btnSaveQuote = document.getElementById('btn-save-quote');
  const btnPrint = document.getElementById('btn-print');
  const btnEditQuote = document.getElementById('btn-edit-quote');
  const btnNewQuote = document.getElementById('btn-new-quote');
  const quoteSaveToast = document.getElementById('quote-save-toast');

  const viewBizName = document.getElementById('view-biz-name');
  const viewBizPhone = document.getElementById('view-biz-phone');
  const viewBizEmail = document.getElementById('view-biz-email');
  const viewQuoteDate = document.getElementById('view-quote-date');
  const viewQuoteId = document.getElementById('view-quote-id');
  const viewCustName = document.getElementById('view-cust-name');
  const viewCustAddress = document.getElementById('view-cust-address');
  const viewYardSize = document.getElementById('view-yard-size');
  const quoteLineItems = document.getElementById('quote-line-items');
  const viewQuoteTerms = document.getElementById('view-quote-terms');
  const viewSubtotal = document.getElementById('view-subtotal');
  const rowMinCharge = document.getElementById('row-min-charge');
  const viewMinChargeFloor = document.getElementById('view-min-charge-floor');
  const viewMinChargeAdj = document.getElementById('view-min-charge-adj');
  const viewRoundingAdj = document.getElementById('view-rounding-adj');
  const viewFinalTotal = document.getElementById('view-final-total');
  const quotePreviewPhotos = document.getElementById('quote-preview-photos');
  const quotePhotosGallery = document.getElementById('quote-photos-gallery');

  // DOM Elements - Screen 4: Saved Quotes Pipeline
  const statPendingVal = document.getElementById('stat-pending-val');
  const statWonVal = document.getElementById('stat-won-val');
  const cardWinRate = document.getElementById('card-win-rate');
  const statWinRateVal = document.getElementById('stat-win-rate-val');

  const filterButtons = document.querySelectorAll('.pipeline-filters .filter-btn');
  const filterCountAll = document.getElementById('filter-count-all');
  const filterCountPending = document.getElementById('filter-count-pending');
  const filterCountWon = document.getElementById('filter-count-won');
  const filterCountLost = document.getElementById('filter-count-lost');

  const savedQuotesList = document.getElementById('saved-quotes-list');
  const savedQuotesEmpty = document.getElementById('saved-quotes-empty');
  const btnEmptyNewQuote = document.getElementById('btn-empty-new-quote');

  // ---------------------------------------------------------------------------
  // Translation Helpers
  // ---------------------------------------------------------------------------
  function t(key) {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] || key);
  }

  function setLanguage(lang) {
    currentLanguage = (lang === 'es') ? 'es' : 'en';
    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLanguage);
    } catch (e) {
      console.warn('Could not persist language choice:', e);
    }

    document.documentElement.lang = currentLanguage;

    // Update Language Toggle Buttons
    if (btnLangEn && btnLangEs) {
      btnLangEn.classList.toggle('active', currentLanguage === 'en');
      btnLangEs.classList.toggle('active', currentLanguage === 'es');
    }

    // Update all static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) {
        el.textContent = val;
      }
    });

    // Update placeholders
    inputBizName.placeholder = t('placeholderBizName');
    inputBizPhone.placeholder = t('placeholderPhone');
    inputBizEmail.placeholder = t('placeholderEmail');
    inputTerms.placeholder = t('placeholderTerms');
    inputCustName.placeholder = t('placeholderCustName');
    inputCustAddress.placeholder = t('placeholderCustAddress');

    // Units
    if (unitYardSize) unitYardSize.textContent = t('unitYardSize');
    if (unitMulch) unitMulch.textContent = t('unitMulch');
    if (unitHedge) unitHedge.textContent = t('unitHedge');

    // Update Rate Badges on Screen 2
    updateScreen2RateBadges();

    // Re-render Quote Preview if currently active
    if (currentQuoteData) {
      renderQuotePreview(currentQuoteData);
    }

    // Re-render Saved Quotes Pipeline
    renderSavedQuotesPipeline();
  }

  function loadLanguage() {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        currentLanguage = stored;
      }
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    setLanguage(currentLanguage);
  }

  if (btnLangEn) {
    btnLangEn.addEventListener('click', () => setLanguage('en'));
  }
  if (btnLangEs) {
    btnLangEs.addEventListener('click', () => setLanguage('es'));
  }

  // ---------------------------------------------------------------------------
  // Navigation & Screen Switching
  // ---------------------------------------------------------------------------
  function showScreen(screenId) {
    Object.keys(screens).forEach(id => {
      if (screens[id]) {
        screens[id].style.display = (id === screenId) ? 'block' : 'none';
      }
    });

    navTabs.forEach(btn => {
      const isTarget = btn.getAttribute('data-target') === screenId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    if (screenId === 'screen-savedquotes') {
      renderSavedQuotesPipeline();
    }

    // Scroll smoothly to top on tab switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      showScreen(target);
    });
  });

  if (btnEmptyNewQuote) {
    btnEmptyNewQuote.addEventListener('click', () => {
      showScreen('screen-newquote');
    });
  }

  // ---------------------------------------------------------------------------
  // Settings Management (Screen 1 & LocalStorage)
  // ---------------------------------------------------------------------------
  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        currentSettings = JSON.parse(stored);
      } else {
        currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        saveSettingsToStorage();
      }
    } catch (err) {
      console.warn('Could not read settings from localStorage, loading defaults:', err);
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    populateSettingsForm();
    updateScreen2RateBadges();
  }

  function saveSettingsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    } catch (err) {
      console.error('Failed to write settings to localStorage:', err);
    }
  }

  function populateSettingsForm() {
    inputBizName.value = currentSettings.businessName || '';
    inputBizPhone.value = currentSettings.phone || '';
    inputBizEmail.value = currentSettings.email || '';
    inputMinCharge.value = currentSettings.minJobCharge;
    inputTerms.value = currentSettings.quoteTerms || '';

    inputRateMowing.value = currentSettings.rates.mowing;
    inputRateEdging.value = currentSettings.rates.edging;
    inputRateLeaf.value = currentSettings.rates.leaf;
    inputRateMulch.value = currentSettings.rates.mulch;
    inputRateHedge.value = currentSettings.rates.hedge;
  }

  function updateScreen2RateBadges() {
    if (!currentSettings || !currentSettings.rates) return;
    const per1k = currentLanguage === 'es' ? '1k pies²' : '1k sq ft';
    const perCuYd = currentLanguage === 'es' ? 'yd³' : 'cu yd';
    const perHr = currentLanguage === 'es' ? 'hora' : 'hr';

    badgeMowing.textContent = `$${Number(currentSettings.rates.mowing).toFixed(2)} / ${per1k}`;
    badgeEdging.textContent = `$${Number(currentSettings.rates.edging).toFixed(2)} / ${per1k}`;
    badgeLeaf.textContent = `$${Number(currentSettings.rates.leaf).toFixed(2)} / ${per1k}`;
    badgeMulch.textContent = `$${Number(currentSettings.rates.mulch).toFixed(2)} / ${perCuYd}`;
    badgeHedge.textContent = `$${Number(currentSettings.rates.hedge).toFixed(2)} / ${perHr}`;
  }

  priceSheetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    currentSettings = {
      businessName: inputBizName.value.trim() || 'My Lawn Care Crew',
      phone: inputBizPhone.value.trim(),
      email: inputBizEmail.value.trim(),
      minJobCharge: Math.max(0, parseFloat(inputMinCharge.value) || 0),
      quoteTerms: inputTerms.value.trim(),
      rates: {
        mowing: Math.max(0, parseFloat(inputRateMowing.value) || 0),
        edging: Math.max(0, parseFloat(inputRateEdging.value) || 0),
        leaf: Math.max(0, parseFloat(inputRateLeaf.value) || 0),
        mulch: Math.max(0, parseFloat(inputRateMulch.value) || 0),
        hedge: Math.max(0, parseFloat(inputRateHedge.value) || 0)
      }
    };

    saveSettingsToStorage();
    updateScreen2RateBadges();

    // Show toast
    settingsToast.textContent = t('toastSettingsSaved');
    settingsToast.style.display = 'block';
    setTimeout(() => {
      settingsToast.style.display = 'none';
    }, 2500);
  });

  btnResetSettings.addEventListener('click', () => {
    if (confirm(t('confirmResetSettings'))) {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettingsToStorage();
      populateSettingsForm();
      updateScreen2RateBadges();

      settingsToast.textContent = t('toastSettingsReset');
      settingsToast.style.display = 'block';
      setTimeout(() => {
        settingsToast.style.display = 'none';
        settingsToast.textContent = t('toastSettingsSaved');
      }, 2500);
    }
  });

  // ---------------------------------------------------------------------------
  // Sequential Quote ID Generation
  // ---------------------------------------------------------------------------
  function getNextSequentialQuoteId() {
    let maxNum = 0;
    try {
      const counterStored = localStorage.getItem(COUNTER_STORAGE_KEY);
      if (counterStored) {
        maxNum = parseInt(counterStored, 10) || 0;
      }
      // Cross-check against savedQuotes
      savedQuotes.forEach(q => {
        if (q && q.id) {
          const match = q.id.match(/^Q-(\d+)$/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
    } catch (e) {
      console.warn('Error reading quote counter:', e);
    }

    const nextNum = maxNum + 1;
    try {
      localStorage.setItem(COUNTER_STORAGE_KEY, nextNum.toString());
    } catch (e) {
      console.warn('Error saving quote counter:', e);
    }

    return `Q-${nextNum.toString().padStart(4, '0')}`;
  }

  // ---------------------------------------------------------------------------
  // Photo Compression Helper (Thumbnail ~400px wide JPEG)
  // ---------------------------------------------------------------------------
  function compressImageToThumbnail(dataUrl, maxWidth = 400, quality = 0.7) {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:image')) {
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

  // ---------------------------------------------------------------------------
  // Screen 2: Dynamic Service Toggles
  // ---------------------------------------------------------------------------
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

  svcMulch.addEventListener('change', () => toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch));
  svcHedge.addEventListener('change', () => toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge));

  // ---------------------------------------------------------------------------
  // Screen 2: Photo Upload & Thumbnails
  // ---------------------------------------------------------------------------
  photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        attachedPhotos.push(event.target.result);
        renderThumbnails();
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected if removed
    photoInput.value = '';
  });

  function renderThumbnails() {
    photoThumbnails.innerHTML = '';
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
      removeBtn.title = 'Remove photo';
      removeBtn.addEventListener('click', () => {
        attachedPhotos.splice(idx, 1);
        renderThumbnails();
      });

      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      photoThumbnails.appendChild(wrap);
    });
  }

  // ---------------------------------------------------------------------------
  // Quick-Fill Fake Sample Data (Instant testing under 1 minute)
  // ---------------------------------------------------------------------------
  btnFillFake.addEventListener('click', () => {
    const isEs = currentLanguage === 'es';
    inputCustName.value = isEs ? 'Juana Pérez (Cliente de Prueba)' : 'Jane Doe (Fake Sample Customer)';
    inputCustAddress.value = isEs ? '742 Evergreen Terrace, Springfield, TX 75001' : '742 Evergreen Terrace, Springfield, TX 75001';
    inputYardSize.value = 4200;

    svcMowing.checked = true;
    svcEdging.checked = true;
    svcLeaf.checked = false;

    svcMulch.checked = true;
    toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch);
    inputQtyMulch.value = 2;

    svcHedge.checked = true;
    toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge);
    inputQtyHedge.value = 1.5;

    svcError.style.display = 'none';
  });

  // ---------------------------------------------------------------------------
  // Screen 2: Calculation Engine & Quote Generation
  // ---------------------------------------------------------------------------
  newQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validations
    const custName = inputCustName.value.trim();
    const custAddress = inputCustAddress.value.trim();
    const yardSize = parseFloat(inputYardSize.value);

    if (!custName) {
      showNewQuoteToast(currentLanguage === 'es' ? 'Por favor ingrese el nombre del cliente.' : 'Please enter a customer name.', 'error');
      inputCustName.focus();
      return;
    }

    if (!custAddress) {
      showNewQuoteToast(currentLanguage === 'es' ? 'Por favor ingrese la dirección de la propiedad.' : 'Please enter the service property address.', 'error');
      inputCustAddress.focus();
      return;
    }

    if (!yardSize || yardSize <= 0) {
      showNewQuoteToast(currentLanguage === 'es' ? 'Por favor ingrese un tamaño de césped válido en pies cuadrados.' : 'Please enter a valid yard size in square feet.', 'error');
      inputYardSize.focus();
      return;
    }

    const hasService = svcMowing.checked || svcEdging.checked || svcLeaf.checked || svcMulch.checked || svcHedge.checked;
    if (!hasService) {
      svcError.style.display = 'block';
      return;
    }
    svcError.style.display = 'none';

    // Pricing Calculation according to quote-rules skill:
    const areaUnits = yardSize / 1000.0;
    const lineItems = [];
    const isEs = currentLanguage === 'es';

    // 1. Mowing (per 1,000 sq ft)
    if (svcMowing.checked) {
      const rate = currentSettings.rates.mowing;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'mowing',
        name: isEs ? 'Corte de Césped' : 'Lawn Mowing',
        description: isEs ? 'Corte de áreas de césped con soplado limpio de residuos' : 'Mowing maintained turf areas with clippings blown clean',
        qty: `${yardSize.toLocaleString()} ${isEs ? 'pies²' : 'sq ft'} (${areaUnits.toFixed(2)}k)`,
        rate: `$${rate.toFixed(2)} / ${isEs ? '1k pies²' : '1k sq ft'}`,
        amount: amount
      });
    }

    // 2. Edging (per 1,000 sq ft)
    if (svcEdging.checked) {
      const rate = currentSettings.rates.edging;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'edging',
        name: isEs ? 'Bordeado Perimetral y de Canteros' : 'Perimeter & Bed Edging',
        description: isEs ? 'Bordeado vertical limpio a lo largo de aceras, entradas y canteros' : 'Clean mechanical vertical edge along walks, driveways, and beds',
        qty: `${yardSize.toLocaleString()} ${isEs ? 'pies²' : 'sq ft'} (${areaUnits.toFixed(2)}k)`,
        rate: `$${rate.toFixed(2)} / ${isEs ? '1k pies²' : '1k sq ft'}`,
        amount: amount
      });
    }

    // 3. Leaf Cleanup (per 1,000 sq ft)
    if (svcLeaf.checked) {
      const rate = currentSettings.rates.leaf;
      const amount = areaUnits * rate;
      lineItems.push({
        key: 'leaf',
        name: isEs ? 'Recolección y Limpieza de Hojas' : 'Leaf Cleanup & Collection',
        description: isEs ? 'Recolección, soplado y retiro de hojas de césped y áreas de jardín' : 'Leaf collection, blowing, and hauling from turf and landscape beds',
        qty: `${yardSize.toLocaleString()} ${isEs ? 'pies²' : 'sq ft'} (${areaUnits.toFixed(2)}k)`,
        rate: `$${rate.toFixed(2)} / ${isEs ? '1k pies²' : '1k sq ft'}`,
        amount: amount
      });
    }

    // 4. Mulch (per cubic yard)
    if (svcMulch.checked) {
      const rate = currentSettings.rates.mulch;
      const yards = Math.max(0.5, parseFloat(inputQtyMulch.value) || 1);
      const amount = yards * rate;
      lineItems.push({
        key: 'mulch',
        name: isEs ? 'Entrega e Instalación de Mantillo' : 'Mulch Delivery & Installation',
        description: isEs ? 'Mantillo de madera triturada de primera calidad aplicado a 2-3" de espesor' : 'Premium shredded hardwood mulch installed at 2-3" depth',
        qty: `${yards} ${isEs ? 'yarda' + (yards === 1 ? ' cúbica' : 's cúbicas') : 'cubic yard' + (yards === 1 ? '' : 's')}`,
        rate: `$${rate.toFixed(2)} / ${isEs ? 'yd³' : 'cu yd'}`,
        amount: amount
      });
    }

    // 5. Hedge Trimming (per crew hour)
    if (svcHedge.checked) {
      const rate = currentSettings.rates.hedge;
      const hours = Math.max(0.5, parseFloat(inputQtyHedge.value) || 1);
      const amount = hours * rate;
      lineItems.push({
        key: 'hedge',
        name: isEs ? 'Poda y Perfilado de Setos' : 'Hedge & Shrub Trimming',
        description: isEs ? 'Poda de precisión y limpieza de setos y arbustos perimetrales' : 'Precision trimming and clean-up of perimeter hedges and shrubs',
        qty: `${hours} ${isEs ? 'hora' + (hours === 1 ? '' : 's') + ' de cuadrilla' : 'crew hour' + (hours === 1 ? '' : 's')}`,
        rate: `$${rate.toFixed(2)} / ${isEs ? 'hora' : 'hr'}`,
        amount: amount
      });
    }

    // Financial Totals:
    const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);

    // Minimum Job Charge check
    const minCharge = currentSettings.minJobCharge || 0;
    let minChargeAdj = 0;
    let baseTotal = subtotal;

    if (subtotal < minCharge) {
      minChargeAdj = minCharge - subtotal;
      baseTotal = minCharge;
    }

    // Nearest $5 Rounding
    const finalTotal = Math.round(baseTotal / 5.0) * 5.0;
    const roundingAdj = finalTotal - baseTotal;

    // Build quote state object
    const today = new Date();
    const dateFormatted = today.toLocaleDateString(isEs ? 'es-US' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Quote ID assignment: use pending duplicate ID if available, or keep current ID if editing, or get next sequential ID
    let quoteId;
    if (pendingDuplicatedQuoteId) {
      quoteId = pendingDuplicatedQuoteId;
      pendingDuplicatedQuoteId = null;
    } else if (currentQuoteData && currentQuoteData.quoteId) {
      quoteId = currentQuoteData.quoteId;
    } else {
      quoteId = getNextSequentialQuoteId();
    }

    currentQuoteData = {
      quoteId,
      createdAt: (currentQuoteData && currentQuoteData.createdAt) ? currentQuoteData.createdAt : today.toISOString(),
      dateCreated: (currentQuoteData && currentQuoteData.dateCreated) ? currentQuoteData.dateCreated : today.toISOString(),
      dateFormatted,
      custName,
      custAddress,
      yardSize,
      serviceSelections: {
        mowing: svcMowing.checked,
        edging: svcEdging.checked,
        leaf: svcLeaf.checked,
        mulch: svcMulch.checked,
        mulchQty: parseFloat(inputQtyMulch.value) || 2,
        hedge: svcHedge.checked,
        hedgeQty: parseFloat(inputQtyHedge.value) || 1.5
      },
      lineItems,
      subtotal,
      minCharge,
      minChargeAdj,
      roundingAdj,
      finalTotal,
      photos: [...attachedPhotos],
      terms: currentSettings.quoteTerms,
      bizName: currentSettings.businessName,
      bizPhone: currentSettings.phone,
      bizEmail: currentSettings.email
    };

    renderQuotePreview(currentQuoteData);
    showScreen('screen-preview');
  });

  // ---------------------------------------------------------------------------
  // Screen 3: Render Quote Preview
  // ---------------------------------------------------------------------------
  function renderQuotePreview(quote) {
    if (!quote) return;

    viewBizName.textContent = quote.bizName || currentSettings.businessName;
    const phone = quote.bizPhone || currentSettings.phone;
    const email = quote.bizEmail || currentSettings.email;

    viewBizPhone.textContent = phone ? `📞 ${phone}` : '';
    viewBizEmail.textContent = email ? `✉️ ${email}` : '';
    viewQuoteDate.textContent = quote.dateFormatted;
    viewQuoteId.textContent = `#${quote.quoteId || quote.id}`;

    viewCustName.textContent = quote.custName;
    viewCustAddress.textContent = quote.custAddress;
    const isEs = currentLanguage === 'es';
    viewYardSize.textContent = `${quote.yardSize.toLocaleString()} ${isEs ? 'pies²' : 'sq ft'}`;

    viewQuoteTerms.textContent = quote.terms || currentSettings.quoteTerms || (isEs ? 'Términos estándar aplican.' : 'Standard terms apply.');

    // Populate Table Line Items
    quoteLineItems.innerHTML = '';
    quote.lineItems.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="item-service-title">${escapeHtml(item.name)}</div>
          <div class="item-service-desc">${escapeHtml(item.description)}</div>
        </td>
        <td class="text-center">${escapeHtml(item.qty)}</td>
        <td class="text-right">${escapeHtml(item.rate)}</td>
        <td class="text-right"><strong>$${item.amount.toFixed(2)}</strong></td>
      `;
      quoteLineItems.appendChild(tr);
    });

    // Subtotal
    viewSubtotal.textContent = `$${quote.subtotal.toFixed(2)}`;

    // Minimum Job Charge Row
    if (quote.minChargeAdj > 0) {
      rowMinCharge.style.display = 'flex';
      viewMinChargeFloor.textContent = quote.minCharge.toFixed(0);
      viewMinChargeAdj.textContent = `+$${quote.minChargeAdj.toFixed(2)}`;
    } else {
      rowMinCharge.style.display = 'none';
    }

    // Rounding adjustment row
    const roundingSign = quote.roundingAdj >= 0 ? '+' : '-';
    viewRoundingAdj.textContent = `${roundingSign}$${Math.abs(quote.roundingAdj).toFixed(2)}`;

    // Final Total (Rounded to nearest $5)
    viewFinalTotal.textContent = `$${quote.finalTotal.toFixed(2)}`;

    // Render Preview Photos
    if (quote.photos && quote.photos.length > 0) {
      quotePreviewPhotos.style.display = 'block';
      quotePhotosGallery.innerHTML = '';
      quote.photos.forEach((dataUrl, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'preview-photo-wrap';
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = `Site reference photo ${idx + 1}`;
        wrap.appendChild(img);
        quotePhotosGallery.appendChild(wrap);
      });
    } else {
      quotePreviewPhotos.style.display = 'none';
      quotePhotosGallery.innerHTML = '';
    }

    // Update Save button label depending on whether this quote is already saved
    const isSaved = savedQuotes.some(q => q.id === (quote.quoteId || quote.id));
    const btnSaveLabel = btnSaveQuote.querySelector('[data-i18n]');
    if (btnSaveLabel) {
      btnSaveLabel.textContent = isSaved ? t('btnUpdateQuote') : t('btnSaveQuote');
    }
  }

  // ---------------------------------------------------------------------------
  // Screen 3 Actions: Save Quote, Print, Edit, Start Fresh
  // ---------------------------------------------------------------------------
  function showSaveToast(message, type = 'success') {
    quoteSaveToast.textContent = message;
    quoteSaveToast.className = `toast toast-save no-print ${type === 'warning' ? 'toast-warning' : (type === 'error' ? 'toast-error' : '')}`;
    quoteSaveToast.style.display = 'block';
    setTimeout(() => {
      quoteSaveToast.style.display = 'none';
    }, 3200);
  }

  async function handleSaveQuote() {
    if (!currentQuoteData) return;

    const quoteId = currentQuoteData.quoteId || currentQuoteData.id;
    const existingIndex = savedQuotes.findIndex(q => q.id === quoteId);
    const isUpdate = existingIndex >= 0;

    // Compress photos to thumbnails before saving
    let compressedPhotos = [];
    try {
      compressedPhotos = await compressPhotoList(currentQuoteData.photos || []);
    } catch (e) {
      compressedPhotos = currentQuoteData.photos || [];
    }

    const savedRecord = {
      id: quoteId,
      createdAt: isUpdate ? (savedQuotes[existingIndex].createdAt || new Date().toISOString()) : (currentQuoteData.createdAt || new Date().toISOString()),
      dateCreated: isUpdate ? (savedQuotes[existingIndex].dateCreated || savedQuotes[existingIndex].createdAt || new Date().toISOString()) : (currentQuoteData.dateCreated || new Date().toISOString()),
      dateFormatted: currentQuoteData.dateFormatted,
      custName: currentQuoteData.custName,
      custAddress: currentQuoteData.custAddress,
      yardSize: currentQuoteData.yardSize,
      serviceSelections: currentQuoteData.serviceSelections || {
        mowing: svcMowing.checked,
        edging: svcEdging.checked,
        leaf: svcLeaf.checked,
        mulch: svcMulch.checked,
        mulchQty: parseFloat(inputQtyMulch.value) || 2,
        hedge: svcHedge.checked,
        hedgeQty: parseFloat(inputQtyHedge.value) || 1.5
      },
      lineItems: JSON.parse(JSON.stringify(currentQuoteData.lineItems)),
      subtotal: currentQuoteData.subtotal,
      minCharge: currentQuoteData.minCharge,
      minChargeAdj: currentQuoteData.minChargeAdj,
      minChargeNote: currentQuoteData.minChargeAdj > 0 ? `Floor of $${currentQuoteData.minCharge.toFixed(0)} applied` : '',
      roundingAdj: currentQuoteData.roundingAdj,
      finalTotal: currentQuoteData.finalTotal,
      terms: currentQuoteData.terms || currentSettings.quoteTerms,
      bizName: currentQuoteData.bizName || currentSettings.businessName,
      bizPhone: currentQuoteData.bizPhone || currentSettings.phone,
      bizEmail: currentQuoteData.bizEmail || currentSettings.email,
      photos: compressedPhotos,
      status: isUpdate ? savedQuotes[existingIndex].status : 'Pending'
    };

    if (isUpdate) {
      savedQuotes[existingIndex] = savedRecord;
    } else {
      savedQuotes.unshift(savedRecord);
    }

    // Attempt to persist in localStorage with quota fallback
    try {
      localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
      const toastMsg = isUpdate ? t('quoteUpdatedToast').replace('{id}', quoteId) : t('quoteSavedToast').replace('{id}', quoteId);
      showSaveToast(toastMsg, 'success');
    } catch (storageErr) {
      console.warn('Storage limit exceeded, attempting to save without photos...', storageErr);
      // Fallback: strip photos from this record
      savedRecord.photos = [];
      if (isUpdate) {
        savedQuotes[existingIndex] = savedRecord;
      } else {
        savedQuotes[0] = savedRecord;
      }
      try {
        localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
        showSaveToast(t('quoteSavedNoPhotos').replace('{id}', quoteId), 'warning');
      } catch (fatalErr) {
        console.error('Failed to save to localStorage entirely:', fatalErr);
        showSaveToast(t('quoteSaveError'), 'error');
        return;
      }
    }

    // Refresh Save button text and saved count badge
    renderQuotePreview(currentQuoteData);
    updateNavBadge();
    renderSavedQuotesPipeline();
  }

  btnSaveQuote.addEventListener('click', handleSaveQuote);

  btnPrint.addEventListener('click', () => {
    window.print();
  });

  btnEditQuote.addEventListener('click', () => {
    showScreen('screen-newquote');
  });

  btnNewQuote.addEventListener('click', () => {
    if (confirm(t('confirmStartFresh'))) {
      startFreshQuote();
    }
  });

  function startFreshQuote() {
    newQuoteForm.reset();
    attachedPhotos = [];
    renderThumbnails();
    toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch);
    toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge);
    svcError.style.display = 'none';
    currentQuoteData = null;
    showScreen('screen-newquote');
  }

  // ---------------------------------------------------------------------------
  // Screen 4: Saved Quotes Pipeline Management
  // ---------------------------------------------------------------------------
  function loadSavedQuotes() {
    try {
      const stored = localStorage.getItem(SAVED_QUOTES_KEY);
      if (stored) {
        savedQuotes = JSON.parse(stored);
      } else {
        savedQuotes = [];
      }
    } catch (err) {
      console.warn('Could not read saved quotes from localStorage:', err);
      savedQuotes = [];
    }
    updateNavBadge();
    renderSavedQuotesPipeline();
  }

  function saveQuotesToStorage() {
    try {
      localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
    } catch (err) {
      console.error('Could not write saved quotes to localStorage:', err);
    }
    updateNavBadge();
  }

  function updateNavBadge() {
    const pendingCount = savedQuotes.filter(q => q.status === 'Pending').length;
    if (pendingCount > 0) {
      navSavedCount.style.display = 'inline-block';
      navSavedCount.textContent = pendingCount.toString();
    } else {
      navSavedCount.style.display = 'none';
    }
  }

  function getDaysSince(isoString) {
    if (!isoString) return 0;
    const created = new Date(isoString);
    if (isNaN(created.getTime())) return 0;
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  function formatRelativeAge(quote) {
    const days = getDaysSince(quote.createdAt || quote.dateCreated);
    if (days === 0) return t('timeToday');
    if (days === 1) return t('timeYesterday');
    return t('timeDaysAgo').replace('{n}', days.toString());
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderSavedQuotesPipeline();
    });
  });

  function renderSavedQuotesPipeline() {
    // Sort quotes newest first
    savedQuotes.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.dateCreated || 0).getTime();
      const dateB = new Date(b.createdAt || b.dateCreated || 0).getTime();
      return dateB - dateA;
    });

    // Summary Calculations
    const pendingQuotes = savedQuotes.filter(q => q.status === 'Pending');
    const wonQuotes = savedQuotes.filter(q => q.status === 'Won');
    const lostQuotes = savedQuotes.filter(q => q.status === 'Lost');

    const pendingTotal = pendingQuotes.reduce((acc, q) => acc + (q.finalTotal || 0), 0);
    const wonTotal = wonQuotes.reduce((acc, q) => acc + (q.finalTotal || 0), 0);

    // Update Summary Bar
    statPendingVal.textContent = `${pendingQuotes.length} ($${pendingTotal.toFixed(2)})`;
    statWonVal.textContent = `$${wonTotal.toFixed(2)}`;

    // Win Rate: won / (won + lost)
    const decidedCount = wonQuotes.length + lostQuotes.length;
    if (decidedCount > 0) {
      const winRatePct = Math.round((wonQuotes.length / decidedCount) * 100);
      cardWinRate.style.display = 'flex';
      statWinRateVal.textContent = `${winRatePct}%`;
    } else {
      cardWinRate.style.display = 'none';
    }

    // Update Filter Counts
    filterCountAll.textContent = savedQuotes.length.toString();
    filterCountPending.textContent = pendingQuotes.length.toString();
    filterCountWon.textContent = wonQuotes.length.toString();
    filterCountLost.textContent = lostQuotes.length.toString();

    // Filter Quotes
    let filteredList = savedQuotes;
    if (activeFilter === 'pending') {
      filteredList = pendingQuotes;
    } else if (activeFilter === 'won') {
      filteredList = wonQuotes;
    } else if (activeFilter === 'lost') {
      filteredList = lostQuotes;
    }

    // Empty state
    if (filteredList.length === 0) {
      savedQuotesList.innerHTML = '';
      savedQuotesEmpty.style.display = 'block';
      return;
    } else {
      savedQuotesEmpty.style.display = 'none';
    }

    // Render Cards
    savedQuotesList.innerHTML = '';
    filteredList.forEach(quote => {
      const card = createQuoteCard(quote);
      savedQuotesList.appendChild(card);
    });
  }

  function createQuoteCard(quote) {
    const card = document.createElement('article');
    card.className = 'saved-quote-card';
    card.setAttribute('data-id', quote.id);

    const daysSince = getDaysSince(quote.createdAt || quote.dateCreated);
    const isFollowUpDue = (quote.status === 'Pending' && daysSince >= 3);

    // Status Badge classes and labels
    let badgeClass = 'badge-pending';
    let statusLabel = t('filterPending');
    if (quote.status === 'Won') {
      badgeClass = 'badge-won';
      statusLabel = t('filterWon');
    } else if (quote.status === 'Lost') {
      badgeClass = 'badge-lost';
      statusLabel = t('filterLost');
    }

    const relativeAge = formatRelativeAge(quote);

    card.innerHTML = `
      <div class="saved-card-clickable" title="Tap to reopen quote in preview">
        <div class="saved-card-header">
          <h3 class="saved-card-cust">${escapeHtml(quote.custName)}</h3>
          <div class="saved-card-total">$${Number(quote.finalTotal).toFixed(2)}</div>
        </div>
        <div class="saved-card-meta">
          <strong>#${escapeHtml(quote.id)}</strong> · 
          <span>${escapeHtml(quote.custAddress)}</span> · 
          <span>${escapeHtml(quote.dateFormatted || '')}</span> (${relativeAge})
        </div>
        <div class="saved-card-badges">
          <span class="badge-status ${badgeClass}">● ${statusLabel}</span>
          ${isFollowUpDue ? `<span class="badge-status badge-followup">⚠️ ${t('followUpBadge')}</span>` : ''}
        </div>
      </div>
      <div class="saved-card-actions">
        ${renderActionButtons(quote)}
      </div>
    `;

    // Tap card to reopen in Quote Preview
    const clickableArea = card.querySelector('.saved-card-clickable');
    clickableArea.addEventListener('click', () => {
      currentQuoteData = {
        ...quote,
        quoteId: quote.id
      };
      renderQuotePreview(currentQuoteData);
      showScreen('screen-preview');
    });

    // Wire up card action buttons
    bindCardActionButtons(card, quote);

    return card;
  }

  function renderActionButtons(quote) {
    let statusBtns = '';
    if (quote.status === 'Pending') {
      statusBtns = `
        <button type="button" class="btn btn-won btn-action-won">🏆 ${t('btnMarkWon')}</button>
        <button type="button" class="btn btn-lost btn-action-lost">❌ ${t('btnMarkLost')}</button>
      `;
    } else if (quote.status === 'Won') {
      statusBtns = `
        <button type="button" class="btn btn-revert btn-action-revert">↩️ ${t('btnRevert')}</button>
        <button type="button" class="btn btn-lost btn-action-lost">❌ ${t('btnMarkLost')}</button>
      `;
    } else if (quote.status === 'Lost') {
      statusBtns = `
        <button type="button" class="btn btn-revert btn-action-revert">↩️ ${t('btnRevert')}</button>
        <button type="button" class="btn btn-won btn-action-won">🏆 ${t('btnMarkWon')}</button>
      `;
    }

    return `
      ${statusBtns}
      <button type="button" class="btn btn-duplicate btn-action-dup">📋 ${t('btnDuplicate')}</button>
      <button type="button" class="btn btn-delete btn-action-del">🗑️ ${t('btnDelete')}</button>
    `;
  }

  function bindCardActionButtons(card, quote) {
    const actionsWrap = card.querySelector('.saved-card-actions');

    // Mark Won
    const btnWon = card.querySelector('.btn-action-won');
    if (btnWon) {
      btnWon.addEventListener('click', (e) => {
        e.stopPropagation();
        updateQuoteStatus(quote.id, 'Won');
      });
    }

    // Mark Lost
    const btnLost = card.querySelector('.btn-action-lost');
    if (btnLost) {
      btnLost.addEventListener('click', (e) => {
        e.stopPropagation();
        updateQuoteStatus(quote.id, 'Lost');
      });
    }

    // Revert to Pending
    const btnRevert = card.querySelector('.btn-action-revert');
    if (btnRevert) {
      btnRevert.addEventListener('click', (e) => {
        e.stopPropagation();
        updateQuoteStatus(quote.id, 'Pending');
      });
    }

    // Duplicate
    const btnDup = card.querySelector('.btn-action-dup');
    if (btnDup) {
      btnDup.addEventListener('click', (e) => {
        e.stopPropagation();
        duplicateQuote(quote);
      });
    }

    // Delete with in-page inline confirmation (no browser dialogs)
    const btnDel = card.querySelector('.btn-action-del');
    if (btnDel) {
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        showInlineDeleteConfirm(card, quote);
      });
    }
  }

  function updateQuoteStatus(quoteId, newStatus) {
    const target = savedQuotes.find(q => q.id === quoteId);
    if (target) {
      target.status = newStatus;
      saveQuotesToStorage();
      renderSavedQuotesPipeline();
      // If currentQuoteData is this quote, update it too
      if (currentQuoteData && (currentQuoteData.quoteId === quoteId || currentQuoteData.id === quoteId)) {
        currentQuoteData.status = newStatus;
      }
    }
  }

  function duplicateQuote(quote) {
    // Populate form with customer info and measurements
    inputCustName.value = quote.custName;
    inputCustAddress.value = quote.custAddress;
    inputYardSize.value = quote.yardSize;

    // Service toggles
    const selections = quote.serviceSelections || {};
    svcMowing.checked = selections.mowing !== undefined ? selections.mowing : true;
    svcEdging.checked = selections.edging !== undefined ? selections.edging : true;
    svcLeaf.checked = !!selections.leaf;

    svcMulch.checked = !!selections.mulch;
    toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch);
    inputQtyMulch.value = selections.mulchQty || 2;

    svcHedge.checked = !!selections.hedge;
    toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge);
    inputQtyHedge.value = selections.hedgeQty || 1.5;

    // Photos
    attachedPhotos = quote.photos ? [...quote.photos] : [];
    renderThumbnails();

    // Assign a NEW sequential quote number
    const newId = getNextSequentialQuoteId();
    pendingDuplicatedQuoteId = newId;

    const today = new Date();
    const dateFormatted = today.toLocaleDateString(currentLanguage === 'es' ? 'es-US' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    currentQuoteData = {
      quoteId: newId,
      createdAt: today.toISOString(),
      dateCreated: today.toISOString(),
      dateFormatted,
      custName: quote.custName,
      custAddress: quote.custAddress,
      yardSize: quote.yardSize,
      serviceSelections: { ...selections },
      lineItems: JSON.parse(JSON.stringify(quote.lineItems)),
      subtotal: quote.subtotal,
      minCharge: quote.minCharge,
      minChargeAdj: quote.minChargeAdj,
      roundingAdj: quote.roundingAdj,
      finalTotal: quote.finalTotal,
      terms: quote.terms,
      photos: [...attachedPhotos],
      status: 'Pending'
    };

    showScreen('screen-newquote');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showNewQuoteToast(t('quoteDuplicatedToast').replace('{id}', newId), 'success');
  }

  function showInlineDeleteConfirm(card, quote) {
    card.classList.add('card-deleting');
    const actionsWrap = card.querySelector('.saved-card-actions');
    const originalContent = actionsWrap.innerHTML;

    actionsWrap.innerHTML = `
      <div class="delete-confirm-box">
        <span class="delete-confirm-msg">⚠️ ${t('deleteConfirmMsg').replace('{id}', quote.id)}</span>
        <div class="delete-confirm-actions">
          <button type="button" class="btn btn-sm btn-confirm-delete btn-do-delete">🗑️ ${t('btnConfirmDelete')}</button>
          <button type="button" class="btn btn-sm btn-secondary btn-cancel-delete">✕ ${t('btnCancelDelete')}</button>
        </div>
      </div>
    `;

    // Confirm Delete
    actionsWrap.querySelector('.btn-do-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      savedQuotes = savedQuotes.filter(q => q.id !== quote.id);
      saveQuotesToStorage();
      renderSavedQuotesPipeline();
    });

    // Cancel Delete
    actionsWrap.querySelector('.btn-cancel-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.remove('card-deleting');
      actionsWrap.innerHTML = originalContent;
      bindCardActionButtons(card, quote);
    });
  }

  // Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------
  loadSettings();
  loadSavedQuotes();
  loadLanguage(); // Loads stored language preference and applies it to UI
  showScreen('screen-newquote'); // Default opening view for fast mobile field quoting

})();
