/**
 * LawnQuote - Field Quoting Tool for Lawn Care & Landscaping Crews
 * 
 * Complies strictly with .agents/skills/quote-rules/SKILL.md:
 * - Area-based services round yard size UP to the next 1,000 sq ft
 * - Minimum job charge floor applied when subtotal is below baseline
 * - Final quote total rounded to the nearest multiple of $5
 * - Zero native popups (alert/confirm/prompt); all validations inline
 * - Defensive localStorage read/write with graceful in-memory fallback
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
      mulch: 85.0,       // $ per cubic yard
      hedge: 55.0        // $ per crew hour
    }
  };

  const STORAGE_KEY = 'lawnquote_crew_settings_v1';

  // Industry benchmark guardrails for outlier / typo detection
  const RATE_BENCHMARKS = {
    mowing: { min: 3, max: 40, label: 'Mowing', typical: '$10–$25 / 1k sq ft' },
    edging: { min: 1, max: 25, label: 'Edging', typical: '$3–$10 / 1k sq ft' },
    leaf: { min: 2, max: 35, label: 'Leaf cleanup', typical: '$6–$15 / 1k sq ft' },
    mulch: { min: 20, max: 200, label: 'Mulch', typical: '$70–$120 / cu yd' },
    hedge: { min: 15, max: 150, label: 'Hedge trimming', typical: '$45–$75 / hr' },
    minJobCharge: { min: 10, max: 250, label: 'Minimum job charge', typical: '$35–$100' }
  };

  // State
  let currentSettings = null;
  let attachedPhotos = []; // Array of base64 data URLs
  let pendingRateWarning = false;
  let rateWarningTimer = null;

  // ---------------------------------------------------------------------------
  // 2. DOM Elements (Grouped by Screen Domain)
  // ---------------------------------------------------------------------------
  const DOM = {
    screens: {
      'screen-pricesheet': document.getElementById('screen-pricesheet'),
      'screen-newquote': document.getElementById('screen-newquote'),
      'screen-preview': document.getElementById('screen-preview')
    },
    nav: {
      tabs: document.querySelectorAll('.tab-btn'),
      gotoPriceSheetBtn: document.getElementById('btn-goto-pricesheet')
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
      rateMulch: document.getElementById('setting-rate-mulch'),
      rateHedge: document.getElementById('setting-rate-hedge'),
      resetBtn: document.getElementById('btn-reset-settings'),
      toast: document.getElementById('settings-toast'),
      warningBanner: document.getElementById('pricesheet-warning'),
      exportBtn: document.getElementById('btn-export-backup'),
      importBtn: document.getElementById('btn-import-backup'),
      importFileInput: document.getElementById('backup-file-input'),
      errors: {
        bizName: document.getElementById('error-setting-business-name'),
        minCharge: document.getElementById('error-setting-min-charge'),
        rateMowing: document.getElementById('error-setting-rate-mowing'),
        rateEdging: document.getElementById('error-setting-rate-edging'),
        rateLeaf: document.getElementById('error-setting-rate-leaf'),
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
        mulch: document.getElementById('badge-rate-mulch'),
        hedge: document.getElementById('badge-rate-hedge')
      }
    },
    preview: {
      printBtn: document.getElementById('btn-print'),
      editBtn: document.getElementById('btn-edit-quote'),
      newQuoteBtn: document.getElementById('btn-new-quote'),
      toast: document.getElementById('quote-action-toast'),
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
    }
  };

  // ---------------------------------------------------------------------------
  // 3. UI Helpers: Error Messaging, Formatting, Steppers & Two-Tap Confirmations
  // ---------------------------------------------------------------------------

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
    });

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let val = parseFloat(inputElem.value) || minVal;
      val = Math.round((val + step) * 10) / 10;
      inputElem.value = val;
      clearFieldError(inputElem, errorElem);
    });
  }

  /**
   * Reusable inline 2-tap confirmation helper (eliminates native confirm() popups)
   */
  function bindTwoStepConfirm(button, promptText, defaultText, onConfirm) {
    let pending = false;
    let timer = null;

    button.addEventListener('click', () => {
      if (!pending) {
        pending = true;
        button.textContent = promptText;
        button.classList.add('btn-secondary');
        button.classList.remove('btn-outline');

        timer = setTimeout(() => {
          pending = false;
          button.textContent = defaultText;
          button.classList.remove('btn-secondary');
          button.classList.add('btn-outline');
        }, 3500);
        return;
      }

      clearTimeout(timer);
      pending = false;
      button.textContent = defaultText;
      button.classList.remove('btn-secondary');
      button.classList.add('btn-outline');
      onConfirm();
    });
  }

  /**
   * Downscales large camera photos on an offscreen canvas to max 800px.
   * Compresses 5MB-10MB mobile photos to ~60KB JPEGs, preventing mobile browser OOM crashes.
   */
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

  // ---------------------------------------------------------------------------
  // 4. Screen Navigation
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  DOM.nav.tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen(btn.getAttribute('data-target'));
    });
  });

  if (DOM.nav.gotoPriceSheetBtn) {
    DOM.nav.gotoPriceSheetBtn.addEventListener('click', () => {
      showScreen('screen-pricesheet');
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Settings Management (Defensive LocalStorage Handling)
  // ---------------------------------------------------------------------------
  function loadSettings() {
    let loaded = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        loaded = JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Unable to access localStorage for reading:', err);
    }

    if (loaded && typeof loaded === 'object' && loaded.rates) {
      currentSettings = loaded;
    } else {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettingsToStorage();
    }

    populateSettingsForm();
    updateScreenBadges();
  }

  function saveSettingsToStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
      return true;
    } catch (err) {
      console.error('Failed writing settings to localStorage:', err);
      return false;
    }
  }

  function populateSettingsForm() {
    const s = DOM.priceSheet;
    s.bizName.value = currentSettings.businessName || '';
    s.phone.value = currentSettings.phone || '';
    s.email.value = currentSettings.email || '';
    s.minCharge.value = currentSettings.minJobCharge;
    s.terms.value = currentSettings.quoteTerms || '';

    s.rateMowing.value = currentSettings.rates.mowing;
    s.rateEdging.value = currentSettings.rates.edging;
    s.rateLeaf.value = currentSettings.rates.leaf;
    s.rateMulch.value = currentSettings.rates.mulch;
    s.rateHedge.value = currentSettings.rates.hedge;
  }

  function updateScreenBadges() {
    const q = DOM.newQuote;
    if (q.activeBizName) {
      q.activeBizName.textContent = currentSettings.businessName || 'My Lawn Care Crew';
    }
    if (q.sampleBadge) {
      const isDefault = currentSettings.businessName === DEFAULT_SETTINGS.businessName;
      q.sampleBadge.style.display = isDefault ? 'inline-block' : 'none';
    }

    q.badges.mowing.textContent = `${formatCurrency(currentSettings.rates.mowing)} / 1k sq ft`;
    q.badges.edging.textContent = `${formatCurrency(currentSettings.rates.edging)} / 1k sq ft`;
    q.badges.leaf.textContent = `${formatCurrency(currentSettings.rates.leaf)} / 1k sq ft`;
    q.badges.mulch.textContent = `${formatCurrency(currentSettings.rates.mulch)} / cu yd`;
    q.badges.hedge.textContent = `${formatCurrency(currentSettings.rates.hedge)} / hr`;
  }

  // ---------------------------------------------------------------------------
  // 6. Form Validations (Inline Errors, No Alert Dialogs)
  // ---------------------------------------------------------------------------
  function validatePriceSheetForm() {
    const s = DOM.priceSheet;
    let hasError = false;

    // Business Name
    const bizName = s.bizName.value.trim();
    if (!bizName) {
      setFieldError(s.bizName, s.errors.bizName, 'Business name is required.');
      hasError = true;
    } else {
      clearFieldError(s.bizName, s.errors.bizName);
    }

    // Minimum Job Charge
    const minChargeVal = parseFloat(s.minCharge.value);
    if (isNaN(minChargeVal) || minChargeVal < 0) {
      setFieldError(s.minCharge, s.errors.minCharge, 'Enter a valid minimum charge (0 or higher).');
      hasError = true;
    } else {
      clearFieldError(s.minCharge, s.errors.minCharge);
    }

    // Service Rates List
    const rates = {};
    const rateFields = [
      { elem: s.rateMowing, err: s.errors.rateMowing, key: 'mowing', name: 'Mowing' },
      { elem: s.rateEdging, err: s.errors.rateEdging, key: 'edging', name: 'Edging' },
      { elem: s.rateLeaf, err: s.errors.rateLeaf, key: 'leaf', name: 'Leaf cleanup' },
      { elem: s.rateMulch, err: s.errors.rateMulch, key: 'mulch', name: 'Mulch' },
      { elem: s.rateHedge, err: s.errors.rateHedge, key: 'hedge', name: 'Hedge trimming' }
    ];

    rateFields.forEach(item => {
      const val = parseFloat(item.elem.value);
      if (isNaN(val) || val < 0) {
        setFieldError(item.elem, item.err, `Enter a valid rate for ${item.name} (0 or higher).`);
        hasError = true;
      } else {
        clearFieldError(item.elem, item.err);
        rates[item.key] = val;
      }
    });

    if (hasError) return null;

    return {
      businessName: bizName,
      phone: s.phone.value.trim(),
      email: s.email.value.trim(),
      minJobCharge: minChargeVal,
      quoteTerms: s.terms.value.trim(),
      rates: rates
    };
  }

  function validateNewQuoteForm() {
    const q = DOM.newQuote;
    let hasError = false;
    let firstErrorElem = null;

    // 1. Customer Name
    const custName = q.custName.value.trim();
    if (!custName) {
      setFieldError(q.custName, q.errors.custName, 'Customer name is required.');
      hasError = true;
      firstErrorElem = firstErrorElem || q.custName;
    } else {
      clearFieldError(q.custName, q.errors.custName);
    }

    // 2. Customer Address
    const custAddress = q.custAddress.value.trim();
    if (!custAddress) {
      setFieldError(q.custAddress, q.errors.custAddress, 'Property service address is required.');
      hasError = true;
      firstErrorElem = firstErrorElem || q.custAddress;
    } else {
      clearFieldError(q.custAddress, q.errors.custAddress);
    }

    // 3. Yard Size (must be positive number > 0)
    const rawYardSize = q.yardSize.value.trim();
    const yardSize = parseFloat(rawYardSize);
    if (!rawYardSize) {
      setFieldError(q.yardSize, q.errors.yardSize, 'Yard size is required.');
      hasError = true;
      firstErrorElem = firstErrorElem || q.yardSize;
    } else if (isNaN(yardSize) || yardSize <= 0) {
      setFieldError(q.yardSize, q.errors.yardSize, 'Enter a valid positive number for yard size in sq ft.');
      hasError = true;
      firstErrorElem = firstErrorElem || q.yardSize;
    } else {
      clearFieldError(q.yardSize, q.errors.yardSize);
    }

    // 4. Services Selection
    const hasService = q.svcMowing.checked || q.svcEdging.checked || q.svcLeaf.checked || q.svcMulch.checked || q.svcHedge.checked;
    if (!hasService) {
      q.errors.svc.style.display = 'block';
      hasError = true;
      firstErrorElem = firstErrorElem || q.svcMowing;
    } else {
      q.errors.svc.style.display = 'none';
    }

    // 5. Mulch Quantity (if selected)
    let mulchYards = 0;
    if (q.svcMulch.checked) {
      const rawMulch = q.qtyMulch.value.trim();
      mulchYards = parseFloat(rawMulch);
      if (!rawMulch || isNaN(mulchYards) || mulchYards <= 0) {
        setFieldError(q.qtyMulch, q.errors.qtyMulch, 'Enter mulch quantity in cubic yards (greater than 0).');
        hasError = true;
        firstErrorElem = firstErrorElem || q.qtyMulch;
      } else {
        clearFieldError(q.qtyMulch, q.errors.qtyMulch);
      }
    }

    // 6. Hedge Trimming Hours (if selected)
    let hedgeHours = 0;
    if (q.svcHedge.checked) {
      const rawHedge = q.qtyHedge.value.trim();
      hedgeHours = parseFloat(rawHedge);
      if (!rawHedge || isNaN(hedgeHours) || hedgeHours <= 0) {
        setFieldError(q.qtyHedge, q.errors.qtyHedge, 'Enter estimated crew labor hours (greater than 0).');
        hasError = true;
        firstErrorElem = firstErrorElem || q.qtyHedge;
      } else {
        clearFieldError(q.qtyHedge, q.errors.qtyHedge);
      }
    }

    if (hasError) {
      if (firstErrorElem) {
        firstErrorElem.focus();
        firstErrorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return null;
    }

    return {
      custName,
      custAddress,
      yardSize,
      services: {
        mowing: q.svcMowing.checked,
        edging: q.svcEdging.checked,
        leaf: q.svcLeaf.checked,
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

  /**
   * Pure calculation engine adhering strictly to .agents/skills/quote-rules/SKILL.md:
   * 
   * Rule A (Area Rounding Up):
   *   Lawn area rounds UP to the next 1,000 sq ft:
   *   areaUnits = Math.ceil(yardSize / 1000)
   *   Examples: 4,200 sq ft -> 5 units; 500 sq ft -> 1 unit.
   * 
   * Rule B (Line Items):
   *   Area items: areaUnits * rate
   *   Quantity items: mulchYards * rateMulch, hedgeHours * rateHedge
   * 
   * Rule C (Subtotal):
   *   Sum of all active line item amounts
   * 
   * Rule D (Minimum Job Charge):
   *   If subtotal < minJobCharge:
   *     baseTotal = minJobCharge
   *     minChargeAdj = minJobCharge - subtotal
   *   Else:
   *     baseTotal = subtotal
   * 
   * Rule E (Nearest $5 Rounding):
   *   finalTotal = Math.round(baseTotal / 5) * 5
   *   roundingAdj = finalTotal - baseTotal
   */
  function calculateQuote(yardSize, services, quantities, rates, minJobCharge) {
    // Step 1: Area Ceiling Rule
    const areaUnits = Math.ceil(yardSize / 1000.0);
    const lineItems = [];

    // Step 2: Build Active Line Items
    if (services.mowing) {
      const rate = rates.mowing;
      const amount = areaUnits * rate;
      lineItems.push({
        name: 'Lawn Mowing',
        description: 'Mowing maintained turf areas with clippings blown clean',
        qty: `${yardSize.toLocaleString()} sq ft (${areaUnits}k sq ft)`,
        rate: `${formatCurrency(rate)} / 1k sq ft`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.edging) {
      const rate = rates.edging;
      const amount = areaUnits * rate;
      lineItems.push({
        name: 'Perimeter & Bed Edging',
        description: 'Clean mechanical vertical edge along walks, driveways, and beds',
        qty: `${yardSize.toLocaleString()} sq ft (${areaUnits}k sq ft)`,
        rate: `${formatCurrency(rate)} / 1k sq ft`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.leaf) {
      const rate = rates.leaf;
      const amount = areaUnits * rate;
      lineItems.push({
        name: 'Leaf Cleanup & Collection',
        description: 'Leaf collection, blowing, and hauling from turf and landscape beds',
        qty: `${yardSize.toLocaleString()} sq ft (${areaUnits}k sq ft)`,
        rate: `${formatCurrency(rate)} / 1k sq ft`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.mulch) {
      const rate = rates.mulch;
      const amount = quantities.mulchYards * rate;
      lineItems.push({
        name: 'Mulch Delivery & Installation',
        description: 'Premium shredded hardwood mulch installed at 2-3" depth',
        qty: `${quantities.mulchYards} cu yd${quantities.mulchYards === 1 ? '' : 's'}`,
        rate: `${formatCurrency(rate)} / cu yd`,
        amount: Math.round(amount * 100) / 100
      });
    }

    if (services.hedge) {
      const rate = rates.hedge;
      const amount = quantities.hedgeHours * rate;
      lineItems.push({
        name: 'Hedge & Shrub Trimming',
        description: 'Precision trimming and debris cleanup of perimeter hedges/shrubs',
        qty: `${quantities.hedgeHours} crew hr${quantities.hedgeHours === 1 ? '' : 's'}`,
        rate: `${formatCurrency(rate)} / hr`,
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
  // 8. Render Quote Preview (Strict Skill Section Ordering: 1 -> 7)
  // ---------------------------------------------------------------------------
  function renderQuotePreview(quote) {
    const p = DOM.preview;

    // SECTION 1: Header / Branding
    p.bizName.textContent = currentSettings.businessName;
    p.bizPhone.textContent = currentSettings.phone ? `📞 ${currentSettings.phone}` : '';
    p.bizEmail.textContent = currentSettings.email ? `✉️ ${currentSettings.email}` : '';
    p.quoteDate.textContent = quote.dateFormatted;
    p.quoteId.textContent = `#${quote.quoteId}`;

    // SECTION 2: Customer Details
    p.custName.textContent = quote.custName;
    p.custAddress.textContent = quote.custAddress;
    p.yardSize.textContent = `${quote.yardSize.toLocaleString()} sq ft`;

    // SECTION 3: Itemized Table
    p.lineItems.innerHTML = '';
    quote.lineItems.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="item-service-title">${escapeHtml(item.name)}</div>
          <div class="item-service-desc">${escapeHtml(item.description)}</div>
          <div class="item-service-meta-mobile">${escapeHtml(item.qty)} &bull; ${escapeHtml(item.rate)}</div>
        </td>
        <td class="text-center">${escapeHtml(item.qty)}</td>
        <td class="text-right">${escapeHtml(item.rate)}</td>
        <td class="text-right"><strong>${formatCurrency(item.amount)}</strong></td>
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
        p.highValueWarning.innerHTML = `⚠️ <strong>High Quote Notice:</strong> ${formatCurrency(quote.finalTotal)} for ${quote.yardSize.toLocaleString()} sq ft. Please verify yard size and quantities before sending to the customer.`;
        p.highValueWarning.style.display = 'block';
      } else {
        p.highValueWarning.style.display = 'none';
      }
    }

    // SECTION 5: Quote Terms & Conditions
    p.terms.textContent = currentSettings.quoteTerms || 'Standard terms apply.';

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
  }

  // ---------------------------------------------------------------------------
  // 9. Event Listeners & Binding
  // ---------------------------------------------------------------------------

  // Auto-clear validation errors as user types
  const q = DOM.newQuote;
  [
    { input: q.custName, err: q.errors.custName },
    { input: q.custAddress, err: q.errors.custAddress },
    { input: q.yardSize, err: q.errors.yardSize },
    { input: q.qtyMulch, err: q.errors.qtyMulch },
    { input: q.qtyHedge, err: q.errors.qtyHedge }
  ].forEach(pair => {
    pair.input.addEventListener('input', () => clearFieldError(pair.input, pair.err));
  });

  [q.svcMowing, q.svcEdging, q.svcLeaf, q.svcMulch, q.svcHedge].forEach(cb => {
    cb.addEventListener('change', () => {
      if (q.svcMowing.checked || q.svcEdging.checked || q.svcLeaf.checked || q.svcMulch.checked || q.svcHedge.checked) {
        q.errors.svc.style.display = 'none';
      }
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

  q.svcMulch.addEventListener('change', () => toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch));
  q.svcHedge.addEventListener('change', () => toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge));

  // Steppers for Mulch (cu yds) and Hedge (hrs)
  setupStepper(q.mulchMinusBtn, q.mulchPlusBtn, q.qtyMulch, q.errors.qtyMulch, 0.5, 0.5);
  setupStepper(q.hedgeMinusBtn, q.hedgePlusBtn, q.qtyHedge, q.errors.qtyHedge, 0.5, 0.5);

  // Photo Upload & Thumbnails (with Canvas Downscaling to prevent OOM Crashes)
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
    q.custName.value = 'Jane Doe (Fake Sample Customer)';
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

    q.svcMulch.checked = true;
    toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch);
    q.qtyMulch.value = 2;

    q.svcHedge.checked = true;
    toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge);
    q.qtyHedge.value = 1.5;
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

    currentSettings = validated;
    const saved = saveSettingsToStorage();
    updateScreenBadges();

    const toast = DOM.priceSheet.toast;
    toast.textContent = saved ? 'Settings saved successfully!' : 'Settings updated in memory (localStorage blocked).';
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
            if (DOM.priceSheet.warningBanner) DOM.priceSheet.warningBanner.style.display = 'none';

            const toast = DOM.priceSheet.toast;
            toast.textContent = 'Settings successfully restored from backup!';
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2800);
          } else {
            setFieldError(null, DOM.priceSheet.errors.bizName, 'Backup file missing valid rate structure.');
          }
        } catch (err) {
          setFieldError(null, DOM.priceSheet.errors.bizName, 'Failed to parse JSON backup file.');
        }
      };
      reader.readAsText(file);
      DOM.priceSheet.importFileInput.value = '';
    });
  }

  // Reset to Defaults (Two-Tap Confirmation)
  bindTwoStepConfirm(
    DOM.priceSheet.resetBtn,
    '⚠️ Tap again to confirm reset',
    '↺ Reset to Realistic Defaults',
    () => {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettingsToStorage();
      populateSettingsForm();
      updateScreenBadges();

      const s = DOM.priceSheet;
      Object.values(s.errors).forEach(err => { if (err) err.style.display = 'none'; });
      [s.bizName, s.minCharge, s.rateMowing, s.rateEdging, s.rateLeaf, s.rateMulch, s.rateHedge].forEach(i => {
        if (i) i.classList.remove('input-invalid');
      });

      s.toast.textContent = 'Settings reset to realistic defaults!';
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
    const quoteData = {
      quoteId: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      dateFormatted: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      custName: formData.custName,
      custAddress: formData.custAddress,
      yardSize: formData.yardSize,
      lineItems: pricing.lineItems,
      subtotal: pricing.subtotal,
      minCharge: pricing.minCharge,
      minChargeAdj: pricing.minChargeAdj,
      roundingAdj: pricing.roundingAdj,
      finalTotal: pricing.finalTotal,
      photos: [...attachedPhotos]
    };

    renderQuotePreview(quoteData);
    showScreen('screen-preview');
  });

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
    '⚠️ Tap again to confirm',
    '➕ Start Fresh',
    () => {
      q.form.reset();
      attachedPhotos = [];
      renderThumbnails();

      clearFieldError(q.custName, q.errors.custName);
      clearFieldError(q.custAddress, q.errors.custAddress);
      clearFieldError(q.yardSize, q.errors.yardSize);
      clearFieldError(q.qtyMulch, q.errors.qtyMulch);
      clearFieldError(q.qtyHedge, q.errors.qtyHedge);
      q.errors.svc.style.display = 'none';

      toggleServiceQty(q.svcMulch, q.mulchContainer, q.qtyMulch);
      toggleServiceQty(q.svcHedge, q.hedgeContainer, q.qtyHedge);

      showScreen('screen-newquote');

      const toast = DOM.preview.toast;
      toast.textContent = 'Form cleared for new customer quote.';
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }
  );

  // ---------------------------------------------------------------------------
  // 10. Initialization
  // ---------------------------------------------------------------------------
  loadSettings();
  showScreen('screen-newquote');

})();
